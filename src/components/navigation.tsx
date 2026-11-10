"use client";

import { MouseEvent, useState } from "react";
import Link from "next/link";
import { usePortfolioView, type PortfolioView } from "@/components/portfolio-shell";
import profile from "@/data/profile.json";

const links: { label: string; href: string; view?: PortfolioView; hash?: string }[] = [
  { label: "Home", href: "/", view: "professional", hash: "home" },
  { label: "Résumé", href: "/resume" },
  { label: "Projects", href: "/?view=professional#projects", view: "professional", hash: "projects" },
  { label: "Work history", href: "/?view=professional#work-history", view: "professional", hash: "work-history" },
  { label: "Certifications", href: "/?view=professional#certifications", view: "professional", hash: "certifications" },
  { label: "Recommendations", href: "/recommendations" },
  { label: "Trail Log", href: "/?view=personal#trails", view: "personal", hash: "trails" },
  { label: "Jose’s Dugout", href: "/?view=personal#dugout", view: "personal", hash: "dugout" },
  { label: "Grill Master", href: "/?view=personal#grill", view: "personal", hash: "grill" },
  { label: "Music", href: "/?view=personal#music", view: "personal", hash: "music" },
  { label: "Ask Jose", href: "/?view=professional#ask", view: "professional", hash: "ask" },
  { label: "About / Family", href: "/?view=personal#about", view: "personal", hash: "about" },
  { label: "Contact", href: "/?view=professional#contact", view: "professional", hash: "contact" },
];

export function Navigation() {
  const [open, setOpen] = useState(false);
  const [bonus, setBonus] = useState(-1);
  const portfolio = usePortfolioView();
  function follow(event: MouseEvent<HTMLAnchorElement>, view: PortfolioView, hash = "") {
    if (portfolio && !event.metaKey && !event.ctrlKey && !event.shiftKey && event.button === 0) {
      event.preventDefault(); portfolio.navigate(view, hash);
    }
    setOpen(false);
  }
  return <header className="site-header">
    <a className="skip-link" href="#main">Skip to content</a>
    <div className="nav-inner">
      <div className="brand"><button className="brand-mark easter-egg-button" aria-label="Reveal a bonus help desk joke" onClick={() => setBonus(i => (i + 1) % profile.jokes.length)}>JJ<span>.</span></button><Link href="/" onClick={e => follow(e, "professional", "home")} aria-label="Jose Jerez home">JOSE JEREZ<small>PEOPLE. SYSTEMS. SOLUTIONS.</small></Link></div>
      <nav className="desktop-nav" aria-label="Main navigation"><Link href="/?view=professional#projects" onClick={e => follow(e, "professional", "projects")}>The work</Link><Link href="/?view=professional#recommendations" onClick={e => follow(e, "professional", "recommendations")}>Recommendations</Link><Link href="/?view=personal" onClick={e => follow(e, "personal")}>Off the clock</Link><Link href="/?view=professional#ask" onClick={e => follow(e, "professional", "ask")}>Ask Jose</Link></nav>
      <div className="nav-actions"><Link className="button button-small" href="/resume">Résumé <span aria-hidden="true">↗</span></Link><button className="menu-button" onClick={() => setOpen(!open)} aria-expanded={open} aria-controls="all-navigation">{open ? "Close" : "Menu"} <span aria-hidden="true">{open ? "−" : "+"}</span></button></div>
    </div>
    {bonus >= 0 && <div className="bonus-joke" role="status"><span>Hidden ticket #{bonus + 1}</span><p>{profile.jokes[bonus]}</p><button onClick={() => setBonus(-1)} aria-label="Dismiss bonus joke">×</button></div>}
    {open && <nav id="all-navigation" className="all-nav" aria-label="All sections">{links.map(item => <Link key={item.label} href={item.href} onClick={e => { if (item.view) follow(e, item.view, item.hash); else setOpen(false); }}>{item.label}<span aria-hidden="true">↗</span></Link>)}</nav>}
  </header>;
}
