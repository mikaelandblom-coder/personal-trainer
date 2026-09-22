import { ACTIVITIES, activityById } from '../data/activities'
import { GROUPS } from '../data/exercises'
import type { Exercise, MuscleGroup, Session } from '../types'
import { todayISO } from './dates'

/** Load below this doesn't count as having trained the muscle. */
export const MEANINGFUL = 0.5

/** Sets at which an exercise reaches its full load for a group. */
const FULL_SETS = 3

/** Past this, a group reads as undertrained rather than merely recovered. */
const OVERDUE_HOURS = 7 * 24

export type GroupStatus = 'today' | 'rest' | 'ready' | 'overdue'

export interface GroupState {
  group: MuscleGroup
  label: string
  /** Hours since the group last took a meaningful load; undefined if never. */
  hoursSince: number | undefined
  /** Hours until it clears the recovery window; 0 once it has. */
  hoursUntilReady: number
  status: GroupStatus
  /** What last loaded it, for explaining the status. */
  cause: string | undefined
  /** Local date of that load, for the "worked today" distinction. */
  lastDate: string | undefined
}

/** Every group an exercise loads, primary at 1 plus its secondaries. */
export function exerciseLoads(exercise: Exercise): Partial<Record<MuscleGroup, number>> {
  return { [exercise.group]: 1, ...exercise.also }
}

/**
 * When a record without its own timestamp is assumed to have happened: the end
 * of its day. History logged before timestamps existed has only a date, and
 * treating it as late as possible keeps the recovery window erring toward
 * caution rather than clearing a muscle early.
 */
function fallbackTime(date: string): number {
  return new Date(`${date}T23:59:00`).getTime()
}

function timeOf(at: string | undefined, date: string): number {
  if (!at) return fallbackTime(date)
  const parsed = Date.parse(at)
  return Number.isNaN(parsed) ? fallbackTime(date) : parsed
}

export interface SessionLoad {
  date: string
  loads: Partial<Record<MuscleGroup, number>>
  causes: Partial<Record<MuscleGroup, string>>
  /** Epoch ms of the last thing in this session that loaded each group. */
  times: Partial<Record<MuscleGroup, number>>
}

/** Total load a single session put on each muscle group, and when. */
export function sessionLoads(
  session: Session,
  exerciseById: (id: string) => Exercise | undefined,
): SessionLoad {
  const loads: Partial<Record<MuscleGroup, number>> = {}
  const causes: Partial<Record<MuscleGroup, string>> = {}
  const times: Partial<Record<MuscleGroup, number>> = {}
  const best: Partial<Record<MuscleGroup, number>> = {}

  const apply = (group: MuscleGroup, amount: number, cause: string, when: number) => {
    if (amount <= 0) return
    loads[group] = (loads[group] ?? 0) + amount
    times[group] = Math.max(times[group] ?? 0, when)
    if (amount > (best[group] ?? 0)) {
      best[group] = amount
      causes[group] = cause
    }
  }

  for (const entry of session.entries) {
    const exercise = exerciseById(entry.exerciseId)
    if (!exercise || entry.sets.length === 0) continue
    const volume = Math.min(1, entry.sets.length / FULL_SETS)
    const when = Math.max(...entry.sets.map((s) => timeOf(s.at, session.date)))
    for (const [group, weight] of Object.entries(exerciseLoads(exercise))) {
      apply(group as MuscleGroup, weight * volume, exercise.name, when)
    }
  }

  for (const activity of session.activities ?? []) {
    const kind = activityById(activity.type)
    if (!kind) continue
    const scale = Math.min(1.2, activity.minutes / kind.fullMinutes)
    const when = timeOf(activity.at, session.date)
    for (const [group, weight] of Object.entries(kind.loads)) {
      apply(group as MuscleGroup, weight * scale, kind.name, when)
    }
  }

  return { date: session.date, loads, causes, times }
}

/**
 * How long each muscle group has been recovering. Measured in hours from the
 * last set that loaded it, not in calendar days: a Monday evening session and
 * a Wednesday morning one are 36 hours apart however different the dates look.
 */
export function recoveryBoard(
  sessions: Session[],
  exerciseById: (id: string) => Exercise | undefined,
  recoveryHours = 46,
  now = Date.now(),
): GroupState[] {
  const loaded = sessions
    .map((s) => sessionLoads(s, exerciseById))
    .filter((s) => new Date(`${s.date}T00:00:00`).getTime() <= now)

  const today = todayISO(new Date(now))

  return GROUPS.map(({ id, label }) => {
    let lastTime: number | undefined
    let cause: string | undefined
    let lastDate: string | undefined

    for (const s of loaded) {
      if ((s.loads[id] ?? 0) < MEANINGFUL) continue
      const when = s.times[id]
      if (when === undefined) continue
      if (lastTime === undefined || when > lastTime) {
        lastTime = when
        cause = s.causes[id]
        lastDate = s.date
      }
    }

    const hoursSince = lastTime === undefined ? undefined : Math.max(0, (now - lastTime) / 3600000)
    const hoursUntilReady =
      hoursSince === undefined ? 0 : Math.max(0, recoveryHours - hoursSince)

    let status: GroupStatus
    if (hoursSince === undefined || hoursSince >= OVERDUE_HOURS) status = 'overdue'
    else if (hoursSince >= recoveryHours) status = 'ready'
    else if (lastDate === today) status = 'today'
    else status = 'rest'

    return { group: id, label, hoursSince, hoursUntilReady, status, cause, lastDate }
  })
}

