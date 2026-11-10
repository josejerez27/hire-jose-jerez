"use client";

import { createContext, KeyboardEvent, ReactNode, useContext, useEffect, useRef, useState, useSyncExternalStore } from "react";
import Link from "next/link";
import { Navigation } from "@/components/navigation";
import { Jokes } from "@/components/jokes";

export type PortfolioView = "professional" | "personal";
type ViewContext = { view: PortfolioView; navigate: (view: PortfolioView, hash?: string) => void };
const Context = createContext<ViewContext | null>(null);
export const usePortfolioView = () => useContext(Context);
export function PortfolioViewLink({ view, hash = "", className, children }: { view: PortfolioView; hash?: string; className?: string; children: ReactNode }) {
  const portfolio = usePortfolioView();
  return <Link href={`/?view=${view}${hash ? `#${hash}` : ""}`} className={className} onClick={event => {
    if (portfolio && !event.metaKey && !event.ctrlKey && !event.shiftKey && event.button === 0) { event.preventDefault(); portfolio.navigate(view, hash); }
  }}>{children}</Link>;
}
const personalHashes = new Set(["#dugout", "#grill", "#trails", "#about", "#life"]);
function currentView(): PortfolioView {
  const params = new URLSearchParams(window.location.search);
  if (params.get("view") === "personal") return "personal";
  if (!params.has("view") && personalHashes.has(window.location.hash)) return "personal";
  return "professional";
}
function subscribe(callback: () => void) {
  window.addEventListener("popstate", callback);
  window.addEventListener("hashchange", callback);
  window.addEventListener("portfolio-view", callback);
  return () => {
    window.removeEventListener("popstate", callback);
    window.removeEventListener("hashchange", callback);
    window.removeEventListener("portfolio-view", callback);
  };
}

export function PortfolioShell({ initialView, intro, professional, personal, professionalSidebar, personalSidebar, music }: {
  initialView: PortfolioView; intro: ReactNode; professional: ReactNode; personal: ReactNode;
  professionalSidebar: ReactNode; personalSidebar: ReactNode; music: ReactNode;
}) {
  const view = useSyncExternalStore(subscribe, currentView, () => initialView);
  const scrollPositions = useRef<Record<PortfolioView, number | null>>({ professional: null, personal: null });
  const [musicExpanded, setMusicExpanded] = useState<boolean | null>(null);
  const expanded = musicExpanded ?? view === "personal";
  useEffect(() => {
    if (!window.location.hash) return;
    const frame = requestAnimationFrame(() => {
      const target = document.getElementById(window.location.hash.slice(1));
      target?.closest("details")?.setAttribute("open", "");
      target?.scrollIntoView({ block: "start", behavior: "instant" });
    });
    return () => cancelAnimationFrame(frame);
  }, [view]);
  function navigate(next: PortfolioView, hash = "") {
    scrollPositions.current[view] = window.scrollY;
    const url = new URL(window.location.href);
    url.searchParams.set("view", next); url.hash = hash;
    if (url.href !== window.location.href) window.history.pushState(null, "", url);
    window.dispatchEvent(new Event("portfolio-view"));
    requestAnimationFrame(() => requestAnimationFrame(() => {
      if (hash) {
        const target = document.getElementById(hash.replace(/^#/, ""));
        target?.closest("details")?.setAttribute("open", "");
        if (hash.replace(/^#/, "") === "music") setMusicExpanded(true);
        target?.scrollIntoView({ block: "start", behavior: "instant" });
      }
      else {
        const intro = document.getElementById("home")!;
        const headerHeight = document.querySelector(".site-header")?.getBoundingClientRect().height ?? 88;
        window.scrollTo({ top: scrollPositions.current[next] ?? intro.offsetTop + intro.offsetHeight - headerHeight, behavior: "instant" });
      }
    }));
  }
  function keyboard(event: KeyboardEvent<HTMLButtonElement>) {
    if (!["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)) return;
    event.preventDefault();
    const next = event.key === "Home" ? "professional" : event.key === "End" ? "personal" : view === "professional" ? "personal" : "professional";
    navigate(next); document.getElementById(`tab-${next}`)?.focus();
  }
  return <Context.Provider value={{ view, navigate }}><div className="portfolio-shell" data-view={view}>
    <Navigation />
    <main id="main">
      {intro}
      <div className="shell portfolio-tabs-wrap" id="portfolio-tabs"><div className="portfolio-tabs" role="tablist" aria-label="Explore Jose’s portfolio">
        <button role="tab" id="tab-professional" aria-controls="panel-professional" aria-selected={view === "professional"} tabIndex={view === "professional" ? 0 : -1} onClick={() => navigate("professional")} onKeyDown={keyboard}><span className="tab-symbol" aria-hidden="true">↗</span><span>Professional<small>The work, the impact, the next opportunity.</small></span><span className="tab-arrow" aria-hidden="true">↘</span></button>
        <button role="tab" id="tab-personal" aria-controls="panel-personal" aria-selected={view === "personal"} tabIndex={view === "personal" ? 0 : -1} onClick={() => navigate("personal")} onKeyDown={keyboard}><span className="tab-symbol" aria-hidden="true">◎</span><span>Personal<small>The person behind the job title.</small></span><span className="tab-arrow" aria-hidden="true">↘</span></button>
      </div><p className="tab-caption">{view === "professional" ? "A closer look at how I work. A conversation is always welcome." : "Good teams, good trails, good food. The things that keep me going."}</p></div>
      <div className="shell lane-layout">
        <div className="main-lane">
          <div role="tabpanel" id="panel-professional" aria-labelledby="tab-professional" hidden={view !== "professional"} tabIndex={0}>{professional}</div>
          <div role="tabpanel" id="panel-personal" aria-labelledby="tab-personal" hidden={view !== "personal"} tabIndex={0}>{personal}</div>
        </div>
        <aside className="side-lane" aria-label="Conversation, music, and a little humor">
          <div hidden={view !== "professional"}>{professionalSidebar}</div>
          <div hidden={view !== "personal"}>{personalSidebar}</div>
          <section className="music-dock" id="music" aria-label="Jose’s music player"><button className="music-dock-toggle" aria-expanded={expanded} aria-controls="shared-music-player" onClick={() => setMusicExpanded(!expanded)}><span className="music-disc" aria-hidden="true">♫</span><span><strong>Jose’s playlist</strong><small>A little soundtrack, if you’d like.</small></span><span aria-hidden="true">{expanded ? "−" : "+"}</span></button><div id="shared-music-player" hidden={!expanded}>{music}</div></section>
          <Jokes />
        </aside>
      </div>
    </main>
    <footer className="shell hub-footer"><span>© {new Date().getFullYear()} Jose Jerez</span><span>People. Systems. A full life.</span><a href="#home">Back to top ↑</a></footer>
  </div></Context.Provider>;
}
