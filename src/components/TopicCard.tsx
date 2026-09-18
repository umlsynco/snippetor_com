import type { Topic, TopicColor } from '../data/topics'
import {
  ArrowRightIcon,
  ClipboardIcon,
  GlobeIcon,
  LayersIcon,
  PuzzleIcon,
  ShieldIcon,
  UserIcon,
  WindowIcon,
} from './icons'

const icons = {
  layers: LayersIcon,
  puzzle: PuzzleIcon,
  user: UserIcon,
  clipboard: ClipboardIcon,
  globe: GlobeIcon,
  shield: ShieldIcon,
  window: WindowIcon,
}

const colorClasses: Record<TopicColor, string> = {
  blue: 'bg-blue-50 text-blue-600',
  green: 'bg-emerald-50 text-emerald-600',
  purple: 'bg-violet-50 text-violet-600',
  orange: 'bg-orange-50 text-orange-600',
  red: 'bg-red-50 text-red-600',
  sky: 'bg-sky-50 text-sky-600',
  teal: 'bg-teal-50 text-teal-600',
}

export function TopicCard({ topic }: { topic: Topic }) {
  const Icon = icons[topic.icon]

  return (
    <a
      href={`#${topic.slug}`}
      className="group flex flex-col rounded-xl border border-slate-200 bg-white p-6 transition hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-md"
    >
      <div className={`mb-4 flex h-11 w-11 items-center justify-center rounded-lg ${colorClasses[topic.color]}`}>
        <Icon className="h-5 w-5" />
      </div>
      <h3 className="text-base font-bold text-slate-900">{topic.title}</h3>
      <p className="mt-2 flex-1 text-sm leading-relaxed text-slate-500">{topic.description}</p>
      <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-blue-600">
        View snippets ({topic.count})
        <ArrowRightIcon className="h-4 w-4 transition group-hover:translate-x-0.5" />
      </span>
    </a>
  )
}
