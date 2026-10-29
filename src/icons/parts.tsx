import type { JSX } from 'react'

/**
 * Drawing parts for the right-hand column of an exercise icon. The 24x24 grid
 * is split in two: the muscle map owns x 0-15 (see body.tsx), and this column
 * owns x 16-23.6 — a movement cue on top (y 1-10.5) and an equipment mark
 * below (y 13-22.5).
 *
 * Cues share one convention: the body sits to the left, so an arrow pointing
 * right is a push away from it and an arrow pointing left is a pull toward it.
 */
const CX = 19.8

type Pt = [number, number]

const rad = (deg: number) => (deg * Math.PI) / 180

/** Chevron at `tip`, pointing in direction `deg` (0 = right, 90 = down). */
function Tip({ at, deg }: { at: Pt; deg: number }): JSX.Element {
  const [x, y] = at
  const back = (off: number) =>
    `${x - 1.7 * Math.cos(rad(deg + off))},${y - 1.7 * Math.sin(rad(deg + off))}`
  return <polyline points={`${back(-38)} ${x},${y} ${back(38)}`} />
}

export function Arrow({ from, to, both }: { from: Pt; to: Pt; both?: boolean }): JSX.Element {
  const deg = (Math.atan2(to[1] - from[1], to[0] - from[0]) * 180) / Math.PI
  return (
    <>
      <line x1={from[0]} y1={from[1]} x2={to[0]} y2={to[1]} />
      <Tip at={to} deg={deg} />
      {both && <Tip at={from} deg={deg + 180} />}
    </>
  )
}

/** Circular arc from angle `a0` to `a1` (degrees, screen space), head at `a1`. */
export function Arc({ c, r, a0, a1 }: { c: Pt; r: number; a0: number; a1: number }): JSX.Element {
  const p = (a: number): Pt => [c[0] + r * Math.cos(rad(a)), c[1] + r * Math.sin(rad(a))]
  const [s, e] = [p(a0), p(a1)]
  const cw = a1 > a0
  const large = Math.abs(a1 - a0) > 180 ? 1 : 0
  return (
    <>
      <path d={`M${s[0]} ${s[1]} A${r} ${r} 0 ${large} ${cw ? 1 : 0} ${e[0]} ${e[1]}`} />
      <Tip at={e} deg={a1 + (cw ? 90 : -90)} />
    </>
  )
}

// ------------------------------------------------------------------- cues

export const Up = () => <Arrow from={[CX, 9.8]} to={[CX, 1.4]} />
export const Down = () => <Arrow from={[CX, 1.4]} to={[CX, 9.8]} />
export const Push = ({ y = 5.6 }: { y?: number }) => <Arrow from={[16.4, y]} to={[23.2, y]} />
export const Pull = ({ y = 5.6 }: { y?: number }) => <Arrow from={[23.2, y]} to={[16.4, y]} />
export const UpDown = ({ x = CX }: { x?: number }) => <Arrow from={[x, 1.4]} to={[x, 9.8]} both />

/** Flat bench with the press going straight up off it. */
export const FlatBench = () => (
  <>
    <line x1="16.4" y1="9.2" x2="23.2" y2="9.2" />
    <line x1="17.4" y1="9.2" x2="17.4" y2="11" />
    <line x1="22.2" y1="9.2" x2="22.2" y2="11" />
    <Arrow from={[CX, 7.2]} to={[CX, 1.2]} />
  </>
)

/** The tilt bar: an inclined bench, with the press following it. */
export const InclineBench = () => (
  <>
    <line x1="16.4" y1="10.6" x2="22.8" y2="5.6" />
    <Arrow from={[18.2, 6.6]} to={[21.4, 1.2]} />
  </>
)

/** Two arms closing toward the midline: pec deck, cable fly. */
export const FlyIn = () => (
  <>
    <Arc c={[CX, 8.6]} r={3.6} a0={-172} a1={-104} />
    <Arc c={[CX, 8.6]} r={3.6} a0={-8} a1={-76} />
  </>
)

/** Two arms opening away from the midline: rear delt fly. */
export const FlyOut = () => (
  <>
    <Arc c={[CX, 8.6]} r={3.6} a0={-100} a1={-170} />
    <Arc c={[CX, 8.6]} r={3.6} a0={-80} a1={-10} />
  </>
)

/** Elbow at bottom left, hand sweeping up toward the shoulder. */
export const Curl = () => <Arc c={[17, 9.6]} r={6} a0={0} a1={-88} />
/** The same joint, straightening. */
export const Extend = () => <Arc c={[17, 9.6]} r={6} a0={-90} a1={-2} />

