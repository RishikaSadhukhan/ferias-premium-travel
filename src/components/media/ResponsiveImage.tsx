import { useEffect, useRef, useState, type CSSProperties } from 'react'
import type { MediaImage } from '../../types/content'

interface ResponsiveImageProps extends MediaImage {
  className?: string
  style?: CSSProperties
  /** Above-the-fold images load eagerly with high priority. */
  priority?: boolean
  /** Decorative images get an empty alt so screen readers skip them. */
  decorative?: boolean
  /**
   * Hold the source back until the image is within this margin of the viewport
   * (e.g. '25% 0px'). Native lazy loading starts ~1250px early, which pulls heavy
   * images in on first load; this keeps them for when the reader gets close.
   * The width/height attributes still reserve the space, so nothing shifts.
   * Inside a [data-defer-root] (a sideways rail) the root's position decides.
   */
  deferMargin?: string
}

/** <img> with intrinsic dimensions (no layout shift) and lazy decoding. */
export function ResponsiveImage({
  src,
  alt,
  width,
  height,
  className,
  style,
  priority = false,
  decorative = false,
  deferMargin,
}: ResponsiveImageProps) {
  const ref = useRef<HTMLImageElement>(null)
  const [near, setNear] = useState(!deferMargin)

  useEffect(() => {
    const el = ref.current
    if (near || !el) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setNear(true)
          observer.disconnect()
        }
      },
      { rootMargin: deferMargin },
    )
    observer.observe(el.closest('[data-defer-root]') ?? el)
    return () => observer.disconnect()
  }, [near, deferMargin])

  return (
    // `loading` must be set before `src`, or the browser starts fetching eagerly.
    <img
      ref={ref}
      loading={priority ? 'eager' : 'lazy'}
      decoding="async"
      fetchPriority={priority ? 'high' : 'auto'}
      src={near ? src : undefined}
      alt={decorative ? '' : alt}
      width={width}
      height={height}
      className={className}
      style={style}
    />
  )
}
