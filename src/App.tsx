import { useEffect, useState } from 'react'
import { activityById } from './data/activities'
import { ExerciseIcon } from './icons/ExerciseIcon'
import { Back, Chart, Dumbbells, Gear } from './icons/ui'
import { formatDay, todayISO } from './lib/dates'
import { Home } from './screens/Home'
import { LogActivity } from './screens/LogActivity'
import { LogExercise } from './screens/LogExercise'
import { Progress } from './screens/Progress'
import { Settings } from './screens/Settings'
import { useStore } from './store'

type Tab = 'log' | 'progress' | 'settings'

export function App() {
  const { sessions, exerciseById } = useStore()
  const [tab, setTab] = useState<Tab>('log')
  const [openId, setOpenId] = useState<string | null>(null)
  const [openActivity, setOpenActivity] = useState<string | null>(null)

  // Make the phone's back gesture close an exercise rather than leave the app.
  useEffect(() => {
    const onPop = () => {
      setOpenId(null)
      setOpenActivity(null)
    }
    window.addEventListener('popstate', onPop)
    return () => window.removeEventListener('popstate', onPop)
  }, [])

  const open = (id: string) => {
    setOpenId(id)
    setOpenActivity(null)
    history.pushState({ detail: id }, '')
  }

  const openAct = (id: string) => {
    setOpenActivity(id)
    setOpenId(null)
    history.pushState({ detail: id }, '')
  }

  const close = () => {
    setOpenId(null)
    setOpenActivity(null)
    if (history.state?.detail) history.back()
  }

  const today = sessions.find((s) => s.date === todayISO())
  const setsToday = today?.entries.reduce((n, e) => n + e.sets.length, 0) ?? 0
  const minutesToday = (today?.activities ?? []).reduce((n, a) => n + a.minutes, 0)
  const summary = [
    setsToday ? `${setsToday} sets logged` : '',
    minutesToday ? `${minutesToday} min activity` : '',
  ].filter(Boolean)
  const exercise = openId ? exerciseById(openId) : undefined
  const activity = openActivity ? activityById(openActivity) : undefined
  const detail = exercise ?? activity

  return (
    <div className="app">
      <header className="topbar">
        {detail ? (
          <>
            <button className="iconbtn" onClick={close} aria-label="Back">
              <Back />
            </button>
            <span style={{ color: 'var(--accent)', display: 'flex' }}>
              <ExerciseIcon name={detail.icon} size={28} />
            </span>
            <h1>{detail.name}</h1>
          </>
        ) : (
          <h1>
            {tab === 'log' ? 'Today' : tab === 'progress' ? 'Progress' : 'Settings'}
            <span className="sub">
              {tab === 'log'
                ? [formatDay(todayISO()), ...summary].join(' · ')
                : tab === 'progress'
                  ? `${sessions.length} sessions recorded`
                  : 'Units, backup, exercises'}
            </span>
          </h1>
        )}
      </header>

      <main>
        {exercise ? (
          <LogExercise exerciseId={exercise.id} />
        ) : activity ? (
          <LogActivity typeId={activity.id} />
        ) : tab === 'log' ? (
          <Home onOpen={open} onOpenActivity={openAct} />
        ) : tab === 'progress' ? (
          <Progress onOpen={open} />
        ) : (
          <Settings />
        )}
      </main>

      <nav className="tabs">
        {([
          ['log', 'Workout', <Dumbbells key="d" />],
          ['progress', 'Progress', <Chart key="c" />],
          ['settings', 'Settings', <Gear key="g" />],
        ] as const).map(([id, label, icon]) => (
          <button
            key={id}
            className={!detail && tab === id ? 'on' : ''}
            onClick={() => {
              setOpenId(null)
              setOpenActivity(null)
              setTab(id)
            }}
          >
            {icon}
            {label}
          </button>
        ))}
      </nav>
    </div>
  )
}
