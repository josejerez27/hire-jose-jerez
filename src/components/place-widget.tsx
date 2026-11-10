"use client";

import { FormEvent, useState } from "react";
import type { Place } from "@/lib/profile";

export function PlaceWidget({ kind, places, mapsKey }: { kind: "food" | "trails"; places: Place[]; mapsKey: string }) {
  const [query, setQuery] = useState(kind === "food" ? "BBQ restaurants in Utah County, Utah" : "hiking trails in Utah County, Utah");
  const [search, setSearch] = useState(query);
  function submit(event: FormEvent) { event.preventDefault(); if (query.trim()) setSearch(query.trim()); }
  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(search)}`;
  return <div className="panel"><div className="widget-toolbar"><span className="eyebrow">{kind === "food" ? "GOOD FOOD. GOOD COMPANY." : "LESS SCREEN TIME. MORE TRAIL TIME."}</span><span className="chip">{mapsKey ? "Google Maps" : "OpenStreetMap"}</span></div>
    <h3>{kind === "food" ? "Find the next great bite." : "A little room to roam."}</h3>
    {mapsKey ? <><form onSubmit={submit} className="map-form"><label className="sr-only" htmlFor={`${kind}-search`}>Search {kind === "food" ? "restaurants" : "trails"}</label><input id={`${kind}-search`} maxLength={150} required value={query} onChange={e => setQuery(e.target.value)} /><button className="button" type="submit">Explore ↗</button></form><iframe title={kind === "food" ? "Utah restaurant search map" : "Utah trail search map"} src={`https://www.google.com/maps/embed/v1/search?key=${encodeURIComponent(mapsKey)}&q=${encodeURIComponent(search)}`} loading="lazy" referrerPolicy="strict-origin-when-cross-origin" allowFullScreen className="map-frame" /></> : <><iframe title={kind === "food" ? "Explore food spots around Utah County" : "Explore Utah’s outdoors"} src="https://www.openstreetmap.org/export/embed.html?bbox=-112.15%2C39.80%2C-111.25%2C40.65&layer=mapnik" loading="lazy" className="map-frame" /><p className="widget-note">Interactive regional map © OpenStreetMap contributors.</p></>}
    <a className="text-link" href={mapsUrl} target="_blank" rel="noreferrer">{kind === "food" ? "Explore restaurants on Google Maps" : "Explore trails on Google Maps"} ↗</a>
    {places.length ? <ul className="place-list">{places.map(place => <li key={place.name}><h4>{place.name}</h4><span className="eyebrow">{place.location}</span><p>{place.note}</p>{mapsKey && <button className="text-link" onClick={() => { const value = place.mapQuery || `${place.name}, ${place.location}`; setQuery(value); setSearch(value); }}>Explore this place ↗</button>}<a className="text-link" href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(place.mapQuery || `${place.name}, ${place.location}`)}`} target="_blank" rel="noreferrer">Directions & details ↗</a></li>)}</ul> : <p className="empty-note">{kind === "food" ? "My favorite food spots are still being added. Explore the area in the meantime." : "My personal trail log is still being added. Explore the map for your next adventure."}</p>}
  </div>;
}
