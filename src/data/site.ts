import type { FilmShot, NavItem } from '../types/content'

export const site = {
  name: 'FÉRIAS',
  tagline: "Go somewhere you'll remember.",
  email: 'hello@ferias.travel',
  hours: 'Monday to Saturday, 10:00–19:00 IST',
  socials: [
    { label: 'Instagram', href: 'https://instagram.com' },
    { label: 'YouTube', href: 'https://youtube.com' },
    { label: 'Pinterest', href: 'https://pinterest.com' },
  ],
  logo: { ink: '/brand/logo-ink.svg', ivory: '/brand/logo-ivory.svg', width: 369, height: 80 },
}

export const navItems: NavItem[] = [
  { label: 'Journeys', href: '#journeys' },
  { label: 'Experiences', href: '#experiences' },
  { label: 'About', href: '#about' },
  { label: 'Contact', href: '#contact' },
]

export const heroFilm = {
  src: '/media/video/hero.webm',
  poster: '/media/posters/hero.webp',
  durationLabel: '0:24',
}

export const closingFilm = {
  src: '/media/video/closing.webm',
  poster: '/media/posters/closing.webp',
}

/**
 * Shot list of the hero film (start time in seconds → destination on screen).
 * Drives the "Now showing" readout and the four-chapter indicator.
 * Update alongside the film if it is re-cut.
 */
export const heroShots: FilmShot[] = [
  { from: 0, slug: 'japan' },
  { from: 5.7, slug: 'morocco' },
  { from: 7.9, slug: 'kerala' },
  { from: 10.1, slug: 'japan' },
  { from: 11.4, slug: 'kashmir' },
  { from: 13.6, slug: 'morocco' },
  { from: 16.7, slug: 'kerala' },
  { from: 19.1, slug: 'kashmir' },
  { from: 21.5, slug: 'japan' },
]
