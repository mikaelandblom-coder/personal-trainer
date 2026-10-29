import type { JSX } from 'react'
import type { ActivityKind, Equipment, Exercise, MuscleGroup } from '../types'

/**
 * Exercise icons are muscle maps rather than drawings of the movement. A
 * figure performing a lift is unreadable at tile size — torso, arms and legs
 * land on two or three pixels each, so a squat and a lunge collapse into the
 * same shape. What the exercise *trains* survives that scale, because it is
 * areas of colour rather than thin lines, and it is also the fact the recovery
 * rules care about.
 */

/** Badge drawn in the lower-right corner; what you hold, or what you're doing. */
export type BadgeKind = Equipment | 'badminton' | 'cycling' | 'cardio'

const BODY_SCALE = 0.88

/** Weights below this are too small to be worth lighting up. */
const VISIBLE = 0.15

const SILHOUETTE: JSX.Element = (
  <g fill="var(--body-dim, #2f3742)">
    <circle cx="12" cy="3" r="1.9" />
    <rect x="8.5" y="6.3" width="7" height="7.4" rx="2.2" />
    <circle cx="7.9" cy="7.1" r="1.75" />
    <circle cx="16.1" cy="7.1" r="1.75" />
    <rect x="5.15" y="7.8" width="2.4" height="7.2" rx="1.2" />
    <rect x="16.45" y="7.8" width="2.4" height="7.2" rx="1.2" />
    <rect x="8.95" y="13.5" width="2.9" height="8" rx="1.35" />
    <rect x="12.15" y="13.5" width="2.9" height="8" rx="1.35" />
  </g>
)

const REGION: Record<MuscleGroup, JSX.Element> = {
  chest: (
    <>
      <rect x="9.0" y="7.7" width="2.8" height="2.9" rx="1.2" />
      <rect x="12.2" y="7.7" width="2.8" height="2.9" rx="1.2" />
    </>
  ),
  back: <path d="M8.9 6.9 L15.1 6.9 L13.6 12.6 L10.4 12.6 Z" />,
  core: <rect x="9.7" y="10.4" width="4.6" height="3.0" rx="1.1" />,
  shoulders: (
    <>
      <circle cx="7.9" cy="7.1" r="1.75" />
      <circle cx="16.1" cy="7.1" r="1.75" />
    </>
  ),
  arms: (
    <>
      <rect x="5.15" y="7.8" width="2.4" height="7.2" rx="1.2" />
      <rect x="16.45" y="7.8" width="2.4" height="7.2" rx="1.2" />
    </>
  ),
  legs: (
    <>
      <rect x="8.95" y="13.5" width="2.9" height="8" rx="1.35" />
      <rect x="12.15" y="13.5" width="2.9" height="8" rx="1.35" />
    </>
  ),
}

const stroke = {
  fill: 'none',
  stroke: 'var(--badge, #8b96a6)',
  strokeWidth: 1.3,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
}

