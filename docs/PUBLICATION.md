# Publication status — November 10, 2026

Public portfolio: **https://hire-jose-jerez.vercel.app**

Personal view: **https://hire-jose-jerez.vercel.app/?view=personal**

The initial completed portfolio was published from GitHub commit `6165d5b50ea776dc9e5367af977ad26ecba65d30` to the existing `hire-jose-jerez` Vercel project. All 59 uploaded file paths and Git blob hashes matched the prepared source. Subsequent commits refine the setup messages and update this handoff.

## What resolved the public 404

Authenticated inspection confirmed that Vercel's Framework Preset was **Other**. It was changed to **Next.js** and saved. The Root Directory was already the repository root, and `hire-jose-jerez.vercel.app` was correctly assigned. Publishing the completed Next.js source produced a Ready production deployment with the expected page and API routes.

The first successful production build took approximately 1 minute 35 seconds. Vercel selected Node.js 26.x because the current package engine range is `>=22`; local production verification also used Node.js 26.13.0, while CI targets Node.js 22.

## Live checks

- The homepage opens in a separate browser context without Vercel/GitHub sign-in.
- Professional is the default; Personal has a shareable query URL.
- Updated support metrics and project content render.
- The deployed sports endpoint returns HTTP 200 with games for all four teams and no per-team provider errors. The local server's network restriction therefore does not affect the deployed integration.
- Resume/download, navigation, mobile layout, and protected owner endpoints are included in deployment verification.

## Features that still need owner setup

- **Ask Jose:** configure `OPENAI_API_KEY` and `OPENAI_MODEL`. The preview identifies the pending connection and offers direct email. No paid AI calls were made during publishing.
- **Recommendations:** curated reference entries/PDFs can be published without a database. Visitor submissions require durable Redis storage on Vercel, and the review inbox requires `RECOMMENDATION_ADMIN_PASSWORD`. Until storage is connected, the public form offers an email alternative instead of accepting unsavable submissions. See `RECOMMENDATIONS.md`.
- **Personal content:** add actual letters, work history, certifications, favorite places, and a personal Spotify playlist to `src/data/profile.json`.
- **Maps:** regional OpenStreetMap embeds and external discovery links work without a key. Add a restricted Google Maps Embed key for in-widget search.

Custom domain setup can follow after feedback. The existing `.vercel.app` production link can be shared now.
