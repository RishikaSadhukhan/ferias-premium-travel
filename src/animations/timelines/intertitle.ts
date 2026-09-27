import { gsap } from '../gsap'
import { revealLines, revealOnEnter } from '../reveal'
import type { ActiveMotion } from '../useMotionScope'

/**
 * Intertitle I — the two lines arrive one after the other, like title cards.
 * FULL adds a slow sideways drift of the filmstrip, tied to scroll; everywhere else
 * the strip is a swipe rail (CSS).
 */
export function buildIntertitle(el: HTMLElement, mode: ActiveMotion) {
  const q = gsap.utils.selector(el)
  const [title] = q('[data-intertitle-title]')
  const [strip] = q('[data-filmstrip]')
  const [track] = q('[data-filmstrip-track]')

  gsap.from(q('[data-intertitle-meta]'), {
    opacity: 0,
    duration: 1,
    scrollTrigger: { trigger: el, start: 'top 85%', once: true },
  })
  revealLines(q('[data-line]'), title, { stagger: 0.35, duration: 1.3 })
  revealOnEnter(q('[data-filmstrip-track] > li'), strip, { y: 0, x: 40, stagger: 0.06, duration: 1.1 })
  revealOnEnter(q('[data-intertitle-columns] > *'), q('[data-intertitle-columns]')[0], { stagger: 0.12 })

  if (mode !== 'full') return

  // Drifting with the page: CSS drops the swipe rail (tablet / phone / reduced motion).
  strip.dataset.drift = ''
  gsap.to(track, {
    x: () => -Math.max(0, track.scrollWidth - window.innerWidth),
    ease: 'none',
    scrollTrigger: { trigger: strip, start: 'top bottom', end: 'bottom top', scrub: 0.6, invalidateOnRefresh: true },
  })
  return () => delete strip.dataset.drift
}
