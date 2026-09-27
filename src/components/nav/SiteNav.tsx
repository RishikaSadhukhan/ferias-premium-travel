import { useEffect, useState, type MouseEvent } from 'react'
import { destinationBySlug } from '../../data/destinations'
import { navItems, site } from '../../data/site'
import { useJourneys } from '../../context/journeys'
import { useMotion } from '../../context/motion'
import { cx } from '../../utils/cx'
import { Button } from '../ui/Button'
import { Icon } from '../ui/Icon'
import { MobileMenu } from './MobileMenu'
import { ReelProgress } from './ReelProgress'
import s from './SiteNav.module.css'

export function SiteNav() {
  const [solid, setSolid] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const { activeReel } = useJourneys()
  const { scrollTo } = useMotion()
  const reel = activeReel ? destinationBySlug[activeReel] : null

  // Transparent over the hero; the Bone bar once the hero has scrolled away.
  useEffect(() => {
    const hero = document.getElementById('top')
    if (!hero) return
    const observer = new IntersectionObserver(([entry]) => setSolid(!entry.isIntersecting), {
      rootMargin: '-64px 0px 0px 0px',
    })
    observer.observe(hero)
    return () => observer.disconnect()
  }, [])

  const go = (event: MouseEvent<HTMLAnchorElement>, href: string) => {
    event.preventDefault()
    scrollTo(href)
  }

  return (
    <header className={cx(s.nav, solid && s.solid)}>
      <a href="#top" className={s.logo} onClick={(e) => go(e, '#top')} aria-label="FÉRIAS — back to the opening shot">
        <img className={s.logoIvory} src={site.logo.ivory} alt="" width={site.logo.width} height={site.logo.height} />
        <img className={s.logoInk} src={site.logo.ink} alt="" width={site.logo.width} height={site.logo.height} />
      </a>

      <nav aria-label="Primary">
        <ul className={s.links}>
          {navItems.map((item) => (
            <li key={item.href}>
              <a
                className={cx(s.link)}
                href={item.href}
                aria-current={item.href === '#journeys' && reel ? 'true' : undefined}
                onClick={(e) => go(e, item.href)}
              >
                {item.label}
              </a>
            </li>
          ))}
        </ul>
      </nav>

      <div className={s.end}>
        {reel && (
          <span className={cx('mono', s.readout)}>
            Reel {String(reel.reel).padStart(2, '0')} — {reel.name}
          </span>
        )}
        <Button variant="light" className={s.cta} href="#contact" onClick={(e) => go(e, '#contact')}>
          Plan your journey
        </Button>
        <button
          type="button"
          className={s.menuButton}
          aria-label="Open menu"
          aria-haspopup="dialog"
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen(true)}
        >
          <Icon name="menu" />
        </button>
      </div>

      <ReelProgress visible={solid} />
      <MobileMenu open={menuOpen} onClose={() => setMenuOpen(false)} />
    </header>
  )
}
