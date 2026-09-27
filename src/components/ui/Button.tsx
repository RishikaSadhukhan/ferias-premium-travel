import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from 'react'
import { cx } from '../../utils/cx'
import { Icon, type IconName } from './Icon'
import s from './Button.module.css'

type Variant = 'light' | 'dark' | 'link'

interface BaseProps {
  variant?: Variant
  icon?: IconName
  iconFirst?: boolean
  block?: boolean
  className?: string
  children: ReactNode
}

type AsButton = BaseProps & ButtonHTMLAttributes<HTMLButtonElement> & { href?: undefined }
type AsLink = BaseProps & AnchorHTMLAttributes<HTMLAnchorElement> & { href: string }

/** One button primitive: renders <a> when given an href, otherwise <button>. */
export function Button(props: AsButton | AsLink) {
  const { variant = 'light', icon, iconFirst, block, className, children, ...rest } = props
  const classes = cx(s.button, s[variant], block && s.block, className)
  const content = (
    <>
      {icon && iconFirst && <Icon name={icon} />}
      <span>{children}</span>
      {icon && !iconFirst && <Icon name={icon} />}
    </>
  )

  if (typeof rest.href === 'string') {
    return (
      <a className={classes} {...(rest as AnchorHTMLAttributes<HTMLAnchorElement>)}>
        {content}
      </a>
    )
  }
  const buttonProps = rest as ButtonHTMLAttributes<HTMLButtonElement>
  return (
    <button type={buttonProps.type ?? 'button'} className={classes} {...buttonProps}>
      {content}
    </button>
  )
}
