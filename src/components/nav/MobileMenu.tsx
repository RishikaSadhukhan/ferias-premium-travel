import { destinationBySlug, destinations } from '../../data/destinations'
import { navItems, site } from '../../data/site'
import { useJourneys } from '../../context/journeys'
import { useMotion } from '../../context/motion'
import { Button } from '../ui/Button'
import { Dialog } from '../ui/Dialog'
import { Icon } from '../ui/Icon'
import s from './MobileMenu.module.css'

const itemMeta: Record<string, string> = {
  '#journeys': `${destinations.length} reels`,
  '#experiences': 'Scenes',
  '#about': 'The studio',
  '#contact': 'Enquire',
}

export function MobileMenu({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { scrollTo } = useMotion()
  const { activeReel } = useJourneys()
  const featured = destinationBySlug[activeReel ?? 'japan']

  // Close first so the page is unlocked, then travel.
  const travel = (href: string) => {
    onClose()
    requestAnimationFrame(() => scrollTo(href))
  }

  return (
    <Dialog open={open} onClose={onClose} labelledBy="mobile-menu-title" className={s.menu}>
      <div className={s.bar}>
        <img className={s.logo} src={site.logo.ivory} alt="FÉRIAS" width={site.logo.width} height={site.logo.height} />
        <button type="button" className={s.close} onClick={onClose} aria-label="Close menu">
          <Icon name="close" />
        </button>
      </div>

      <div className={s.body}>
        <h2 id="mobile-menu-title" className={`mono ${s.label}`}>
          Index
        </h2>
        <nav aria-label="Mobile">
          <ul className={s.list}>
            {navItems.map((item) => (
              <li key={item.href}>
                <button type="button" className={s.item} onClick={() => travel(item.href)}>
                  <span className={s.itemLabel}>{item.label}</span>
                  <span className={`mono ${s.itemMeta}`}>{itemMeta[item.href]}</span>
                </button>
              </li>
            ))}
          </ul>
        </nav>

        <button type="button" className={s.now} onClick={() => travel(`#reel-${featured.slug}`)}>
          <img loading="lazy" decoding="async" src={featured.video.poster} alt="" width={1600} height={900} />
          <span>
            <span className={`mono ${s.itemMeta}`}>
              Now showing · Reel {String(featured.reel).padStart(2, '0')}
            </span>
            <span className={s.nowTitle}>{featured.packageName}</span>
          </span>
        </button>

        <div className={s.foot}>
          <Button variant="light" icon="arrowRight" block onClick={() => travel('#contact')}>
            Plan your journey
          </Button>
          <div className={`mono ${s.meta}`}>
            <span>
              {site.socials.slice(0, 2).map((social, i) => (
                <span key={social.label}>
                  {i > 0 && ' · '}
                  <a href={social.href} target="_blank" rel="noreferrer">
                    {social.label}
                  </a>
                </span>
              ))}
            </span>
            <a href={`mailto:${site.email}`}>{site.email}</a>
          </div>
        </div>
      </div>
    </Dialog>
  )
}
