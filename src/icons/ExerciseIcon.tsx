import { Body, type Loads } from './body'
import { GLYPHS } from './glyphs'
import { Barbell } from './parts'

/** Fallback for custom exercises whose icon key isn't in the set. */
const Generic = Barbell

/**
 * Muscle map on the left, driven by `loads` (primary group at 1, secondaries
 * at their share — the same numbers the recovery model uses), with the
 * movement cue and equipment mark for `icon` on the right.
 */
export function ExerciseIcon({
  icon,
  loads,
  size = 44,
}: {
  icon: string
  loads: Loads
  size?: number
}) {
  const Glyph = GLYPHS[icon] ?? Generic
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
      <Body loads={loads} />
      <Glyph />
    </svg>
  )
}

export const ICON_KEYS = Object.keys(GLYPHS)
