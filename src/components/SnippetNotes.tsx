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
    <div className="flex h-full flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="border-b border-slate-100 p-4">
        <div className="relative flex items-center justify-center">
          <Link
            to={backHref}
            className="absolute left-0 inline-flex items-center gap-1.5 text-sm font-medium text-slate-700 hover:text-slate-900"
          >
            <ArrowLeftIcon className="h-4 w-4" />
            Back
          </Link>
          <div className="text-center">
            <h1 className="text-lg font-bold text-slate-900">{title}</h1>
            <p className="text-xs text-slate-500">
              Active snippets &middot; {notes.length} snippet{notes.length === 1 ? '' : 's'}
            </p>
          </div>
        </div>

        <div className="mt-3 flex justify-end">
          <div className="inline-flex rounded-full bg-slate-100 p-1 text-sm font-medium">
            {(['blob', 'master'] as const).map((value) => (
              <button
                key={value}
                type="button"
                onClick={() => setMode(value)}
                className={`rounded-full px-4 py-1 capitalize transition ${
                  mode === value ? 'bg-blue-100 font-semibold text-blue-600' : 'text-slate-500'
                }`}
              >
                {value}
              </button>
            ))}
          </div>
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
              className={`mx-[5px] flex items-start gap-2 rounded-md border-t-[5px] border-b-[5px] border-t-transparent border-b-transparent px-4 py-3 text-left transition ${
                active ? 'border-l-2 border-l-blue-600 bg-[#EAF2FE]' : 'border-l-2 border-l-transparent hover:bg-slate-50'
              }`}
            >
              <span className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${active ? 'bg-blue-600' : 'bg-slate-300'}`} />
              <span className="min-w-0 flex-1">
                <span className="block break-words font-mono text-sm font-semibold text-slate-800">
                  {basename(note.path)};|={note.line}
                </span>
                <span className="block break-words text-xs text-slate-400">{repoShortName(repo)}</span>
                <span className="mt-0.5 block break-words text-xs text-slate-500">{note.text}</span>
              </span>
              <ChevronRightIcon className="mt-1 h-6 w-6 shrink-0 text-[#4A5894]" />
            </button>
          )
        })}
      </div>

      <div className="flex items-center justify-between border-t border-slate-100 p-3 text-sm">
        <button
          type="button"
          disabled={activeIndex === 0}
          onClick={() => onSelect(activeIndex - 1)}
          className="rounded-lg bg-slate-100 px-4 py-1.5 font-medium text-slate-400 transition hover:bg-slate-200 hover:text-slate-600 disabled:cursor-not-allowed disabled:hover:bg-slate-100 disabled:hover:text-slate-400"
        >
          Prev
        </button>
        <span className="font-medium text-slate-700">
          {activeIndex + 1} of {notes.length}
        </span>
        <button
          type="button"
          disabled={activeIndex === notes.length - 1}
          onClick={() => onSelect(activeIndex + 1)}
          className="rounded-lg border border-blue-300 bg-blue-50 px-4 py-1.5 font-semibold text-blue-600 transition hover:bg-blue-100 disabled:cursor-not-allowed disabled:border-slate-200 disabled:bg-slate-100 disabled:text-slate-300"
        >
          Next
        </button>
      </div>
    </div>
  )
}
