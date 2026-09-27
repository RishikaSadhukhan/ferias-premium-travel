import type { ReelLayout } from '../../types/content'
import { gsap } from '../gsap'
import { pinStart, revealOnEnter } from '../reveal'
import type { ActiveMotion } from '../useMotionScope'

/**
 * One reel, three phases (FULL):
 *  1. Enter  — scrubbed while the reel scrolls up to the top: the picture fades up
 *     from black and settles; title and slate take their marks. Finished by the time
 *     the reel reaches the top, so jumping to a reel always lands on a complete frame.
 *  2. Hold   — the stage pins and the film unfolds from a contained frame to full
 *     bleed (Morocco is the reference, pinned for 110% of a screen; the other reels
 *     share its clip mechanics on a tighter 75% hold, so each destination reads
 *     as one viewport-sized scene rather than a long section).
 *  3. Exit   — the picture dips to black as the next "Cut to —" band arrives.
 * LITE: a simple one-time reveal, no pinning.
 */
export function buildReel(el: HTMLElement, layout: ReelLayout, mode: ActiveMotion) {
  const q = gsap.utils.selector(el)
  const [stage] = q('[data-reel-stage]')
  const [frame] = q('[data-reel-frame]')
  const [video] = q('[data-reel-frame] video')
  const [dim] = q('[data-reel-dim]')
  const [shade] = q('[data-reel-shade]')
  const [guide] = q('[data-reel-frame-guide]')
  const [copy] = q('[data-reel-copy]')
  const [heading] = q('[data-reel-heading]')
  const [story] = q('[data-reel-story]')
  const [title] = q('[data-reel-title]')
  const [slate] = q('[data-reel-slate]')
  const chrome = q('[data-reel-meta], [data-reel-rail]')

  if (mode === 'lite') {
    revealOnEnter([heading, story, slate], el, { stagger: 0.12 })
    return
  }

  const framed = layout === 'framed-expand'

  // 1 — Enter (the other reels fade up from a lighter dip, so the footage shows sooner)
  const enter = gsap.timeline({
    defaults: { ease: 'none' },
    scrollTrigger: { trigger: el, start: 'top 85%', end: 'top top', scrub: 0.6 },
  })
  enter.fromTo(dim, { opacity: framed ? 0.85 : 0.5 }, { opacity: 0, duration: framed ? 0.6 : 0.45 }, 0)
  enter.fromTo(video, { scale: 1.14 }, { scale: 1.04, duration: 1 }, 0)

  if (layout === 'title-left' || layout === 'title-right') {
    const dir = layout === 'title-left' ? -1 : 1
    enter
      .from(copy, { x: 110 * dir, opacity: 0, duration: 0.5, ease: 'power2.out' }, 0.35)
      .from(slate, { x: -110 * dir, opacity: 0, duration: 0.5, ease: 'power2.out' }, 0.45)
      .from(chrome, { opacity: 0, duration: 0.3 }, 0.55)
  } else if (layout === 'centered-bar') {
    enter
      .from(copy, { opacity: 0, scale: 0.94, duration: 0.5, ease: 'power2.out' }, 0.3)
      .from(title, { letterSpacing: '0.04em', duration: 0.6, ease: 'power2.out' }, 0.3)
      .from(slate, { y: 70, opacity: 0, duration: 0.45, ease: 'power2.out' }, 0.5)
      .from(chrome, { opacity: 0, duration: 0.3 }, 0.55)
  } else {
    enter
      .from(heading, { y: 60, opacity: 0, duration: 0.5, ease: 'power2.out' }, 0.35)
      .from(story, { y: 60, opacity: 0, duration: 0.5, ease: 'power2.out' }, 0.45)
      .from(chrome, { opacity: 0, duration: 0.3 }, 0.55)
  }

  // 2 — Hold (pinned). Every reel holds long enough for its full-bleed moment.
  const hold = gsap.timeline({
    defaults: { ease: 'none' },
    scrollTrigger: {
      trigger: el,
      start: pinStart(stage),
      end: framed ? '+=110%' : '+=75%',
      pin: stage,
      scrub: 0.6,
      anticipatePin: 1,
      invalidateOnRefresh: true,
    },
  })
  // Explicit start value: continue exactly where the enter phase left the picture.
  hold.fromTo(video, { scale: 1.04 }, { scale: 1, duration: 1, immediateRender: false }, 0)

  let cleanup: (() => void) | undefined
  if (framed) {
    // The film becomes a full-stage box (CSS), clipped back to the framed
    // rectangle measured from the invisible guide, then the clip opens to full
    // bleed. Title and story stay on screen and cross-fade from ink-on-Sand to
    // ivory-on-film over a soft shade. (A data attribute, not a class: React owns className.)
    el.dataset.expandable = ''
    const inset = () => {
      const s = stage.getBoundingClientRect()
      const g = guide.getBoundingClientRect()
      return `inset(${g.top - s.top}px ${s.right - g.right}px ${s.bottom - g.bottom}px ${g.left - s.left}px)`
    }
    hold
      .fromTo(frame, { clipPath: inset }, { clipPath: 'inset(0px 0px 0px 0px)', ease: 'power2.inOut', duration: 0.6 }, 0)
      .fromTo(shade, { opacity: 0 }, { opacity: 1, duration: 0.45 }, 0.15)
      .fromTo(
        el,
        { '--mo-fg': '#151412', '--mo-mute': '#5a554c', '--mo-line': 'rgba(21, 20, 18, 0.14)' },
        { '--mo-fg': '#f7f4ee', '--mo-mute': 'rgba(247, 244, 238, 0.8)', '--mo-line': 'rgba(247, 244, 238, 0.3)', duration: 0.35 },
        0.25,
      )
    cleanup = () => delete el.dataset.expandable
  } else {
    // Japan, Kerala, Kashmir — Morocco's motion language on their own layouts,
    // on the page's Sand. The film is already a full-stage box; clip it to a
    // contained rectangle and open it over the first 60% of the hold with
    // Morocco's ease. Top and sides come from the guide (the same rectangle as
    // Morocco's film); the bottom edge follows each composition:
    //  - Japan / Kashmir: 20px into the title, as Morocco's title overlaps its film,
    //    so the copy below sits on Sand in ink and cross-fades to ivory as it opens;
    //  - Kerala: low enough that its centred ivory copy stays inside the film,
    //    and clear of the bottom bar.
    // The reel number / coordinates and the rail ride the frame edge: they start
    // inside the contained frame (as Morocco's caption does) and settle as it opens.
    el.dataset.unfold = ''
    const titleLayout = layout === 'title-left' || layout === 'title-right'
    // Layout positions (offsets ignore the transforms the timeline applies).
    const containedBottom = (guideBottom: number) => {
      if (titleLayout) return copy.offsetTop + title.offsetTop + 20
      const copyBottom = copy.offsetTop + copy.offsetHeight + 32
      return Math.min(Math.max(copyBottom, guideBottom), slate.offsetTop - 16)
    }
    const guideBox = () => {
      const s = stage.getBoundingClientRect()
      const g = guide.getBoundingClientRect()
      return { s, top: g.top - s.top, right: s.right - g.right, bottom: g.bottom - s.top, left: g.left - s.left }
    }
    // On the title's side the film reaches just past the copy edge, so the kicker
    // above the title always sits over the film (a slight asymmetry toward the title).
    const box = () => {
      const { s, top, right, bottom, left } = guideBox()
      const copyLeft = copy.offsetLeft - 12
      const copyRight = s.width - (copy.offsetLeft + copy.offsetWidth) - 12
      return {
        top,
        right: layout === 'title-right' ? Math.min(right, copyRight) : right,
        bottom: s.height - containedBottom(bottom),
        left: layout === 'title-left' ? Math.min(left, copyLeft) : left,
      }
    }
    const unfold = { ease: 'power2.inOut', duration: 0.6 }
    hold
      .fromTo(
        frame,
        { clipPath: () => { const b = box(); return `inset(${b.top}px ${b.right}px ${b.bottom}px ${b.left}px)` } },
        { clipPath: 'inset(0px 0px 0px 0px)', ...unfold },
        0,
      )
      .to(copy, { y: -24, duration: 1 }, 0)
    if (titleLayout) {
      hold.fromTo(
        el,
        { '--rl-fg': '#151412', '--rl-mute': '#5a554c', '--rl-shadow': 0 },
        { '--rl-fg': '#f7f4ee', '--rl-mute': 'rgba(247, 244, 238, 0.8)', '--rl-shadow': 0.55, duration: 0.35 },
        0.25,
      )
    }

    // Composed chrome positions derive from the guide: --fx = 2 × gutter, --ft = nav + 16.
    const [meta] = q('[data-reel-meta]')
    const [rail] = q('[data-reel-rail]')
    const gutter = () => guideBox().left / 2
    const navBottom = () => guideBox().top - 16
    hold.fromTo(
      meta,
      { left: () => box().left + 24, right: () => box().right + 24, top: () => box().top + 22 },
      { left: gutter, right: gutter, top: () => navBottom() + 20, ...unfold },
      0,
    )
    if (rail) {
      const railTop = () => navBottom() + (layout === 'title-right' ? 20 : 64)
      hold.fromTo(
        rail,
        { right: () => box().right + 24, top: () => Math.max(railTop(), box().top + 22) },
        { right: gutter, top: railTop, ...unfold },
        0,
      )
    }
    cleanup = () => delete el.dataset.unfold
  }

  // 3 — Exit: dip to black as the reel leaves
  gsap.fromTo(
    dim,
    { opacity: 0 },
    {
      opacity: 0.7,
      ease: 'none',
      immediateRender: false,
      scrollTrigger: { trigger: el, start: 'bottom 75%', end: 'bottom top', scrub: 0.6 },
    },
  )

  return cleanup
}
