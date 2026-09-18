import { useState } from 'react'
import { Link } from 'react-router-dom'
import type { SnippetNote, SnippetRepo } from '../types/snippet'
import { repoShortName } from '../utils/sourceFiles'
import { ArrowLeftIcon, ChevronRightIcon } from './icons'

function basename(path: string) {
  return path.split('/').pop() ?? path
}

export function SnippetNotes({
  backHref,
  title,
  notes,
  repo,
  activeIndex,
  onSelect,
}: {
  backHref: string
  title: string
  notes: SnippetNote[]
  repo: SnippetRepo
  activeIndex: number
  onSelect: (index: number) => void
}) {
  const [mode, setMode] = useState<'blob' | 'master'>('blob')

  return (
    <div className="flex h-full flex-col border-r border-slate-200 bg-white">
      <div className="border-b border-slate-100 p-4">
        <Link to={backHref} className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-600 hover:text-slate-900">
          <ArrowLeftIcon className="h-4 w-4" />
          Back
        </Link>
        <h1 className="mt-3 text-lg font-bold text-slate-900">{title}</h1>
        <p className="text-xs text-slate-500">
          Active snippets &middot; {notes.length} snippet{notes.length === 1 ? '' : 's'}
        </p>

        <div className="mt-3 inline-flex rounded-lg bg-slate-100 p-0.5 text-sm font-medium">
          {(['blob', 'master'] as const).map((value) => (
            <button
              key={value}
              type="button"
              onClick={() => setMode(value)}
              className={`rounded-md px-3 py-1 capitalize transition ${
                mode === value ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500'
              }`}
            >
              {value}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        {notes.map((note, index) => {
          const active = index === activeIndex
          return (
            <button
              key={`${note.path}:${note.line}`}
              type="button"
              onClick={() => onSelect(index)}
              className={`flex w-full items-start gap-2 border-b border-slate-100 px-4 py-3 text-left transition ${
                active ? 'border-l-2 border-l-blue-600 bg-blue-50/60' : 'border-l-2 border-l-transparent hover:bg-slate-50'
              }`}
            >
              <span className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${active ? 'bg-blue-600' : 'bg-slate-300'}`} />
              <span className="min-w-0 flex-1">
                <span className="block truncate font-mono text-sm font-semibold text-slate-800">
                  {basename(note.path)};|={note.line}
                </span>
                <span className="block truncate text-xs text-slate-400">{repoShortName(repo)}</span>
                <span className="mt-0.5 block truncate text-xs text-slate-500">{note.text}</span>
              </span>
              <ChevronRightIcon className="mt-1 h-4 w-4 shrink-0 text-slate-300" />
            </button>
          )
        })}
      </div>

      <div className="flex items-center justify-between border-t border-slate-100 p-3 text-sm">
        <button
          type="button"
          disabled={activeIndex === 0}
          onClick={() => onSelect(activeIndex - 1)}
          className="rounded-md px-3 py-1.5 font-medium text-slate-600 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:text-slate-300 disabled:hover:bg-transparent"
        >
          Prev
        </button>
        <span className="text-slate-400">
          {activeIndex + 1} of {notes.length}
        </span>
        <button
          type="button"
          disabled={activeIndex === notes.length - 1}
          onClick={() => onSelect(activeIndex + 1)}
          className="rounded-md px-3 py-1.5 font-medium text-blue-600 transition hover:bg-blue-50 disabled:cursor-not-allowed disabled:text-slate-300 disabled:hover:bg-transparent"
        >
          Next
        </button>
      </div>
    </div>
  )
}
