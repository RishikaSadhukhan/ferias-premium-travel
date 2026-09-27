import type { MediaImage, Scene } from '../types/content'

export const scenes: Scene[] = [
  {
    id: 'taste',
    number: '01',
    title: 'Taste',
    caption: 'Counter seats in Tokyo, mezze in a Fes courtyard, fish curry on a banana leaf.',
    image: { src: '/media/images/japan-sushi.webp', alt: 'Chopsticks over a sushi lunch', width: 1800, height: 1800 },
  },
  {
    id: 'move',
    number: '02',
    title: 'Move',
    caption: 'The window seat, the slow train, the long way round.',
    image: { src: '/media/images/scene-train.webp', alt: 'Green fields passing a train window', width: 1800, height: 1192 },
  },
  {
    id: 'breathe',
    number: '03',
    title: 'Breathe',
    caption: 'Munnar, before the mist has lifted.',
    image: {
      src: '/media/images/kerala-tea-hills.webp',
      alt: 'Tea estates on a misty hillside',
      width: 4480,
      height: 6720,
    },
  },
  {
    id: 'discover',
    number: '04',
    title: 'Discover',
    caption: 'A wrong turn in the souk that turns out to be the right one.',
    image: {
      src: '/media/images/morocco-souk.webp',
      alt: 'Rugs hung along a Moroccan market lane',
      width: 4912,
      height: 7360,
    },
  },
]

/** Frames for the intertitle filmstrip — one line of stills, labelled like film frames. */
export const filmstrip: (MediaImage & { label: string })[] = [
  { src: '/media/images/japan-tokyo-street.webp', alt: 'A Tokyo street', width: 3717, height: 5568, label: 'FR 001 · Tokyo' },
  { src: '/media/images/morocco-souk.webp', alt: 'A Marrakech souk', width: 4912, height: 7360, label: 'FR 014 · Marrakech' },
  { src: '/media/images/kerala-tea-hills.webp', alt: 'Munnar tea hills', width: 4480, height: 6720, label: 'FR 027 · Munnar' },
  { src: '/media/images/kashmir-gulmarg.webp', alt: 'Snow in Gulmarg', width: 2587, height: 3234, label: 'FR 039 · Gulmarg' },
  { src: '/media/images/japan-fuji.webp', alt: 'Mount Fuji', width: 3641, height: 5462, label: 'FR 052 · Kawaguchiko' },
  { src: '/media/images/morocco-medersa.webp', alt: 'A medersa courtyard', width: 3914, height: 5872, label: 'FR 061 · Marrakech' },
  { src: '/media/images/kerala-varkala.webp', alt: 'Varkala cliffs', width: 3000, height: 4000, label: 'FR 074 · Varkala' },
  { src: '/media/images/kashmir-shikara.webp', alt: 'A shikara on Dal Lake', width: 2853, height: 3667, label: 'FR 088 · Srinagar' },
]
