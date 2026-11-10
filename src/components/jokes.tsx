"use client";

import { useEffect, useState } from "react";
import profile from "@/data/profile.json";

export function Jokes() {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  useEffect(() => {
    if (paused || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = setInterval(() => setIndex(i => (i + 1) % profile.jokes.length), 18000);
    return () => clearInterval(id);
  }, [paused]);
  return <section className="joke" aria-label="Help Desk Humor"><div className="humor-heading"><span className="eyebrow">HELP DESK HUMOR</span><span aria-hidden="true">:)</span></div><p>{profile.jokes[index]}</p><div className="inline-actions"><button onClick={() => setIndex(i => (i + 1) % profile.jokes.length)}>Another one ↻</button><button aria-pressed={paused} onClick={() => setPaused(!paused)}>{paused ? "Resume rotation" : "Pause rotation"}</button></div><small>A little personality between the tickets.</small></section>;
}
