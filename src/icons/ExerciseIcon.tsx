import type { JSX } from 'react'
import type { Equipment, MuscleGroup } from '../types'
import { Body, type Loads } from './body'
import { BACK_VIEW, GLYPHS } from './glyphs'
import { Barbell, Cable, Dumbbell, Machine } from './parts'

/**
 * Custom exercises have no movement cue, only the mark for what they're done
 * with. Bodyweight has nothing to hold, so it draws nothing.
 */
const GEAR: Record<Equipment, () => JSX.Element | null> = {
  barbell: Barbell,
  dumbbell: Dumbbell,
  machine: Machine,
  cable: Cable,
  bodyweight: () => null,
}

/**
 * Muscle map on the left, driven by `loads` (primary group at 1, secondaries
 * at their share — the same numbers the recovery model uses), with the
 * movement cue and equipment mark for `icon` on the right. Back exercises, and
 * any custom exercise filed under back, show the figure from behind.
 *
 * Groups in `alert` are still inside their recovery window and are drawn in
 * the warning colour, so the icon says which part of the exercise is the
 * problem: a lat pulldown with tired biceps is a different warning from one
 * with tired lats.
 */
export function ExerciseIcon({
  icon,
  equipment,
  loads,
  alert,
  size = 44,
}: {
  icon?: string
  equipment?: Equipment
  loads: Loads
  alert?: MuscleGroup[]
  size?: number
}) {
  const Glyph = (icon && GLYPHS[icon]) || (equipment ? GEAR[equipment] : Barbell)
  const back = (icon !== undefined && BACK_VIEW.has(icon)) || loads.back === 1
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill="none"
      stroke="currentColor"
      strokeWidth={1.2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      <Body loads={loads} view={back ? 'back' : 'front'} alert={alert} />
      <Glyph />
    </svg>
  )
}
