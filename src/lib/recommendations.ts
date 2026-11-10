import { randomUUID } from "node:crypto";
import { mkdir, readFile, rename, writeFile } from "node:fs/promises";
import path from "node:path";

export type RecommendationInput = { name: string; email: string; title: string; relationship: string; message: string; consent: true };
export type Recommendation = RecommendationInput & { id: string; status: "pending" | "approved" | "rejected"; createdAt: string; reviewedAt?: string };
export type PublicRecommendation = Pick<Recommendation, "id" | "name" | "title" | "relationship" | "message"> & { letterUrl?: string };
const hashKey = "hire-jose:recommendations:v1";
let writeQueue: Promise<unknown> = Promise.resolve();

export function validateRecommendation(value: unknown): RecommendationInput | null {
  if (!value || typeof value !== "object") return null;
  const data = value as Record<string, unknown>;
  const limits = { name: 80, email: 254, title: 120, relationship: 160, message: 2000 };
  for (const [key, max] of Object.entries(limits)) {
    if (typeof data[key] !== "string" || !data[key].trim() || data[key].length > max || /[\u0000-\u0008\u000b\u000c\u000e-\u001f]/.test(data[key])) return null;
  }
  if (data.consent !== true || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email as string) || (data.message as string).trim().length < 20) return null;
  return { name: (data.name as string).trim(), email: (data.email as string).trim(), title: (data.title as string).trim(), relationship: (data.relationship as string).trim(), message: (data.message as string).trim(), consent: true };
}
export function publicRecommendation(item: Recommendation): PublicRecommendation {
  return { id: item.id, name: item.name, title: item.title, relationship: item.relationship, message: item.message };
}
function backend() {
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!!url !== !!token) throw new Error("Configure both Redis credentials");
  if (url && token) return { url, token };
  if (process.env.VERCEL) throw new Error("Durable storage must be configured on Vercel");
  return null;
}
async function redis(command: (string | number)[]) {
  const config = backend();
  if (!config) throw new Error("Redis not configured");
  const response = await fetch(config.url, { method: "POST", headers: { Authorization: `Bearer ${config.token}`, "Content-Type": "application/json" }, body: JSON.stringify(command), cache: "no-store", signal: AbortSignal.timeout(6000) });
  if (!response.ok) throw new Error("Recommendation storage unavailable");
  const data = await response.json();
  if (data.error) throw new Error("Recommendation storage rejected the operation");
  return data.result;
}
function dataFile() { return path.join(process.env.RECOMMENDATIONS_DATA_DIR || path.join(process.cwd(), ".data"), "recommendations.json"); }
async function localRead(): Promise<Recommendation[]> {
  try {
    const items = JSON.parse(await readFile(dataFile(), "utf8"));
    if (!Array.isArray(items)) throw new Error("Invalid recommendation storage");
    return items;
  } catch (error) { if ((error as NodeJS.ErrnoException).code === "ENOENT") return []; throw error; }
}
async function localWrite(items: Recommendation[]) {
  const file = dataFile();
  await mkdir(path.dirname(file), { recursive: true, mode: 0o700 });
  const temp = `${file}.${randomUUID()}.tmp`;
  await writeFile(temp, JSON.stringify(items, null, 2), { encoding: "utf8", mode: 0o600 });
  await rename(temp, file);
}
function serialized<T>(operation: () => Promise<T>): Promise<T> {
  const next = writeQueue.then(operation, operation);
  writeQueue = next.catch(() => {});
  return next;
}
export async function listRecommendations(): Promise<Recommendation[]> {
  if (backend()) {
    const values = await redis(["HVALS", hashKey]);
    if (!Array.isArray(values)) throw new Error("Invalid recommendation storage response");
    return values.map(value => JSON.parse(value));
  }
  return localRead();
}
export async function submitRecommendation(input: RecommendationInput): Promise<Recommendation> {
  const item: Recommendation = { ...input, id: randomUUID(), status: "pending", createdAt: new Date().toISOString() };
  if (backend()) {
    const saved = await redis(["EVAL", "if redis.call('HLEN',KEYS[1])>=1000 then return 0 end; redis.call('HSET',KEYS[1],ARGV[1],ARGV[2]); return 1", 1, hashKey, item.id, JSON.stringify(item)]);
    if (saved !== 1) throw new Error("Recommendation inbox is full");
  } else await serialized(async () => { const items = await localRead(); if (items.length >= 1000) throw new Error("Recommendation inbox is full"); await localWrite([...items, item]); });
  return item;
}
export async function reviewRecommendation(id: string, status: Recommendation["status"]): Promise<boolean> {
  if (backend()) {
    const value = await redis(["HGET", hashKey, id]);
    if (!value) return false;
    const item = JSON.parse(value) as Recommendation;
    await redis(["HSET", hashKey, id, JSON.stringify({ ...item, status, reviewedAt: new Date().toISOString() })]);
    return true;
  }
  return serialized(async () => {
    const items = await localRead(); const index = items.findIndex(item => item.id === id);
    if (index < 0) return false;
    items[index] = { ...items[index], status, reviewedAt: new Date().toISOString() };
    await localWrite(items); return true;
  });
}
