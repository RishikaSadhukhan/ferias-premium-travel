import Lenis from 'lenis'
import { gsap, ScrollTrigger } from './gsap'

/**
 * Smooth scrolling for the FULL context only. Lenis is driven by GSAP's ticker
 * so ScrollTrigger and Lenis agree on every frame.
 */
export function createLenis() {
  const lenis = new Lenis({ lerp: 0.1, smoothWheel: true })

  lenis.on('scroll', ScrollTrigger.update)
  const tick = (time: number) => lenis.raf(time * 1000)
  gsap.ticker.add(tick)
  gsap.ticker.lagSmoothing(0)

  return {
    lenis,
    destroy() {
      gsap.ticker.remove(tick)
      gsap.ticker.lagSmoothing(500, 33)
      lenis.destroy()
    },
  }
}
