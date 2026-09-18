import { Link } from 'react-router-dom'
import type { Topic } from '../data/topics'
import { topicColorClasses, topicIcons } from '../utils/topicVisuals'
import { ArrowRightIcon } from './icons'

export function TopicCard({ topic }: { topic: Topic }) {
  const Icon = topicIcons[topic.icon]

  return (
    <Link
      to={`/${topic.slug}`}
      className="group flex flex-col rounded-xl border border-slate-200 bg-white p-6 transition hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-md"
    >
      <div className={`mb-4 flex h-11 w-11 items-center justify-center rounded-lg ${topicColorClasses[topic.color]}`}>
        <Icon className="h-5 w-5" />
      </div>
      <h3 className="text-base font-bold text-slate-900">{topic.title}</h3>
      <p className="mt-2 flex-1 text-sm leading-relaxed text-slate-500">{topic.description}</p>
      <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-blue-600">
        View snippets ({topic.count})
        <ArrowRightIcon className="h-4 w-4 transition group-hover:translate-x-0.5" />
      </span>
    </Link>
  )
}
