import { useJourneys } from '../../context/journeys'
import type { Destination } from '../../types/content'
import { cx } from '../../utils/cx'
import { formatDuration, formatPrice, formatRoute } from '../../utils/format'
import { Button } from '../ui/Button'
import s from './Slate.module.css'

export type SlateVariant = 'card' | 'bar' | 'strip'

interface SlateProps {
  destination: Destination
  variant: SlateVariant
  className?: string
  /** Marks the slate for the reel choreography. */
  motionTarget?: boolean
}

export function Slate({ destination: d, variant, className, motionTarget }: SlateProps) {
  const { showJourney, planJourney } = useJourneys()

  return (
    <aside
      className={cx(s.slate, s[variant], className)}
      aria-label={`${d.packageName} at a glance`}
      data-reel-slate={motionTarget || undefined}
    >
      <div className={cx('mono', s.head)}>
        <span>The slate</span>
        <span>
          {d.code} · {d.duration.days}D
        </span>
      </div>

      <dl className={s.rows}>
        <div className={s.row}>
          <dt className="mono">Duration</dt>
          <dd>
            <span className={s.full}>{formatDuration(d.duration)}</span>
            <span className={s.short}>{d.duration.days} days</span>
          </dd>
        </div>
        <div className={s.row}>
          <dt className="mono">Route</dt>
          <dd>
            <span className={s.full}>{formatRoute(d.route)}</span>
            <span className={s.short}>{formatRoute([d.route[0], d.route[d.route.length - 1]])}</span>
          </dd>
        </div>
        <div className={cx(s.row, s.paceRow)}>
          <dt className="mono">Pace</dt>
          <dd>{d.pace}</dd>
        </div>
        <div className={cx(s.row, s.scenesRow)}>
          <dt className="mono">Scenes</dt>
          <dd>{d.scenes.join(' · ')}</dd>
        </div>
        <div className={s.row}>
          <dt className="mono">{d.price ? 'From' : 'Price'}</dt>
          <dd className={s.price}>{formatPrice(d.price)}</dd>
        </div>
      </dl>

      <div className={s.actions}>
        <Button
          variant="dark"
          icon="arrowRight"
          className={s.primary}
          onClick={() => showJourney(d.slug)}
          aria-haspopup="dialog"
        >
          View journey
        </Button>
        <Button variant="link" onClick={() => planJourney(d.slug)}>
          Plan this journey
        </Button>
      </div>
    </aside>
  )
}
