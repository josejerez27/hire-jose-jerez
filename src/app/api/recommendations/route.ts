import { listRecommendations, publicRecommendation, recommendationStorageReady, submitRecommendation, validateRecommendation } from "@/lib/recommendations";
import { sameOrigin, privateJson } from "@/lib/review-auth";
import { allowed } from "@/lib/rate-limit";
import { profile } from "@/lib/profile";

export const runtime = "nodejs";
export async function GET() {
  if (!recommendationStorageReady()) return privateJson({ items: profile.references, acceptingSubmissions: false });
  try {
    const items = (await listRecommendations()).filter(item => item.status === "approved" && item.consent === true).map(publicRecommendation);
    return privateJson({ items: [...profile.references, ...items], acceptingSubmissions: true });
  } catch { return privateJson({ items: profile.references, error: "Recommendations are temporarily unavailable. Please try again shortly." }, 503); }
}
export async function POST(request: Request) {
  if (!sameOrigin(request)) return privateJson({ error: "Please use the recommendation form on Jose’s website." }, 403);
  if (!request.headers.get("content-type")?.includes("application/json")) return privateJson({ error: "Please send a valid recommendation." }, 415);
  if (Number(request.headers.get("content-length")) > 12000) return privateJson({ error: "Please shorten your recommendation." }, 413);
  let raw;
  try { const text = await request.text(); if (text.length > 12000) return privateJson({ error: "Please shorten your recommendation." }, 413); raw = JSON.parse(text); }
  catch { return privateJson({ error: "Please send a valid recommendation." }, 400); }
  const input = validateRecommendation(raw);
  if (!input) return privateJson({ error: "Please complete every field, write at least 20 characters, and give permission to publish." }, 400);
  try {
    const ip = request.headers.get("x-vercel-forwarded-for")?.split(",")[0]?.trim() || request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "local";
    if (!await allowed(`recommendation:${ip}`)) return privateJson({ error: "Please wait a minute before submitting again." }, 429);
    await submitRecommendation(input);
    return privateJson({ message: "Thank you! Your recommendation has been sent to Jose for review. It will only appear after he approves it." }, 201);
  } catch { return privateJson({ error: `The recommendation inbox couldn’t connect. Please try again or contact ${profile.email}.` }, 503); }
}
