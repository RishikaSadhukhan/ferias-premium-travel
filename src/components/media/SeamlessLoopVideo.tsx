import { useEffect, useRef, useState, type CSSProperties } from 'react'
import { useMotion } from '../../context/motion'
import { cx } from '../../utils/cx'
import s from './SeamlessLoopVideo.module.css'

interface SeamlessLoopVideoProps {
  src: string
  poster: string
  className?: string
  /** Cross-dissolve length in seconds; must be under half the clip's duration. */
  fade?: number
}

/**
 * Background clip whose first and last frames don't match (the closing ocean).
 * Two copies of the same file are stacked; shortly before the visible copy ends,
 * the other restarts underneath and they cross-dissolve, so there is no
 * end → snap → begin. The second copy is served from the browser cache.
 *
 * Same loading rules as LazyVideo: nothing (not even the poster) until ~1.5
 * screens away, play only while ≥25% visible, and poster-only under reduced
 * motion or Save-Data.
 */
export function SeamlessLoopVideo({ src, poster, className, fade = 1 }: SeamlessLoopVideoProps) {
  const wrap = useRef<HTMLDivElement>(null)
  const first = useRef<HTMLVideoElement>(null)
  const second = useRef<HTMLVideoElement>(null)
  const { posterOnly } = useMotion()
  const [near, setNear] = useState(false)
  const enabled = near && !posterOnly

  // 1. Attach the media when the section approaches the viewport.
  useEffect(() => {
    const el = wrap.current
    if (near || !el) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setNear(true)
          observer.disconnect()
        }
      },
      { rootMargin: '150% 0px' },
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [near])

  // 2. Play while visible; alternate the two copies with a cross-dissolve.
  useEffect(() => {
    const el = wrap.current
    const a = first.current
    const b = second.current
    if (!enabled || !el || !a || !b) return
    const videos = [a, b]
    let active = 0
    let visible = false
    let timer = 0
    const resets: number[] = []

    // The incoming copy fades in on top while the outgoing one stays fully opaque
    // underneath, so coverage never dips (two 50% layers would let the backdrop through).
    const bringToFront = (index: number) => {
      videos[index].style.zIndex = '2'
      videos[1 - index].style.zIndex = '1'
      videos[index].style.transition = ''
      videos[index].style.opacity = '1'
    }
    const schedule = () => {
      window.clearTimeout(timer)
      const v = videos[active]
      if (!visible || !Number.isFinite(v.duration) || v.duration <= fade * 2) return
      timer = window.setTimeout(crossfade, Math.max(0, (v.duration - fade - v.currentTime) * 1000))
    }
    const crossfade = () => {
      if (!visible) return
      const previous = videos[active]
      const next = videos[1 - active]
      // Never dissolve into a copy that has no decoded frame yet (it would flash the backdrop).
      if (next.readyState < 2) {
        next.addEventListener('canplay', crossfade, { once: true })
        return
      }
      active = 1 - active
      next.currentTime = 0
      next.play().catch(() => {})
      bringToFront(active)
      resets.push(
        window.setTimeout(() => {
          // Hidden under the opaque copy, so drop it instantly (ready for the next dissolve).
          previous.style.transition = 'none'
          previous.style.opacity = '0'
          previous.pause()
          previous.currentTime = 0
        }, fade * 1000 + 60),
      )
      schedule()
    }
    // Safety net: if buffering delays the timer, never let a copy sit on its last frame.
    const onEnded = (event: Event) => {
      if (event.currentTarget === videos[active]) crossfade()
    }
    const onMeta = () => schedule()

    videos.forEach((v) => {
      v.addEventListener('ended', onEnded)
      v.addEventListener('loadedmetadata', onMeta)
    })
    bringToFront(active)

    const observer = new IntersectionObserver(
      ([entry]) => {
        visible = entry.intersectionRatio >= 0.25
        if (visible) {
          videos[active].play().catch(() => {})
          schedule()
        } else {
          window.clearTimeout(timer)
          videos.forEach((v) => v.pause())
        }
      },
      { threshold: [0, 0.25, 0.6] },
    )
    observer.observe(el)

    return () => {
      observer.disconnect()
      window.clearTimeout(timer)
      resets.forEach((id) => window.clearTimeout(id))
      videos.forEach((v) => {
        v.removeEventListener('ended', onEnded)
        v.removeEventListener('loadedmetadata', onMeta)
        v.pause()
      })
    }
  }, [enabled, fade])

  return (
    <div ref={wrap} className={cx(s.wrap, className)} style={{ '--loop-fade': `${fade}s` } as CSSProperties} aria-hidden="true">
      <video
        ref={first}
        className={s.video}
        src={enabled ? src : undefined}
        poster={near ? poster : undefined}
        muted
        playsInline
        preload={enabled ? 'auto' : 'none'}
        tabIndex={-1}
        disablePictureInPicture
        data-loop-copy="a"
      />
      <video
        ref={second}
        className={s.video}
        style={{ opacity: 0 }}
        src={enabled ? src : undefined}
        muted
        playsInline
        preload={enabled ? 'auto' : 'none'}
        tabIndex={-1}
        disablePictureInPicture
        data-loop-copy="b"
      />
    </div>
  )
}
