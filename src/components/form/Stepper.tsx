import { Icon } from '../ui/Icon'
import s from './Form.module.css'

interface StepperProps {
  id: string
  label: string
  value: number
  min: number
  max: number
  error?: string
  onChange: (value: number) => void
  onBlur: () => void
}

export function Stepper({ id, label, value, min, max, error, onChange, onBlur }: StepperProps) {
  const clamp = (n: number) => Math.min(max, Math.max(min, n))

  return (
    <div className={s.field}>
      <label htmlFor={id} className={`mono ${s.label}`}>
        {label}
      </label>
      <div className={s.stepper}>
        <button
          type="button"
          className={s.stepButton}
          onClick={() => onChange(clamp(value - 1))}
          disabled={value <= min}
          aria-label={`Fewer ${label.toLowerCase()}`}
          aria-controls={id}
        >
          <Icon name="minus" />
        </button>
        <input
          id={id}
          className={s.stepValue}
          type="number"
          inputMode="numeric"
          min={min}
          max={max}
          value={Number.isNaN(value) ? '' : value}
          onChange={(e) => onChange(e.target.valueAsNumber)}
          onBlur={onBlur}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? `${id}-error` : undefined}
          data-field="travellers"
        />
        <button
          type="button"
          className={s.stepButton}
          onClick={() => onChange(clamp((Number.isNaN(value) ? min - 1 : value) + 1))}
          disabled={value >= max}
          aria-label={`More ${label.toLowerCase()}`}
          aria-controls={id}
        >
          <Icon name="plus" />
        </button>
      </div>
      {error && (
        <p id={`${id}-error`} className={s.error}>
          {error}
        </p>
      )}
    </div>
  )
}
