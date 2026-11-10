# Hire Jose Jerez

Live portfolio: **https://hire-jose-jerez.vercel.app** · [Personal view](https://hire-jose-jerez.vercel.app/?view=personal)

An editable Next.js 16 / React 19 / Tailwind CSS 4 portfolio for IT Operations, systems administration, IAM, enterprise applications, and automation roles.

## Run locally

Use Node.js 22 or newer. From this project directory:

```sh
npm ci
npm run dev
```

Open `http://localhost:3000`. On Windows, use `npm.cmd` if PowerShell blocks the npm script.

## What is included

- Professional projects, skills, updated support metrics, work history, and certification sections.
- `/resume` plus a downloadable one-page PDF generated from the profile content before builds.
- Ask Jose UI and a server-side OpenAI Responses API integration. An API key/model must be configured to enable AI answers.
- Spotify artist players, with support for a personal playlist URL.
- ESPN team schedule/score widgets for the Dodgers, Cowboys, Mammoth, and Jazz.
- Interactive food/outdoor regional maps; optional Google Maps search; editable favorites and grilling notes.
- About / Family, contact links, mobile navigation, and rotating IT jokes.
- Professional / Personal tabs with shareable URLs, two-column desktop layouts, scroll restoration, and a music player that stays mounted during tab switches.
- Reference letters and visitor recommendations, with a private owner approval inbox. See [Recommendations setup](docs/RECOMMENDATIONS.md).
- Lint/build commands, backend tests, desktop/mobile browser tests, and GitHub Actions checks.

## Start editing

Edit **`src/data/profile.json`** for professional facts, metrics, projects, platforms, roles, certifications, personal favorites, and jokes. Empty lists are intentional where details have not yet been provided. The website, resume, and chatbot use the same data.

Page layout and copy: `src/app/page.tsx`. Styles: `src/app/globals.css`.

See [Editing content](docs/EDITING-CONTENT.md) for entry examples and [Deployment](docs/DEPLOYMENT.md) for integrations and GitHub/Vercel settings.

New recommendation submissions save privately on a local server. Before accepting them on Vercel, configure durable Redis storage and a private `RECOMMENDATION_ADMIN_PASSWORD`. `/admin/recommendations` has no default password and cannot approve submissions until you configure one.

## Validate

```sh
npm run lint
npm run build
npm test
npx playwright install chromium
npm run test:e2e
```

`npm run resume` regenerates the PDF separately. `npm run typecheck` checks generated route types and TypeScript. Browser tests target a production build and start the server automatically when needed. They mock third-party frames/feeds and AI responses to stay deterministic and avoid paid API calls. To test with installed Google Chrome instead of Playwright's downloaded Chromium, set `PLAYWRIGHT_CHANNEL=chrome`.

## Deploy

Connect this repository to Vercel with the Next.js preset and the repository root as Root Directory. `vercel.json` sets `npm ci` and `npm run build`. Leave Output Directory automatic. See [.env.example](.env.example) for optional connections; never commit actual keys.

The original public URL returned a Vercel 404. The homepage route existed, but the Vercel project was configured with the Other framework preset. The preset is now Next.js, and the completed source has been published successfully. Read [Publication status](docs/PUBLICATION.md), [Repository audit](docs/REPOSITORY-AUDIT.md), and [Validation](docs/VALIDATION.md) for findings and remaining integration setup.
