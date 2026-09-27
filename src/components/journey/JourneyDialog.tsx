import { useState } from 'react'
import { destinationBySlug } from '../../data/destinations'
import { useJourneys } from '../../context/journeys'
import type { Destination, MediaImage } from '../../types/content'
import { cx } from '../../utils/cx'
import { formatDuration, formatPrice, formatReel, formatRoute } from '../../utils/format'
import { ResponsiveImage } from '../media/ResponsiveImage'
import { Button } from '../ui/Button'
import { Dialog } from '../ui/Dialog'
import { Icon } from '../ui/Icon'
import s from './JourneyDialog.module.css'

const ratio = (image: MediaImage) => image.width / image.height

/**
 * Stills after the hero image. The layout follows the photographs themselves:
 *  - mostly portrait → a 3:4 triptych; on phones the still closest to 4:5 leads
 *    full-width, so the lead frame crops least;
 *  - mostly landscape → the widest still leads full-width at 16:10, 4:3 pair beneath.
 */
const galleryFor = (d: Destination) => {
  const stills = d.gallery.slice(1)
  const sorted = stills.map(ratio).sort((a, b) => a - b)
  const portrait = (sorted[Math.floor(sorted.length / 2)] ?? 1) < 1
  const lead = portrait
    ? (image: MediaImage) => Math.abs(ratio(image) - 4 / 5)
    : (image: MediaImage) => -ratio(image)
  return { portrait, stills: [...stills].sort((a, b) => lead(a) - lead(b)) }
}

/** Full package detail — opened from any slate, deep-linkable via #journey-<slug>. */
export function JourneyDialog() {
  const { openJourney, closeJourney, planJourney } = useJourneys()
  // Keep the last journey rendered while the dialog closes (adjusted during render, not in an effect).
  const [shown, setShown] = useState<Destination | null>(openJourney ? destinationBySlug[openJourney] : null)
  if (openJourney && shown?.slug !== openJourney) setShown(destinationBySlug[openJourney])

  const d = shown
  const gallery = d ? galleryFor(d) : null
  return (
    <Dialog open={Boolean(openJourney)} onClose={closeJourney} labelledBy="journey-title" className={s.dialog}>
      {d && (
        <article>
          <div className={s.hero}>
            <ResponsiveImage {...d.gallery[0]} priority />
            <span className={`mono ${s.reelTag}`}>{formatReel(d.reel)}</span>
            <button type="button" className={s.close} onClick={closeJourney} aria-label="Close journey details">
              <Icon name="close" />
            </button>
          </div>

          <div className={s.body}>
            <p className={`mono ${s.meta}`}>
              {d.name} — {d.region}
            </p>
            <h2 id="journey-title" className={`display ${s.title}`}>
              {d.name}
            </h2>
            <p className={s.package}>{d.packageName}</p>
            <p className={s.logline}>{d.logline}</p>

            <dl className={s.facts}>
              <div>
                <dt className="mono">Duration</dt>
                <dd>{formatDuration(d.duration)}</dd>
              </div>
              <div>
                <dt className="mono">Pace</dt>
                <dd>{d.pace}</dd>
              </div>
              <div>
                <dt className="mono">Style</dt>
                <dd>{d.style}</dd>
              </div>
              <div>
                <dt className="mono">Price</dt>
                <dd>{formatPrice(d.price)}</dd>
              </div>
            </dl>

            <section className={s.block} aria-labelledby="journey-route">
              <h3 id="journey-route" className={`mono ${s.blockTitle}`}>
                The route — {formatRoute(d.route)}
              </h3>
              <ol>
                {d.itinerary.map((stop) => (
                  <li key={stop.days} className={s.stop}>
                    <span className="mono">{stop.days}</span>
                    <div>
                      <p className={s.stopPlace}>{stop.place}</p>
                      <p className={s.stopNote}>{stop.note}</p>
                    </div>
                  </li>
                ))}
              </ol>
            </section>

            <div className={`${s.block} ${s.lists}`}>
              <section aria-labelledby="journey-highlights">
                <h3 id="journey-highlights" className={`mono ${s.blockTitle}`}>
                  Scenes you’ll remember
                </h3>
                <ul className={s.bullets}>
                  {d.highlights.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </section>
              <section aria-labelledby="journey-included">
                <h3 id="journey-included" className={`mono ${s.blockTitle}`}>
                  Handled for you
                </h3>
                <ul className={s.bullets}>
                  {d.included.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </section>
            </div>

            <div className={cx(s.gallery, gallery?.portrait ? s.galleryPortrait : s.galleryLandscape)}>
              {gallery?.stills.map((image, i) => (
                <ResponsiveImage key={image.src} {...image} className={cx(s.still, i === 0 && s.stillLead)} />
              ))}
            </div>

            <div className={s.actions}>
              <Button variant="dark" icon="arrowRight" onClick={() => planJourney(d.slug)}>
                Plan this journey
              </Button>
              <Button variant="link" onClick={closeJourney}>
                Back to the film
              </Button>
            </div>
          </div>
        </article>
      )}
    </Dialog>
  )
}
