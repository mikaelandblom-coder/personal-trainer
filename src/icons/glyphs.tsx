import type { JSX } from 'react'
import {
  Arrow,
  Barbell,
  Bridge,
  Cable,
  Crunch,
  Curl,
  Dip,
  Dot,
  Down,
  Dumbbell,
  DumbbellV,
  Extend,
  FlatBench,
  FlyIn,
  FlyOut,
  FromFloor,
  HangBar,
  Hinge,
  Hold,
  InclineBench,
  LegSwing,
  Machine,
  Pull,
  Push,
  Raise,
  Shrug,
  Tiptoe,
  Up,
  UpDown,
  Wheel,
} from './parts'

/**
 * The right-hand column of each icon: how the weight moves, and with what.
 * The muscle map beside it comes from the exercise's load data, so these only
 * need to separate exercises that train the same muscles — bench from incline,
 * row from pulldown, curl from extension.
 */
export const GLYPHS: Record<string, () => JSX.Element> = {
  // ---------------------------------------------------------------- chest
  bench: () => (<><FlatBench /><Barbell /></>),
  incline: () => (<><InclineBench /><Barbell /></>),
  'db-press': () => (<><FlatBench /><Dumbbell /></>),
  'incline-db': () => (<><InclineBench /><Dumbbell /></>),
  'chest-press': () => (<><Push /><Machine /></>),
  'pec-deck': () => (<><FlyIn /><Machine /></>),
  'cable-fly': () => (<><FlyIn /><Cable /></>),
  dips: () => <Dip />,

  // ----------------------------------------------------------------- back
  pulldown: () => (<><Down /><Cable /></>),
  pullup: () => (<><HangBar /><Arrow from={[19.8, 10.4]} to={[19.8, 3.4]} /></>),
  'seated-row': () => (<><Pull /><Cable /></>),
  'bb-row': () => (<><Pull /><Barbell /></>),
  'db-row': () => (<><Pull /><Dumbbell /></>),
  't-bar': () => (
    <>
      <circle cx="22.8" cy="9.8" r="0.9" fill="currentColor" stroke="none" />
      <line x1="22.8" y1="9.8" x2="17" y2="3" />
      <line x1="15.9" y1="4.2" x2="18.1" y2="1.8" />
      <Barbell />
    </>
  ),
  deadlift: () => (<><FromFloor /><Barbell /></>),
  'straight-arm': () => (<><Extend /><Cable /></>),

  // ----------------------------------------------------------------- legs
  squat: () => (<><UpDown /><Dot x={22.6} y={2.2} /><Barbell /></>),
  'front-squat': () => (<><UpDown /><Dot x={17} y={2.2} /><Barbell /></>),
  'leg-press': () => (<><Arrow from={[16.6, 10]} to={[23, 3.2]} /><Machine /></>),
  'hack-squat': () => (<><UpDown /><Machine /></>),
  'leg-ext': () => (<><Extend /><Machine /></>),
  'leg-curl': () => (<><Curl /><Machine /></>),
  rdl: () => (<><Hinge /><Barbell /></>),
  'hip-thrust': () => (<><Bridge /><Barbell /></>),
  'split-squat': () => (
    <>
      <UpDown x={18.2} />
      <rect x="21.2" y="7.4" width="2.2" height="3" rx="0.4" />
      <Dumbbell />
    </>
  ),
  lunge: () => (<><Arrow from={[16.8, 2.4]} to={[22.8, 9.4]} /><Dumbbell /></>),
  calf: () => (<><Tiptoe /><Machine /></>),

  // ------------------------------------------------------------ shoulders
  ohp: () => (<><Up /><Barbell /></>),
  'db-ohp': () => (<><Up /><Dumbbell /></>),
  lateral: () => (<><Raise /><Dumbbell /></>),
  'rear-delt': () => (<><FlyOut /><Dumbbell /></>),
  'face-pull': () => (<><Pull y={2.8} /><Cable /></>),
  shrug: () => (<><Shrug /><Dumbbell /></>),

  // ----------------------------------------------------------------- arms
  'bb-curl': () => (<><Curl /><Barbell /></>),
  'db-curl': () => (<><Curl /><Dumbbell /></>),
  'hammer-curl': () => (<><Curl /><DumbbellV /></>),
  preacher: () => (
    <>
      <Curl />
      <line x1="16.2" y1="11.2" x2="21.4" y2="7.6" />
      <Machine />
    </>
  ),
  'cable-curl': () => (<><Curl /><Cable /></>),
  pushdown: () => (<><Down /><Cable /></>),
  'oh-ext': () => (<><Extend /><Dumbbell /></>),
  skull: () => (<><Extend /><Barbell /></>),

  // ----------------------------------------------------------------- core
  'leg-raise': () => (<><HangBar /><LegSwing /></>),
  'cable-crunch': () => (<><Crunch /><Cable /></>),
  plank: () => <Hold />,
  'ab-wheel': () => (<><Push y={8} /><Wheel /></>),

  // ----------------------------------------------------------- activities
  badminton: () => (
    <>
      <path d="M17.4 3.4 L19.8 9.8 L22.2 3.4 Z" />
      <line x1="18.6" y1="6.6" x2="21" y2="6.6" />
      <circle cx="19.8" cy="11.2" r="1.4" fill="currentColor" stroke="none" />
      <ellipse cx="19.8" cy="17" rx="2.6" ry="3.2" />
      <line x1="19.8" y1="20.2" x2="19.8" y2="23" />
    </>
  ),
  cycling: () => (
    <>
      <circle cx="17.6" cy="15.6" r="2" />
      <circle cx="22" cy="15.6" r="2" />
      <polyline points="17.6,15.6 19.2,11.8 22,15.6" />
      <line x1="18.4" y1="11" x2="20" y2="11" />
    </>
  ),
  cardio: () => (
    <polyline points="16,12 17.6,12 18.6,8.6 20,16 21.2,10.4 22,12 23.6,12" />
  ),
}

