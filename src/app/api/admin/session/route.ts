import { adminConfigured, createReviewSession, passwordMatches, privateJson, sameOrigin, sessionCookie } from "@/lib/review-auth";
import { allowed } from "@/lib/rate-limit";

export const runtime = "nodejs";
export async function POST(request: Request) {
  if (!sameOrigin(request)) return privateJson({ error: "Invalid request origin." }, 403);
  if (!adminConfigured()) return privateJson({ error: "The private review inbox needs its owner password configured first. See the recommendations setup guide." }, 503);
  let password;
  try { const raw = await request.text(); if (raw.length > 1000) return privateJson({ error: "Invalid password." }, 400); password = JSON.parse(raw).password; }
  catch { return privateJson({ error: "Invalid request." }, 400); }
  if (typeof password !== "string" || password.length > 200) return privateJson({ error: "Invalid password." }, 400);
  try {
    const ip = request.headers.get("x-vercel-forwarded-for")?.split(",")[0]?.trim() || request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "local";
    if (!await allowed(`review-login:${ip}`)) return privateJson({ error: "Too many attempts. Please wait a minute." }, 429);
    if (!passwordMatches(password)) return privateJson({ error: "That password wasn’t recognized." }, 401);
    return privateJson({ ok: true }, 200, { "Set-Cookie": sessionCookie(request, createReviewSession()) });
  } catch { return privateJson({ error: "Sign-in is temporarily unavailable." }, 503); }
}
export async function DELETE(request: Request) {
  if (!sameOrigin(request)) return privateJson({ error: "Invalid request origin." }, 403);
  return privateJson({ ok: true }, 200, { "Set-Cookie": sessionCookie(request, "", true) });
}
