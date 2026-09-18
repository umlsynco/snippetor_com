import { Navigate, useParams } from 'react-router-dom'
import { Breadcrumb } from '../components/Breadcrumb'
import { SnippetCard } from '../components/SnippetCard'
import { TopicGraphic } from '../components/TopicGraphic'
import { getTopic } from '../data/topics'
import { getSnippets } from '../data/snippets'
import { topicColorClasses, topicIcons } from '../utils/topicVisuals'

export function Theme() {
  const { theme } = useParams<{ theme: string }>()
  const topic = theme ? getTopic(theme) : undefined

  if (!topic) {
    return <Navigate to="/" replace />
  }

  const Icon = topicIcons[topic.icon]
  const snippets = getSnippets(topic.slug)

  return (
    <>
      <Breadcrumb current={topic.pageTitle} />

      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-6xl flex-col gap-8 px-6 py-12 md:flex-row md:items-center md:justify-between">
          <div className="flex items-start gap-5">
            <div className={`flex h-16 w-16 shrink-0 items-center justify-center rounded-xl ${topicColorClasses[topic.color]}`}>
              <Icon className="h-7 w-7" />
            </div>
            <div>
              <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">{topic.pageTitle}</h1>
              <p className="mt-2 max-w-xl text-slate-600">{topic.pageDescription}</p>
            </div>
          </div>

          <div className="flex items-center gap-6">
            <TopicGraphic color={topic.color} />
            <p className="max-w-[10rem] text-right text-sm italic leading-snug text-slate-400">&ldquo;{topic.quote}&rdquo;</p>
          </div>
        </div>
      </section>

      <section className="bg-white">
        <div className="mx-auto max-w-6xl px-6 py-12">
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
            {snippets.map((snippet) => (
              <SnippetCard key={snippet.snippet_path} snippet={snippet} />
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
