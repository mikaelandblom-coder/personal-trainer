import { useMemo, useState } from 'react'
import { GROUPS } from '../data/exercises'
import { ExerciseIcon } from '../icons/ExerciseIcon'
import { formatSets, isStalled, lastPerformance, recentExerciseIds } from '../lib/derive'
import { todayISO } from '../lib/dates'
import { useStore } from '../store'
import type { MuscleGroup } from '../types'

type Filter = 'all' | MuscleGroup

export function Home({ onOpen }: { onOpen: (exerciseId: string) => void }) {
  const { allExercises, sessions, settings } = useStore()
  const [filter, setFilter] = useState<Filter>('all')

  const today = sessions.find((s) => s.date === todayISO())
  const doneToday = useMemo(
    () => new Set(today?.entries.map((e) => e.exerciseId) ?? []),
    [today],
  )

  const visible = useMemo(
    () => allExercises.filter((e) => !settings.hidden.includes(e.id)),
    [allExercises, settings.hidden],
  )

  const recent = useMemo(() => {
    if (filter !== 'all') return []
    const order = recentExerciseIds(sessions).slice(0, 8)
    return order
      .map((id) => visible.find((e) => e.id === id))
      .filter((e): e is NonNullable<typeof e> => Boolean(e))
  }, [sessions, visible, filter])

  const recentIds = new Set(recent.map((e) => e.id))
  const rest = visible.filter((e) => (filter === 'all' ? !recentIds.has(e.id) : e.group === filter))

  return (
    <>
      <div className="filters">
        <button className={`pill ${filter === 'all' ? 'on' : ''}`} onClick={() => setFilter('all')}>
          All
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
              <Tile key={e.id} id={e.id} done={doneToday.has(e.id)} onOpen={onOpen} />
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
              <Tile key={e.id} id={e.id} done={doneToday.has(e.id)} onOpen={onOpen} />
            ))}
          </div>
        </>
      )}

      {visible.length === 0 && (
        <div className="empty">Every exercise is hidden. Unhide some in Settings.</div>
      )}
    </>
  )
}

function Tile({
  id,
  done,
  onOpen,
}: {
  id: string
  done: boolean
  onOpen: (id: string) => void
}) {
  const { exerciseById, sessions, settings } = useStore()
  const exercise = exerciseById(id)
  if (!exercise) return null

  const last = lastPerformance(sessions, id)
  const stalled = isStalled(sessions, id)
  const todayEntry = sessions
    .find((s) => s.date === todayISO())
    ?.entries.find((e) => e.exerciseId === id)

  return (
    <button
      className={`tile ${done ? 'done' : ''} ${stalled ? 'stalled' : ''}`}
      onClick={() => onOpen(id)}
    >
      {done && <span className="badge">{todayEntry?.sets.length}</span>}
      {!done && stalled && <span className="badge">•</span>}
      <ExerciseIcon name={exercise.icon} />
      <span className="label">{exercise.name}</span>
      {last && (
        <span className="last">
          {done ? formatSets(todayEntry?.sets ?? []) : `${last.top}${settings.unit === 'lb' ? '' : ''}`}
        </span>
      )}
    </button>
  )
}
