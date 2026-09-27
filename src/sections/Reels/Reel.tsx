import { useRef } from 'react'
import { buildReel } from '../../animations/timelines/reel'
import { useMotionScope } from '../../animations/useMotionScope'
import { useReelTracking } from '../../animations/useReelTracking'
import { LazyVideo } from '../../components/media/LazyVideo'
import { Slate, type SlateVariant } from '../../components/slate/Slate'
import { destinations } from '../../data/destinations'
import type { Destination, ReelLayout } from '../../types/content'
import { cx } from '../../utils/cx'
import { formatReel } from '../../utils/format'
import s from './Reel.module.css'

const layoutClass: Record<ReelLayout, string> = {
  'title-left': s.titleLeft,
  'framed-expand': s.framedExpand,
  'centered-bar': s.centeredBar,
  'title-right': s.titleRight,
}

const slateVariant: Record<ReelLayout, SlateVariant> = {
  'title-left': 'card',
  'framed-expand': 'strip',
  'centered-bar': 'bar',
  'title-right': 'card',
}

const hasRail = (layout: ReelLayout) => layout === 'title-left' || layout === 'title-right'

/** Letters that hang below the baseline (the J and p of "Japan"): the tight title line box needs room for them. */
const DESCENDERS = /[gjpqyJQ]/

/** One reusable reel; the destination's `layout` picks the composition and its choreography. */
export function Reel({ destination: d }: { destination: Destination }) {
  const ref = useRef<HTMLElement>(null)
  useReelTracking(ref, d.slug)
  useMotionScope(ref, (el, mode) => buildReel(el, d.layout, mode), [d.layout])
  const titleId = `reel-${d.slug}-title`
  const framed = d.layout === 'framed-expand'

  const slate = (
    <Slate destination={d} variant={slateVariant[d.layout]} className={s.slate} motionTarget />
  )

  return (
    <article ref={ref} id={`reel-${d.slug}`} className={cx(s.reel, layoutClass[d.layout])} aria-labelledby={titleId}>
      <div className={s.stage} data-reel-stage>
        <div className={s.frame} data-reel-frame>
          <LazyVideo className={s.video} group="reels" src={d.video.src} poster={d.video.poster} />
          <div className={s.scrim} aria-hidden="true" />
          {framed && <div className={s.shade} aria-hidden="true" data-reel-shade />}
          <div className={s.dim} aria-hidden="true" data-reel-dim />
        </div>
        {/* Invisible copy of the contained rectangle: the unfold measures its clip from it. */}
        <span className={s.frameGuide} aria-hidden="true" data-reel-frame-guide />

        <header className={cx('mono', s.meta)} aria-hidden="true" data-reel-meta>
          <div>
            <p>{formatReel(d.reel, destinations.length)}</p>
            {!framed && <p className={s.metaSub}>{d.coordinates}</p>}
          </div>
          <p className={cx(s.metaSub, s.metaEnd)}>{framed ? (d.frameCaption ?? d.timecode) : d.timecode}</p>
        </header>

        {hasRail(d.layout) && (
          <ol className={s.rail} aria-hidden="true" data-reel-rail>
            {destinations.map((other) => (
              <li key={other.slug} className={cx('mono', s.railItem, other.slug === d.slug && s.railActive)}>
                {String(other.reel).padStart(2, '0')} {other.name}
              </li>
            ))}
          </ol>
        )}

        <div className={s.copy} data-reel-copy>
          <div className={s.heading} data-reel-heading data-descends={DESCENDERS.test(d.name) || undefined}>
            <p className={cx('mono', s.kicker)}>
              {d.name} — {d.region}
            </p>
            <h3 id={titleId} className={cx('display', s.title)} data-reel-title>
              {d.name}
            </h3>
          </div>
          <div className={s.story} data-reel-story>
            <p className={s.package}>{d.packageName}</p>
            <p className={s.logline}>{d.logline}</p>
            {/* The framed reel stacks its slate under the story, beside the film. */}
            {d.layout === 'framed-expand' && slate}
          </div>
        </div>

        {d.layout !== 'framed-expand' && slate}
      </div>
    </article>
  )
}
