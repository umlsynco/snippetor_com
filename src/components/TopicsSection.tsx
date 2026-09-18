import { topics } from '../data/topics'
import { TopicCard } from './TopicCard'

export function TopicsSection() {
  return (
    <section className="bg-white">
      <div className="mx-auto max-w-6xl px-6 py-16">
        <div className="mb-10 flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">Browse Topics</h2>
            <p className="mt-1 text-slate-500">Select a topic to explore my snippets.</p>
          </div>
          <p className="max-w-xs text-right text-sm italic leading-relaxed text-slate-400">
            &ldquo;The best way to understand a large codebase is to leave a trail for your future self.&rdquo;
          </p>
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {topics.map((topic) => (
            <TopicCard key={topic.slug} topic={topic} />
          ))}
        </div>
      </div>
    </section>
  )
}
