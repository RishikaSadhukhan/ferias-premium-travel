import { useEffect, useRef, type MouseEvent, type ReactNode } from 'react'
import { useMotion } from '../../context/motion'

interface DialogProps {
  open: boolean
  onClose: () => void
  labelledBy: string
  className?: string
  children: ReactNode
}

/**
 * Native modal <dialog>: focus is trapped by the browser and Esc closes it.
 * We add scroll locking, backdrop-click to close, and focus restoration.
 */
export function Dialog({ open, onClose, labelledBy, className, children }: DialogProps) {
  const ref = useRef<HTMLDialogElement>(null)
  const returnFocus = useRef<HTMLElement | null>(null)
  const { lockScroll } = useMotion()

  useEffect(() => {
    const dialog = ref.current
    if (!dialog) return
    if (open && !dialog.open) {
      returnFocus.current = document.activeElement as HTMLElement | null
      dialog.showModal()
      lockScroll(true)
    } else if (!open && dialog.open) {
      dialog.close()
    }
  }, [open, lockScroll])

  useEffect(() => {
    const dialog = ref.current
    if (!dialog) return
    const handleClose = () => {
      lockScroll(false)
      returnFocus.current?.focus({ preventScroll: true })
      onClose()
    }
    dialog.addEventListener('close', handleClose)
    return () => dialog.removeEventListener('close', handleClose)
  }, [onClose, lockScroll])

  // Unlock if the component unmounts while open.
  useEffect(() => () => lockScroll(false), [lockScroll])

  const onBackdrop = (event: MouseEvent<HTMLDialogElement>) => {
    if (event.target === ref.current) ref.current?.close()
  }

  return (
    <dialog ref={ref} className={className} aria-labelledby={labelledBy} onClick={onBackdrop} data-lenis-prevent>
      {children}
    </dialog>
  )
}
