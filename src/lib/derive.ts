import type { Entry, Session, SetEntry } from '../types'
import { daysBetween, todayISO } from './dates'

export interface Performance {
  date: string
  sets: SetEntry[]
  top: number
  /** Sum of set weights — a rough load proxy when reps aren't counted. */
  load: number
}

export function topSet(sets: SetEntry[]): number {
  return sets.reduce((m, s) => Math.max(m, s.weight), 0)
}

export function totalLoad(sets: SetEntry[]): number {
  return sets.reduce((sum, s) => sum + s.weight, 0)
}

/** Every session where the exercise was trained, oldest first. */
export function historyFor(sessions: Session[], exerciseId: string): Performance[] {
  return sessions
    .filter((s) => s.entries.some((e) => e.exerciseId === exerciseId && e.sets.length > 0))
    .map((s) => {
      const entry = s.entries.find((e) => e.exerciseId === exerciseId) as Entry
      return {
        date: s.date,
        sets: entry.sets,
        top: topSet(entry.sets),
        load: totalLoad(entry.sets),
      }
    })
    .sort((a, b) => a.date.localeCompare(b.date))
}

export function lastPerformance(sessions: Session[], exerciseId: string): Performance | undefined {
  const h = historyFor(sessions, exerciseId)
  return h[h.length - 1]
}

export function personalBest(sessions: Session[], exerciseId: string): Performance | undefined {
  const h = historyFor(sessions, exerciseId)
  if (h.length === 0) return undefined
  return h.reduce((best, p) => (p.top > best.top ? p : best))
}

export type Trend = 'up' | 'flat' | 'down' | 'new'

/**
 * Compares the most recent top set with the best of the three before it.
 * "flat" over enough sessions is what the stall flag keys off.
 */
export function trend(sessions: Session[], exerciseId: string): Trend {
  const h = historyFor(sessions, exerciseId)
  if (h.length < 2) return 'new'
  const latest = h[h.length - 1].top
  const prior = Math.max(...h.slice(Math.max(0, h.length - 4), h.length - 1).map((p) => p.top))
  if (latest > prior) return 'up'
  if (latest < prior) return 'down'
  return 'flat'
}

/** Sessions since the top set last improved. */
export function sessionsSinceProgress(sessions: Session[], exerciseId: string): number {
  const h = historyFor(sessions, exerciseId)
  if (h.length === 0) return 0
  let best = h[0].top
  let since = 0
  for (const p of h.slice(1)) {
    if (p.top > best) {
      best = p.top
      since = 0
    } else {
      since++
    }
  }
  return since
}

export const STALL_THRESHOLD = 4

export function isStalled(sessions: Session[], exerciseId: string): boolean {
  return (
    historyFor(sessions, exerciseId).length > STALL_THRESHOLD &&
    sessionsSinceProgress(sessions, exerciseId) >= STALL_THRESHOLD
  )
}

export function daysSinceTrained(sessions: Session[], exerciseId: string): number | undefined {
  const last = lastPerformance(sessions, exerciseId)
  return last ? daysBetween(last.date, todayISO()) : undefined
}

/** Exercise ids ordered by how recently they were trained. */
export function recentExerciseIds(sessions: Session[]): string[] {
  const seen = new Map<string, string>()
  for (const s of sessions) {
    for (const e of s.entries) {
      const prev = seen.get(e.exerciseId)
      if (!prev || s.date > prev) seen.set(e.exerciseId, s.date)
    }
  }
  return [...seen.entries()].sort((a, b) => b[1].localeCompare(a[1])).map(([id]) => id)
}

export function formatWeight(w: number, unit: string): string {
  const rounded = Math.round(w * 100) / 100
  return `${rounded}${unit === 'lb' ? ' lb' : ' kg'}`
}

export function formatSets(sets: SetEntry[]): string {
  return sets.map((s) => (Math.round(s.weight * 100) / 100).toString()).join(' / ')
}
