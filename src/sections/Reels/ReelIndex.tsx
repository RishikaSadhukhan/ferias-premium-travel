import { destinations } from '../../data/destinations'
import { useJourneys } from '../../context/journeys'
import { useMotion } from '../../context/motion'
import { cx } from '../../utils/cx'
import s from './ReelIndex.module.css'

const totalDays = destinations.reduce((sum, d) => sum + d.duration.days, 0)

/** Jump between reels — useful after scrolling past the film. */
export function ReelIndex() {
  const { scrollTo } = useMotion()
  const { activeReel } = useJourneys()

  return (
    <nav className={s.index} aria-labelledby="reel-index-title">
      <div className={s.head}>
        <h2 id="reel-index-title" className={s.title}>
          Jump to a journey
        </h2>
        <p className={`mono ${s.count}`}>
          {destinations.length} reels · {totalDays} days of travel
        </p>
      </div>
      <ul className={s.list}>
        {destinations.map((d) => (
          <li key={d.slug} className={cx(activeReel === d.slug && s.active)}>
            <button type="button" className={s.item} onClick={() => scrollTo(`#reel-${d.slug}`)}>
              <img loading="lazy" decoding="async" className={s.thumb} src={d.video.poster} alt="" width={1600} height={900} />
              <span>
                <span className={`mono ${s.reelNo}`}>
                  Reel {String(d.reel).padStart(2, '0')} · {d.duration.days}D
                </span>
                <span className={s.package}>{d.packageName}</span>
              </span>
            </button>
          </li>
        ))}
      </ul>
    </nav>
  )
}
