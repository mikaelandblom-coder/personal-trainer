import { useEffect, useMemo, useState } from 'react'
import { ACTIVITIES } from '../data/activities'
import { GROUPS } from '../data/exercises'
import { ActivityIcon, ExerciseIcon } from '../icons/MuscleIcon'
import { formatSets, isStalled, lastPerformance, recentExerciseIds } from '../lib/derive'
import { todayISO } from '../lib/dates'
import { conflictsWith, recoveryBoard } from '../lib/recovery'
import type { GroupState } from '../lib/recovery'
import { useStore } from '../store'
import type { MuscleGroup } from '../types'
import { Readiness } from './Readiness'

type Filter = 'all' | 'activity' | MuscleGroup

/**
 * Recovery is a countdown, so the board goes stale if the app is left open.
 * Ticking every minute keeps "ready in 2h" honest without any real cost.
 */
function useNow(intervalMs = 60_000): number {
  const [now, setNow] = useState(() => Date.now())
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), intervalMs)
    return () => clearInterval(id)
  }, [intervalMs])
  return now
}

export function Home({
  onOpen,
  onOpenActivity,
}: {
  onOpen: (exerciseId: string) => void
  onOpenActivity: (typeId: string) => void
}) {
  const { allExercises, sessions, settings, exerciseById } = useStore()
  const [filter, setFilter] = useState<Filter>('all')

  const now = useNow()
  const board = useMemo(
    () => recoveryBoard(sessions, exerciseById, settings.recoveryHours, now),
    [sessions, exerciseById, settings.recoveryHours, now],
  )

  const today = sessions.find((s) => s.date === todayISO())
  const doneToday = useMemo(
    () => new Set(today?.entries.map((e) => e.exerciseId) ?? []),
    [today],
  )

  const visible = useMemo(
    () => allExercises.filter((e) => !settings.hidden.includes(e.id)),
    [allExercises, settings.hidden],
  )

  const activityMinutesToday = (typeId: string) =>
    (today?.activities ?? [])
      .filter((a) => a.type === typeId)
      .reduce((n, a) => n + a.minutes, 0)

  const recent = useMemo(() => {
    if (filter !== 'all') return []
    const order = recentExerciseIds(sessions).slice(0, 8)
    return order
      .map((id) => visible.find((e) => e.id === id))
      .filter((e): e is NonNullable<typeof e> => Boolean(e))
  }, [sessions, visible, filter])

  const recentIds = new Set(recent.map((e) => e.id))
  const rest =
    filter === 'activity'
      ? []
      : visible.filter((e) => (filter === 'all' ? !recentIds.has(e.id) : e.group === filter))

  return (
    <>
      {filter === 'all' && <Readiness board={board} />}

      <div className="filters">
        <button className={`pill ${filter === 'all' ? 'on' : ''}`} onClick={() => setFilter('all')}>
          All
        </button>
        <button
          className={`pill ${filter === 'activity' ? 'on' : ''}`}
          onClick={() => setFilter('activity')}
        >
          Activity
        </button>
        {GROUPS.map((g) => (
          <button
            key={g.id}
            className={`pill ${filter === g.id ? 'on' : ''}`}
            onClick={() => setFilter(g.id)}
          >
            {g.label}
          </button>
        ))}
      </div>

      {recent.length > 0 && (
        <>
          <div className="section-label">Recent</div>
          <div className="grid">
            {recent.map((e) => (
              <Tile key={e.id} id={e.id} done={doneToday.has(e.id)} onOpen={onOpen} board={board} />
            ))}
          </div>
        </>
      )}

      {rest.length > 0 && (
        <>
          <div className="section-label">
            {filter === 'all' ? 'All exercises' : GROUPS.find((g) => g.id === filter)?.label}
          </div>
          <div className="grid">
            {rest.map((e) => (
              <Tile key={e.id} id={e.id} done={doneToday.has(e.id)} onOpen={onOpen} board={board} />
            ))}
          </div>
        </>
      )}

      {(filter === 'all' || filter === 'activity') && (
        <>
          <div className="section-label">Badminton, rides and other activity</div>
          <div className="grid">
            {ACTIVITIES.map((a) => {
              const mins = activityMinutesToday(a.id)
              return (
                <button
                  key={a.id}
                  className={`tile ${mins > 0 ? 'done' : ''}`}
                  onClick={() => onOpenActivity(a.id)}
                >
                  {mins > 0 && <span className="badge">{mins}m</span>}
                  <ActivityIcon kind={a} />
                  <span className="label">{a.name}</span>
                </button>
              )
            })}
          </div>
        </>
      )}

      {visible.length === 0 && filter !== 'activity' && (
        <div className="empty">Every exercise is hidden. Unhide some in Settings.</div>
      )}
    </>
  )
}

function Tile({
  id,
  done,
  onOpen,
  board,
}: {
  id: string
  done: boolean
  onOpen: (id: string) => void
  board: GroupState[]
}) {
  const { exerciseById, sessions, settings } = useStore()
  const exercise = exerciseById(id)
  if (!exercise) return null

  const last = lastPerformance(sessions, id)
  const stalled = isStalled(sessions, id)
  // Warn before the set, not after: this exercise loads something worked
  // today or yesterday.
  const conflicts = done ? [] : conflictsWith(exercise, board)
  const todayEntry = sessions
    .find((s) => s.date === todayISO())
    ?.entries.find((e) => e.exerciseId === id)

  return (
    <button
      className={`tile ${done ? 'done' : ''} ${stalled ? 'stalled' : ''} ${
        conflicts.length > 0 ? 'conflict' : ''
      }`}
      onClick={() => onOpen(id)}
      title={
        conflicts.length > 0
          ? `Recently worked: ${conflicts.map((c) => c.label.toLowerCase()).join(', ')}`
          : undefined
      }
    >
      {done && <span className="badge">{todayEntry?.sets.length}</span>}
      {!done && stalled && <span className="badge">•</span>}
      <ExerciseIcon exercise={exercise} alert={conflicts.map((c) => c.group)} />
      <span className="label">{exercise.name}</span>
      {conflicts.length > 0 ? (
        <span className="last warn">{conflicts.map((c) => c.label.toLowerCase()).join(' · ')}</span>
      ) : (
        last && (
          <span className="last">
            {done ? formatSets(todayEntry?.sets ?? []) : `${last.top}${settings.unit}`}
          </span>
        )
      )}
    </button>
  )
}
