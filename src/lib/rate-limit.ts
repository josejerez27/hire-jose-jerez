import { createHash } from "node:crypto";

const buckets = new Map<string, { count: number; reset: number }>();
export async function allowed(ip: string): Promise<boolean> {
  const key = "ask-jose:" + createHash("sha256").update(ip).digest("hex");
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  if (url && token) {
    // One atomic script: expiry is set even under simultaneous requests.
    const response = await fetch(url, {
      method: "POST", headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      body: JSON.stringify(["EVAL", "local n=redis.call('INCR',KEYS[1]); if n==1 then redis.call('EXPIRE',KEYS[1],60) end; return n", 1, key]),
      cache: "no-store", signal: AbortSignal.timeout(4000),
    });
    if (!response.ok) throw new Error("Rate limiter unavailable");
    const result = await response.json();
    if (typeof result.result !== "number") throw new Error("Invalid rate-limit response");
    return result.result <= 6;
  }
  const now = Date.now();
  for (const [id, bucket] of buckets) if (bucket.reset <= now) buckets.delete(id);
  const bucket = buckets.get(key) ?? { count: 0, reset: now + 60000 };
  if (!buckets.has(key) && buckets.size >= 2000) return false;
  bucket.count++; buckets.set(key, bucket);
  return bucket.count <= 6;
}
