import { useCallback, useEffect, useMemo, useState, type ReactNode } from 'react'
import { isDestinationSlug } from '../data/destinations'
import type { DestinationSlug } from '../types/content'
import { JourneyContext, type PlanRequest } from './journeys'
import { useMotion } from './motion'

const HASH_PREFIX = '#journey-'

const slugFromHash = (): DestinationSlug | null => {
  const hash = window.location.hash
  if (!hash.startsWith(HASH_PREFIX)) return null
  const slug = hash.slice(HASH_PREFIX.length)
  return isDestinationSlug(slug) ? slug : null
}

export function JourneyProvider({ children }: { children: ReactNode }) {
  const { scrollTo } = useMotion()
  const [activeReel, setActiveReel] = useState<DestinationSlug | null>(null)
  const [openJourney, setOpenJourney] = useState<DestinationSlug | null>(() => slugFromHash())
  const [planRequest, setPlanRequest] = useState<PlanRequest | null>(null)

  // Journey dialogs are deep-linkable: #journey-kerala opens Kerala.
  useEffect(() => {
    const onHash = () => setOpenJourney(slugFromHash())
    window.addEventListener('hashchange', onHash)
    return () => window.removeEventListener('hashchange', onHash)
  }, [])

  const showJourney = useCallback((slug: DestinationSlug) => {
    history.pushState(null, '', `${HASH_PREFIX}${slug}`)
    setOpenJourney(slug)
  }, [])

  const closeJourney = useCallback(() => {
    if (window.location.hash.startsWith(HASH_PREFIX)) {
      history.replaceState(null, '', window.location.pathname + window.location.search)
    }
    setOpenJourney(null)
  }, [])

  const planJourney = useCallback(
    (slug: DestinationSlug) => {
      setPlanRequest((prev) => ({ slug, id: (prev?.id ?? 0) + 1 }))
      closeJourney()
      // Wait a frame so a closing dialog releases scroll before we move.
      requestAnimationFrame(() => scrollTo('#contact'))
    },
    [closeJourney, scrollTo],
  )

  const value = useMemo(
    () => ({
      activeReel,
      setActiveReel,
      openJourney,
      showJourney,
      closeJourney,
      planRequest,
      planJourney,
    }),
    [activeReel, openJourney, showJourney, closeJourney, planRequest, planJourney],
  )

  return <JourneyContext.Provider value={value}>{children}</JourneyContext.Provider>
}
