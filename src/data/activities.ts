import type { ActivityKind } from '../types'

/**
 * Training that isn't sets and weights. These count toward recovery: two hours
 * of badminton is a heavy lower-body session whatever the gym log says, so it
 * has to sit in the same load model as a squat day.
 */
export const ACTIVITIES: ActivityKind[] = [
  {
    id: 'badminton',
    name: 'Badminton',
    badge: 'badminton',
    // Repeated lunging and overhead work — legs first, shoulders close behind.
    loads: { legs: 0.85, shoulders: 0.5, core: 0.35, arms: 0.25, back: 0.2 },
    fullMinutes: 90,
    presets: [60, 90, 120, 150],
  },
  {
    id: 'cycling',
    name: 'Cycling',
    badge: 'cycling',
    loads: { legs: 0.45, core: 0.1 },
    fullMinutes: 60,
    presets: [15, 30, 45, 60],
  },
  {
    id: 'cardio',
    name: 'Other Cardio',
    badge: 'cardio',
    loads: { legs: 0.35, core: 0.15 },
    fullMinutes: 45,
    presets: [20, 30, 45, 60],
  },
]

export function activityById(id: string): ActivityKind | undefined {
  return ACTIVITIES.find((a) => a.id === id)
}
