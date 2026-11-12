"use client";

import { FormEvent, useEffect, useRef, useState } from "react";

type Message = { role: "user" | "assistant"; content: string; source?: "gemini" | "portfolio" };
export function AskJose({ connected = true }: { connected?: boolean }) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [question, setQuestion] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const end = useRef<HTMLDivElement>(null);
  const inFlight = useRef(false);
  useEffect(() => { if (messages.length) end.current?.scrollIntoView({ block: "nearest" }); }, [messages]);
  async function ask(text: string) {
    if (inFlight.current || !text.trim() || text.trim().length > 1000) return;
    inFlight.current = true;
    const next = [...messages, { role: "user" as const, content: text.trim() }];
    setBusy(true); setError(""); setQuestion(""); setMessages(next);
    try {
      const response = await fetch("/api/ask", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ messages: next.slice(-11) }), signal: AbortSignal.timeout(35000) });
      const data = await response.json();
      if (!response.ok || typeof data.answer !== "string") throw new Error(data.error || "Chat is temporarily unavailable. Please try again.");
      setMessages([...next, { role: "assistant", content: data.answer, source: data.source === "portfolio" ? "portfolio" : "gemini" }]);
    } catch (err) { setError(err instanceof Error ? err.message : "Unable to connect. Please try again."); setMessages(next.slice(0, -1)); setQuestion(text); }
    finally { inFlight.current = false; setBusy(false); }
  }
  function submit(event: FormEvent) { event.preventDefault(); void ask(question); }
  return <div className="chat-card">
    <div className="chat-top"><span className="avatar">JJ</span><div><strong>Ask Jose</strong><small>Portfolio assistant</small></div><span className="chip">{connected ? "AI + portfolio answers" : "Portfolio answers"}</span></div>
    {!connected && <p className="widget-note chat-setup-note">Prepared answers are available now. Ask about projects, platforms, experience, or contact details.</p>}
    <div className="chat-messages" role="log" aria-label="Conversation" aria-live="polite" aria-busy={busy}>
      <p className="chat-bubble assistant">Hi! Ask me about Jose’s projects, experience, skills, or how to get in touch.</p>
      {messages.map((message, i) => <p className={`chat-bubble ${message.role}`} key={i}><span className="sr-only">{message.role === "user" ? "You" : "Ask Jose"}: </span>{message.content}{message.role === "assistant" && <small className="chat-answer-source">{message.source === "portfolio" ? "Prepared portfolio answer" : "AI-generated answer"}</small>}</p>)}
      {busy && <p className="muted">Thinking…</p>}<div ref={end} />
    </div>
    {!messages.length && <div className="suggestions">{["What has Jose automated?", "What platforms has he used?", "How can I contact Jose?"].map(q => <button key={q} disabled={busy} onClick={() => void ask(q)}>{q} ↗</button>)}</div>}
    {error && <p className="error-message" role="alert">{error}</p>}
    <form className="chat-form" onSubmit={submit}><label className="sr-only" htmlFor="question">Your question for Ask Jose</label><input id="question" value={question} onChange={e => setQuestion(e.target.value)} maxLength={1000} required disabled={busy} placeholder="Ask about the person behind the résumé…" /><button className="button" type="submit" disabled={busy || !question.trim()}>Send <span aria-hidden="true">↗</span></button></form>
    {messages.length > 0 && <button type="button" className="text-link chat-clear" disabled={busy} onClick={() => { setMessages([]); setQuestion(""); setError(""); }}>Clear chat</button>}
    <p className="chat-disclaimer">AI can make mistakes. When AI is available, conversations are sent to Google Gemini. Google may use free-tier chats to improve its products. Prepared answers keep chat available when AI is unavailable. Please keep personal or sensitive information out of the chat.</p>
  </div>;
}
