import type { Metadata } from "next";
import Link from "next/link";
import { Navigation } from "@/components/navigation";
import { Recommendations } from "@/components/recommendations";
import { RecommendationForm } from "@/components/recommendation-form";

export const metadata: Metadata = { title: "Recommendations" };
export default function RecommendationPage() {
  return <><Navigation /><main id="main" className="shell references-page"><Link className="text-link" href="/?view=professional">← Back to the professional portfolio</Link><div className="section-heading"><p className="eyebrow">PEOPLE I’VE WORKED WITH</p><h1>Good work.<br /><span>Shared experiences.</span></h1><p>Reference letters and recommendations from the people who know my work. Every published submission is reviewed by me first.</p></div><Recommendations /><RecommendationForm /></main></>;
}
