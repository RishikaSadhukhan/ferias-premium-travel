import type { RefObject } from 'react'
import { useJourneys } from '../context/journeys'
import type { DestinationSlug } from '../types/content'
import { ScrollTrigger, useGSAP } from './gsap'

/**
 * Reports a reel's scroll progress to the nav (as --reel-<slug> on <html>,
 * so no React re-render per frame) and marks it active while on screen.
 * Runs in every motion context: it's wayfinding, not decoration.
 */
export function useReelTracking(ref: RefObject<HTMLElement | null>, slug: DestinationSlug) {
  const { setActiveReel } = useJourneys()

  useGSAP(
    () => {
      const root = document.documentElement
      const write = (value: number) => root.style.setProperty(`--reel-${slug}`, value.toFixed(3))

      const trigger = ScrollTrigger.create({
        trigger: ref.current,
        start: 'top 55%',
        end: 'bottom 45%',
        // Measure after the reel's pin exists, so progress spans the pinned hold too.
        refreshPriority: -1,
        onUpdate: (self) => write(self.progress),
        onLeave: () => write(1),
        onLeaveBack: () => write(0),
        onToggle: (self) =>
          setActiveReel((current) => (self.isActive ? slug : current === slug ? null : current)),
      })

      ScrollTrigger.sort()

      return () => {
        trigger.kill()
        root.style.removeProperty(`--reel-${slug}`)
      }
    },
    { scope: ref, dependencies: [slug] },
  )
}