export function isBlocked(state: GroupState): boolean {
  return state.status === 'today' || state.status === 'rest'
}

/** "3h", "1d 4h", "6d" — compact enough for a table row. */
export function formatElapsed(hours: number): string {
  if (hours < 1) return 'just now'
  if (hours < 24) return `${Math.round(hours)}h`
  const days = Math.floor(hours / 24)
  const rest = Math.round(hours - days * 24)
  if (days >= 4 || rest === 0) return `${days}d`
  return `${days}d ${rest}h`
}

/** Rounds up: "ready in 2h" should not appear while 90 minutes remain. */
export function formatUntil(hours: number): string {
  if (hours <= 0) return 'now'
  if (hours < 24) return `${Math.ceil(hours)}h`
  const days = Math.floor(hours / 24)
  const rest = Math.ceil(hours - days * 24)
  return rest === 0 ? `${days}d` : `${days}d ${rest}h`
}

export interface Plan {
  id: 'legs' | 'upper-push' | 'upper-pull' | 'rest'
  label: string
  reason: string
  /** Groups this session would work, for highlighting the grid. */
  focus: MuscleGroup[]
  /** Groups that rule out an alternative right now. */
  blocked: { group: MuscleGroup; cause: string | undefined; hoursUntilReady: number }[]
}

const TEMPLATES: { id: Plan['id']; label: string; focus: MuscleGroup[] }[] = [
  { id: 'legs', label: 'Legs', focus: ['legs'] },
  { id: 'upper-push', label: 'Upper — push', focus: ['chest', 'shoulders'] },
  { id: 'upper-pull', label: 'Upper — pull', focus: ['back', 'arms'] },
]

export function describeGroupState(state: GroupState): string {
  const name = state.label.toLowerCase()
  if (state.hoursSince === undefined) return `${name} not trained yet`
  if (isBlocked(state)) {
    return `${name} ready in ${formatUntil(state.hoursUntilReady)}`
  }
  return `${name} last worked ${formatElapsed(state.hoursSince)} ago`
}

/**
 * Picks the session to do now: the template whose muscles have had the most
 * rest. Everything is scored off the same load model, so two hours of
 * badminton rules out legs exactly like a squat session would.
 */
export function suggestPlan(board: GroupState[]): Plan {
  const state = (g: MuscleGroup) => board.find((b) => b.group === g)!
  const clearance = (focus: MuscleGroup[]) =>
    Math.min(...focus.map((g) => state(g).hoursSince ?? Number.POSITIVE_INFINITY))

  const ranked = TEMPLATES.map((t) => ({ ...t, clearance: clearance(t.focus) })).sort(
    (a, b) => b.clearance - a.clearance,
  )
  const best = ranked[0]
  const bestBlocked = best.focus.map(state).some(isBlocked)

  const blocked = ranked
    .slice(1)
    .flatMap((t) => t.focus.map(state))
    .filter(isBlocked)
    .map((s) => ({ group: s.group, cause: s.cause, hoursUntilReady: s.hoursUntilReady }))

  if (bestBlocked) {
    const soonest = board
      .filter(isBlocked)
      .sort((a, b) => a.hoursUntilReady - b.hoursUntilReady)[0]
    return {
      id: 'rest',
      label: 'Rest or easy cardio',
      reason: soonest
        ? `Everything is still inside the ${Math.round(
            soonest.hoursUntilReady + (soonest.hoursSince ?? 0),
          )}-hour window. ${soonest.label} clears first, in ${formatUntil(
            soonest.hoursUntilReady,
          )}. A ride keeps the week moving without stacking load.`
        : 'Everything worked recently. A ride keeps the week moving without stacking load.',
      focus: [],
      blocked: [],
    }
  }

  const drivers = best.focus.map(state)
  const freshest = drivers.reduce((a, b) =>
    (a.hoursSince ?? Infinity) > (b.hoursSince ?? Infinity) ? a : b,
  )
  const reason =
    freshest.hoursSince === undefined
      ? `${freshest.label} hasn't been trained yet.`
      : `${freshest.label} last worked ${formatElapsed(freshest.hoursSince)} ago${
          freshest.cause ? ` (${freshest.cause})` : ''
        }.`

  return { id: best.id, label: best.label, reason, focus: best.focus, blocked }
}

/** Groups an exercise would load that haven't cleared the window yet. */
export function conflictsWith(exercise: Exercise, board: GroupState[]): GroupState[] {
  const loads = exerciseLoads(exercise)
  return board.filter((b) => isBlocked(b) && (loads[b.group] ?? 0) >= MEANINGFUL)
}

export function explainBlocked(blocked: Plan['blocked']): string {
  const seen = new Set<string>()
  const parts: string[] = []
  for (const b of blocked) {
    if (seen.has(b.group)) continue
    seen.add(b.group)
    parts.push(`${b.group} (${formatUntil(b.hoursUntilReady)})`)
  }
  return parts.join(', ')
}

export const ACTIVITY_IDS = ACTIVITIES.map((a) => a.id)
