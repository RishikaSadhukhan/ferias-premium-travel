import { useEffect, useRef, useState } from 'react'
import { gsap, type ScrollTrigger } from '../../animations/gsap'
import { pinStart, revealOnEnter } from '../../animations/reveal'
import { useMotionScope } from '../../animations/useMotionScope'
import { ResponsiveImage } from '../../components/media/ResponsiveImage'
import { Icon } from '../../components/ui/Icon'
import { scenes } from '../../data/scenes'
import { useMotion } from '../../context/motion'
import { cx } from '../../utils/cx'
import s from './Scenes.module.css'

const last = scenes.length - 1

export function Scenes() {
  const root = useRef<HTMLElement>(null)
  const viewport = useRef<HTMLDivElement>(null)
  const pinned = useRef<ScrollTrigger | null>(null)
  const [index, setIndex] = useState(0)
  const { reducedMotion, scrollTo } = useMotion()

  /*
   * FULL: the section pins and vertical scroll drives the track sideways.
   * LITE / STATIC: the native swipe rail (scroll-snap) stays in charge.
   */
  useMotionScope(root, (el, mode) => {
    const q = gsap.utils.selector(el)
    revealOnEnter(q('[data-scenes-head] > *'), el, { stagger: 0.1 })
    if (mode !== 'full') {
      revealOnEnter(q('[data-scene]'), el, { y: 0, x: 48, stagger: 0.08 })
      return
    }

    const track = q('[data-scenes-track]')[0] as HTMLElement
    const port = viewport.current!
    el.dataset.pinned = 'true'
    const distance = () => Math.max(0, track.scrollWidth - port.clientWidth)

    const tween = gsap.to(track, {
      x: () => -distance(),
      ease: 'none',
      scrollTrigger: {
        trigger: el,
        start: pinStart(el),
        end: () => `+=${distance()}`,
        pin: true,
        scrub: 0.6,
        anticipatePin: 1,
        invalidateOnRefresh: true,
        // Only touches React when the scene number actually changes.
        onUpdate: (self) => setIndex(Math.round(self.progress * last)),
      },
    })
    pinned.current = tween.scrollTrigger ?? null

    return () => {
      pinned.current = null
      delete el.dataset.pinned
    }
  })

  // Native rail: keep the counter in sync with the scene snapped into view.
  useEffect(() => {
    const el = viewport.current
    if (!el) return
    const items = Array.from(el.querySelectorAll<HTMLElement>('[data-scene]'))
    const observer = new IntersectionObserver(
      (entries) => {
        if (pinned.current) return
        entries.forEach((entry) => {
          if (entry.isIntersecting) setIndex(items.indexOf(entry.target as HTMLElement))
        })
      },
      { root: el, threshold: 0.6 },
    )
    items.forEach((item) => observer.observe(item))
    return () => observer.disconnect()
  }, [])

  const goTo = (next: number) => {
    const clamped = Math.min(last, Math.max(0, next))
    const st = pinned.current
    if (st) {
      // Pinned: move the page to the matching point of the horizontal scene.
      scrollTo(st.start + (st.end - st.start) * (clamped / last))
    } else {
      const el = viewport.current
      const target = el?.querySelectorAll<HTMLElement>('[data-scene]')[clamped]
      if (!el || !target) return
      const padding = parseFloat(getComputedStyle(el).scrollPaddingLeft) || 0
      const left = el.scrollLeft + target.getBoundingClientRect().left - el.getBoundingClientRect().left - padding
      el.scrollTo({ left, behavior: reducedMotion ? 'auto' : 'smooth' })
    }
    setIndex(clamped)
  }

  const pad = (n: number) => String(n).padStart(2, '0')

  return (
    <section ref={root} id="experiences" className={s.scenes} aria-labelledby="scenes-title">
      <div className={s.head} data-scenes-head>
        <div>
          <p className={cx('mono', s.kicker)}>
            Scenes {scenes[0].number} — {scenes[last].number} · Experiences
          </p>
          <h2 id="scenes-title" className={cx('display', s.title)}>
            What it <em>feels</em> like.
          </h2>
        </div>
        <p className={s.intro}>Four scenes that turn up in every FÉRIAS journey — whichever country you’re in.</p>
        <div className={s.controls}>
          <button
            type="button"
            className={s.control}
            onClick={() => goTo(index - 1)}
            disabled={index === 0}
            aria-label="Previous scene"
          >
            <Icon name="arrowLeft" />
          </button>
          <button
            type="button"
            className={s.control}
            onClick={() => goTo(index + 1)}
            disabled={index === last}
            aria-label="Next scene"
          >
            <Icon name="arrowRight" />
          </button>
        </div>
      </div>

      <div
        ref={viewport}
        className={s.viewport}
        tabIndex={0}
        role="region"
        aria-roledescription="carousel"
        aria-label="Scenes — scroll sideways or use the arrow buttons"
      >
        <ol className={s.track} data-scenes-track>
          {scenes.map((scene) => (
            <li
              key={scene.id}
              data-scene
              className={cx(
                s.scene,
                scene.image.width / scene.image.height > 1.4 && s.wide,
                scene.image.width / scene.image.height < 0.9 && s.tall,
              )}
              aria-label={`Scene ${scene.number} of ${pad(scenes.length)}: ${scene.title}`}
            >
              <figure>
                <ResponsiveImage {...scene.image} />
                <figcaption>
                  <p className={cx('mono', s.sceneLabel)}>
                    Scene {scene.number} — {scene.title}
                  </p>
                  <p className={s.caption}>{scene.caption}</p>
                </figcaption>
              </figure>
            </li>
          ))}
        </ol>
      </div>

      <div className={s.progress} aria-hidden="true">
        <span className="mono">
          {pad(index + 1)} / {pad(scenes.length)}
        </span>
        <span className={s.bar}>
          <span className={s.barFill} style={{ transform: `scaleX(${(index + 1) / scenes.length})` }} />
        </span>
      </div>
    </section>
  )
}
