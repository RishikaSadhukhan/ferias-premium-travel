import type { InputHTMLAttributes, TextareaHTMLAttributes } from 'react'
import s from './Form.module.css'

interface CommonProps {
  id: string
  label: string
  error?: string
  hint?: string
}

type InputFieldProps = CommonProps & { multiline?: false } & InputHTMLAttributes<HTMLInputElement>
type TextareaFieldProps = CommonProps & { multiline: true } & TextareaHTMLAttributes<HTMLTextAreaElement>

/** Label + control + error, wired for screen readers. */
export function Field(props: InputFieldProps | TextareaFieldProps) {
  const { id, label, error, hint, multiline, ...rest } = props
  const describedBy = [hint && `${id}-hint`, error && `${id}-error`].filter(Boolean).join(' ') || undefined
  const shared = {
    id,
    className: s.control,
    'aria-invalid': error ? true : undefined,
    'aria-describedby': describedBy,
  }

  return (
    <div className={s.field}>
      <label htmlFor={id} className={`mono ${s.label}`}>
        {label}
      </label>
      {multiline ? (
        <textarea {...shared} {...(rest as TextareaHTMLAttributes<HTMLTextAreaElement>)} />
      ) : (
        <input {...shared} {...(rest as InputHTMLAttributes<HTMLInputElement>)} />
      )}
      {hint && !error && (
        <p id={`${id}-hint`} className={s.hint}>
          {hint}
        </p>
      )}
      {error && (
        <p id={`${id}-error`} className={s.error}>
          {error}
        </p>
      )}
    </div>
  )
}
