export type DestinationSlug = 'japan' | 'morocco' | 'kerala' | 'kashmir'

/** Each reel is composed differently; the layout picks markup + timeline. */
export type ReelLayout = 'title-left' | 'framed-expand' | 'centered-bar' | 'title-right'

export type Region = 'International' | 'India'

export interface MediaImage {
  src: string
  alt: string
  width: number
  height: number
}

export interface ItineraryStop {
  days: string
  place: string
  note: string
}

export interface Destination {
  slug: DestinationSlug
  reel: number
  /** Two-letter production code shown on the slate, e.g. "JP". */
  code: string
  name: string
  region: Region
  packageName: string
  logline: string
  duration: { days: number; nights: number }
  route: string[]
  pace: string
  scenes: string[]
  style: string
  highlights: string[]
  included: string[]
  itinerary: ItineraryStop[]
  /** null → shown as "Custom itinerary". */
  price: { amount: number; currency: 'INR' } | null
  place: string
  coordinates: string
  timecode: string
  /** Caption set inside the framed film (framed-expand reel only). */
  frameCaption?: string
  layout: ReelLayout
  video: { src: string; poster: string }
  /** gallery[0] is the tile used in the contact form and the reel index. */
  gallery: MediaImage[]
}

export interface Scene {
  id: string
  number: string
  title: 'Taste' | 'Move' | 'Breathe' | 'Discover'
  caption: string
  image: MediaImage
}

export interface NavItem {
  label: string
  href: `#${string}`
}

/** A span of the hero film, used for the "Now showing" readout. */
export interface FilmShot {
  from: number
  slug: DestinationSlug
}
