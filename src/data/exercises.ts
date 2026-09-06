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
  { id: 'bench-press', name: 'Bench Press', icon: 'bench', group: 'chest', equipment: 'barbell' },
  { id: 'incline-bench', name: 'Incline Bench', icon: 'incline', group: 'chest', equipment: 'barbell' },
  { id: 'db-press', name: 'DB Bench Press', icon: 'db-press', group: 'chest', equipment: 'dumbbell' },
  { id: 'incline-db-press', name: 'Incline DB Press', icon: 'incline-db', group: 'chest', equipment: 'dumbbell' },
  { id: 'chest-press', name: 'Chest Press', icon: 'chest-press', group: 'chest', equipment: 'machine' },
  { id: 'pec-deck', name: 'Pec Deck', icon: 'pec-deck', group: 'chest', equipment: 'machine' },
  { id: 'cable-fly', name: 'Cable Fly', icon: 'cable-fly', group: 'chest', equipment: 'cable' },
  { id: 'dips', name: 'Dips', icon: 'dips', group: 'chest', equipment: 'bodyweight' },

  // Back
  { id: 'lat-pulldown', name: 'Lat Pulldown', icon: 'pulldown', group: 'back', equipment: 'cable' },
  { id: 'pull-up', name: 'Pull-up', icon: 'pullup', group: 'back', equipment: 'bodyweight' },
  { id: 'seated-row', name: 'Seated Row', icon: 'seated-row', group: 'back', equipment: 'cable' },
  { id: 'barbell-row', name: 'Barbell Row', icon: 'bb-row', group: 'back', equipment: 'barbell' },
  { id: 'db-row', name: 'DB Row', icon: 'db-row', group: 'back', equipment: 'dumbbell' },
  { id: 't-bar-row', name: 'T-Bar Row', icon: 't-bar', group: 'back', equipment: 'barbell' },
  { id: 'deadlift', name: 'Deadlift', icon: 'deadlift', group: 'back', equipment: 'barbell' },
  { id: 'straight-arm-pulldown', name: 'Straight-Arm Pulldown', icon: 'straight-arm', group: 'back', equipment: 'cable' },

  // Legs
  { id: 'back-squat', name: 'Back Squat', icon: 'squat', group: 'legs', equipment: 'barbell' },
  { id: 'front-squat', name: 'Front Squat', icon: 'front-squat', group: 'legs', equipment: 'barbell' },
  { id: 'leg-press', name: 'Leg Press', icon: 'leg-press', group: 'legs', equipment: 'machine' },
  { id: 'hack-squat', name: 'Hack Squat', icon: 'hack-squat', group: 'legs', equipment: 'machine' },
  { id: 'leg-extension', name: 'Leg Extension', icon: 'leg-ext', group: 'legs', equipment: 'machine' },
  { id: 'leg-curl', name: 'Leg Curl', icon: 'leg-curl', group: 'legs', equipment: 'machine' },
  { id: 'rdl', name: 'Romanian Deadlift', icon: 'rdl', group: 'legs', equipment: 'barbell' },
  { id: 'hip-thrust', name: 'Hip Thrust', icon: 'hip-thrust', group: 'legs', equipment: 'barbell' },
  { id: 'bulgarian-split-squat', name: 'Bulgarian Split Squat', icon: 'split-squat', group: 'legs', equipment: 'dumbbell' },
  { id: 'lunge', name: 'Lunge', icon: 'lunge', group: 'legs', equipment: 'dumbbell' },
  { id: 'calf-raise', name: 'Calf Raise', icon: 'calf', group: 'legs', equipment: 'machine' },

  // Shoulders
  { id: 'overhead-press', name: 'Overhead Press', icon: 'ohp', group: 'shoulders', equipment: 'barbell' },
  { id: 'db-shoulder-press', name: 'DB Shoulder Press', icon: 'db-ohp', group: 'shoulders', equipment: 'dumbbell' },
  { id: 'lateral-raise', name: 'Lateral Raise', icon: 'lateral', group: 'shoulders', equipment: 'dumbbell' },
  { id: 'rear-delt-fly', name: 'Rear Delt Fly', icon: 'rear-delt', group: 'shoulders', equipment: 'dumbbell' },
  { id: 'face-pull', name: 'Face Pull', icon: 'face-pull', group: 'shoulders', equipment: 'cable' },
  { id: 'shrug', name: 'Shrug', icon: 'shrug', group: 'shoulders', equipment: 'dumbbell' },

  // Arms
  { id: 'barbell-curl', name: 'Barbell Curl', icon: 'bb-curl', group: 'arms', equipment: 'barbell' },
  { id: 'db-curl', name: 'DB Curl', icon: 'db-curl', group: 'arms', equipment: 'dumbbell' },
  { id: 'hammer-curl', name: 'Hammer Curl', icon: 'hammer-curl', group: 'arms', equipment: 'dumbbell' },
  { id: 'preacher-curl', name: 'Preacher Curl', icon: 'preacher', group: 'arms', equipment: 'machine' },
  { id: 'cable-curl', name: 'Cable Curl', icon: 'cable-curl', group: 'arms', equipment: 'cable' },
  { id: 'triceps-pushdown', name: 'Triceps Pushdown', icon: 'pushdown', group: 'arms', equipment: 'cable' },
  { id: 'overhead-extension', name: 'Overhead Extension', icon: 'oh-ext', group: 'arms', equipment: 'dumbbell' },
  { id: 'skull-crusher', name: 'Skull Crusher', icon: 'skull', group: 'arms', equipment: 'barbell' },

  // Core
  { id: 'hanging-leg-raise', name: 'Hanging Leg Raise', icon: 'leg-raise', group: 'core', equipment: 'bodyweight' },
  { id: 'cable-crunch', name: 'Cable Crunch', icon: 'cable-crunch', group: 'core', equipment: 'cable' },
  { id: 'plank', name: 'Plank', icon: 'plank', group: 'core', equipment: 'bodyweight' },
  { id: 'ab-wheel', name: 'Ab Wheel', icon: 'ab-wheel', group: 'core', equipment: 'bodyweight' },
]
