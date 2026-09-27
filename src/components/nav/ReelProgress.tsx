import type { CSSProperties } from 'react'
import { destinations } from '../../data/destinations'
import { cx } from '../../utils/cx'
import s from './ReelProgress.module.css'

/** Four segments, one per reel, filled by scroll progress (see useReelTracking). */
export function ReelProgress({ visible }: { visible: boolean }) {
  return (
    <div className={cx(s.progress, visible && s.visible)} aria-hidden="true">
      {destinations.map((d) => (
        <span key={d.slug} className={s.segment} style={{ '--p': `var(--reel-${d.slug}, 0)` } as CSSProperties} />
      ))}
    </div>
  )
}
