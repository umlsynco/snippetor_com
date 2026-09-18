import type { TopicColor } from '../data/topics'
import {
  ClipboardIcon,
  GlobeIcon,
  LayersIcon,
  PuzzleIcon,
  ShieldIcon,
  UserIcon,
  WindowIcon,
} from '../components/icons'

export const topicIcons = {
  layers: LayersIcon,
  puzzle: PuzzleIcon,
  user: UserIcon,
  clipboard: ClipboardIcon,
  globe: GlobeIcon,
  shield: ShieldIcon,
  window: WindowIcon,
}

export const topicColorClasses: Record<TopicColor, string> = {
  blue: 'bg-blue-50 text-blue-600',
  green: 'bg-emerald-50 text-emerald-600',
  purple: 'bg-violet-50 text-violet-600',
  orange: 'bg-orange-50 text-orange-600',
  red: 'bg-red-50 text-red-600',
  sky: 'bg-sky-50 text-sky-600',
  teal: 'bg-teal-50 text-teal-600',
}

export const topicOutlineClasses: Record<TopicColor, string> = {
  blue: 'text-blue-200 border-blue-200',
  green: 'text-emerald-200 border-emerald-200',
  purple: 'text-violet-200 border-violet-200',
  orange: 'text-orange-200 border-orange-200',
  red: 'text-red-200 border-red-200',
  sky: 'text-sky-200 border-sky-200',
  teal: 'text-teal-200 border-teal-200',
}
