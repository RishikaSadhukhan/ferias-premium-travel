import { useEffect, useRef, useState } from 'react'
import { buildHero } from '../../animations/timelines/hero'
import { useMotionScope } from '../../animations/useMotionScope'
import { LazyVideo } from '../../components/media/LazyVideo'
import { Button } from '../../components/ui/Button'
import { Dialog } from '../../components/ui/Dialog'
import { Icon } from '../../components/ui/Icon'
import { destinationBySlug, destinations } from '../../data/destinations'
import { heroFilm, heroShots } from '../../data/site'
import { useMotion } from '../../context/motion'
import type { DestinationSlug } from '../../types/content'
import { cx } from '../../utils/cx'
import { REPLAY_EVENT } from '../../utils/events'
import { useFilmShot } from './useFilmShot'
import s from './Hero.module.css'

export function Hero() {
  const { scrollTo, posterOnly } = useMotion()
  const root = useRef<HTMLElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const [filmOpen, setFilmOpen] = useState(false)
  const { shot, onTimeUpdate } = useFilmShot()
  const showing = destinationBySlug[shot.slug]

  useMotionScope(root, buildHero)

  // "Replay the film" from the closing section restarts the opening shot.
  useEffect(() => {
    const replay = () => {
      const video = videoRef.current
      if (!video) return
      video.currentTime = 0
      video.play().catch(() => {})
    }
    window.addEventListener(REPLAY_EVENT, replay)
    return () => window.removeEventListener(REPLAY_EVENT, replay)
  }, [])

  // Chapter buttons jump the film to that destination's first shot.
  const seek = (slug: DestinationSlug) => {
    const video = videoRef.current
    const first = heroShots.find((item) => item.slug === slug)
    if (!video || !first || !video.currentSrc) return
    video.currentTime = first.from + 0.05
    video.play().catch(() => {})
  }

  return (
    <section ref={root} id="top" className={s.hero} aria-labelledby="hero-title">
      <div className={s.media} data-hero-video>
        <LazyVideo
          eager
          group="hero"
          className={s.video}
          src={heroFilm.src}
          poster={heroFilm.poster}
          videoRef={videoRef}
          onTimeUpdate={onTimeUpdate}
        />
      </div>
      <div className={s.scrim} aria-hidden="true" />

      <div className={s.content} data-hero-content>
        <p className={cx('mono', s.kicker)} data-hero-kicker>
          A film in four reels — {destinations.map((d) => d.name).join(' · ')}
        </p>
        <h1 id="hero-title" className={cx('display', s.title)}>
          <span className="visually-hidden">FÉRIAS — </span>
          <span className="mask">
            <span data-line>Go somewhere</span>
          </span>
          <span className="mask">
            <em data-line>you’ll remember.</em>
          </span>
        </h1>
        <div className={s.actions} data-hero-actions>
          <Button variant="light" href="#journeys" onClick={(e) => (e.preventDefault(), scrollTo('#journeys'))}>
            Explore journeys
          </Button>
          <button type="button" className={s.watch} onClick={() => setFilmOpen(true)} aria-haspopup="dialog">
            <span className={s.watchIcon}>
              <Icon name="play" size={14} />
            </span>
            Watch the film <span className="mono">{heroFilm.durationLabel}</span>
          </button>
        </div>
      </div>

      <div className={s.bottom} data-hero-bottom>
        <p className="mono">
          Now showing — {showing.name}
          <br />
          {showing.coordinates}
        </p>
        <ol className={s.chapters} aria-label="Destinations in the film">
          {destinations.map((d) => {
            const active = d.slug === shot.slug
            const label = `${String(d.reel).padStart(2, '0')} ${d.name}`
            const bar = (
              <span className={s.chapterBar} aria-hidden="true">
                <span className={s.chapterFill} style={{ transform: `scaleX(${active ? shot.progress : 0})` }} />
              </span>
            )
            return (
              <li key={d.slug} className={cx(s.chapter, active && s.chapterActive)}>
                {posterOnly ? (
                  <>
                    <span className={cx('mono', s.chapterLabel)}>{label}</span>
                    {bar}
                  </>
                ) : (
                  <button
                    type="button"
                    className={s.chapterButton}
                    onClick={() => seek(d.slug)}
                    aria-current={active || undefined}
                    aria-label={`Play the ${d.name} scenes`}
                  >
                    <span className={cx('mono', s.chapterLabel)}>{label}</span>
                    {bar}
                  </button>
                )}
              </li>
            )
          })}
        </ol>
        <span className={cx('mono', s.scroll)} aria-hidden="true">
          Scroll ↓
        </span>
      </div>

      <Dialog open={filmOpen} onClose={() => setFilmOpen(false)} labelledBy="film-title" className={s.film}>
        <div className={s.filmBar}>
          <h2 id="film-title" className="mono">
            The FÉRIAS film · {heroFilm.durationLabel}
          </h2>
          <button type="button" className={s.filmClose} onClick={() => setFilmOpen(false)} aria-label="Close the film">
            <Icon name="close" />
          </button>
        </div>
        {filmOpen && (
          <video className={s.filmVideo} src={heroFilm.src} poster={heroFilm.poster} controls autoPlay muted playsInline />
        )}
      </Dialog>
    </section>
  )
}
