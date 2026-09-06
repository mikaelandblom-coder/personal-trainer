import type { JSX } from 'react'

/**
 * Shared pictogram parts. Everything is drawn on a 24x24 grid with the
 * "floor" at y=21, so exercises read consistently across the set.
 *
 * Props accept the JSX-friendly `"5.5"` form as well as numbers; `n()`
 * normalises before any arithmetic.
 */
type N = number | string
const n = (v: N) => (typeof v === 'number' ? v : Number(v))

export function Bar({ y, x1 = 2.5, x2 = 21.5 }: { y: N; x1?: N; x2?: N }): JSX.Element {
  const [Y, A, B] = [n(y), n(x1), n(x2)]
  return (
    <>
      <line x1={A} y1={Y} x2={B} y2={Y} />
      <rect x={A + 0.8} y={Y - 2.4} width="1.5" height="4.8" rx="0.5" fill="currentColor" stroke="none" />
      <rect x={B - 2.3} y={Y - 2.4} width="1.5" height="4.8" rx="0.5" fill="currentColor" stroke="none" />
    </>
  )
}

/** Barbell seen end-on with big floor plates, e.g. deadlift. */
export function PlatedBar({ y }: { y: N }): JSX.Element {
  const Y = n(y)
  return (
    <>
      <line x1="5" y1={Y} x2="19" y2={Y} />
      <circle cx="4.2" cy={Y} r="3.1" />
      <circle cx="19.8" cy={Y} r="3.1" />
    </>
  )
}

export function DB({ cx, cy, w = 4.4 }: { cx: N; cy: N; w?: N }): JSX.Element {
  const [X, Y, W] = [n(cx), n(cy), n(w)]
  return (
    <>
      <line x1={X - W / 2} y1={Y} x2={X + W / 2} y2={Y} />
      <rect x={X - W / 2 - 1.2} y={Y - 1.9} width="1.4" height="3.8" rx="0.4" fill="currentColor" stroke="none" />
      <rect x={X + W / 2 - 0.2} y={Y - 1.9} width="1.4" height="3.8" rx="0.4" fill="currentColor" stroke="none" />
    </>
  )
}

/** Dumbbell held vertically, e.g. hammer curl. */
export function DBv({ cx, cy, h = 4.4 }: { cx: N; cy: N; h?: N }): JSX.Element {
  const [X, Y, H] = [n(cx), n(cy), n(h)]
  return (
    <>
      <line x1={X} y1={Y - H / 2} x2={X} y2={Y + H / 2} />
      <rect x={X - 1.9} y={Y - H / 2 - 1.4} width="3.8" height="1.4" rx="0.4" fill="currentColor" stroke="none" />
      <rect x={X - 1.9} y={Y + H / 2} width="3.8" height="1.4" rx="0.4" fill="currentColor" stroke="none" />
    </>
  )
}

export function Head({ cx, cy, r = 1.5 }: { cx: N; cy: N; r?: N }): JSX.Element {
  return <circle cx={n(cx)} cy={n(cy)} r={n(r)} />
}

/** Weight stack for machine/cable exercises. */
export function Stack({ x, y = 7, h = 11 }: { x: N; y?: N; h?: N }): JSX.Element {
  const [X, Y, H] = [n(x), n(y), n(h)]
  return (
    <>
      <rect x={X} y={Y} width="4.2" height={H} rx="0.8" />
      <line x1={X + 0.6} y1={Y + H * 0.33} x2={X + 3.6} y2={Y + H * 0.33} />
      <line x1={X + 0.6} y1={Y + H * 0.62} x2={X + 3.6} y2={Y + H * 0.62} />
    </>
  )
}

export function Floor({ y = 21, x1 = 2, x2 = 22 }: { y?: N; x1?: N; x2?: N }): JSX.Element {
  return <line x1={n(x1)} y1={n(y)} x2={n(x2)} y2={n(y)} opacity="0.45" />
}

/** Small motion arrow, used to disambiguate otherwise similar postures. */
export function ArrowUp({ x, y, len = 3 }: { x: N; y: N; len?: N }): JSX.Element {
  const [X, Y, L] = [n(x), n(y), n(len)]
  return (
    <>
      <line x1={X} y1={Y} x2={X} y2={Y - L} />
      <polyline points={`${X - 1.1},${Y - L + 1.2} ${X},${Y - L} ${X + 1.1},${Y - L + 1.2}`} />
    </>
  )
}

export function ArrowRight({ x, y, len = 3 }: { x: N; y: N; len?: N }): JSX.Element {
  const [X, Y, L] = [n(x), n(y), n(len)]
  return (
    <>
      <line x1={X} y1={Y} x2={X + L} y2={Y} />
      <polyline points={`${X + L - 1.2},${Y - 1.1} ${X + L},${Y} ${X + L - 1.2},${Y + 1.1}`} />
    </>
  )
}

export function ArrowDown({ x, y, len = 3 }: { x: N; y: N; len?: N }): JSX.Element {
  const [X, Y, L] = [n(x), n(y), n(len)]
  return (
    <>
      <line x1={X} y1={Y} x2={X} y2={Y + L} />
      <polyline points={`${X - 1.1},${Y + L - 1.2} ${X},${Y + L} ${X + 1.1},${Y + L - 1.2}`} />
    </>
  )
}
