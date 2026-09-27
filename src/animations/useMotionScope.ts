import type { RefObject } from 'react'
import { MQ } from './breakpoints'
import { gsap, ScrollTrigger, useGSAP } from './gsap'

export type ActiveMotion = 'full' | 'lite'

type Build<T extends HTMLElement> = (el: T, mode: ActiveMotion) => void | (() => void)

/**
 * Runs a section's choreography inside gsap.matchMedia().
 *  - FULL and LITE get the build function (it branches on `mode`).
 *  - STATIC (phones, reduced motion) gets nothing: normal document flow.
 * Everything created inside is reverted automatically when the context
 * changes (resize, motion preference) or the component unmounts, so hidden
 * "from" states can never get stuck.
 */
export function useMotionScope<T extends HTMLElement>(
  scope: RefObject<T | null>,
  build: Build<T>,
  dependencies: unknown[] = [],
) {
  useGSAP(
    () => {
      const el = scope.current
      if (!el) return
      const mm = gsap.matchMedia()
      mm.add(
        { full: MQ.full, lite: MQ.lite },
        (context) => {
          const { full, lite } = context.conditions as Record<ActiveMotion, boolean>
          if (!full && !lite) return
          const cleanup = build(el, full ? 'full' : 'lite')
          ScrollTrigger.sort()
          return cleanup
        },
        el,
      )
      return () => mm.revert()
    },
    { scope, dependencies },
  )
}
