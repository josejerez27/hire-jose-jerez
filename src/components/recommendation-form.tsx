"use client";

import { FormEvent, useState } from "react";

export function RecommendationForm({ acceptingSubmissions = true, email = "josejerez310@yahoo.com" }: { acceptingSubmissions?: boolean; email?: string }) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const fields = new FormData(form);
    setBusy(true); setError(""); setSuccess("");
    try {
      const response = await fetch("/api/recommendations", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ name: fields.get("name"), email: fields.get("email"), title: fields.get("title"), relationship: fields.get("relationship"), message: fields.get("message"), consent: fields.get("consent") === "on" }), signal: AbortSignal.timeout(12000) });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Your recommendation couldn’t be sent. Please try again.");
      setSuccess(data.message); form.reset();
    } catch (err) { setError(err instanceof Error ? err.message : "Couldn’t connect. Please try again."); }
    finally { setBusy(false); }
  }
  if (!acceptingSubmissions) return <section id="recommend" className="panel recommendation-form-panel"><p className="eyebrow">WORKED WITH JOSE?</p><h2>Your words would mean a lot.</h2><p>The recommendation inbox is being connected. In the meantime, email me your recommendation or reference letter. I’ll ask your permission before publishing it.</p><a className="button" href={`mailto:${email}?subject=Recommendation%20for%20Jose`}>Email Jose a recommendation ↗</a></section>;
  return <section id="recommend" className="panel recommendation-form-panel"><p className="eyebrow">WORKED WITH JOSE?</p><h2>Leave a recommendation.</h2><p>A story, a project, or something you appreciated about working together. Your words stay private until Jose reviews and approves them.</p>
    <form onSubmit={submit} className="recommendation-form"><fieldset disabled={busy}><div className="form-grid">
      <label>Your name<input name="name" autoComplete="name" required maxLength={80} /></label>
      <label>Email <span className="field-hint">Private · never published</span><input name="email" type="email" autoComplete="email" required maxLength={254} /></label>
      <label>Title or role<input name="title" autoComplete="organization-title" required maxLength={120} placeholder="Your professional title" /></label>
      <label>How do you know Jose?<input name="relationship" required maxLength={160} placeholder="Colleague, manager, project partner…" /></label>
    </div><label>Your recommendation<textarea name="message" required minLength={20} maxLength={2000} rows={6} placeholder="What was it like working with Jose?" /></label>
    <label className="consent-label"><input name="consent" type="checkbox" required /><span>I give Jose permission to publish my name, title, professional relationship, and recommendation on this website after his review. My email stays private.</span></label>
    <button className="button" type="submit">{busy ? "Sending…" : "Send for Jose’s approval ↗"}</button></fieldset></form>
    {error && <p className="error-message" role="alert">{error}</p>}{success && <p className="success-message" role="status">{success}</p>}
    <p className="widget-note">Only share information you’re comfortable making public. To update or remove a submitted recommendation later, contact Jose.</p>
  </section>;
}
