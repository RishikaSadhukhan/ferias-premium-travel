import { gsap } from '../gsap'
import { revealLines } from '../reveal'
import type { ActiveMotion } from '../useMotionScope'

/**
 * Opening shot.
 *  - Both contexts: the headline rises line by line, then kicker, actions and chapter bar.
 *  - FULL: on scroll the film eases forward (scale + slow drift) while the copy lifts
 *    away, so the Sand intertitle seems to arrive over the picture.
 * Intro tweens target inner elements; scroll tweens target their wrappers, so the two never fight.
 */
export function buildHero(el: HTMLElement, mode: ActiveMotion) {
  const q = gsap.utils.selector(el)
  const [video] = q('[data-hero-video]')
  const [content] = q('[data-hero-content]')
  const [bottom] = q('[data-hero-bottom]')

  const intro = gsap.timeline({ delay: 0.15 })
  intro
    .add(revealLines(q('[data-line]'), undefined, { duration: 1.4, stagger: 0.14 }), 0)
    .from(q('[data-hero-kicker]'), { opacity: 0, y: 12, duration: 1 }, 0.35)
    .from(q('[data-hero-actions] > *'), { opacity: 0, y: 18, duration: 0.9, stagger: 0.08 }, 0.7)
    .from(q('[data-hero-bottom] > *'), { opacity: 0, duration: 1.2, stagger: 0.1 }, 0.9)

  if (mode !== 'full') return

  gsap
    .timeline({
      defaults: { ease: 'none' },
      scrollTrigger: { trigger: el, start: 'top top', end: 'bottom top', scrub: 0.5 },
    })
    .to(video, { scale: 1.08, yPercent: 10 }, 0)
    .to(content, { y: -110, opacity: 0, duration: 0.7 }, 0)
    .to(bottom, { opacity: 0, duration: 0.35 }, 0)
}
