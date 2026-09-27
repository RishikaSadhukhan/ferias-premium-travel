/**
 * The three motion contexts. Every GSAP timeline is created inside a
 * gsap.matchMedia() branch keyed by these, so switching breakpoint or
 * motion preference reverts everything cleanly.
 *
 * FULL   — desktop, fine pointer, motion allowed: Lenis, pinning, scrubbing.
 * LITE   — tablet / touch, motion allowed: reveals only, no pinning.
 * STATIC — phones or reduced motion: no scroll choreography at all.
 */
const motionOk = '(prefers-reduced-motion: no-preference)'

export const MQ = {
  full: `${motionOk} and (min-width: 1200px) and (hover: hover) and (pointer: fine)`,
  lite: `${motionOk} and (min-width: 768px) and ((max-width: 1199.98px) or (hover: none) or (pointer: coarse))`,
  static: '(max-width: 767.98px), (prefers-reduced-motion: reduce)',
  reducedMotion: '(prefers-reduced-motion: reduce)',
  mobile: '(max-width: 767.98px)',
} as const

export type MotionMode = 'full' | 'lite' | 'static'

export const getMotionMode = (): MotionMode => {
  if (typeof window === 'undefined') return 'static'
  if (window.matchMedia(MQ.full).matches) return 'full'
  if (window.matchMedia(MQ.lite).matches) return 'lite'
  return 'static'
}
