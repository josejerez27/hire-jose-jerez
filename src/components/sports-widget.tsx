"use client";

import { useEffect, useState } from "react";
import { teams, type SportsFeed } from "@/lib/sports";
import { usePortfolioView } from "@/components/portfolio-shell";

export function SportsWidget() {
  const portfolio = usePortfolioView();
  const active = !portfolio || portfolio.view === "personal";
  const [data, setData] = useState<SportsFeed | null>(null);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(true);
  async function refresh(signal?: AbortSignal) {
    try { const r = await fetch("/api/sports", { signal }); if (!r.ok) throw new Error(); setData(await r.json()); setError(""); }
    catch { if (!signal?.aborted) setError("The score feed couldn’t connect. Team pages are still available below."); }
    finally { if (!signal?.aborted) setBusy(false); }
  }
  useEffect(() => {
    if (!active) return;
    const controller = new AbortController();
    fetch("/api/sports", { signal: controller.signal })
      .then(r => { if (!r.ok) throw new Error(); return r.json(); })
      .then(feed => { setData(feed); setError(""); })
      .catch(() => { if (!controller.signal.aborted) setError("The score feed couldn’t connect. Team pages are still available below."); })
      .finally(() => { if (!controller.signal.aborted) setBusy(false); });
    const id = setInterval(() => { if (!document.hidden) void refresh(controller.signal); }, 60000);
    return () => { controller.abort(); clearInterval(id); };
  }, [active]);
  return <div>
    <div className="widget-toolbar"><span className="eyebrow"><span className="status-dot" /> THE TEAMS I FOLLOW</span><button onClick={() => { setBusy(true); void refresh(); }} disabled={busy}>{busy ? "Checking…" : "Refresh scores ↻"}</button></div>
    {error && <p role="status" className="muted">{error}</p>}
    <div className="sports-grid">{teams.map((team, i) => {
      const feed = data?.teams.find(t => t.id === team.id && t.league === team.league);
      return <article className="score-card" key={team.league}><div className="score-heading"><span className={`team-monogram team-${i}`}>{team.league === "MLB" ? "LA" : team.short.slice(0, 1)}</span><span className="eyebrow">{team.league}</span></div><h3>{team.name}</h3>
        {feed?.error ? <p className="muted">{feed.error}</p> : feed?.games.length ? feed.games.map(game => <div className="game" key={game.id}><span className={game.state === "in" ? "live-label" : "muted"}>{game.state === "in" ? "LIVE · " : ""}{game.status}</span><p>{game.name}</p>{game.scores && <strong>{game.scores}</strong>}<time dateTime={game.date}>{new Date(game.date).toLocaleString(undefined, { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" })}</time></div>) : <p className="muted">{busy ? "Loading the latest schedule…" : "No games returned by the current schedule."}</p>}
        <a className="text-link" href={team.url} target="_blank" rel="noreferrer">Team updates on ESPN ↗</a></article>;
    })}</div>
    <p className="widget-note">Source: ESPN public schedule feeds. Refreshes every minute while this tab is visible. {data && `Last checked ${new Date(data.checkedAt).toLocaleTimeString()}.`} Dates and times use your device’s timezone.</p>
  </div>;
}
