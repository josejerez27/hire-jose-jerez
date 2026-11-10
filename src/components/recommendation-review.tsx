"use client";

import { FormEvent, useEffect, useState } from "react";
import type { Recommendation } from "@/lib/recommendations";

export function RecommendationReview() {
  const [items, setItems] = useState<Recommendation[]>([]);
  const [signedIn, setSignedIn] = useState(false);
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(true);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [filter, setFilter] = useState<Recommendation["status"]>("pending");
  useEffect(() => {
    const controller = new AbortController();
    fetch("/api/admin/recommendations", { signal: controller.signal, cache: "no-store" })
      .then(async r => { if (r.status === 401) return; const data = await r.json(); if (!r.ok) throw new Error(data.error); setItems(data.items); setSignedIn(true); })
      .catch(err => { if (!controller.signal.aborted) setError(err.message || "The inbox couldn’t connect."); })
      .finally(() => { if (!controller.signal.aborted) setBusy(false); });
    return () => controller.abort();
  }, []);
  async function reload() {
    const response = await fetch("/api/admin/recommendations", { cache: "no-store" });
    const data = await response.json();
    if (response.status === 401) { setSignedIn(false); setItems([]); }
    if (!response.ok) throw new Error(data.error);
    setItems(data.items);
  }
  async function login(event: FormEvent) {
    event.preventDefault(); setBusy(true); setError("");
    try {
      const response = await fetch("/api/admin/session", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ password }) });
      const data = await response.json(); if (!response.ok) throw new Error(data.error);
      setPassword(""); setSignedIn(true); await reload();
    } catch (err) { setError(err instanceof Error ? err.message : "Sign-in failed."); }
    finally { setBusy(false); }
  }
  async function decide(id: string, status: Recommendation["status"]) {
    setBusy(true); setError(""); setNotice("");
    try {
      const response = await fetch("/api/admin/recommendations", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id, status }) });
      const data = await response.json(); if (!response.ok) throw new Error(data.error);
      await reload(); setNotice(status === "approved" ? "Approved. This recommendation is now public." : "Saved. This recommendation is not public.");
    } catch (err) { setError(err instanceof Error ? err.message : "Your decision couldn’t be saved."); }
    finally { setBusy(false); }
  }
  async function logout() {
    setBusy(true); setError("");
    try { const response = await fetch("/api/admin/session", { method: "DELETE" }); if (!response.ok) throw new Error("Couldn’t sign out. Please try again."); setItems([]); setSignedIn(false); setNotice(""); }
    catch (err) { setError((err as Error).message); }
    finally { setBusy(false); }
  }
  return <div className="review-inbox">
    {error && <p className="error-message" role="alert">{error}</p>}{notice && <p className="success-message" role="status">{notice}</p>}
    {!signedIn ? <form className="panel admin-login" onSubmit={login}><h2>Private review inbox</h2><p>Only you can approve recommendations for publication.</p><label>Owner password<input type="password" value={password} onChange={e => setPassword(e.target.value)} autoComplete="current-password" required maxLength={200} /></label><button className="button" disabled={busy} type="submit">{busy ? "Connecting…" : "Sign in ↗"}</button></form> : <>
      <div className="review-toolbar"><div className="filter-buttons">{(["pending", "approved", "rejected"] as const).map(status => <button key={status} aria-pressed={filter === status} onClick={() => setFilter(status)}>{status === "pending" ? "Awaiting review" : status === "approved" ? "Published" : "Not published"} ({items.filter(item => item.status === status).length})</button>)}</div><button disabled={busy} onClick={() => void logout()} className="text-link">Sign out</button></div>
      {!items.some(item => item.status === filter) && <p className="empty-note">No recommendations in this view.</p>}
      {items.filter(item => item.status === filter).map(item => <article className="panel review-card" key={item.id}><p className="eyebrow">{item.status} · {new Date(item.createdAt).toLocaleDateString()}</p><h2>{item.name}</h2><p>{item.title} · {item.relationship}</p><p className="private-email">Private contact: <a href={`mailto:${item.email}`}>{item.email}</a></p><blockquote>{item.message}</blockquote><p className="widget-note">Permission to publish: {item.consent ? "Granted" : "Not granted"}. Verify the sender and wording before approval.</p><div className="hero-buttons">{item.status !== "approved" && <button className="button" disabled={busy || !item.consent} onClick={() => void decide(item.id, "approved")}>Approve & publish</button>}{item.status !== "rejected" && <button className="button button-outline" disabled={busy} onClick={() => void decide(item.id, "rejected")}>{item.status === "approved" ? "Unpublish" : "Do not publish"}</button>}{item.status === "rejected" && <button className="button button-outline" disabled={busy} onClick={() => void decide(item.id, "pending")}>Return to review</button>}</div></article>)}
    </>}
  </div>;
}
