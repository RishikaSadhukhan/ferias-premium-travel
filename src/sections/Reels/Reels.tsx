import { Fragment } from 'react'
import { destinations } from '../../data/destinations'
import { CutBand } from './CutBand'
import { Reel } from './Reel'
import { ReelIndex } from './ReelIndex'

/** The journeys: four reels joined by "Cut to —" bands, then an index. */
export function Reels() {
  return (
    <section id="journeys" aria-labelledby="journeys-title">
      <h2 id="journeys-title" className="visually-hidden">
        Journeys — four holiday packages
      </h2>
      {destinations.map((d, i) => (
        <Fragment key={d.slug}>
          {i > 0 && <CutBand destination={d} />}
          <Reel destination={d} />
        </Fragment>
      ))}
      <ReelIndex />
    </section>
  )
}
