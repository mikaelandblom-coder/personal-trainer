const base = {
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.7,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
  'aria-hidden': true,
}

export const Back = ({ s = 22 }: { s?: number }) => (
  <svg {...base} width={s} height={s}>
    <polyline points="14.5,5 7.5,12 14.5,19" />
  </svg>
)

export const Dumbbells = ({ s = 21 }: { s?: number }) => (
  <svg {...base} width={s} height={s}>
    <line x1="7" y1="12" x2="17" y2="12" />
    <rect x="3" y="8.5" width="3" height="7" rx="1" />
    <rect x="18" y="8.5" width="3" height="7" rx="1" />
  </svg>
)

export const Chart = ({ s = 21 }: { s?: number }) => (
  <svg {...base} width={s} height={s}>
    <polyline points="4,16 9.5,10.5 13.5,14 20,6.5" />
    <polyline points="16.5,6.5 20,6.5 20,10" />
  </svg>
)

export const Gear = ({ s = 21 }: { s?: number }) => (
  <svg {...base} width={s} height={s}>
    <circle cx="12" cy="12" r="3.1" />
    <path d="M12 3.5v2.2M12 18.3v2.2M20.5 12h-2.2M5.7 12H3.5M18 6l-1.6 1.6M7.6 16.4 6 18M18 18l-1.6-1.6M7.6 7.6 6 6" />
  </svg>
)

export const Plus = ({ s = 22 }: { s?: number }) => (
  <svg {...base} width={s} height={s}>
    <line x1="12" y1="5.5" x2="12" y2="18.5" />
    <line x1="5.5" y1="12" x2="18.5" y2="12" />
  </svg>
)

export const Minus = ({ s = 22 }: { s?: number }) => (
  <svg {...base} width={s} height={s}>
    <line x1="5.5" y1="12" x2="18.5" y2="12" />
  </svg>
)

export const Trash = ({ s = 19 }: { s?: number }) => (
  <svg {...base} width={s} height={s}>
    <path d="M4.5 6.5h15M9.5 6.5V4.8h5v1.7M6.8 6.5l.9 12.2h8.6l.9-12.2" />
  </svg>
)

export const Flag = ({ s = 19 }: { s?: number }) => (
  <svg {...base} width={s} height={s}>
    <line x1="6.5" y1="3.8" x2="6.5" y2="20.2" />
    <path d="M6.5 5h10l-2.2 3.6L16.5 12h-10z" />
  </svg>
)

export const Cloud = ({ s = 21 }: { s?: number }) => (
  <svg {...base} width={s} height={s}>
    <path d="M6.8 18.5a3.8 3.8 0 0 1-.4-7.6 5.2 5.2 0 0 1 10.1-1.2 3.9 3.9 0 0 1 .4 8.8z" />
  </svg>
)
