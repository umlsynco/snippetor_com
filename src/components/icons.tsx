import type { SVGProps } from 'react'

type IconProps = SVGProps<SVGSVGElement>

const base = {
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.8,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
}

export function LayersIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <rect x="4" y="4" width="12" height="12" rx="2.5" />
      <path d="M8 20h12a2 2 0 0 0 2-2V8" />
    </svg>
  )
}

export function PuzzleIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M8 4h4a1.5 1.5 0 0 1 0 3 1.5 1.5 0 0 0 0 3h4a1 1 0 0 1 1 1v4a1.5 1.5 0 0 1-3 0 1.5 1.5 0 0 0-3 0v4a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1v-4a1.5 1.5 0 0 1 3 0 1.5 1.5 0 0 0 0-3H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h3z" />
    </svg>
  )
}

export function UserIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <circle cx="12" cy="8" r="3.5" />
      <path d="M5 20c0-3.5 3-6 7-6s7 2.5 7 6" />
    </svg>
  )
}

export function ClipboardIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <rect x="6" y="4" width="10" height="15" rx="2" />
      <rect x="9" y="2.5" width="4" height="3" rx="1" />
      <path d="M17 8h1a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-9" />
    </svg>
  )
}

export function GlobeIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M3.5 12h17M12 3.5c2.5 2.3 3.8 5.3 3.8 8.5s-1.3 6.2-3.8 8.5c-2.5-2.3-3.8-5.3-3.8-8.5S9.5 5.8 12 3.5Z" />
    </svg>
  )
}

export function ShieldIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M12 3.5 19 6v5.5c0 4.5-3 7.7-7 9-4-1.3-7-4.5-7-9V6l7-2.5Z" />
      <path d="M9 12l2 2 4-4.5" />
    </svg>
  )
}

export function WindowIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <rect x="3" y="4.5" width="18" height="15" rx="2" />
      <path d="M3 9h18" />
      <circle cx="6" cy="6.75" r="0.6" fill="currentColor" stroke="none" />
      <circle cx="8.2" cy="6.75" r="0.6" fill="currentColor" stroke="none" />
    </svg>
  )
}

export function GithubIcon(props: IconProps) {
  return (
    <svg {...base} strokeWidth={1.6} {...props}>
      <path d="M12 2.5a9.5 9.5 0 0 0-3 18.52c.48.09.65-.21.65-.46v-1.7c-2.64.57-3.2-1.27-3.2-1.27-.43-1.1-1.06-1.4-1.06-1.4-.87-.6.07-.58.07-.58.96.07 1.47.99 1.47.99.85 1.47 2.24 1.04 2.79.8.09-.62.34-1.05.61-1.29-2.11-.24-4.33-1.06-4.33-4.7 0-1.04.37-1.89.98-2.55-.1-.24-.43-1.22.09-2.54 0 0 .8-.26 2.62.98a9.03 9.03 0 0 1 4.77 0c1.82-1.24 2.62-.98 2.62-.98.52 1.32.19 2.3.1 2.54.6.66.98 1.51.98 2.55 0 3.65-2.23 4.45-4.35 4.69.35.3.65.88.65 1.78v2.64c0 .25.17.56.66.46A9.5 9.5 0 0 0 12 2.5Z" />
    </svg>
  )
}

export function ArrowRightIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M4 12h16M13 6l6 6-6 6" />
    </svg>
  )
}
