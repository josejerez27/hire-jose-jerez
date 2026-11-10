# Dusk Blue & Gold

Chosen direction: the second Desert Dusk variation, with the headline **“Less friction. More momentum.”**

The theme keeps the existing Professional/Personal layout, persistent player, projects, metrics, and recommendation workflow. The headline is editable in `src/data/profile.json` under `heroHeadline`.

## Palette and typography

- Canvas: `#102333`, deep slate navy.
- Panels: `#183244` with restrained blue gradients.
- Primary text: `#EEF2EF`, soft white.
- Accent: `#E4BC78`, champagne gold.
- Muted text: `#AFBFCB`; blue-gray borders.
- Headings: Space Grotesk, hosted locally using `next/font/local`. Body and compact UI copy use the system sans-serif stack. No build-time font download is needed.

Space Grotesk source: [Google Fonts](https://github.com/google/fonts/tree/main/ofl/spacegrotesk). Its original SIL Open Font License is included in `src/app/fonts/OFL.txt` alongside `SpaceGrotesk.ttf`.

## Background asset

Runtime asset: **`public/images/dusk-desert.webp`**, approximately 27 KB, 2172 × 724 pixels. The decorative image sits behind the hero with a CSS fade to the page canvas; all text and controls remain real HTML. There is no embedded screenshot or fake interface in the background.

The original image is retained locally in ignored `artifacts/themes/dusk-desert-original.png`. The production file was encoded as WebP using Sharp without changing the composition. It was generated with the built-in image generation tool, using the selected mockup as the edit target. No API key or custom image-generation script was used.

### Final generation prompt

+Use case: precise-object-edit / website background asset. Edit the provided blue-and-gold website mockup into ONLY its clean landscape background. Remove ALL interface, text, letters, numbers, logos, buttons, cards, borders, scrollbars, forms and icons completely. Reconstruct uninterrupted landscape wherever those elements were. Output a wide cinematic 3:1 landscape illustration, ideally 2400 by 800 pixels, with no frame. Preserve the Utah sandstone mesa silhouettes and layered mountain composition from the top hero: deep slate navy sky #102333, distant muted steel-blue and teal mesas and ridges, a restrained champagne/amber horizon glow slightly right of center, dark blue foreground. Place the horizon in the middle-upper half, with a gently descending dark unobtrusive foreground at the lower edge so a CSS gradient can blend seamlessly into #102333. Leave the left upper half quieter and darker for overlaid website headlines, with no high-contrast landmarks behind the text area. Mood: calm blue-hour desert, sophisticated, subtle natural photographic texture rather than busy detail. This is a usable production BACKGROUND ONLY, not another screenshot, not a website mockup. Absolutely no text, symbols, panels, typography or watermark.
