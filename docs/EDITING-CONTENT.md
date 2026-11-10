# Make this site yours

Most factual content lives in **`src/data/profile.json`**. Update it, save, and preview with `npm run dev`. A production deployment uses the content at build time, so commit the changes and let Vercel redeploy.

The homepage now has Professional (`/?view=professional`) and Personal (`/?view=personal`) tabs with a shared music player. The Professional tab opens by default. Desktop uses a main column and a sidebar; mobile brings Ask Jose directly after the support metrics. Longer background and personal sections expand on demand.

Layout and ordering are in `src/app/page.tsx`; tab switching, scroll restoration, and the persistent music dock are in `src/components/portfolio-shell.tsx`. The main Help Desk Humor card is larger on Personal; the JJ logo reveals a bonus joke.

JSON requires double quotes and does not allow comments or trailing commas. Do not put API keys in this file; it is public portfolio data and also supplies the resume and Ask Jose's facts.

## Professional content

- `summary`, `role`, `name`, `email`, `github`, and `yearsExperience`: core profile.
- `metrics`: the four homepage support figures.
- `projects`: titles, categories, platform tags, descriptions, and outcomes. Keep outcome figures scoped to the relevant project.
- `skills` and `experienceAreas`: platform list and professional focus.
- `interests`: the About / Family paragraph.
- `jokes`: the rotating Help Desk Humor card and the JJ-logo bonus jokes.
- `references`: approved letter excerpts and optional PDF links. See [Recommendations](RECOMMENDATIONS.md) for adding letters and using the visitor approval inbox.

Page layout, section headings, and introductory copy are in `src/app/page.tsx`. Visual styling is in `src/app/globals.css`; the complete navigation is in `src/components/navigation.tsx`.

## Work history

Replace the empty `workHistory` array with entries in this shape, using your own verified details:

```json
{
  "company": "Your employer",
  "title": "Your job title",
  "dates": "Your dates",
  "highlights": ["A responsibility or outcome you can discuss publicly"]
}
```

## Certifications

Add objects to `certifications`:

```json
{
  "name": "Your certification",
  "issuer": "Issuing organization",
  "date": "Earned or renewed date",
  "url": "https://your-public-credential-link.example"
}
```

The URL is optional. Use public HTTPS credential URLs.

## Food spots and trails

Add entries to `restaurants` or `trails`:

```json
{
  "name": "Your favorite place",
  "location": "City, Utah",
  "note": "Why you like it, what to order, or a note from your trip",
  "mapQuery": "Place name and full location"
}
```

`mapQuery` is optional. Entries get directions/details links. With a Google Maps Embed key, the Explore button also updates the embedded map.

`grillNotes` accepts objects with `title` and `description` for recipes, techniques, or food stories. Until favorites are entered, the food and trail sections show honest empty states alongside interactive regional maps and external discovery links.

## Spotify

Paste your public playlist's share URL into `spotifyPlaylistUrl`, or set `SPOTIFY_PLAYLIST_URL` in Vercel. Use `https://open.spotify.com/playlist/` followed by the 22-character playlist ID. The environment variable takes precedence. No Spotify secret or OAuth login is needed for the embedded player. Artist embeds appear when a valid playlist URL is absent; they are not represented as Jose's personal playlist. Playback is controlled by Spotify.

## Resume and chatbot stay in sync

`npm run resume` generates `public/jose-jerez-resume.pdf` from this same data. It also runs before every production build. A build fails with an explanation if the content no longer fits on one page; shorten it or replace the generator with your curated resume. Do not silently truncate your work history.

`/resume` is the web version and includes print styles. The generated PDF uses standard embedded PDF font references and normalizes punctuation to portable text. It currently summarizes the portfolio; it does not claim an unprovided employment history.

Ask Jose reads the same profile on the server. When you add real roles, certifications, or favorites, those facts become available after redeployment. It cannot know unprovided information.
