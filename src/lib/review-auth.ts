import { createHash, createHmac, timingSafeEqual } from "node:crypto";

export const reviewCookie = "jose_review";
const lifetime = 8 * 60 * 60;
export const adminConfigured = () => (process.env.RECOMMENDATION_ADMIN_PASSWORD?.length ?? 0) >= 16;
export function passwordMatches(password: string) {
  if (!adminConfigured()) return false;
  const hash = (value: string) => createHash("sha256").update(value).digest();
  return timingSafeEqual(hash(password), hash(process.env.RECOMMENDATION_ADMIN_PASSWORD!));
}
function signature(expiry: string) { return createHmac("sha256", process.env.RECOMMENDATION_ADMIN_PASSWORD!).update(`review:${expiry}`).digest("hex"); }
export function createReviewSession(now = Date.now()) {
  if (!adminConfigured()) throw new Error("Review password is not configured");
  const expiry = String(Math.floor(now / 1000) + lifetime);
  return `${expiry}.${signature(expiry)}`;
}
export function authenticated(request: Request, now = Date.now()): boolean {
  if (!adminConfigured()) return false;
  const session = request.headers.get("cookie")?.split(";").map(part => part.trim()).find(part => part.startsWith(`${reviewCookie}=`))?.slice(reviewCookie.length + 1);
  if (!session) return false;
  const [expiry, mac, extra] = session.split(".");
  if (extra || !/^\d+$/.test(expiry) || !/^[a-f0-9]{64}$/.test(mac ?? "") || Number(expiry) <= Math.floor(now / 1000)) return false;
  return timingSafeEqual(Buffer.from(mac, "hex"), Buffer.from(signature(expiry), "hex"));
}
export function sessionCookie(request: Request, session: string, clear = false) {
  return `${reviewCookie}=${session}; HttpOnly; SameSite=Strict; Path=/api/admin; Max-Age=${clear ? 0 : lifetime}${new URL(request.url).protocol === "https:" ? "; Secure" : ""}`;
}
export const sameOrigin = (request: Request) => request.headers.get("origin") === new URL(request.url).origin;
export const privateJson = (data: unknown, status = 200, headers: Record<string, string> = {}) => Response.json(data, { status, headers: { "Cache-Control": "no-store", ...headers } });
