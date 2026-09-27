import { useCallback, useState, type SyntheticEvent } from 'react'
import { heroShots } from '../../data/site'
import type { DestinationSlug } from '../../types/content'

/** Maps the hero film's playhead to the destination on screen. */
export function useFilmShot() {
  const [shot, setShot] = useState<{ slug: DestinationSlug; progress: number }>({
    slug: heroShots[0].slug,
    progress: 0,
  })

  const onTimeUpdate = useCallback((event: SyntheticEvent<HTMLVideoElement>) => {
    const { currentTime, duration } = event.currentTarget
    if (!Number.isFinite(duration)) return
    let index = 0
    for (let i = 0; i < heroShots.length; i++) if (currentTime >= heroShots[i].from) index = i
    const start = heroShots[index].from
    const end = heroShots[index + 1]?.from ?? duration
    const progress = Math.min(1, Math.max(0, (currentTime - start) / (end - start)))
    setShot({ slug: heroShots[index].slug, progress })
  }, [])

  return { shot, onTimeUpdate }
}
