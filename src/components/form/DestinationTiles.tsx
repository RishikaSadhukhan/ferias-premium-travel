import { destinations } from '../../data/destinations'
import { Icon } from '../ui/Icon'
import s from './Form.module.css'

interface DestinationTilesProps {
  value: string
  error?: string
  onChange: (value: string) => void
  onBlur: () => void
}

/** Native radio group (arrow keys work for free), presented as image tiles. */
export function DestinationTiles({ value, error, onChange, onBlur }: DestinationTilesProps) {
  const firstFocusable = value || destinations[0].slug

  return (
    <>
      <div className={s.tiles}>
        {destinations.map((d) => (
          <label key={d.slug} className={s.tile}>
            <input
              className={s.radio}
              type="radio"
              name="destination"
              value={d.slug}
              checked={value === d.slug}
              onChange={() => onChange(d.slug)}
              onBlur={onBlur}
              aria-describedby={error ? 'destination-error' : undefined}
              data-field={firstFocusable === d.slug ? 'destination' : undefined}
            />
            <img loading="lazy" decoding="async" src={d.gallery[0].src} alt="" width={d.gallery[0].width} height={d.gallery[0].height} />
            <span className={s.tileName}>{d.name}</span>
            <span className={s.tileCheck} aria-hidden="true">
              <Icon name="check" size={16} />
            </span>
          </label>
        ))}
        <label className={`${s.tile} ${s.undecided}`}>
          <input
            className={s.radio}
            type="radio"
            name="destination"
            value="undecided"
            checked={value === 'undecided'}
            onChange={() => onChange('undecided')}
            onBlur={onBlur}
            data-field={value === 'undecided' ? 'destination' : undefined}
          />
          Not sure yet — surprise me
        </label>
      </div>
      {error && (
        <p id="destination-error" className={s.error}>
          {error}
        </p>
      )}
    </>
  )
}
