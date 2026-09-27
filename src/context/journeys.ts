import { createContext, useContext, type Dispatch, type SetStateAction } from 'react'
import type { DestinationSlug } from '../types/content'

export interface PlanRequest {
  slug: DestinationSlug
  id: number
}

export interface JourneyContextValue {
  /** Reel currently on screen (drives the nav readout), null outside the reels. */
  activeReel: DestinationSlug | null
  setActiveReel: Dispatch<SetStateAction<DestinationSlug | null>>
  /** Journey whose detail dialog is open. */
  openJourney: DestinationSlug | null
  showJourney: (slug: DestinationSlug) => void
  closeJourney: () => void
  /** Latest "Plan this journey" request; the id makes repeat requests count. */
  planRequest: PlanRequest | null
  planJourney: (slug: DestinationSlug) => void
}

export const JourneyContext = createContext<JourneyContextValue | null>(null)

export function useJourneys() {
  const ctx = useContext(JourneyContext)
  if (!ctx) throw new Error('useJourneys must be used inside <JourneyProvider>')
  return ctx
}
