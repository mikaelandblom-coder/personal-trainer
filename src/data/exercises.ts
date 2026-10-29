import type { Exercise, MuscleGroup } from '../types'

export const GROUPS: { id: MuscleGroup; label: string }[] = [
  { id: 'chest', label: 'Chest' },
  { id: 'back', label: 'Back' },
  { id: 'legs', label: 'Legs' },
  { id: 'shoulders', label: 'Shoulders' },
  { id: 'arms', label: 'Arms' },
  { id: 'core', label: 'Core' },
]

export const CATALOG: Exercise[] = [
  // Chest
  { id: 'bench-press', name: 'Bench Press', group: 'chest', equipment: 'barbell', also: { shoulders: 0.5, arms: 0.5 } },
  { id: 'incline-bench', name: 'Incline Bench', group: 'chest', equipment: 'barbell', also: { shoulders: 0.6, arms: 0.5 } },
  { id: 'db-press', name: 'DB Bench Press', group: 'chest', equipment: 'dumbbell', also: { shoulders: 0.5, arms: 0.45 } },
  { id: 'incline-db-press', name: 'Incline DB Press', group: 'chest', equipment: 'dumbbell', also: { shoulders: 0.6, arms: 0.45 } },
  { id: 'chest-press', name: 'Chest Press', group: 'chest', equipment: 'machine', also: { shoulders: 0.4, arms: 0.4 } },
  { id: 'pec-deck', name: 'Pec Deck', group: 'chest', equipment: 'machine', also: { shoulders: 0.25 } },
  { id: 'cable-fly', name: 'Cable Fly', group: 'chest', equipment: 'cable', also: { shoulders: 0.3 } },
  { id: 'dips', name: 'Dips', group: 'chest', equipment: 'bodyweight', also: { shoulders: 0.5, arms: 0.6 } },

  // Back
  { id: 'lat-pulldown', name: 'Lat Pulldown', group: 'back', equipment: 'cable', also: { arms: 0.5, shoulders: 0.2 } },
  { id: 'pull-up', name: 'Pull-up', group: 'back', equipment: 'bodyweight', also: { arms: 0.55, shoulders: 0.25, core: 0.2 } },
  { id: 'seated-row', name: 'Seated Row', group: 'back', equipment: 'cable', also: { arms: 0.45, shoulders: 0.2 } },
  { id: 'barbell-row', name: 'Barbell Row', group: 'back', equipment: 'barbell', also: { arms: 0.45, core: 0.35, legs: 0.2 } },
  { id: 'db-row', name: 'DB Row', group: 'back', equipment: 'dumbbell', also: { arms: 0.45, core: 0.2 } },
  { id: 't-bar-row', name: 'T-Bar Row', group: 'back', equipment: 'barbell', also: { arms: 0.45, core: 0.35 } },
  { id: 'deadlift', name: 'Deadlift', group: 'back', equipment: 'barbell', also: { legs: 0.7, core: 0.6, arms: 0.2 } },
  { id: 'straight-arm-pulldown', name: 'Straight-Arm Pulldown', group: 'back', equipment: 'cable', also: { arms: 0.2, core: 0.2 } },

  // Legs
  { id: 'back-squat', name: 'Back Squat', group: 'legs', equipment: 'barbell', also: { core: 0.5, back: 0.4 } },
  { id: 'front-squat', name: 'Front Squat', group: 'legs', equipment: 'barbell', also: { core: 0.55, back: 0.35 } },
  { id: 'leg-press', name: 'Leg Press', group: 'legs', equipment: 'machine', also: { core: 0.1 } },
  { id: 'hack-squat', name: 'Hack Squat', group: 'legs', equipment: 'machine', also: { core: 0.2 } },
  { id: 'leg-extension', name: 'Leg Extension', group: 'legs', equipment: 'machine' },
  { id: 'leg-curl', name: 'Leg Curl', group: 'legs', equipment: 'machine' },
  { id: 'rdl', name: 'Romanian Deadlift', group: 'legs', equipment: 'barbell', also: { back: 0.6, core: 0.4 } },
  { id: 'hip-thrust', name: 'Hip Thrust', group: 'legs', equipment: 'barbell', also: { core: 0.3, back: 0.2 } },
  { id: 'bulgarian-split-squat', name: 'Bulgarian Split Squat', group: 'legs', equipment: 'dumbbell', also: { core: 0.35 } },
  { id: 'lunge', name: 'Lunge', group: 'legs', equipment: 'dumbbell', also: { core: 0.3 } },
  { id: 'calf-raise', name: 'Calf Raise', group: 'legs', equipment: 'machine' },

  // Shoulders
  { id: 'overhead-press', name: 'Overhead Press', group: 'shoulders', equipment: 'barbell', also: { arms: 0.5, core: 0.35, chest: 0.3 } },
  { id: 'db-shoulder-press', name: 'DB Shoulder Press', group: 'shoulders', equipment: 'dumbbell', also: { arms: 0.45, core: 0.25, chest: 0.25 } },
  { id: 'lateral-raise', name: 'Lateral Raise', group: 'shoulders', equipment: 'dumbbell' },
  { id: 'rear-delt-fly', name: 'Rear Delt Fly', group: 'shoulders', equipment: 'dumbbell', also: { back: 0.35 } },
  { id: 'face-pull', name: 'Face Pull', group: 'shoulders', equipment: 'cable', also: { back: 0.4 } },
  { id: 'shrug', name: 'Shrug', group: 'shoulders', equipment: 'dumbbell', also: { back: 0.35 } },

  // Arms
  { id: 'barbell-curl', name: 'Barbell Curl', group: 'arms', equipment: 'barbell', also: { back: 0.15 } },
  { id: 'db-curl', name: 'DB Curl', group: 'arms', equipment: 'dumbbell' },
  { id: 'hammer-curl', name: 'Hammer Curl', group: 'arms', equipment: 'dumbbell' },
  { id: 'preacher-curl', name: 'Preacher Curl', group: 'arms', equipment: 'machine' },
  { id: 'cable-curl', name: 'Cable Curl', group: 'arms', equipment: 'cable' },
  { id: 'triceps-pushdown', name: 'Triceps Pushdown', group: 'arms', equipment: 'cable', also: { chest: 0.1 } },
  { id: 'overhead-extension', name: 'Overhead Extension', group: 'arms', equipment: 'dumbbell', also: { shoulders: 0.2 } },
  { id: 'skull-crusher', name: 'Skull Crusher', group: 'arms', equipment: 'barbell', also: { shoulders: 0.15 } },

  // Core
  { id: 'hanging-leg-raise', name: 'Hanging Leg Raise', group: 'core', equipment: 'bodyweight', also: { back: 0.2, arms: 0.2 } },
  { id: 'cable-crunch', name: 'Cable Crunch', group: 'core', equipment: 'cable' },
  { id: 'plank', name: 'Plank', group: 'core', equipment: 'bodyweight', also: { shoulders: 0.2 } },
  { id: 'ab-wheel', name: 'Ab Wheel', group: 'core', equipment: 'bodyweight', also: { shoulders: 0.3, back: 0.2 } },
]