export const Hinge = () => <Arc c={[23, 9.6]} r={6} a0={180} a1={272} />

/** Arm rising out to the side. */
export const Raise = () => <Arc c={[17, 2.4]} r={6.6} a0={88} a1={8} />

export const Crunch = () => <Arc c={[23, 9.2]} r={6} a0={-92} a1={-178} />

/** Overhead bar: pull-ups and hanging work. */
export const HangBar = () => <line x1="16.2" y1="1.4" x2="23.4" y2="1.4" />

/** Legs swinging up from a hang. */
export const LegSwing = () => <Arc c={[23.6, 10.4]} r={5.6} a0={180} a1={262} />

/** Bar starting end-on at the floor, lifted straight up. */
export const FromFloor = () => (
  <>
    <circle cx={CX} cy="8.4" r="1.9" />
    <Arrow from={[CX, 6]} to={[CX, 1]} />
  </>
)

/** Hips lifting into a bridge. */
export const Bridge = () => (
  <>
    <path d="M16.4 10.4 Q19.8 3.6 23.2 10.4" />
    <Arrow from={[CX, 9.4]} to={[CX, 4.8]} />
  </>
)

/** Up onto the toes off a step. */
export const Tiptoe = () => (
  <>
    <rect x="17" y="8.6" width="5.6" height="1.8" rx="0.4" />
    <Arrow from={[CX, 6.8]} to={[CX, 1.4]} />
  </>
)

/** Shoulders lifting straight up. */
export const Shrug = () => (
  <>
    <Arrow from={[17.6, 9.4]} to={[17.6, 3]} />
    <Arrow from={[22, 9.4]} to={[22, 3]} />
  </>
)

/** Parallel bars, body lowering between them. */
export const Dip = () => (
  <>
    <line x1="16.4" y1="3.4" x2="16.4" y2="10.6" />
    <line x1="23.2" y1="3.4" x2="23.2" y2="10.6" />
    <UpDown />
  </>
)

/** Held, not moved. */
export const Hold = () => (
  <>
    <circle cx={CX} cy="6.2" r="3.7" />
    <line x1={CX} y1="6.2" x2={CX} y2="4" />
    <line x1={CX} y1="6.2" x2={CX + 1.5} y2="7.2" />
    <line x1={CX - 1} y1="1" x2={CX + 1} y2="1" />
  </>
)

/** A filled marker, used where the only difference is where the bar sits. */
export const Dot = ({ x, y }: { x: number; y: number }) => (
  <circle cx={x} cy={y} r="1.1" fill="currentColor" stroke="none" />
)

// -------------------------------------------------------------- equipment

const Plate = ({ x, y, w, h }: { x: number; y: number; w: number; h: number }) => (
  <rect x={x} y={y} width={w} height={h} rx="0.4" fill="currentColor" stroke="none" />
)

export const Barbell = () => (
  <>
    <line x1="16" y1="18" x2="23.6" y2="18" />
    <Plate x={16.7} y={15.4} w={1.5} h={5.2} />
    <Plate x={21.4} y={15.4} w={1.5} h={5.2} />
  </>
)

export const Dumbbell = () => (
  <>
    <line x1="17.6" y1="18" x2="22" y2="18" />
    <Plate x={16.6} y={16} w={1.6} h={4} />
    <Plate x={21.4} y={16} w={1.6} h={4} />
  </>
)

/** Dumbbell held neutral, thumbs up: hammer curls. */
export const DumbbellV = () => (
  <>
    <line x1={CX} y1="15.6" x2={CX} y2="20.4" />
    <Plate x={CX - 2} y={14} w={4} h={1.6} />
    <Plate x={CX - 2} y={20.4} w={4} h={1.6} />
  </>
)

export const Machine = () => (
  <>
    <rect x="17.4" y="13.4" width="4.8" height="9" rx="0.8" />
    <line x1="18.2" y1="16.4" x2="21.4" y2="16.4" />
    <line x1="18.2" y1="19.4" x2="21.4" y2="19.4" />
  </>
)

export const Cable = () => (
  <>
    <circle cx={CX} cy="14.6" r="1.6" />
    <line x1={CX} y1="16.2" x2={CX} y2="21" />
    <line x1={CX - 2.2} y1="21" x2={CX + 2.2} y2="21" />
  </>
)

export const Wheel = () => (
  <>
    <circle cx={CX} cy="18" r="3.4" />
    <circle cx={CX} cy="18" r="0.7" fill="currentColor" stroke="none" />
    <line x1="16" y1="18" x2="23.6" y2="18" />
  </>
)
