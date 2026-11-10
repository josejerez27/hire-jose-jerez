"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import type { PublicRecommendation } from "@/lib/recommendations";

function letterLink(url?: string) {
  if (!url) return undefined;
  if (/^\/references\/[a-zA-Z0-9_./% -]+\.pdf$/i.test(url) && !url.includes("..")) return url;
  try { return new URL(url).protocol === "https:" ? url : undefined; } catch { return undefined; }
}
export function Recommendations({ featured = false }: { featured?: boolean }) {
  const [items, setItems] = useState<PublicRecommendation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  useEffect(() => {
    const controller = new AbortController();
    fetch("/api/recommendations", { signal: controller.signal, cache: "no-store" })
      .then(async response => { const data = await response.json(); setItems(data.items ?? []); setError(response.ok ? "" : data.error); })
      .catch(() => { if (!controller.signal.aborted) setError("Recommendations couldn’t load right now. Please try again shortly."); })
      .finally(() => { if (!controller.signal.aborted) setLoading(false); });
    return () => controller.abort();
  }, []);
  const visible = featured ? items.slice(0, 3) : items;
  return <div className="recommendations-list" aria-busy={loading}>
    {loading && <p className="muted" role="status">Loading recommendations…</p>}
    {error && <p className="empty-note" role="status">{error}</p>}
    {!loading && !items.length && !error && <div className="reference-empty"><span className="quote-mark" aria-hidden="true">“</span><p>There’s room here for the people who know my work.</p><small>Reference letters and approved recommendations will appear here as they’re added.</small></div>}
    {visible.map(item => <figure className="recommendation-card" key={item.id}><span className="quote-mark" aria-hidden="true">“</span><blockquote>{item.message}</blockquote><figcaption><span className="reference-avatar" aria-hidden="true">{item.name.split(/\s+/).map(part => part[0]).slice(0, 2).join("")}</span><div><strong>{item.name}</strong><span>{item.title}</span><small>{item.relationship}</small></div></figcaption>{letterLink(item.letterUrl) && <a className="text-link" href={letterLink(item.letterUrl)} target="_blank" rel="noreferrer">Read the reference letter ↗</a>}</figure>)}
    {featured && items.length > 0 && <Link className="text-link" href="/recommendations">Read {items.length > 3 ? `all ${items.length} recommendations` : "the full recommendations"} ↗</Link>}
  </div>;
}
