import { useRef } from 'react'
import { gsap } from '../../animations/gsap'
import { useMotionScope } from '../../animations/useMotionScope'
import type { Destination } from '../../types/content'
import s from './CutBand.module.css'

/** "Cut to —" intertitle between reels. Decorative: the next reel carries the heading. */
export function CutBand({ destination: d }: { destination: Destination }) {
  const ref = useRef<HTMLDivElement>(null)

  // The destination name wipes in like a title card cut into the edit.
  useMotionScope(ref, (el, mode) => {
    const q = gsap.utils.selector(el)
    const tl = gsap.timeline({
      defaults: { ease: 'none' },
      scrollTrigger:
        mode === 'full'
          ? { trigger: el, start: 'top 95%', end: 'top 45%', scrub: 0.5 }
          : { trigger: el, start: 'top 85%', once: true },
    })
    tl.from(q('[data-cut-label]'), { opacity: 0, x: -12, duration: 0.3 }, 0)
      .fromTo(
        q('[data-cut-name]'),
        { clipPath: 'inset(0% 100% 0% 0%)' },
        { clipPath: 'inset(0% 0% 0% 0%)', duration: 0.6, ease: 'power2.out' },
        0.15,
      )
      .from(q('[data-cut-side], [data-cut-coords]'), { opacity: 0, duration: 0.3 }, 0.45)
    if (mode === 'lite') tl.duration(1.2)
  })

  return (
    <div ref={ref} className={s.cut} aria-hidden="true">
      <span className={`mono ${s.side}`} data-cut-side>
        Reel {String(d.reel).padStart(2, '0')}
      </span>
      <div className={s.center}>
        <span className={`mono ${s.label}`} data-cut-label>
          Cut to —
        </span>
        <span className={s.name} data-cut-name>
          {d.name}
        </span>
        <span className={`mono ${s.coords}`} data-cut-coords>
          {d.coordinates}
        </span>
      </div>
      <span className={`mono ${s.side}`} data-cut-side>
        {d.timecode}
      </span>
    </div>
  )
}
