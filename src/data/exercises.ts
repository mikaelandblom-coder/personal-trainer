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
  { id: 'bench-press', name: 'Bench Press', icon: 'bench', group: 'chest', equipment: 'barbell', also: { shoulders: 0.5, arms: 0.5 } },
  { id: 'incline-bench', name: 'Incline Bench', icon: 'incline', group: 'chest', equipment: 'barbell', also: { shoulders: 0.6, arms: 0.5 } },
  { id: 'db-press', name: 'DB Bench Press', icon: 'db-press', group: 'chest', equipment: 'dumbbell', also: { shoulders: 0.5, arms: 0.45 } },
  { id: 'incline-db-press', name: 'Incline DB Press', icon: 'incline-db', group: 'chest', equipment: 'dumbbell', also: { shoulders: 0.6, arms: 0.45 } },
  { id: 'chest-press', name: 'Chest Press', icon: 'chest-press', group: 'chest', equipment: 'machine', also: { shoulders: 0.4, arms: 0.4 } },
  { id: 'pec-deck', name: 'Pec Deck', icon: 'pec-deck', group: 'chest', equipment: 'machine', also: { shoulders: 0.25 } },
  { id: 'cable-fly', name: 'Cable Fly', icon: 'cable-fly', group: 'chest', equipment: 'cable', also: { shoulders: 0.3 } },
  { id: 'dips', name: 'Dips', icon: 'dips', group: 'chest', equipment: 'bodyweight', also: { shoulders: 0.5, arms: 0.6 } },

  // Back
  { id: 'lat-pulldown', name: 'Lat Pulldown', icon: 'pulldown', group: 'back', equipment: 'cable', also: { arms: 0.5, shoulders: 0.2 } },
  { id: 'pull-up', name: 'Pull-up', icon: 'pullup', group: 'back', equipment: 'bodyweight', also: { arms: 0.55, shoulders: 0.25, core: 0.2 } },
  { id: 'seated-row', name: 'Seated Row', icon: 'seated-row', group: 'back', equipment: 'cable', also: { arms: 0.45, shoulders: 0.2 } },
  { id: 'barbell-row', name: 'Barbell Row', icon: 'bb-row', group: 'back', equipment: 'barbell', also: { arms: 0.45, core: 0.35, legs: 0.2 } },
  { id: 'db-row', name: 'DB Row', icon: 'db-row', group: 'back', equipment: 'dumbbell', also: { arms: 0.45, core: 0.2 } },
  { id: 't-bar-row', name: 'T-Bar Row', icon: 't-bar', group: 'back', equipment: 'barbell', also: { arms: 0.45, core: 0.35 } },
  { id: 'deadlift', name: 'Deadlift', icon: 'deadlift', group: 'back', equipment: 'barbell', also: { legs: 0.7, core: 0.6, arms: 0.2 } },
  { id: 'straight-arm-pulldown', name: 'Straight-Arm Pulldown', icon: 'straight-arm', group: 'back', equipment: 'cable', also: { arms: 0.2, core: 0.2 } },

  // Legs
  { id: 'back-squat', name: 'Back Squat', icon: 'squat', group: 'legs', equipment: 'barbell', also: { core: 0.5, back: 0.4 } },
  { id: 'front-squat', name: 'Front Squat', icon: 'front-squat', group: 'legs', equipment: 'barbell', also: { core: 0.55, back: 0.35 } },
  { id: 'leg-press', name: 'Leg Press', icon: 'leg-press', group: 'legs', equipment: 'machine', also: { core: 0.1 } },
  { id: 'hack-squat', name: 'Hack Squat', icon: 'hack-squat', group: 'legs', equipment: 'machine', also: { core: 0.2 } },
  { id: 'leg-extension', name: 'Leg Extension', icon: 'leg-ext', group: 'legs', equipment: 'machine' },
  { id: 'leg-curl', name: 'Leg Curl', icon: 'leg-curl', group: 'legs', equipment: 'machine' },
  { id: 'rdl', name: 'Romanian Deadlift', icon: 'rdl', group: 'legs', equipment: 'barbell', also: { back: 0.6, core: 0.4 } },
  { id: 'hip-thrust', name: 'Hip Thrust', icon: 'hip-thrust', group: 'legs', equipment: 'barbell', also: { core: 0.3, back: 0.2 } },
  { id: 'bulgarian-split-squat', name: 'Bulgarian Split Squat', icon: 'split-squat', group: 'legs', equipment: 'dumbbell', also: { core: 0.35 } },
  { id: 'lunge', name: 'Lunge', icon: 'lunge', group: 'legs', equipment: 'dumbbell', also: { core: 0.3 } },
  { id: 'calf-raise', name: 'Calf Raise', icon: 'calf', group: 'legs', equipment: 'machine' },

  // Shoulders
  { id: 'overhead-press', name: 'Overhead Press', icon: 'ohp', group: 'shoulders', equipment: 'barbell', also: { arms: 0.5, core: 0.35, chest: 0.3 } },
  { id: 'db-shoulder-press', name: 'DB Shoulder Press', icon: 'db-ohp', group: 'shoulders', equipment: 'dumbbell', also: { arms: 0.45, core: 0.25, chest: 0.25 } },
  { id: 'lateral-raise', name: 'Lateral Raise', icon: 'lateral', group: 'shoulders', equipment: 'dumbbell' },
  { id: 'rear-delt-fly', name: 'Rear Delt Fly', icon: 'rear-delt', group: 'shoulders', equipment: 'dumbbell', also: { back: 0.35 } },
  { id: 'face-pull', name: 'Face Pull', icon: 'face-pull', group: 'shoulders', equipment: 'cable', also: { back: 0.4 } },
  { id: 'shrug', name: 'Shrug', icon: 'shrug', group: 'shoulders', equipment: 'dumbbell', also: { back: 0.35 } },

  // Arms
  { id: 'barbell-curl', name: 'Barbell Curl', icon: 'bb-curl', group: 'arms', equipment: 'barbell', also: { back: 0.15 } },
  { id: 'db-curl', name: 'DB Curl', icon: 'db-curl', group: 'arms', equipment: 'dumbbell' },
  { id: 'hammer-curl', name: 'Hammer Curl', icon: 'hammer-curl', group: 'arms', equipment: 'dumbbell' },
  { id: 'preacher-curl', name: 'Preacher Curl', icon: 'preacher', group: 'arms', equipment: 'machine' },
  { id: 'cable-curl', name: 'Cable Curl', icon: 'cable-curl', group: 'arms', equipment: 'cable' },
  { id: 'triceps-pushdown', name: 'Triceps Pushdown', icon: 'pushdown', group: 'arms', equipment: 'cable', also: { chest: 0.1 } },
  { id: 'overhead-extension', name: 'Overhead Extension', icon: 'oh-ext', group: 'arms', equipment: 'dumbbell', also: { shoulders: 0.2 } },
  { id: 'skull-crusher', name: 'Skull Crusher', icon: 'skull', group: 'arms', equipment: 'barbell', also: { shoulders: 0.15 } },

  // Core
  { id: 'hanging-leg-raise', name: 'Hanging Leg Raise', icon: 'leg-raise', group: 'core', equipment: 'bodyweight', also: { back: 0.2, arms: 0.2 } },
  { id: 'cable-crunch', name: 'Cable Crunch', icon: 'cable-crunch', group: 'core', equipment: 'cable' },
  { id: 'plank', name: 'Plank', icon: 'plank', group: 'core', equipment: 'bodyweight', also: { shoulders: 0.2 } },
  { id: 'ab-wheel', name: 'Ab Wheel', icon: 'ab-wheel', group: 'core', equipment: 'bodyweight', also: { shoulders: 0.3, back: 0.2 } },
]
