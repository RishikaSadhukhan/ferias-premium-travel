import { useRef } from 'react'
import { buildIntertitle } from '../../animations/timelines/intertitle'
import { useMotionScope } from '../../animations/useMotionScope'
import { ResponsiveImage } from '../../components/media/ResponsiveImage'
import { Button } from '../../components/ui/Button'
import { filmstrip } from '../../data/scenes'
import { useMotion } from '../../context/motion'
import { cx } from '../../utils/cx'
import s from './Intertitle.module.css'

export function Intertitle() {
  const { scrollTo } = useMotion()
  const root = useRef<HTMLElement>(null)
  useMotionScope(root, buildIntertitle)

  return (
    <section ref={root} className={s.intertitle} aria-labelledby="intertitle-title">
      <div className={cx('mono', s.meta)} aria-hidden="true" data-intertitle-meta>
        <span>Intertitle I — Why we travel</span>
        <span>00:00:24:00</span>
      </div>

      <h2 id="intertitle-title" className={cx('display', s.title)} data-intertitle-title>
        <span className="mask">
          <span data-line>Your routine has a postcode.</span>
        </span>
        <span className="mask">
          <em data-line>The world doesn’t.</em>
        </span>
      </h2>

      <div className={s.strip} aria-hidden="true" data-filmstrip data-defer-root>
        <ul className={s.track} data-filmstrip-track>
          {filmstrip.map((frame) => (
            <li key={frame.label}>
              <figure className={s.frame}>
                <ResponsiveImage {...frame} decorative deferMargin="25% 0px" />
                <figcaption className="mono">{frame.label}</figcaption>
              </figure>
            </li>
          ))}
        </ul>
      </div>

      <div className={s.columns} data-intertitle-columns>
        <p className={s.lead}>
          FÉRIAS plans journeys the way a director plans a film — every scene considered, every transition smooth, and
          room left for the moments nobody scripts.
        </p>
        <div className={s.aside}>
          <p>
            Four hosted journeys across Japan, Morocco and India. Fully planned, quietly handled, and paced for people
            who would rather remember a place than tick it off.
          </p>
          <Button variant="link" icon="arrowRight" href="#about" onClick={(e) => (e.preventDefault(), scrollTo('#about'))}>
            Meet the studio
          </Button>
        </div>
      </div>
    </section>
  )
}
