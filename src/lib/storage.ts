import type { AppData } from '../types'

const KEY = 'personal-trainer/v1'

export const DEFAULT_DATA: AppData = {
  version: 1,
  sessions: [],
  customExercises: [],
  settings: {
    unit: 'kg',
    step: 2.5,
    recoveryHours: 46,
    hidden: [],
    sync: {
      token: '',
      repo: 'mikaelandblom-coder/personal-trainer',
      branch: 'main',
      path: 'data/history.json',
    },
  },
}

export function load(): AppData {
  try {
    const raw = localStorage.getItem(KEY)
    if (!raw) return DEFAULT_DATA
    const parsed = JSON.parse(raw) as Partial<AppData>
    return migrate(parsed)
  } catch {
    return DEFAULT_DATA
  }
}

export function save(data: AppData): void {
  try {
    localStorage.setItem(KEY, JSON.stringify(data))
  } catch {
    // Quota or private-mode failures shouldn't take the app down mid-workout.
  }
}

/** Fills in anything a newer build added to a snapshot written by an older one. */
export function migrate(input: Partial<AppData>): AppData {
  return {
    version: 1,
    sessions: input.sessions ?? [],
    customExercises: input.customExercises ?? [],
    settings: {
      ...DEFAULT_DATA.settings,
      ...input.settings,
      sync: { ...DEFAULT_DATA.settings.sync, ...input.settings?.sync },
    },
  }
}

/** The snapshot shape written to the repo — never includes the token. */
export function exportPayload(data: AppData) {
  const { sync: _sync, ...settings } = data.settings
  return {
    version: 1 as const,
    exportedAt: new Date().toISOString(),
    settings,
    customExercises: data.customExercises,
    sessions: data.sessions,
  }
}
