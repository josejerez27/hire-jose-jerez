import { listRecommendations, reviewRecommendation } from "@/lib/recommendations";
import { authenticated, privateJson, sameOrigin } from "@/lib/review-auth";

export const runtime = "nodejs";
export async function GET(request: Request) {
  if (!authenticated(request)) return privateJson({ error: "Please sign in to review recommendations." }, 401);
  try { return privateJson({ items: await listRecommendations() }); }
  catch { return privateJson({ error: "The review inbox is temporarily unavailable." }, 503); }
}
export async function PATCH(request: Request) {
  if (!sameOrigin(request)) return privateJson({ error: "Invalid request origin." }, 403);
  if (!authenticated(request)) return privateJson({ error: "Please sign in to review recommendations." }, 401);
  let input;
  try { const raw = await request.text(); if (raw.length > 1000) return privateJson({ error: "Invalid review." }, 400); input = JSON.parse(raw); }
  catch { return privateJson({ error: "Invalid review." }, 400); }
  if (typeof input?.id !== "string" || !/^[a-f0-9-]{36}$/.test(input.id) || !["pending", "approved", "rejected"].includes(input.status)) return privateJson({ error: "Select a valid recommendation and review status." }, 400);
  try {
    const found = await reviewRecommendation(input.id, input.status);
    return found ? privateJson({ ok: true }) : privateJson({ error: "Recommendation not found." }, 404);
  } catch { return privateJson({ error: "Your decision couldn’t be saved. Please try again." }, 503); }
}
