# Prepared change summary

Base repository: `https://github.com/josejerez27/hire-jose-jerez`, commit `faa8407790dc86a971f34f022def2d6af85443a0`.

## Proposed pull request

**Title:** Complete editable portfolio and prepare Next.js deployment

**Description:**

The portfolio had professional content but no resume download, interactive personal widgets, or working chatbot integration. Its build depended on downloading Google Fonts, and the public Vercel alias returned `NOT_FOUND`.

This change preserves the existing project descriptions, skills, interests, and contact information; updates the support metrics; and adds shared editable content, all requested personal/professional sections, a generated one-page resume, a Spotify player, sports-feed integration, interactive maps, rotating jokes, and an OpenAI-backed Ask Jose endpoint. Missing personal details remain clearly identified. Next.js builds without external fonts, and Vercel configuration and deployment troubleshooting are documented.

Validation: production build, lint, TypeScript checks, 9 backend/PDF tests, and 10 desktop/mobile browser tests pass locally. AI responses and selected provider requests are mocked in tests; no paid API calls were made. The server-side sports feed is network-blocked in this local environment and must be checked on Vercel. Actual AI answers require configured credentials.

The source was subsequently published through authenticated GitHub/Vercel browser sessions. Vercel's Other framework preset was corrected to Next.js, and the production domain now serves the portfolio. The downloadable source archive itself does not include Git history.

## Main files

The subsequent layout update adds Professional / Personal tabs, persistent music, a higher Ask Jose sidebar, expandable sections, larger Help Desk Humor, a JJ-logo Easter egg, and reference letters/recommendations with private approval. Owner review needs a configured password; Vercel submissions need Redis. Setup-aware messages allow the public preview to work while optional integrations are being connected. See `PUBLICATION.md` for deployment status.

- `src/data/profile.json`: editable facts and content.
- `src/lib/profile.ts`: shapes for work history, certifications, and favorite places.
- `src/app/page.tsx`, `src/app/globals.css`: complete responsive portfolio.
- `src/app/layout.tsx`: personalized metadata and network-independent fonts.
- `src/app/resume/page.tsx`, `scripts/generate-resume.mjs`, `public/jose-jerez-resume.pdf`: web/PDF resume.
- `src/components/*`: navigation, chatbot UI, Spotify, sports, maps, and jokes.
- `src/components/portfolio-shell.tsx`: Professional / Personal tabs, shared player, and saved scroll positions.
- `src/app/recommendations/`, `src/app/admin/recommendations/`, `src/app/api/recommendations/`, `src/app/api/admin/`: recommendation submission, display, and private review.
- `src/lib/recommendations.ts`, `src/lib/review-auth.ts`: private persistence, publication filtering, and owner authentication.
- `src/app/api/ask/route.ts`, `src/lib/rate-limit.ts`: server-side AI integration and request limits.
- `src/app/api/sports/route.ts`, `src/lib/sports.ts`: sports data integration and parsing.
- `vercel.json`, `.env.example`, `.nvmrc`: deployment and environment setup.
- `tests/*`, `playwright.config.ts`, `.github/workflows/ci.yml`: repeatable verification.
- `README.md`, `docs/*`: audit, editing, validation, and deployment handoff.

Existing public SVGs, favicon, TypeScript/PostCSS/ESLint configuration, and agent instruction files are preserved. The package lockfile includes the pinned browser-test dependency.
