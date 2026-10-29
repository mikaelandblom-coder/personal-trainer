import type { JSX } from 'react'
import type { MuscleGroup } from '../types'

export type Loads = Partial<Record<MuscleGroup, number>>

/**
 * Front-view figure filling x 0-15 of the 24x24 icon grid, split into the six
 * groups the recovery model tracks. Back has no front view of its own, so it
 * is drawn as the traps above the chest and the lats flaring below the armpits.
 *
 * Shade follows load: the primary group is solid, a secondary group is as
 * strong as its share, and an untouched region stays faint so the silhouette
 * still reads.
 */
const REST = 0.14

export function shade(load: number | undefined): number {
  if (!load) return REST
  if (load >= 1) return 1
  return 0.22 + 0.56 * load
}

/** Mirror a shape spanning [x, x + w] across the figure's centre line. */
const mx = (x: number, w: number) => 15 - x - w

const Pair = ({ x, y, w, h, r }: { x: number; y: number; w: number; h: number; r: number }) => (
  <>
    <rect x={x} y={y} width={w} height={h} rx={r} />
    <rect x={mx(x, w)} y={y} width={w} height={h} rx={r} />
  </>
)

const REGIONS: Record<MuscleGroup, () => JSX.Element> = {
  shoulders: () => (
    <>
      <circle cx="3.3" cy="6.7" r="1.65" />
      <circle cx="11.7" cy="6.7" r="1.65" />
    </>
  ),
  chest: () => <Pair x={5} y={5.9} w={2.35} h={2.9} r={0.9} />,
  back: () => (
    <>
      <path d="M6.2 4.5 H8.8 L10.7 5.6 H4.3 Z" />
      <path d="M4.1 9.1 H6.05 V13 H5.5 Z" />
      <path d="M10.9 9.1 H8.95 V13 H9.5 Z" />
    </>
  ),
  arms: () => (
    <>
      <Pair x={1.5} y={8.6} w={1.9} h={3.4} r={0.9} />
      <Pair x={1} y={12.6} w={1.7} h={3.3} r={0.8} />
    </>
  ),
  core: () => <rect x="6.35" y="9.1" width="2.3" height="4.3" rx="0.7" />,
  legs: () => (
    <>
      <Pair x={5} y={15.3} w={2.3} h={4.3} r={1} />
      <Pair x={5.3} y={20.1} w={1.8} h={3.3} r={0.85} />
    </>
  ),
}

const ORDER: MuscleGroup[] = ['shoulders', 'chest', 'back', 'arms', 'core', 'legs']

export function Body({ loads }: { loads: Loads }): JSX.Element {
  return (
    <g stroke="none" fill="currentColor">
      <circle cx="7.5" cy="2.3" r="1.75" fillOpacity={0.32} />
      <path d="M5.5 13.8 H9.5 L9.7 15 H5.3 Z" fillOpacity={REST} />
      {ORDER.map((group) => {
        const Region = REGIONS[group]
        return (
          <g key={group} fillOpacity={shade(loads[group])}>
            <Region />
          </g>
        )
      })}
    </g>
  )
}
