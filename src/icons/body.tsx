import type { JSX } from 'react'
import type { MuscleGroup } from '../types'
import { BODY_PATHS, type Region } from './bodyPaths'

export type Loads = Partial<Record<MuscleGroup, number>>
export type View = 'front' | 'back'

/**
 * Muscle map filling x 0-15 of the 24x24 icon grid, traced from
 * art/muscle-map.png. Front and back views are the same body; back exercises
 * use the back view, where lats and traps are actually visible.
 *
 * Shade follows load: the primary group is solid, a secondary group is as
 * strong as its share, and an untouched region stays faint so the silhouette
 * still reads.
 */
const REST = 0.14
const NEUTRAL = 0.3

export function shade(load: number | undefined): number {
  if (!load) return REST
  if (load >= 1) return 1
  return 0.22 + 0.56 * load
}

export function Body({
  loads,
  view,
  alert,
}: {
  loads: Loads
  view: View
  /** Groups still recovering, drawn in the warning colour. */
  alert?: MuscleGroup[]
}): JSX.Element {
  const paths = BODY_PATHS[view]
  return (
    <g stroke="none" fill="currentColor" fillRule="evenodd">
      {(Object.keys(paths) as Region[]).map((region) =>
        region === 'neutral' ? (
          <path key={region} d={paths[region]} fillOpacity={NEUTRAL} />
        ) : (
          <path
            key={region}
            d={paths[region]}
            fill={alert?.includes(region) ? 'var(--down)' : undefined}
            fillOpacity={shade(loads[region])}
          />
        ),
      )}
    </g>
  )
}