const BADGE: Record<BadgeKind, JSX.Element> = {
  barbell: (
    <g {...stroke}>
      <line x1="16.9" y1="20" x2="23.1" y2="20" />
      <line x1="18.2" y1="18.3" x2="18.2" y2="21.7" />
      <line x1="21.8" y1="18.3" x2="21.8" y2="21.7" />
    </g>
  ),
  dumbbell: (
    <g {...stroke}>
      <line x1="18.6" y1="20" x2="21.4" y2="20" />
      <line x1="17.8" y1="18.3" x2="17.8" y2="21.7" />
      <line x1="22.2" y1="18.3" x2="22.2" y2="21.7" />
    </g>
  ),
  cable: (
    <g {...stroke}>
      <line x1="17.2" y1="17.2" x2="22.8" y2="17.2" />
      <line x1="20" y1="17.2" x2="20" y2="20.4" />
      <line x1="18.3" y1="20.9" x2="21.7" y2="20.9" />
    </g>
  ),
  machine: (
    <g {...stroke}>
      <rect x="18" y="17" width="4" height="6" rx="1" />
      <line x1="18.9" y1="19" x2="21.1" y2="19" />
      <line x1="18.9" y1="21" x2="21.1" y2="21" />
    </g>
  ),
  bodyweight: (
    <g {...stroke}>
      <circle cx="20" cy="17.6" r="1.1" />
      <line x1="20" y1="18.9" x2="20" y2="21" />
      <line x1="18.3" y1="19.8" x2="21.7" y2="19.8" />
      <line x1="20" y1="21" x2="18.8" y2="22.8" />
      <line x1="20" y1="21" x2="21.2" y2="22.8" />
    </g>
  ),
  badminton: (
    <g {...stroke}>
      <path d="M17.9 17.4 L22.1 17.4 L20 22.4 Z" />
      <line x1="18.6" y1="19.1" x2="21.4" y2="19.1" />
    </g>
  ),
  cycling: (
    <g {...stroke}>
      <circle cx="20" cy="20" r="2.7" />
      <line x1="20" y1="17.3" x2="20" y2="22.7" />
      <line x1="17.3" y1="20" x2="22.7" y2="20" />
    </g>
  ),
  cardio: (
    <g {...stroke}>
      <circle cx="20" cy="20.4" r="2.5" />
      <line x1="18.7" y1="17.2" x2="21.3" y2="17.2" />
      <line x1="20" y1="17.2" x2="20" y2="18" />
      <line x1="20" y1="20.4" x2="21.5" y2="20.4" />
    </g>
  ),
}

export interface MuscleIconProps {
  /** Lit at full strength. */
  primary: MuscleGroup[]
  /** Group to 0-1 weight; dimmer the lower the weight. */
  secondary?: Partial<Record<MuscleGroup, number>>
  /**
   * Groups still inside the recovery window, drawn in the warning colour.
   * Marking only those says which part of the exercise is the problem —
   * a lat pulldown with tired biceps is a different warning from tired lats.
   */
  alert?: MuscleGroup[]
  badge?: BadgeKind
  size?: number
}

export function MuscleIcon({ primary, secondary, alert, badge, size = 46 }: MuscleIconProps) {
  const tint = (group: MuscleGroup) =>
    alert?.includes(group) ? 'var(--down, #f87171)' : 'currentColor'

  const dim = Object.entries(secondary ?? {}).filter(
    ([group, weight]) => weight >= VISIBLE && !primary.includes(group as MuscleGroup),
  ) as [MuscleGroup, number][]

  return (
    <svg viewBox="0 0 24 24" width={size} height={size} aria-hidden="true" focusable="false">
      <g transform={`scale(${BODY_SCALE})`}>
        {SILHOUETTE}
        {dim.map(([group, weight]) => (
          // Opacity tracks the real load, so an exercise that hammers a
          // secondary muscle looks different from one that brushes it.
          <g key={group} fill={tint(group)} opacity={0.3 + 0.5 * weight}>
            {REGION[group]}
          </g>
        ))}
        {primary.map((group) => (
          <g key={group} fill={tint(group)}>
            {REGION[group]}
          </g>
        ))}
      </g>
      {badge && (
        <g transform="translate(20 20) scale(1.12) translate(-20 -20)">{BADGE[badge]}</g>
      )}
    </svg>
  )
}

export function ExerciseIcon({
  exercise,
  alert,
  size,
}: {
  exercise: Exercise
  alert?: MuscleGroup[]
  size?: number
}) {
  return (
    <MuscleIcon
      primary={[exercise.group]}
      secondary={exercise.also}
      alert={alert}
      badge={exercise.equipment}
      size={size}
    />
  )
}

export function ActivityIcon({ kind, size }: { kind: ActivityKind; size?: number }) {
  const entries = Object.entries(kind.loads) as [MuscleGroup, number][]
  const peak = Math.max(...entries.map(([, w]) => w))
  // An activity has no single "primary" group in the data, so the heaviest
  // load plays that role and the rest shade off from it.
  const primary = entries.filter(([, w]) => w >= peak).map(([g]) => g)
  return (
    <MuscleIcon primary={primary} secondary={kind.loads} badge={kind.badge} size={size} />
  )
}

export const BADGE_KINDS = Object.keys(BADGE) as BadgeKind[]
