import { useMemo } from 'react'
import { GROUPS } from '../data/exercises'
import { ExerciseIcon } from '../icons/ExerciseIcon'
import { exerciseLoads } from '../lib/recovery'
import { daysBetween, relativeDay, todayISO } from '../lib/dates'
import {
  historyFor,
  isStalled,
  personalBest,
  recentExerciseIds,
  sessionsSinceProgress,
  trend,
} from '../lib/derive'
import { useStore } from '../store'
import type { MuscleGroup } from '../types'

export function Progress({ onOpen }: { onOpen: (id: string) => void }) {
  const { sessions, settings, exerciseById } = useStore()
  const today = todayISO()

  const inWindow = (days: number) =>
    sessions.filter((s) => daysBetween(s.date, today) < days && daysBetween(s.date, today) >= 0)

  const week = inWindow(7)
  const month = inWindow(30)
  const setsThisWeek = week.reduce(
    (n, s) => n + s.entries.reduce((m, e) => m + e.sets.length, 0),
    0,
  )

  const balance = useMemo(() => {
    const counts = new Map<MuscleGroup, number>()
    for (const s of month) {
      for (const e of s.entries) {
        const ex = exerciseById(e.exerciseId)
        if (!ex) continue
        counts.set(ex.group, (counts.get(ex.group) ?? 0) + e.sets.length)
      }
    }
    const max = Math.max(1, ...counts.values())
    return GROUPS.map((g) => ({ ...g, sets: counts.get(g.id) ?? 0, max }))
  }, [month, exerciseById])

  const trained = useMemo(() => recentExerciseIds(sessions), [sessions])

  if (sessions.length === 0) {
    return <div className="empty">Log a few sessions and your progress shows up here.</div>
  }

  return (
    <>
      <div className="stat-row">
        <div className="stat">
          <div className="k">This week</div>
          <div className="v">
            {week.length} <small>sessions</small>
          </div>
        </div>
        <div className="stat">
          <div className="k">Sets</div>
          <div className="v">
            {setsThisWeek} <small>this week</small>
          </div>
        </div>
        <div className="stat">
          <div className="k">30 days</div>
          <div className="v">
            {month.length} <small>sessions</small>
          </div>
        </div>
      </div>

      <div className="section-label">Balance · last 30 days</div>
      <div className="card">
        <div className="bars">
          {balance.map((b) => (
            <div className="bar-row" key={b.id}>
              <span className="bname">{b.label}</span>
              <span className="bar-track">
                <span
                  className="bar-fill"
                  style={{
                    width: `${(b.sets / b.max) * 100}%`,
                    background: b.sets === 0 ? 'var(--down)' : undefined,
                  }}
                />
              </span>
              <span className="bval" style={b.sets === 0 ? { color: 'var(--down)' } : undefined}>
                {b.sets}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="section-label">Exercises</div>
      {trained.map((id) => (
        <ExerciseCard key={id} id={id} onOpen={onOpen} unit={settings.unit} />
      ))}
    </>
  )
}

function ExerciseCard({
  id,
  onOpen,
  unit,
}: {
  id: string
  onOpen: (id: string) => void
  unit: string
}) {
  const { sessions, exerciseById } = useStore()
  const exercise = exerciseById(id)
  const history = historyFor(sessions, id)
  if (!exercise || history.length === 0) return null

  const latest = history[history.length - 1]
  const best = personalBest(sessions, id)
  const t = trend(sessions, id)
  const stalled = isStalled(sessions, id)
  const atPR = best?.date === latest.date && history.length > 1
  const delta =
    history.length > 1 ? latest.top - history[history.length - 2].top : 0

  return (
    <button className="card" style={{ display: 'block', width: '100%', textAlign: 'left' }} onClick={() => onOpen(id)}>
      <div className="card-head">
        <ExerciseIcon icon={exercise.icon} equipment={exercise.equipment} loads={exerciseLoads(exercise)} size={28} />
        <div className="name">
          {exercise.name}
          {atPR && <span className="tag pr">PR</span>}
          {stalled && <span className="tag stall">stalled {sessionsSinceProgress(sessions, id)}</span>}
          <span className="meta">
            {latest.top} {unit} top · {relativeDay(latest.date)} · {history.length} sessions
          </span>
        </div>
        <div className={`trend ${t === 'new' ? 'flat' : t}`}>
          {delta === 0 ? '–' : `${delta > 0 ? '+' : ''}${Math.round(delta * 100) / 100}`}
        </div>
      </div>
      <Spark values={history.map((h) => h.top)} />
    </button>
  )
}

/** Top-set-over-time line. Flat means flat — the y-axis is not zero-based. */
function Spark({ values }: { values: number[] }) {
  if (values.length < 2) return null
  const min = Math.min(...values)
  const max = Math.max(...values)
  const span = max - min
  const points = values
    .map((v, i) => {
      const x = (i / (values.length - 1)) * 100
      // A genuinely flat run sits mid-height rather than pinned to the floor.
      const y = span === 0 ? 17 : 30 - ((v - min) / span) * 26
      return `${x.toFixed(2)},${y.toFixed(2)}`
    })
    .join(' ')

  return (
    <svg className="spark" viewBox="0 0 100 34" preserveAspectRatio="none" aria-hidden="true">
      <polyline
        points={points}
        fill="none"
        stroke="var(--accent)"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  )
}
