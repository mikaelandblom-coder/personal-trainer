import { GLYPHS } from './glyphs'

/** Fallback for custom exercises whose icon key isn't in the set. */
function Generic() {
  return (
    <>
      <line x1="4" y1="12" x2="20" y2="12" />
      <rect x="5" y="9" width="2" height="6" rx="0.6" fill="currentColor" stroke="none" />
      <rect x="17" y="9" width="2" height="6" rx="0.6" fill="currentColor" stroke="none" />
    </>
  )
}

export function ExerciseIcon({ name, size = 34 }: { name: string; size?: number }) {
  const Glyph = GLYPHS[name] ?? Generic
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill="none"
      stroke="currentColor"
      strokeWidth={1.4}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      <Glyph />
    </svg>
  )
}

export const ICON_KEYS = Object.keys(GLYPHS)
