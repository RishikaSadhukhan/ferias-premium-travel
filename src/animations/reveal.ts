import { gsap } from './gsap'

type Targets = gsap.TweenTarget

/**
 * Fade-and-rise once, when the trigger enters the viewport. `once` kills the
 * trigger afterwards, so nothing keeps running.
 */
export function revealOnEnter(targets: Targets, trigger: Element, vars: gsap.TweenVars = {}) {
  return gsap.from(targets, {
    y: 28,
    opacity: 0,
    duration: 1,
    stagger: 0.08,
    ease: 'power3.out',
    ...vars,
    scrollTrigger: { trigger, start: 'top 82%', once: true },
  })
}

/**
 * Masked line reveal for display type: each [data-line] sits in a .mask
 * wrapper and rises into view. Without a trigger it plays immediately.
 */
export function revealLines(lines: Targets, trigger?: Element, vars: gsap.TweenVars = {}) {
  return gsap.from(lines, {
    yPercent: 110,
    duration: 1.2,
    stagger: 0.12,
    ease: 'power4.out',
    ...vars,
    scrollTrigger: trigger ? { trigger, start: 'top 80%', once: true } : undefined,
  })
}

/** Start pinning at the top — or at the bottom when the element is taller than the screen, so nothing is clipped. */
export const pinStart = (el: HTMLElement) => () => (el.offsetHeight > window.innerHeight + 2 ? 'bottom bottom' : 'top top')
