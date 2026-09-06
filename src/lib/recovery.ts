import { ACTIVITIES, activityById } from '../data/activities'
import { GROUPS } from '../data/exercises'
import type { Exercise, MuscleGroup, Session } from '../types'
import { daysBetween, todayISO } from './dates'

/** Load below this doesn't count as having trained the muscle. */
export const MEANINGFUL = 0.5

/** Sets at which an exercise reaches its full load for a group. */
const FULL_SETS = 3

export type GroupStatus = 'today' | 'rest' | 'ready' | 'overdue'

export interface GroupState {
  group: MuscleGroup
  label: string
  /** Days since the group last took a meaningful load; undefined if never. */
  daysSince: number | undefined
  status: GroupStatus
  /** What last loaded it, for explaining the status. */
  cause: string | undefined
}

/** Every group an exercise loads, primary at 1 plus its secondaries. */
export function exerciseLoads(exercise: Exercise): Partial<Record<MuscleGroup, number>> {
  return { [exercise.group]: 1, ...exercise.also }
}

/** Per-group load for one day, keyed by group, with what caused the most of it. */
export interface DayLoad {
  date: string
  loads: Partial<Record<MuscleGroup, number>>
  causes: Partial<Record<MuscleGroup, string>>
}

export function dayLoads(session: Session, exerciseById: (id: string) => Exercise | undefined): DayLoad {
  const loads: Partial<Record<MuscleGroup, number>> = {}
  const causes: Partial<Record<MuscleGroup, string>> = {}
  const best: Partial<Record<MuscleGroup, number>> = {}

  const apply = (group: MuscleGroup, amount: number, cause: string) => {
    loads[group] = (loads[group] ?? 0) + amount
    if (amount > (best[group] ?? 0)) {
      best[group] = amount
      causes[group] = cause
    }
  }

  for (const entry of session.entries) {
    const exercise = exerciseById(entry.exerciseId)
    if (!exercise || entry.sets.length === 0) continue
    const volume = Math.min(1, entry.sets.length / FULL_SETS)
    for (const [group, weight] of Object.entries(exerciseLoads(exercise))) {
      apply(group as MuscleGroup, weight * volume, exercise.name)
    }
  }

  for (const activity of session.activities ?? []) {
    const kind = activityById(activity.type)
    if (!kind) continue
    const scale = Math.min(1.2, activity.minutes / kind.fullMinutes)
    for (const [group, weight] of Object.entries(kind.loads)) {
      apply(group as MuscleGroup, weight * scale, kind.name)
    }
  }

  return { date: session.date, loads, causes }
}

/**
 * How recently each muscle group was worked hard enough to matter. The rule
 * being enforced is one day of clearance: trained today or yesterday means it
 * is not available again yet.
 */
export function recoveryBoard(
  sessions: Session[],
  exerciseById: (id: string) => Exercise | undefined,
  today = todayISO(),
): GroupState[] {
  const days = sessions
    .map((s) => dayLoads(s, exerciseById))
    .filter((d) => daysBetween(d.date, today) >= 0)
    .sort((a, b) => b.date.localeCompare(a.date))

  return GROUPS.map(({ id, label }) => {
    const hit = days.find((d) => (d.loads[id] ?? 0) >= MEANINGFUL)
    const daysSince = hit ? daysBetween(hit.date, today) : undefined
    let status: GroupStatus
    if (daysSince === undefined || daysSince >= 7) status = 'overdue'
    else if (daysSince === 0) status = 'today'
    else if (daysSince === 1) status = 'rest'
    else status = 'ready'
    return { group: id, label, daysSince, status, cause: hit?.causes[id] }
  })
}

export interface Plan {
  /** The session to do today, or null when everything is still recovering. */
  id: 'legs' | 'upper-push' | 'upper-pull' | 'rest'
  label: string
  reason: string
  /** Groups this session would work, for highlighting the grid. */
  focus: MuscleGroup[]
  /** Groups that rule out an alternative today. */
  blocked: { group: MuscleGroup; cause: string | undefined }[]
}

const TEMPLATES: { id: Plan['id']; label: string; focus: MuscleGroup[] }[] = [
  { id: 'legs', label: 'Legs', focus: ['legs'] },
  { id: 'upper-push', label: 'Upper — push', focus: ['chest', 'shoulders'] },
  { id: 'upper-pull', label: 'Upper — pull', focus: ['back', 'arms'] },
]

function phrase(state: GroupState): string {
  if (state.daysSince === undefined) return `${state.label.toLowerCase()} not trained yet`
  if (state.daysSince === 0) return `${state.label.toLowerCase()} already worked today`
  const via = state.cause ? ` (${state.cause})` : ''
  return `${state.label.toLowerCase()} was yesterday${via}`
}

/**
 * Picks today's session: the template whose muscles have had the most rest.
 * Everything is scored off the same load model, so two hours of badminton
 * yesterday rules out legs exactly like a squat session would.
 */
export function suggestPlan(board: GroupState[]): Plan {
  const state = (g: MuscleGroup) => board.find((b) => b.group === g)!
  const score = (focus: MuscleGroup[]) =>
    Math.min(...focus.map((g) => state(g).daysSince ?? 99))

  const ranked = TEMPLATES.map((t) => ({ ...t, score: score(t.focus) })).sort(
    (a, b) => b.score - a.score,
  )
  const best = ranked[0]
  const blocked = ranked
    .slice(1)
    .filter((t) => t.score <= 1)
    .flatMap((t) =>
      t.focus
        .map((g) => state(g))
        .filter((s) => s.daysSince !== undefined && s.daysSince <= 1)
        .map((s) => ({ group: s.group, cause: s.cause })),
    )

  if (best.score <= 1) {
    const tired = board
      .filter((b) => b.daysSince !== undefined && b.daysSince <= 1)
      .map((b) => b.label.toLowerCase())
    return {
      id: 'rest',
      label: 'Rest or easy cardio',
      reason: `Everything worked recently — ${tired.join(', ')}. A bike ride keeps the week moving without stacking load.`,
      focus: [],
      blocked: [],
    }
  }

  const drivers = best.focus.map((g) => state(g))
  const freshest = drivers.reduce((a, b) => ((a.daysSince ?? 99) > (b.daysSince ?? 99) ? a : b))
  const reason =
    freshest.daysSince === undefined
      ? `${freshest.label} hasn't been trained yet.`
      : `${freshest.label} last worked ${freshest.daysSince} days ago${freshest.cause ? ` (${freshest.cause})` : ''}.`

  return { id: best.id, label: best.label, reason, focus: best.focus, blocked }
}

/** Groups an exercise would load past the threshold, for the caution marker. */
export function conflictsWith(exercise: Exercise, board: GroupState[]): GroupState[] {
  const loads = exerciseLoads(exercise)
  return board.filter(
    (b) => (b.status === 'rest' || b.status === 'today') && (loads[b.group] ?? 0) >= MEANINGFUL,
  )
}

export function explainBlocked(blocked: Plan['blocked']): string {
  if (blocked.length === 0) return ''
  const seen = new Set<string>()
  const parts: string[] = []
  for (const b of blocked) {
    const key = b.group
    if (seen.has(key)) continue
    seen.add(key)
    parts.push(b.cause ? `${key} (${b.cause})` : key)
  }
  return parts.join(', ')
}

export const ACTIVITY_IDS = ACTIVITIES.map((a) => a.id)
export { phrase as describeGroupState }
