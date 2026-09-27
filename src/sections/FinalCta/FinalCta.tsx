import { useRef } from 'react'
import { gsap } from '../../animations/gsap'
import { revealLines } from '../../animations/reveal'
import { useMotionScope } from '../../animations/useMotionScope'
import { SeamlessLoopVideo } from '../../components/media/SeamlessLoopVideo'
import { Button } from '../../components/ui/Button'
import { closingFilm } from '../../data/site'
import { useMotion } from '../../context/motion'
import { cx } from '../../utils/cx'
import { REPLAY_EVENT } from '../../utils/events'
import s from './FinalCta.module.css'

/** The closing shot. */
export function FinalCta() {
  const { scrollTo } = useMotion()
  const root = useRef<HTMLElement>(null)

  // The closing shot: the picture settles as it arrives, then the last line is set.
  useMotionScope(root, (el, mode) => {
    const q = gsap.utils.selector(el)
    gsap
      .timeline({ scrollTrigger: { trigger: el, start: 'top 60%', once: true } })
      .add(revealLines(q('[data-line]'), undefined, { duration: 1.4 }), 0)
      .from(q('[data-final-body], [data-final-actions] > *'), { opacity: 0, y: 18, duration: 1, stagger: 0.1 }, 0.5)
      .from(q('[data-final-corner]'), { opacity: 0, duration: 1.2 }, 0.8)
    if (mode !== 'full') return
    gsap.fromTo(
      q('[data-final-media]'),
      { scale: 1.12 },
      { scale: 1, ease: 'none', scrollTrigger: { trigger: el, start: 'top bottom', end: 'top top', scrub: 0.6 } },
    )
  })

  const replay = () => {
    scrollTo('#top')
    window.dispatchEvent(new Event(REPLAY_EVENT))
  }

  return (
    <section ref={root} className={s.final} aria-labelledby="final-title">
      <div className={s.media} data-final-media>
        <SeamlessLoopVideo className={s.video} src={closingFilm.src} poster={closingFilm.poster} fade={1} />
      </div>
      <div className={s.scrim} aria-hidden="true" />
      <p className={cx('mono', s.corner, s.cornerStart)} aria-hidden="true" data-final-corner>
        End of reel 04
      </p>
      <p className={cx('mono', s.corner, s.cornerEnd)} aria-hidden="true" data-final-corner>
        00:11:40:00
      </p>

      <div>
        <h2 id="final-title" className={cx('display', s.title)}>
          <span className="mask">
            <span data-line>
              Where to, <em>next?</em>
            </span>
          </span>
        </h2>
        <p className={s.body} data-final-body>Every FÉRIAS journey begins with a conversation. Tell us where — we’ll plan the rest.</p>
        <div className={s.actions} data-final-actions>
          <Button variant="light" icon="arrowRight" onClick={() => scrollTo('#contact')}>
            Start planning
          </Button>
          <Button variant="link" icon="arrowUp" onClick={replay}>
            Replay the film
          </Button>
        </div>
      </div>
    </section>
  )
}
