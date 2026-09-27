# FÉRIAS — Go somewhere you'll remember.

A holiday-packages website built as a front-end assignment: **a travel film that happens to be a website.**
The homepage runs like a film in four reels — Japan, Morocco, Kerala and Kashmir — and the film language
(reel numbers, timecodes, "Cut to —" intertitles, a production slate) doubles as the navigation.

- **Live site:** _add the Vercel URL here_
- **Stack:** React 19 · Vite · TypeScript (strict) · GSAP + ScrollTrigger · Lenis · CSS Modules
- **Cost:** free to build, host and run — static output, no backend.

## Getting started

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # type-check + production build to dist/
npm run preview    # serve the production build
npm run lint       # oxlint
npm test           # vitest (form validation)
```

Copy `.env.example` to `.env.local` and add a free [Web3Forms](https://web3forms.com) key to make the contact
form deliver email. Without a key the form runs in **demo mode**: it validates, shows every state and sends nothing.

## What's on the page

| Assignment requirement | Where it lives |
| --- | --- |
| Hero with a call to action | `sections/Hero` — full-bleed film, _Explore journeys_, _Watch the film_, live "Now showing" readout |
| Navigation bar | `components/nav` — transparent over the hero, Bone bar with four-segment reel progress after it; full-screen mobile menu |
| About us | `sections/About` — "the friend who's been", principles, _Planned with_ credit |
| Trips & packages | `sections/Reels` — four reels, each with **The Slate** (duration, route, pace, scenes, price), a reel index, and a deep-linkable journey dialog (`#journey-kerala`) with the day-by-day route |
| Contact form | `sections/Contact` — three acts (Where · When & who · About you), validation, sending / success / error states |
| Footer | `sections/Footer` — end credits with journeys, studio links, contact and socials |

## Project structure

```
src/
  animations/   GSAP registration, motion contexts, Lenis, reel tracking
  components/   ui/ (Button, Dialog, Icon), media/ (LazyVideo, ResponsiveImage), nav/, slate/, journey/, form/
  context/      motion (mode, scroll, lock) and journeys (active reel, dialog, plan requests)
  data/         destinations.ts — all four packages; scenes.ts; site.ts
  hooks/        useMediaQuery
  sections/     one folder per section, each with its own CSS module
  styles/       tokens.css (palette, type scale, motion), reset, global
  types/        content model
  utils/        formatting, enquiry validation (+ tests), Web3Forms submit
```

The four reels are **data-driven**: one `<Reel>` component; each destination's `layout`
(`title-left`, `framed-expand`, `centered-bar`, `title-right`) picks its composition. Content changes happen
in `src/data/destinations.ts`, not in JSX.

## Decisions worth knowing

**Three motion contexts** (`animations/breakpoints.ts`)

- FULL: desktop with a fine pointer — Lenis smooth scrolling and scroll choreography.
- LITE: tablet / touch — reveals only, no pinning.
- STATIC: phones and `prefers-reduced-motion` — no scroll choreography at all.

**Reduced motion is a real mode:** no Lenis, no pinning or parallax, videos never load (posters instead), and
every control still works.

**Media loading** (`components/media/LazyVideo.tsx`)

- Only the hero film loads eagerly; its poster is preloaded as the LCP image.
- Every other video has no `src` until it is about one screen away.
- Videos play while at least 25% visible and pause when they leave.
- Videos in the same group pause each other, so only one reel plays at a time.
- Save-Data users get posters only.
- `vercel.json` gives `/media` year-long immutable caching.

**Accessibility**

- Semantic landmarks and a skip link.
- Native `<dialog>`: focus is kept inside, Esc closes, focus returns to the trigger.
- Form errors are linked to their fields, and focus moves to the first error.
- Destination tiles are a native radio group, so arrow keys work.
- Visible focus rings; touch targets are at least 44px.

**Assets:** videos are WebM, images WebP. Fonts (Instrument Serif, Geist, Geist Mono) are self-hosted through
Fontsource under the SIL Open Font License.

## Deploying (free)

1. Push this folder to a GitHub repository.
2. In Vercel, **Add New → Project**, import the repo. The Vite preset is detected (`npm run build` → `dist/`).
3. Optionally add `VITE_WEB3FORMS_KEY` under **Settings → Environment Variables**, then redeploy.
