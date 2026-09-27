import type { Destination } from '../types/content'

export const formatDuration = ({ days, nights }: Destination['duration']) => `${days} days · ${nights} nights`

export const formatRoute = (route: string[]) => route.join(' → ')

export const formatPrice = (price: Destination['price']) =>
  price
    ? `From ${new Intl.NumberFormat('en-IN', { style: 'currency', currency: price.currency, maximumFractionDigits: 0 }).format(price.amount)}`
    : 'Custom itinerary'

export const formatReel = (reel: number, total = 4) =>
  `Reel ${String(reel).padStart(2, '0')} / ${String(total).padStart(2, '0')}`

/** Local calendar date as YYYY-MM-DD (the format <input type="date"> uses). */
export const toISODate = (date: Date) => {
  const offset = date.getTimezoneOffset() * 60_000
  return new Date(date.getTime() - offset).toISOString().slice(0, 10)
}
