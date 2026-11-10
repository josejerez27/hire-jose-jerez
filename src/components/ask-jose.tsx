"use client";

import { FormEvent, useEffect, useRef, useState } from "react";

type Message = { role: "user" | "assistant"; content: string };
export function AskJose({ connected = true }: { connected?: boolean }) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [question, setQuestion] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const end = useRef<HTMLDivElement>(null);
  useEffect(() => { if (messages.length) end.current?.scrollIntoView({ block: "nearest" }); }, [messages]);
  async function ask(text: string) {
    if (busy || !text.trim()) return;
    const next = [...messages, { role: "user" as const, content: text.trim() }];
    setBusy(true); setError(""); setQuestion(""); setMessages(next);
    try {
      const response = await fetch("/api/ask", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ messages: next.slice(-10) }), signal: AbortSignal.timeout(35000) });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Chat is temporarily unavailable. Please try again.");
      setMessages([...next, { role: "assistant", content: data.answer }]);
    } catch (err) { setError(err instanceof Error ? err.message : "Unable to connect. Please try again."); setMessages(next.slice(0, -1)); setQuestion(text); }
    finally { setBusy(false); }
  }
  function submit(event: FormEvent) { event.preventDefault(); void ask(question); }
  return <div className="chat-card">
    <div className="chat-top"><span className="avatar">JJ</span><div><strong>Ask Jose</strong><small>AI portfolio assistant</small></div><span className="chip">{connected ? "Powered by AI" : "Connection pending"}</span></div>
    {!connected && <p className="widget-note chat-setup-note">AI chat is being connected. For now, <a className="text-link" href="mailto:josejerez310@yahoo.com">email Jose directly ↗</a>.</p>}
    <div className="chat-messages" role="log" aria-label="Conversation" aria-live="polite" aria-busy={busy}>
      <p className="chat-bubble assistant">Hi! Ask me about Jose’s projects, experience, skills, or how to get in touch.</p>
      {messages.map((message, i) => <p className={`chat-bubble ${message.role}`} key={i}><span className="sr-only">{message.role === "user" ? "You" : "Ask Jose"}: </span>{message.content}</p>)}
      {busy && <p className="muted">Thinking…</p>}<div ref={end} />
    </div>
    {!messages.length && <div className="suggestions">{["What has Jose automated?", "What platforms has he used?", "How can I contact Jose?"].map(q => <button key={q} disabled={busy} onClick={() => void ask(q)}>{q} ↗</button>)}</div>}
    {error && <p className="error-message" role="alert">{error}</p>}
    <form className="chat-form" onSubmit={submit}><label className="sr-only" htmlFor="question">Your question for Ask Jose</label><input id="question" value={question} onChange={e => setQuestion(e.target.value)} maxLength={1000} required disabled={busy} placeholder="Ask about the person behind the résumé…" /><button className="button" type="submit" disabled={busy || !question.trim()}>Send <span aria-hidden="true">↗</span></button></form>
    <p className="chat-disclaimer">AI can make mistakes. Questions are sent to OpenAI when connected. Please keep personal or sensitive information out of the chat.</p>
  </div>;
}
