const paths = {
  arrowRight: 'M4 12h15M13 6l6 6-6 6',
  arrowLeft: 'M20 12H5M11 6l-6 6 6 6',
  arrowDown: 'M12 4v15M6 13l6 6 6-6',
  arrowUp: 'M12 20V5M6 11l6-6 6 6',
  play: 'M7 4.5v15l12-7.5z',
  close: 'M5 5l14 14M19 5L5 19',
  menu: 'M4 9h16M4 15h16',
  check: 'M5 12.5l4.5 4.5L19 7',
  minus: 'M5 12h14',
  plus: 'M12 5v14M5 12h14',
} as const

export type IconName = keyof typeof paths

interface IconProps {
  name: IconName
  size?: number
  className?: string
}

/** Stroke icons drawn for FÉRIAS; decorative by default (labels live on the control). */
export function Icon({ name, size = 18, className }: IconProps) {
  const filled = name === 'play'
  return (
    <svg
      className={className}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill={filled ? 'currentColor' : 'none'}
      stroke={filled ? 'none' : 'currentColor'}
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      <path d={paths[name]} />
    </svg>
  )
}
