import { useEffect, useState } from 'react'
import { ExerciseIcon } from './icons/ExerciseIcon'
import { Back, Chart, Dumbbells, Gear } from './icons/ui'
import { formatDay, todayISO } from './lib/dates'
import { Home } from './screens/Home'
import { LogExercise } from './screens/LogExercise'
import { Progress } from './screens/Progress'
import { Settings } from './screens/Settings'
import { useStore } from './store'

type Tab = 'log' | 'progress' | 'settings'

export function App() {
  const { sessions, exerciseById } = useStore()
  const [tab, setTab] = useState<Tab>('log')
  const [openId, setOpenId] = useState<string | null>(null)

  // Make the phone's back gesture close an exercise rather than leave the app.
  useEffect(() => {
    const onPop = () => setOpenId(null)
    window.addEventListener('popstate', onPop)
    return () => window.removeEventListener('popstate', onPop)
  }, [])

  const open = (id: string) => {
    setOpenId(id)
    history.pushState({ exercise: id }, '')
  }

  const close = () => {
    setOpenId(null)
    if (history.state?.exercise) history.back()
  }

  const today = sessions.find((s) => s.date === todayISO())
  const setsToday = today?.entries.reduce((n, e) => n + e.sets.length, 0) ?? 0
  const exercise = openId ? exerciseById(openId) : undefined

  return (
    <div className="app">
      <header className="topbar">
        {exercise ? (
          <>
            <button className="iconbtn" onClick={close} aria-label="Back">
              <Back />
            </button>
            <span style={{ color: 'var(--accent)', display: 'flex' }}>
              <ExerciseIcon name={exercise.icon} size={28} />
            </span>
            <h1>{exercise.name}</h1>
          </>
        ) : (
          <h1>
            {tab === 'log' ? 'Today' : tab === 'progress' ? 'Progress' : 'Settings'}
            <span className="sub">
              {tab === 'log'
                ? `${formatDay(todayISO())}${setsToday ? ` · ${setsToday} sets logged` : ''}`
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
        ) : tab === 'log' ? (
          <Home onOpen={open} />
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
            className={!openId && tab === id ? 'on' : ''}
            onClick={() => {
              setOpenId(null)
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
