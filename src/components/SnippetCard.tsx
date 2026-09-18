import type { Snippet } from '../types/snippet'
import { ArrowRightIcon } from './icons'

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

export function SnippetCard({ snippet }: { snippet: Snippet }) {
  return (
    <div className="flex flex-col rounded-xl border border-slate-200 bg-white p-6 transition hover:border-slate-300 hover:shadow-md">
      <div className="flex items-start justify-between gap-3">
        <h3 className="text-base font-bold text-slate-900">{snippet.title}</h3>
        <span className="shrink-0 text-xs text-slate-400">{formatDate(snippet.modified)}</span>
      </div>
      <p className="mt-2 text-sm leading-relaxed text-slate-500">{snippet.description}</p>

      <div className="mt-4 h-40 w-full rounded-lg border border-slate-200 bg-slate-50" />

      <div className="mt-4 flex items-center justify-end">
        <ArrowRightIcon className="h-4 w-4 text-blue-600" />
      </div>
    </div>
  )
}
