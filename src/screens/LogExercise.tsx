import { useEffect, useMemo, useState } from 'react'
import { Flag, Minus, Plus, Trash } from '../icons/ui'
import { relativeDay, todayISO } from '../lib/dates'
import { formatSets, historyFor, isStalled, personalBest, sessionsSinceProgress } from '../lib/derive'
import { useStore } from '../store'

export function LogExercise({ exerciseId }: { exerciseId: string }) {
  const store = useStore()
  const { sessions, settings, exerciseById } = store
  const exercise = exerciseById(exerciseId)

  const todayEntry = sessions
    .find((s) => s.date === todayISO())
    ?.entries.find((e) => e.exerciseId === exerciseId)
  const sets = useMemo(() => todayEntry?.sets ?? [], [todayEntry])

  /** The last session *before* today — today's own sets aren't "last time". */
  const previous = useMemo(() => {
    const earlier = historyFor(sessions, exerciseId).filter((p) => p.date !== todayISO())
    return earlier[earlier.length - 1]
  }, [sessions, exerciseId])
  const best = personalBest(sessions, exerciseId)

  /**
   * What the big number starts at: whatever you just did today, else the
   * matching set from last time, else your best. Adjusting is a tap, not typing.
   */
  const suggestion = useMemo(() => {
    const done = sets.length
    if (done > 0) return sets[done - 1].weight
    if (previous) return previous.sets[Math.min(done, previous.sets.length - 1)].weight
    return best?.top ?? settings.step * 8
  }, [sets, previous, best, settings.step])

  const [weight, setWeight] = useState<number>(suggestion)
  const [text, setText] = useState<string>(String(suggestion))
  const [note, setNote] = useState<string>(todayEntry?.note ?? '')

  // Re-seed the entry field after each logged set, but never while typing.
  useEffect(() => {
    setWeight(suggestion)
    setText(String(suggestion))
  }, [suggestion, exerciseId])

  useEffect(() => {
    setNote(todayEntry?.note ?? '')
    // Only when switching exercise — typing shouldn't be clobbered.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [exerciseId])

  if (!exercise) return <div className="empty">That exercise no longer exists.</div>

  const bump = (delta: number) => {
    const next = Math.max(0, Math.round((weight + delta) * 100) / 100)
    setWeight(next)
    setText(String(next))
  }

  const commitText = (raw: string) => {
    setText(raw)
    const parsed = Number(raw.replace(',', '.'))
    if (Number.isFinite(parsed) && parsed >= 0) setWeight(parsed)
  }

  const stalled = isStalled(sessions, exerciseId)
  const sincePR = sessionsSinceProgress(sessions, exerciseId)
  const isPR = best !== undefined && weight > best.top

  return (
    <>
      <div className="stat-row">
        <div className="stat">
          <div className="k">Last time</div>
          <div className="v">{previous ? formatSets(previous.sets) : '—'}</div>
          {previous && <div className="when">{relativeDay(previous.date)}</div>}
        </div>
        <div className="stat">
          <div className="k">Best</div>
          <div className="v">
            {best ? best.top : '—'}
            {best && <small> {settings.unit}</small>}
          </div>
        </div>
      </div>

      {stalled && (
        <div className="hint" style={{ color: 'var(--warn)' }}>
          Top set hasn't moved in {sincePR} sessions. Worth a deload, a rep-range
          change, or swapping the variation.
        </div>
      )}

      <div className="entry">
        <div className="weight-row">
          <button className="step" onClick={() => bump(-settings.step)} aria-label="Decrease">
            <Minus />
          </button>
          <input
            className="weight-input"
            type="text"
            inputMode="decimal"
            value={text}
            onChange={(e) => commitText(e.target.value)}
            onFocus={(e) => e.target.select()}
            aria-label={`Weight in ${settings.unit}`}
          />
          <button className="step" onClick={() => bump(settings.step)} aria-label="Increase">
            <Plus />
          </button>
        </div>
        <button className="primary" onClick={() => store.logSet(exerciseId, weight)}>
          Log set {sets.length + 1}
          {isPR ? ' — new best' : ''} · {weight} {settings.unit}
        </button>
      </div>

      {sets.length > 0 && (
        <div className="sets">
          {sets.map((set, i) => (
            <div className={`set ${set.flagged ? 'flagged' : ''}`} key={i}>
              <span className="n">{i + 1}</span>
              <input
                type="text"
                inputMode="decimal"
                value={String(set.weight)}
                onChange={(e) => {
                  const parsed = Number(e.target.value.replace(',', '.'))
                  if (Number.isFinite(parsed) && parsed >= 0) store.updateSet(exerciseId, i, parsed)
                }}
                aria-label={`Set ${i + 1} weight`}
              />
              <span className="unit">{settings.unit}</span>
              <button
                className={`iconbtn flag ${set.flagged ? 'on' : ''}`}
                style={{ width: 40, height: 40 }}
                onClick={() => store.toggleFlag(exerciseId, i)}
                aria-label="Flag this set"
                title="Felt bad / cut short"
              >
                <Flag />
              </button>
              <button
                className="iconbtn"
                style={{ width: 40, height: 40 }}
                onClick={() => store.removeSet(exerciseId, i)}
                aria-label={`Delete set ${i + 1}`}
              >
                <Trash />
              </button>
            </div>
          ))}
        </div>
      )}

      <textarea
        className="note"
        placeholder="Note (optional) — how it felt, setup, pin position…"
        value={note}
        onChange={(e) => setNote(e.target.value)}
        onBlur={() => store.setNote(exerciseId, note.trim())}
      />

      <div className="section-label">History</div>
      <History exerciseId={exerciseId} />
    </>
  )
}

function History({ exerciseId }: { exerciseId: string }) {
  const { sessions, settings } = useStore()
  const rows = useMemo(() => {
    return sessions
      .filter((s) => s.entries.some((e) => e.exerciseId === exerciseId))
      .sort((a, b) => b.date.localeCompare(a.date))
      .slice(0, 12)
  }, [sessions, exerciseId])

  if (rows.length === 0) return <div className="hint">No sessions logged yet.</div>

  return (
    <>
      {rows.map((s) => {
        const entry = s.entries.find((e) => e.exerciseId === exerciseId)
        if (!entry) return null
        return (
          <div className="card" key={s.id}>
            <div className="card-head">
              <div className="name">
                {formatSets(entry.sets)} <small style={{ color: 'var(--muted)' }}>{settings.unit}</small>
                <span className="meta">{relativeDay(s.date)}</span>
              </div>
              <div className="trend flat">{entry.sets.length} sets</div>
            </div>
            {entry.note && <div className="hint" style={{ margin: '8px 0 0' }}>{entry.note}</div>}
          </div>
        )
      })}
    </>
  )
}
