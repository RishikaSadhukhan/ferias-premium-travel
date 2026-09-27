import { createContext, useContext } from 'react'
import type { MotionMode } from '../animations/breakpoints'

export interface MotionContextValue {
  mode: MotionMode
  reducedMotion: boolean
  /** Poster-only media: reduced motion or the browser's Save-Data hint. */
  posterOnly: boolean
  /** Selector, element, or an absolute scroll position in px. */
  scrollTo: (target: string | HTMLElement | number) => void
  /** Freeze page scroll while a dialog or the mobile menu is open. */
  lockScroll: (locked: boolean) => void
}

export const MotionContext = createContext<MotionContextValue | null>(null)

export function useMotion() {
  const ctx = useContext(MotionContext)
  if (!ctx) throw new Error('useMotion must be used inside <MotionProvider>')
  return ctx
}
