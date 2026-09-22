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
  /** The group this exercise is filed under and loads fully. */
  group: MuscleGroup
  equipment: Equipment
  /**
   * Secondary load, 0-1 per group. This is what makes "don't hit the same
   * muscle two days running" work: bench already taxes triceps and front
   * delts, so an overhead press the next day is not a fresh session.
   */
  also?: Partial<Record<MuscleGroup, number>>
  /** Custom exercises are user-created and can be deleted. */
  custom?: boolean
}

export type ActivityType = string

/** Non-gym training: badminton, cycling, anything measured in time. */
export interface ActivityKind {
  id: ActivityType
  name: string
  icon: string
  /** Load per group, 0-1, at `fullMinutes` of it. */
  loads: Partial<Record<MuscleGroup, number>>
  /** Duration at which the loads above are reached. */
  fullMinutes: number
  /** Preset durations offered on the log screen. */
  presets: number[]
}

export interface Activity {
  type: ActivityType
  minutes: number
  note?: string
  /** ISO timestamp; see SetEntry.at. */
  at?: string
}

/** A single set. No reps — every set is taken to failure. */
export interface SetEntry {
  weight: number
  /** Marked when the set felt bad, was cut short, or form broke down. */
  flagged?: boolean
  /**
   * ISO timestamp of when the set was logged. Recovery is measured in hours,
   * not calendar days, so this is what the 46-hour rule keys off. Absent on
   * sets recorded before timestamps existed.
   */
  at?: string
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
  /** Badminton, cycling and the like, logged as duration rather than sets. */
  activities?: Activity[]
}

export type Unit = 'kg' | 'lb'

export interface Settings {
  unit: Unit
  /** Increment used by the +/- steppers. */
  step: number
  /** Hours a muscle group needs before it is trained hard again. */
  recoveryHours: number
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
