"use client";

import { useState } from "react";

const artists = [{ name: "Red Hot Chili Peppers", id: "0L8ExT028jH3ddEcZwqJJ5" }, { name: "blink-182", id: "6FBDaR13swtiWwGhX1WQsP" }, { name: "Maná", id: "7okwEbXzyT2VffBmyQBWLz" }];
export function MusicWidget({ playlistUrl }: { playlistUrl: string }) {
  const [artist, setArtist] = useState(artists[0]);
  const match = /^https:\/\/open\.spotify\.com\/playlist\/([a-zA-Z0-9]{22})(?:\?.*)?$/.exec(playlistUrl.trim());
  const source = match ? `playlist/${match[1]}` : `artist/${artist.id}`;
  return <div className="panel music-panel"><div className="widget-toolbar"><span className="eyebrow">ON REPEAT</span><span className="chip">Spotify player</span></div><h3>A soundtrack for the off hours.</h3><p className="muted">Red Hot Chili Peppers, blink-182, and Maná. A little rock, a little nostalgia, a little of everything.</p>
    {!match && <div className="filter-buttons" aria-label="Choose an artist">{artists.map(a => <button key={a.id} aria-pressed={a.id === artist.id} onClick={() => setArtist(a)}>{a.name}</button>)}</div>}
    <iframe key={source} title={match ? "Jose’s Spotify playlist" : `${artist.name} on Spotify`} src={`https://open.spotify.com/embed/${source}?utm_source=generator&theme=0`} width="100%" height="352" allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" loading="lazy" className="spotify-frame" />
    <a className="text-link" href={`https://open.spotify.com/${source}`} target="_blank" rel="noreferrer">Open in Spotify ↗</a><p className="widget-note">{match ? "Playback availability depends on Spotify and your account." : "Explore the artists for now. Jose’s personal playlist will appear here once it’s shared."}</p></div>;
}
