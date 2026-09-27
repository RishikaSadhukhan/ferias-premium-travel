# FÉRIAS — Go somewhere you'll remember.

A premium holiday-packages website, built as a front-end assignment around one idea: **a travel film that happens to be a website.**

The homepage plays like a film in four reels, and the language of cinema — reel numbers, timecodes, "Cut to —" transitions and a production slate — doubles as the navigation.

**Live website:** [ferias-premium-travel.vercel.app](https://ferias-premium-travel.vercel.app)

**Repository:** [github.com/RishikaSadhukhan/ferias-premium-travel](https://github.com/RishikaSadhukhan/ferias-premium-travel)

`React 19` · `TypeScript` · `Vite` · `GSAP + ScrollTrigger` · `Lenis` · `CSS Modules` · static, no backend

---

## Project overview

FÉRIAS presents four hosted journeys. Instead of a conventional grid of package cards, each journey is presented as a cinematic reel: a full-screen scene with its own footage, title and composition.

| Reel | Destination | Package |
| --- | --- | --- |
| 01 | Japan | Japan, Unfolded |
| 02 | Morocco | The Red Road |
| 03 | Kerala | The Quiet South |
| 04 | Kashmir | Into the Himalayas |

The page runs in film order: an opening hero, an intertitle, the four reels, a set of shared scenes, the studio story, the enquiry form, a closing shot and end credits.

## Key features

- **Cinematic destination reels:** full-screen video scenes that unfold from contained frames to full bleed as the page scrolls.
- **Four distinct compositions:** each destination has its own visual layout rather than repeating the same template.
- **The Slate:** a compact production-slate card for each journey showing duration, route, pace, scenes and price, with *View journey* and *Plan this journey* actions.
- **Journey dialogs:** detailed package views with gallery, highlights, what's included and a day-by-day route. Each journey can also be opened through its own deep link, such as `#journey-kerala`.
- **Enquiry flow:** a three-step contact form — *Where · When & who · About you* — with validation and sending, success and error states. *Plan this journey* can pre-select the destination.
- **Responsive experience:** dedicated desktop, tablet and mobile behaviour, including a full-screen mobile menu and swipeable content rails.
- **Reduced-motion mode:** a complete still version of the experience rather than simply shortening animations.
- **Lazy media loading:** videos and images load progressively as they approach the viewport.

## Design & UX

- **Editorial travel aesthetic.** A restrained Sand / Bone / Ink palette lets the destination footage provide the colour. Instrument Serif is used for display typography, with Geist for interface and body text and Geist Mono for film metadata.
- **Film-inspired navigation.** The navigation includes a four-segment reel progress bar and a live readout of the reel currently on screen, such as "Reel 02 — Morocco". Each reel carries a reel number, coordinates and timecode, while "Cut to —" bands connect the journeys.
- **Visual storytelling.** The hero film introduces all four destinations with chapter controls that jump into the journey. The closing section returns to a looping film with an option to replay the experience.
- **Destination-specific compositions.** Japan places its title left and slate right. Morocco begins as a framed film and expands to full bleed. Kerala centres its title above a bottom information bar. Kashmir mirrors the Japan composition.
- **Mobile adaptation.** On phones and tablets, reels become full-height cards with the slate presented as a bottom sheet, while horizontal content becomes a swipeable rail.
- **Clear calls to action.** *Explore journeys* and *Plan your journey* remain accessible from the hero, navigation, journey slates, dialogs and closing section.

## Destinations

| Destination | Experience |
| --- | --- |
| **Japan**, *Japan, Unfolded* | 8 days · Tokyo → Kyoto → Osaka. Neon Tokyo, lantern-lit Kyoto and Osaka's late-night kitchens. Pace: curious, fast then slow. |
| **Morocco**, *The Red Road* | 10 days · Marrakech → Atlas → Merzouga → Fes → Chefchaouen. Spice markets, a night under the Sahara dunes and the blue lanes of Chefchaouen. Pace: slow, then vast. |
| **Kerala**, *The Quiet South* | 7 days · Kochi → Munnar → Alleppey → Varkala. Backwaters by houseboat, misted tea hills and a slow coastline. Pace: slow and restorative. |
| **Kashmir**, *Into the Himalayas* | 8 days · Srinagar → Gulmarg → Pahalgam. Dal Lake by shikara, cedar houseboats, snow and alpine meadows. Pace: unhurried, alpine. |

All four are presented as custom itineraries. Package content lives in `src/data/destinations.ts`, while the reels, slates and journey dialogs are generated from that data.

## Tech stack

| Technology | Purpose |
| --- | --- |
| React 19 | UI components |
| TypeScript (strict) | Type safety across components and content data |
| Vite | Development server and production build |
| GSAP + ScrollTrigger | Scroll-driven animation, pinning, reveals and clip-path transitions |
| Lenis | Smooth scrolling on desktop |
| CSS Modules | Component-scoped styling with shared design tokens |
| Vitest | Unit tests for enquiry validation |
| oxlint | Linting |
| Fontsource | Self-hosted fonts |

## Responsiveness & accessibility

### Motion levels

- **Desktop:** smooth scrolling, pinned reels and scroll-driven sequences on wide screens with mouse or trackpad input.
- **Tablet / touch:** the same content with lighter reveals and no pinned scroll choreography.
- **Phones and reduced motion:** normal document flow without scroll choreography.

### Reduced motion

When `prefers-reduced-motion: reduce` is enabled:

- Smooth scrolling, pinning and parallax are disabled.
- Videos use poster images instead of loading.
- All navigation, dialogs and form controls remain functional.

### Accessibility

- Semantic landmarks, a single `h1`, ordered headings and a skip link.
- Visible focus states on interactive elements.
- Native `<dialog>` elements for journey and film overlays, with focus management, Escape-to-close behaviour and scroll locking.
- Form fields have labels, while validation errors are connected to their fields with `aria-describedby` and `aria-invalid`.
- Focus moves to the first invalid field when form validation fails.
- The destination picker uses a native radio group for keyboard navigation.
- Decorative video is hidden from assistive technology.

## Performance

- **Hero first:** only the hero film loads immediately, with its poster preloaded for the opening view.
- **Proximity loading:** other videos and posters attach as they approach the viewport, while below-the-fold images load lazily.
- **One video at a time:** videos play only while visible and pause when they leave. Reel videos also pause each other.
- **Poster fallback:** reduced-motion and Save-Data users receive poster images instead of video downloads.
- **Reliable closing loop:** the final shot uses a cross-dissolve between two copies of the clip with a fallback that prevents playback from freezing.
- **Stable media layout:** images use intrinsic dimensions to reduce layout movement.
- **Media caching:** static media is configured for long-lived browser caching.
- **Production build:** Vite produces an optimized production build with content-hashed assets. Media is served as WebM video and WebP images.

## Project structure

```text
src/
  animations/   GSAP setup, motion levels, per-section timelines
  components/   UI primitives, media, navigation, slate, journey dialog, form
  context/      motion state and journey state
  data/         destinations, scenes and site content
  sections/     one folder per page section with its CSS module
  styles/       design tokens, reset and global styles
  utils/        formatting, enquiry validation and form submission

public/media/   videos, posters and images