import { useEffect, useRef, useState, type RefObject, type SyntheticEvent } from 'react'
import { useMotion } from '../../context/motion'

interface LazyVideoProps {
  src: string
  poster: string
  className?: string
  /** Hero only: attach the source immediately and preload it. */
  eager?: boolean
  /** Videos in the same group never play at the same time. */
  group?: string
  videoRef?: RefObject<HTMLVideoElement | null>
  onTimeUpdate?: (event: SyntheticEvent<HTMLVideoElement>) => void
}

const groups = new Map<string, Set<HTMLVideoElement>>()

function playExclusive(video: HTMLVideoElement, group?: string) {
  if (group) groups.get(group)?.forEach((other) => other !== video && other.pause())
  video.play().catch(() => {
    /* Autoplay can be refused (e.g. power saving); the poster stays visible. */
  })
}

/**
 * Muted, looping, decorative video that:
 *  - has no poster and no src until it is ~1.5 screens away (except `eager`) —
 *    browsers fetch posters eagerly, so even the poster waits,
 *  - plays only while at least 25% visible and pauses when it leaves,
 *  - pauses its siblings in the same group, so one reel plays at a time,
 *  - never loads video under reduced motion or Save-Data — the poster is shown instead.
 */
export function LazyVideo({ src, poster, className, eager = false, group, videoRef, onTimeUpdate }: LazyVideoProps) {
  const innerRef = useRef<HTMLVideoElement>(null)
  const ref = videoRef ?? innerRef
  const { posterOnly } = useMotion()
  const [near, setNear] = useState(eager)
  const enabled = near && !posterOnly

  // 1. Attach poster (and source) when the video approaches the viewport.
  useEffect(() => {
    const video = ref.current
    if (near || !video) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setNear(true)
          observer.disconnect()
        }
      },
      { rootMargin: '150% 0px' },
    )
    observer.observe(video)
    return () => observer.disconnect()
  }, [near, ref])

  // 2. Play while visible, pause otherwise.
  useEffect(() => {
    const video = ref.current
    if (!enabled || !video) return
    if (group) {
      if (!groups.has(group)) groups.set(group, new Set())
      groups.get(group)!.add(video)
    }
    const observer = new IntersectionObserver(
      ([entry]) => (entry.intersectionRatio >= 0.25 ? playExclusive(video, group) : video.pause()),
      { threshold: [0, 0.25, 0.6] },
    )
    observer.observe(video)
    return () => {
      observer.disconnect()
      video.pause()
      if (group) groups.get(group)?.delete(video)
    }
  }, [enabled, group, ref])

  return (
    <video
      ref={ref}
      className={className}
      src={enabled ? src : undefined}
      poster={near ? poster : undefined}
      muted
      loop
      playsInline
      preload={eager ? 'auto' : 'none'}
      aria-hidden="true"
      tabIndex={-1}
      disablePictureInPicture
      onTimeUpdate={onTimeUpdate}
    />
  )
}
