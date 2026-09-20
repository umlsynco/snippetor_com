import type { Snippet } from '../types/snippet'
import { diagramFileUrl } from '../utils/diagramFiles'
import { ArrowRightIcon, PlayIcon } from './icons'
import { UmlThumbnail } from './UmlThumbnail'

function formatDate(modified: number) {
  return new Date(modified).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

export function SnippetCard({
  snippet,
  themeSlug,
  onOpen,
}: {
  snippet: Snippet
  themeSlug: string
  onOpen: (snippet: Snippet) => void
}) {
  return (
    <div
      role="button"
      tabIndex={0}
      onClick={() => onOpen(snippet)}
      onKeyDown={(event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault()
          onOpen(snippet)
        }
      }}
      className="flex cursor-pointer flex-col rounded-xl border border-slate-200 bg-white p-6 text-left transition hover:border-slate-300 hover:shadow-md"
    >
      <div className="flex items-start justify-between gap-3">
        <h3 className="text-base font-bold text-slate-900">{snippet.title}</h3>
        <span className="shrink-0 text-xs text-slate-400">{formatDate(snippet.modified)}</span>
      </div>
      <p className="mt-2 text-sm leading-relaxed text-slate-500">{snippet.description}</p>

      <div
        className="group relative mt-4 h-40 w-full shrink-0 cursor-default overflow-hidden rounded-lg border border-slate-200 bg-slate-50"
        onClick={(event) => event.stopPropagation()}
      >
        {snippet.uml_path && <UmlThumbnail url={diagramFileUrl(themeSlug, snippet.uml_path)} />}
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="flex h-11 w-11 items-center justify-center rounded-full bg-blue-600 text-white shadow-lg transition group-hover:scale-105">
            <PlayIcon className="ml-0.5 h-5 w-5" />
          </span>
        </div>
      </div>

      <div className="mt-4 flex items-center justify-end">
        <ArrowRightIcon className="h-4 w-4 text-blue-600" />
      </div>
    </div>
  )
}
