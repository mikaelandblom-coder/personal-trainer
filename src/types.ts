export type MuscleGroup =
  | 'chest'
  | 'back'
  | 'legs'
  | 'shoulders'
  | 'arms'
  | 'core'

export type Equipment = 'barbell' | 'dumbbell' | 'machine' | 'cable' | 'bodyweight'

export interface Exercise {
  id: string
  name: string
  /** Key into the icon set. */
  icon: string
  group: MuscleGroup
  equipment: Equipment
  /** Custom exercises are user-created and can be deleted. */
  custom?: boolean
}

/** A single set. No reps — every set is taken to failure. */
export interface SetEntry {
  weight: number
  /** Marked when the set felt bad, was cut short, or form broke down. */
  flagged?: boolean
}

export interface Entry {
  exerciseId: string
  sets: SetEntry[]
  note?: string
}

export interface Session {
  id: string
  /** ISO date, local day granularity: YYYY-MM-DD. */
  date: string
  entries: Entry[]
}

export type Unit = 'kg' | 'lb'

export interface Settings {
  unit: Unit
  /** Increment used by the +/- steppers. */
  step: number
  /** Exercise ids the user has hidden from the home grid. */
  hidden: string[]
  sync: SyncSettings
}

export interface SyncSettings {
  /** GitHub fine-grained PAT with Contents: read+write on the repo. */
  token: string
  /** owner/repo */
  repo: string
  branch: string
  path: string
  /** Blob SHA of the last file we wrote, needed to update it. */
  lastSha?: string
  lastSyncedAt?: string
}

export interface AppData {
  version: 1
  sessions: Session[]
  customExercises: Exercise[]
  settings: Settings
}
