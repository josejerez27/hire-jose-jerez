# GitHub and Vercel handoff

## Local project

The working copy is `D:\Projects\sn-playwright\hire-jose-jerez`. The surrounding directory is a separate Playwright workspace. Its files were preserved. This portfolio was downloaded from GitHub as an archive because Git is not installed here; this folder is not a Git checkout and no commit or push has been made.

Use Node.js 22 (the `.nvmrc` and CI default). Verification here used Node.js 26.13.0. On Windows, use `npm.cmd` if PowerShell blocks `npm.ps1`.

```sh
npm ci
npm run dev
```

For production verification:

```sh
npm run lint
npm run build
npm test
npx playwright install chromium
npm run test:e2e
npm start
```

## Put the changes in GitHub

Preferred approach on a machine with Git: clone your repository, create a feature branch, and copy the prepared source files into that checkout. Preserve its `.git` directory. Do not copy `node_modules`, `.next`, test output, or local environment files.

```sh
git clone https://github.com/josejerez27/hire-jose-jerez.git
cd hire-jose-jerez
git switch -c complete-portfolio
# Copy the prepared project contents into this checkout, then:
git status
git diff --check
git diff
npm ci
npm run lint
npm run build
npm test
git add .
git commit -m "Complete editable portfolio and prepare Next.js deployment"
git push -u origin complete-portfolio
```

Open and merge a pull request after reviewing the changes. If using GitHub's Upload files instead, upload the files *inside* the prepared project folder at the existing repository root. Avoid adding a second nested `hire-jose-jerez` directory: Vercel needs to find `package.json` in the selected root. Preserve `.github`, `.env.example`, `.gitignore`, and `.nvmrc` when uploading hidden files.

## Configure Vercel

| Setting | Value |
| --- | --- |
| Repository | `josejerez27/hire-jose-jerez` |
| Production branch | `main` |
| Root Directory | Repository root containing `package.json` |
| Framework | Next.js |
| Install | `npm ci` |
| Build | `npm run build` |
| Output Directory | Automatic; remove overrides |
| Node.js | 22.x |

The application uses server routes. Do not turn on static export or redirect all paths to `index.html`. A custom domain can be added after the `.vercel.app` deployment works.

Deploy the merged commit. Confirm the deployment's generated URL first, then confirm the production alias, `/resume`, `/jose-jerez-resume.pdf`, and `/api/sports`. `/api/ask` accepts POST from the site's own origin. A GET to that POST-only endpoint should return 405.

## Optional connections

Copy `.env.example` to `.env.local` for local use. Add the real values in Vercel's environment settings for Preview and/or Production and redeploy. Keep secrets out of GitHub and chat messages.

| Variable | Purpose |
| --- | --- |
| `OPENAI_API_KEY` | Server-only OpenAI project key; enables actual paid/API-credit chat calls |
| `OPENAI_MODEL` | Model available to your project, e.g. `gpt-4.1-mini` |
| `SPOTIFY_PLAYLIST_URL` | Public personal playlist URL; no Spotify key required |
| `GOOGLE_MAPS_EMBED_KEY` | Optional browser Maps Embed key for live place search in food/trail widgets |
| `UPSTASH_REDIS_REST_URL` and `UPSTASH_REDIS_REST_TOKEN` | Optional durable, shared chat rate limiter |
| `RECOMMENDATION_ADMIN_PASSWORD` | Unique 16+ character password for `/admin/recommendations` |

Redis is optional for chat rate limiting but **required for saving recommendation submissions on Vercel**. Local recommendation records use ignored `.data/` storage. The serverless backend refuses to claim successful storage without Redis. See [Recommendations setup](RECOMMENDATIONS.md) for reference PDFs, publication consent, review, and data retention. Use separate Preview/Production Redis databases.

Ask Jose performs no provider call without both AI settings. It returns an explicit unavailable message rather than generating fake answers. The API sends portfolio facts and recent conversation messages to OpenAI with `store: false`; do not treat that option as a zero-retention guarantee. No chat database is included.

Requests are limited to ten messages, 1,000 characters per message, and 450 output tokens. The limiter permits six requests per minute per visitor. Without Upstash, it is per running server instance and resets on restart; for a public AI-enabled Vercel deployment, configure Upstash or an equivalent Vercel firewall limit and set an API project budget. Configure both Upstash variables together. Provider/limiter outages return safe errors. Origin checks do not replace rate limiting.

The Google Maps Embed key appears in the iframe URL by design. Restrict it to the site's domains and the Maps Embed API. Without it, interactive OpenStreetMap regional embeds and Google Maps discovery links work without a key; embedded restaurant/trail search is available once a Maps key is added. Favorite places still need Jose's entries.

Sports uses ESPN's public schedule feeds with a one-minute cache and periodic client refresh. These endpoints were checked independently, including the current Utah Mammoth team identifier. They are not a contracted API and may change; failures are shown per team with working ESPN links. Local shell networking blocks the sports server's outbound requests in this environment, so the local UI shows its unavailable state. Recheck real provider responses on the Vercel preview.

## Access still required for publishing

GitHub is not connected to this session, and the Vercel connector is disabled by the account administrator. No authenticated GitHub write or Vercel deployment has occurred. The public 404 therefore remains unresolved at the account/deployment level. See the audit for the exact checks to perform once Vercel settings are accessible.

Integration references: [OpenAI text generation](https://developers.openai.com/api/docs/guides/text), [Spotify embeds](https://developer.spotify.com/documentation/embeds/tutorials/creating-an-embed), [Google Maps embeds](https://developers.google.com/maps/documentation/embed/embedding-map).
