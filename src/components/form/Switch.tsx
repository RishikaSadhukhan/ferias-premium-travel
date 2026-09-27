import s from './Form.module.css'

interface SwitchProps {
  id: string
  label: string
  checked: boolean
  onChange: (checked: boolean) => void
}

export function Switch({ id, label, checked, onChange }: SwitchProps) {
  return (
    <label htmlFor={id} className={s.switch}>
      <span>{label}</span>
      <input
        id={id}
        className={s.switchInput}
        type="checkbox"
        role="switch"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
      />
      <span className={s.track} aria-hidden="true" />
    </label>
  )
}
