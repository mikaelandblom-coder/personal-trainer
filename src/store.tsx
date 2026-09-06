import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import type { ReactNode } from 'react'
import { CATALOG } from './data/exercises'
import { todayISO } from './lib/dates'
import { load, save } from './lib/storage'
import type { AppData, Exercise, Session, Settings } from './types'

interface Store {
  data: AppData
  settings: Settings
  sessions: Session[]
  /** Catalog plus any custom exercises the user added. */
  allExercises: Exercise[]
  exerciseById: (id: string) => Exercise | undefined
  logSet: (exerciseId: string, weight: number) => void
  updateSet: (exerciseId: string, index: number, weight: number) => void
  removeSet: (exerciseId: string, index: number) => void
  toggleFlag: (exerciseId: string, index: number) => void
  setNote: (exerciseId: string, note: string) => void
  addExercise: (exercise: Exercise) => void
  deleteExercise: (id: string) => void
  toggleHidden: (id: string) => void
  updateSettings: (patch: Partial<Settings>) => void
  replaceData: (next: AppData) => void
}

const Ctx = createContext<Store | null>(null)

function newSession(date: string): Session {
  return { id: `${date}-${Math.random().toString(36).slice(2, 8)}`, date, entries: [] }
}

/**
 * Applies `fn` to today's entry for an exercise, creating the session and the
 * entry on demand. Empty entries are pruned so a mis-tap doesn't leave a
 * phantom exercise in the day's history.
 */
function editEntry(
  data: AppData,
  exerciseId: string,
  fn: (sets: AppData['sessions'][number]['entries'][number]) => void,
): AppData {
  const date = todayISO()
  const sessions = [...data.sessions]
  let index = sessions.findIndex((s) => s.date === date)
  if (index === -1) {
    sessions.push(newSession(date))
    index = sessions.length - 1
  }
  const session = structuredClone(sessions[index])
  let entry = session.entries.find((e) => e.exerciseId === exerciseId)
  if (!entry) {
    entry = { exerciseId, sets: [] }
    session.entries.push(entry)
  }
  fn(entry)
  session.entries = session.entries.filter((e) => e.sets.length > 0 || (e.note ?? '') !== '')
  sessions[index] = session
  return { ...data, sessions: sessions.filter((s) => s.entries.length > 0) }
}

export function StoreProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<AppData>(() => load())

  useEffect(() => {
    save(data)
  }, [data])

  const allExercises = useMemo(() => [...CATALOG, ...data.customExercises], [data.customExercises])

  const exerciseById = useCallback(
    (id: string) => allExercises.find((e) => e.id === id),
    [allExercises],
  )

  const value = useMemo<Store>(
    () => ({
      data,
      settings: data.settings,
      sessions: data.sessions,
      allExercises,
      exerciseById,
      logSet: (exerciseId, weight) =>
        setData((d) => editEntry(d, exerciseId, (e) => e.sets.push({ weight }))),
      updateSet: (exerciseId, index, weight) =>
        setData((d) =>
          editEntry(d, exerciseId, (e) => {
            if (e.sets[index]) e.sets[index] = { ...e.sets[index], weight }
          }),
        ),
      removeSet: (exerciseId, index) =>
        setData((d) => editEntry(d, exerciseId, (e) => e.sets.splice(index, 1))),
      toggleFlag: (exerciseId, index) =>
        setData((d) =>
          editEntry(d, exerciseId, (e) => {
            const set = e.sets[index]
            if (set) e.sets[index] = { ...set, flagged: !set.flagged }
          }),
        ),
      setNote: (exerciseId, note) =>
        setData((d) =>
          editEntry(d, exerciseId, (e) => {
            e.note = note
          }),
        ),
      addExercise: (exercise) =>
        setData((d) => ({ ...d, customExercises: [...d.customExercises, exercise] })),
      deleteExercise: (id) =>
        setData((d) => ({ ...d, customExercises: d.customExercises.filter((e) => e.id !== id) })),
      toggleHidden: (id) =>
        setData((d) => ({
          ...d,
          settings: {
            ...d.settings,
            hidden: d.settings.hidden.includes(id)
              ? d.settings.hidden.filter((h) => h !== id)
              : [...d.settings.hidden, id],
          },
        })),
      updateSettings: (patch) => setData((d) => ({ ...d, settings: { ...d.settings, ...patch } })),
      replaceData: (next) => setData(next),
    }),
    [data, allExercises, exerciseById],
  )

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>
}

export function useStore(): Store {
  const ctx = useContext(Ctx)
  if (!ctx) throw new Error('useStore must be used inside StoreProvider')
  return ctx
}
