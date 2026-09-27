import { useCallback, useEffect, useMemo, useRef, type ReactNode } from 'react'
import { MQ, type MotionMode } from '../animations/breakpoints'
import { ScrollTrigger } from '../animations/gsap'
import { createLenis } from '../animations/lenis'
import { useMediaQuery } from '../hooks/useMediaQuery'
import { MotionContext } from './motion'

const prefersSaveData = () =>
  typeof navigator !== 'undefined' &&
  Boolean((navigator as Navigator & { connection?: { saveData?: boolean } }).connection?.saveData)

export function MotionProvider({ children }: { children: ReactNode }) {
  const full = useMediaQuery(MQ.full)
  const lite = useMediaQuery(MQ.lite)
  const reducedMotion = useMediaQuery(MQ.reducedMotion)
  const mode: MotionMode = full ? 'full' : lite ? 'lite' : 'static'
  const lenisRef = useRef<ReturnType<typeof createLenis> | null>(null)

  useEffect(() => {
    if (mode !== 'full') return
    const instance = createLenis()
    lenisRef.current = instance
    return () => {
      instance.destroy()
      lenisRef.current = null
    }
  }, [mode])

  // Pins must be measured before the triggers below them: sort by
  // refreshPriority, then re-measure once webfonts and media have settled.
  useEffect(() => {
    const refresh = () => {
      ScrollTrigger.sort()
      ScrollTrigger.refresh()
    }
    ScrollTrigger.sort()
    document.fonts?.ready.then(refresh)
    window.addEventListener('load', refresh)
    return () => window.removeEventListener('load', refresh)
  }, [])

  const scrollTo = useCallback(
    (target: string | HTMLElement | number) => {
      if (typeof target === 'number') {
        if (lenisRef.current) lenisRef.current.lenis.scrollTo(target, { duration: 1 })
        else window.scrollTo({ top: target, behavior: reducedMotion ? 'auto' : 'smooth' })
        return
      }
      const el = typeof target === 'string' ? document.querySelector<HTMLElement>(target) : target
      if (!el) return
      if (lenisRef.current) {
        lenisRef.current.lenis.scrollTo(el, { duration: 1.4 })
      } else {
        el.scrollIntoView({ behavior: reducedMotion ? 'auto' : 'smooth', block: 'start' })
      }
      // Move keyboard/screen-reader focus with the scroll.
      if (!el.hasAttribute('tabindex')) el.setAttribute('tabindex', '-1')
      el.focus({ preventScroll: true })
    },
    [reducedMotion],
  )

  const lockScroll = useCallback((locked: boolean) => {
    document.documentElement.classList.toggle('scroll-locked', locked)
    if (locked) lenisRef.current?.lenis.stop()
    else lenisRef.current?.lenis.start()
  }, [])

  const value = useMemo(
    () => ({ mode, reducedMotion, posterOnly: reducedMotion || prefersSaveData(), scrollTo, lockScroll }),
    [mode, reducedMotion, scrollTo, lockScroll],
  )

  return <MotionContext.Provider value={value}>{children}</MotionContext.Provider>
}
