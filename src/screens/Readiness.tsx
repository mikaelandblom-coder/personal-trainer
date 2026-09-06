import { useState } from 'react'
import { describeGroupState, explainBlocked, suggestPlan } from '../lib/recovery'
import type { GroupState } from '../lib/recovery'
import { useStore } from '../store'

const STATUS_LABEL: Record<GroupState['status'], string> = {
  today: 'today',
  rest: 'resting',
  ready: 'ready',
  overdue: 'overdue',
}

/**
 * The first thing on the workout screen: what to train today, and why. The
 * "why" matters more than the verdict — an unpredictable schedule means the
 * answer changes daily, and a bare recommendation is easy to distrust.
 */
export function Readiness({ board }: { board: GroupState[] }) {
  const { sessions } = useStore()
  const [open, setOpen] = useState(false)
  const plan = suggestPlan(board)

  if (sessions.length === 0) {
    return (
      <div className="plan">
        <div className="plan-head">
          <span className="plan-label">Start anywhere</span>
        </div>
        <p className="plan-reason">
          Log a few sessions — including badminton and rides — and this turns into a
          recommendation based on what's actually recovered.
        </p>
      </div>
    )
  }

  const blocked = explainBlocked(plan.blocked)

  return (
    <div className={`plan ${plan.id === 'rest' ? 'rest' : ''}`}>
      <button className="plan-head" onClick={() => setOpen((v) => !v)} aria-expanded={open}>
        <span className="plan-kicker">Today</span>
        <span className="plan-label">{plan.label}</span>
        <span className="plan-toggle">{open ? 'Hide' : 'Details'}</span>
      </button>
      <p className="plan-reason">{plan.reason}</p>
      {blocked && <p className="plan-blocked">Hold off on {blocked}.</p>}

      <div className="dots">
        {board.map((b) => (
          <span key={b.group} className={`dot ${b.status}`} title={describeGroupState(b)}>
            <i />
            {b.label}
          </span>
        ))}
      </div>

      {open && (
        <div className="board">
          {board.map((b) => (
            <div className="board-row" key={b.group}>
              <span className={`board-name ${b.status}`}>{b.label}</span>
              <span className="board-when">
                {b.daysSince === undefined
                  ? 'not trained yet'
                  : b.daysSince === 0
                    ? 'worked today'
                    : b.daysSince === 1
                      ? 'yesterday'
                      : `${b.daysSince} days ago`}
                {b.cause && b.daysSince !== undefined ? ` · ${b.cause}` : ''}
              </span>
              <span className={`board-status ${b.status}`}>{STATUS_LABEL[b.status]}</span>
            </div>
          ))}
          <p className="plan-reason" style={{ marginTop: 10 }}>
            A group counts as worked when a session loads it at least halfway —
            secondary load included, so bench counts toward shoulders and triceps,
            and badminton counts toward legs.
          </p>
        </div>
      )}
    </div>
  )
}
