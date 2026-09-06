import { useMemo, useState } from 'react'
import { activityById } from '../data/activities'
import { Minus, Plus, Trash } from '../icons/ui'
import { relativeDay, todayISO } from '../lib/dates'
import { useStore } from '../store'

/** 90 -> "1h 30m", 120 -> "2h", 45 -> "45m". */
function formatMinutes(total: number): string {
  const hours = Math.floor(total / 60)
  const minutes = total % 60
  if (hours === 0) return `${minutes}m`
  return minutes === 0 ? `${hours}h` : `${hours}h ${minutes}m`
}

export function LogActivity({ typeId }: { typeId: string }) {
  const store = useStore()
  const { sessions } = store
  const kind = activityById(typeId)

  const todaySession = sessions.find((s) => s.date === todayISO())
  const logged = useMemo(
    () => (todaySession?.activities ?? []).map((a, i) => ({ ...a, index: i })).filter((a) => a.type === typeId),
    [todaySession, typeId],
  )

  const [minutes, setMinutes] = useState(kind?.presets[1] ?? 60)

  const history = useMemo(
    () =>
      sessions
        .filter((s) => (s.activities ?? []).some((a) => a.type === typeId))
        .sort((a, b) => b.date.localeCompare(a.date))
        .slice(0, 10),
    [sessions, typeId],
  )

  if (!kind) return <div className="empty">Unknown activity.</div>

  const weekly = sessions
    .filter((s) => (s.activities ?? []).some((a) => a.type === typeId))
    .filter((s) => {
      const diff = (Date.now() - new Date(`${s.date}T00:00:00`).getTime()) / 86400000
      return diff < 28
    }).length

  return (
    <>
      <div className="stat-row">
        <div className="stat">
          <div className="k">Last time</div>
          <div className="v">{history[0] ? relativeDay(history[0].date) : '—'}</div>
        </div>
        <div className="stat">
          <div className="k">Last 4 weeks</div>
          <div className="v">
            {weekly} <small>sessions</small>
          </div>
        </div>
      </div>

      <div className="entry">
        <div className="weight-row">
          <button className="step" onClick={() => setMinutes((m) => Math.max(5, m - 15))} aria-label="Less time">
            <Minus />
          </button>
          <div className="weight-input" style={{ userSelect: 'none' }}>
            {minutes}
            <span style={{ fontSize: 17, fontWeight: 450, color: 'var(--muted)' }}> min</span>
          </div>
          <button className="step" onClick={() => setMinutes((m) => m + 15)} aria-label="More time">
            <Plus />
          </button>
        </div>
        <div className="filters" style={{ padding: '0 0 12px' }}>
          {kind.presets.map((p) => (
            <button key={p} className={`pill ${minutes === p ? 'on' : ''}`} onClick={() => setMinutes(p)}>
              {formatMinutes(p)}
            </button>
          ))}
        </div>
        <button className="primary" onClick={() => store.logActivity(typeId, minutes)}>
          Log {minutes} min of {kind.name.toLowerCase()}
        </button>
      </div>

      {logged.length > 0 && (
        <div className="sets">
          {logged.map((a) => (
            <div className="set" key={a.index}>
              <span className="n">✓</span>
              <span style={{ flex: 1, fontSize: 17, fontWeight: 600 }}>{a.minutes} min</span>
              <button
                className="iconbtn"
                style={{ width: 40, height: 40 }}
                onClick={() => store.removeActivity(a.index)}
                aria-label="Delete activity"
              >
                <Trash />
              </button>
            </div>
          ))}
        </div>
      )}

      <div className="hint">
        Counts toward recovery: {Object.entries(kind.loads)
          .sort((a, b) => b[1] - a[1])
          .map(([g, w]) => `${g} ${Math.round(w * 100)}%`)
          .join(' · ')}
      </div>

      <div className="section-label">History</div>
      {history.length === 0 ? (
        <div className="hint">Nothing logged yet.</div>
      ) : (
        history.map((s) => (
          <div className="card" key={s.id}>
            <div className="card-head">
              <div className="name">
                {(s.activities ?? [])
                  .filter((a) => a.type === typeId)
                  .map((a) => `${a.minutes} min`)
                  .join(' + ')}
                <span className="meta">{relativeDay(s.date)}</span>
              </div>
            </div>
          </div>
        ))
      )}
    </>
  )
}
