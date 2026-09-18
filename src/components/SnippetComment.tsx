import type { SnippetNote, SnippetRepo } from '../types/snippet'
import { ArrowRightIcon, CloseIcon, ExpandIcon, LinkIcon, PencilIcon } from './icons'

export function SnippetComment({
  note,
  repo,
  index,
  total,
  onPrev,
  onNext,
  onClose,
}: {
  note: SnippetNote
  repo: SnippetRepo
  index: number
  total: number
  onPrev: () => void
  onNext: () => void
  onClose: () => void
}) {
  return (
    <div className="absolute bottom-6 right-6 w-80 rounded-xl border border-slate-200 bg-white p-3 shadow-2xl">
      <div className="flex items-center gap-2">
        <span className="rounded-md bg-slate-100 px-2 py-1 font-mono text-xs text-slate-600">
          drc={repo.commitId.slice(0, 4)}
        </span>
        <span className="rounded-md bg-slate-100 px-2 py-1 text-xs font-medium text-slate-600">{repo.branch}</span>
        <div className="ml-auto flex items-center gap-1 text-slate-400">
          <button type="button" className="rounded p-1 hover:bg-slate-100 hover:text-slate-600" aria-label="Copy link">
            <LinkIcon className="h-4 w-4" />
          </button>
          <button type="button" className="rounded p-1 hover:bg-slate-100 hover:text-slate-600" aria-label="Edit note">
            <PencilIcon className="h-4 w-4" />
          </button>
          <button type="button" className="rounded p-1 hover:bg-slate-100 hover:text-slate-600" aria-label="Expand">
            <ExpandIcon className="h-4 w-4" />
          </button>
          <button type="button" onClick={onClose} className="rounded p-1 hover:bg-slate-100 hover:text-slate-600" aria-label="Close comment">
            <CloseIcon className="h-4 w-4" />
          </button>
        </div>
      </div>

      <p className="mt-3 rounded-lg bg-slate-50 p-3 text-sm text-slate-700">{note.text}</p>

      <div className="mt-3 flex items-center justify-between">
        <button
          type="button"
          disabled={index === 0}
          onClick={onPrev}
          className="rounded-lg border border-slate-200 px-3 py-1.5 text-sm font-medium text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:text-slate-300 disabled:hover:bg-transparent"
        >
          Prev
        </button>
        <span className="text-sm text-slate-400">
          {index + 1} of {total}
        </span>
        <button
          type="button"
          disabled={index === total - 1}
          onClick={onNext}
          className="flex items-center gap-1.5 rounded-lg bg-blue-600 px-3 py-1.5 text-sm font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-slate-200 disabled:text-slate-400"
        >
          Next
          <ArrowRightIcon className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  )
}
