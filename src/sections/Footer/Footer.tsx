import { useRef } from 'react'
import { gsap } from '../../animations/gsap'
import { revealOnEnter } from '../../animations/reveal'
import { useMotionScope } from '../../animations/useMotionScope'
import { Icon } from '../../components/ui/Icon'
import { destinations } from '../../data/destinations'
import { navItems, site } from '../../data/site'
import { useMotion } from '../../context/motion'
import { cx } from '../../utils/cx'
import s from './Footer.module.css'

/** End credits. */
export function Footer() {
  const { scrollTo } = useMotion()
  const year = new Date().getFullYear()
  const root = useRef<HTMLElement>(null)

  // End credits: names settle in, column by column. Short, once.
  useMotionScope(root, (el) => {
    const q = gsap.utils.selector(el)
    revealOnEnter(q('[data-credits-title]'), el, { y: 12, stagger: 0.1 })
    revealOnEnter(q('[data-credits] > *'), q('[data-credits]')[0], { y: 20, stagger: 0.14, duration: 1.2 })
  })

  return (
    <footer ref={root} className={s.footer}>
      <img data-credits-title className={s.logo} src={site.logo.ink} alt="FÉRIAS" width={site.logo.width} height={site.logo.height} />
      <p data-credits-title className={cx('mono', s.tagline)}>
        {site.tagline}
      </p>

      <div className={s.credits} data-credits>
        <nav aria-labelledby="credits-journeys">
          <h2 id="credits-journeys" className={cx('mono', s.role)}>
            Journeys
          </h2>
          <ul>
            {destinations.map((d) => (
              <li key={d.slug}>
                <button type="button" className={s.name} onClick={() => scrollTo(`#reel-${d.slug}`)}>
                  {d.packageName}
                </button>
              </li>
            ))}
          </ul>
        </nav>

        <nav aria-labelledby="credits-studio">
          <h2 id="credits-studio" className={cx('mono', s.role)}>
            The studio
          </h2>
          <ul>
            {navItems
              .filter((item) => item.href !== '#journeys')
              .map((item) => (
                <li key={item.href}>
                  <button type="button" className={s.name} onClick={() => scrollTo(item.href)}>
                    {item.label}
                  </button>
                </li>
              ))}
          </ul>
        </nav>

        <div>
          <h2 className={cx('mono', s.role)}>Contact &amp; follow</h2>
          <ul>
            <li>
              <a className={s.name} href={`mailto:${site.email}`}>
                {site.email}
              </a>
            </li>
            {site.socials.map((social) => (
              <li key={social.label}>
                <a className={s.name} href={social.href} target="_blank" rel="noreferrer">
                  {social.label}
                  <span className="visually-hidden"> (opens in a new tab)</span>
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className={cx('mono', s.bottom)}>
        <span>© {year} FÉRIAS · {site.hours}</span>
        <button type="button" className={s.top} onClick={() => scrollTo('#top')}>
          Back to the opening shot <Icon name="arrowUp" size={14} />
        </button>
      </div>
    </footer>
  )
}
