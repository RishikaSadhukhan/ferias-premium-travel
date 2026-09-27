import { useRef } from 'react'
import { gsap } from '../../animations/gsap'
import { revealOnEnter } from '../../animations/reveal'
import { useMotionScope } from '../../animations/useMotionScope'
import { ResponsiveImage } from '../../components/media/ResponsiveImage'
import { cx } from '../../utils/cx'
import s from './About.module.css'

const principles = [
  { n: '01', title: 'Fewer places, longer stays.' },
  { n: '02', title: 'Local hands, not middlemen.' },
  { n: '03', title: 'One designer, start to finish.' },
]

export function About() {
  const root = useRef<HTMLElement>(null)

  useMotionScope(root, (el, mode) => {
    const q = gsap.utils.selector(el)
    const [content] = q('[data-about-content]')
    revealOnEnter(q('[data-about-content] > :not(ul)'), content, { stagger: 0.1 })
    revealOnEnter(q('[data-about-principles] > li'), q('[data-about-principles]')[0], { stagger: 0.12 })
    if (mode !== 'full') return
    // The photograph drifts slower than the page: depth without distraction.
    gsap.fromTo(
      q('[data-about-media] img'),
      { yPercent: -6, scale: 1.14 },
      {
        yPercent: 6,
        scale: 1.14,
        ease: 'none',
        scrollTrigger: { trigger: el, start: 'top bottom', end: 'bottom top', scrub: 0.6 },
      },
    )
  })

  return (
    <section ref={root} id="about" className={s.about} aria-labelledby="about-title">
      <div className={s.media} data-about-media>
        <ResponsiveImage
          src="/media/images/about-traveller.webp"
          alt="A traveller looks out over misty mountains and tea gardens"
          width={1800}
          height={1200}
        />
        <p className={cx('mono', s.mediaCaption)} aria-hidden="true">
          On location — Munnar, 6:10 am
        </p>
      </div>

      <div className={s.content} data-about-content>
        <p className={cx('mono', s.kicker)}>About — The studio</p>
        <h2 id="about-title" className={cx('display', s.title)}>
          We’re not a travel agency. We’re the friend <em>who’s been.</em>
        </h2>
        <p className={s.body}>
          FÉRIAS is a small team of journey designers. We only plan places we have travelled ourselves, and every trip
          is looked after by one person — from the first message to the flight home.
        </p>

        <ul className={s.principles} data-about-principles>
          {principles.map((p) => (
            <li key={p.n} className={s.principle}>
              <p className="mono">{p.n}</p>
              <p className={s.principleTitle}>{p.title}</p>
            </li>
          ))}
        </ul>

        <div className={s.credit}>
          <p className="mono">Planned with</p>
          <p>Local guides, family-run stays, drivers who know the back roads, and cooks who’ll let you into the kitchen.</p>
        </div>
      </div>
    </section>
  )
}
