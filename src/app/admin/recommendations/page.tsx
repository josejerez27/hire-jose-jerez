import type { Metadata } from "next";
import Link from "next/link";
import { RecommendationReview } from "@/components/recommendation-review";

export const metadata: Metadata = { title: "Private recommendation review", robots: { index: false, follow: false } };
export default function ReviewPage() {
  return <main id="main" className="shell references-page"><Link href="/" className="text-link">← Back to portfolio</Link><p className="eyebrow">FOR JOSE</p><h1>Recommendation review.</h1><p className="muted">A private inbox. Nothing is published until you approve it.</p><RecommendationReview /></main>;
}
