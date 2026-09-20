import type { SnippetNote, SnippetRepo } from '../types/snippet'
import { ArrowRightIcon, CloseIcon, ExpandIcon, LinkIcon, PencilIcon } from './icons'

export function SnippetComment({
  note,
  repo,
  index,
  total,
  ready = true,
  onPrev,
  onNext,
  onClose,
}: {
  note: SnippetNote
  repo: SnippetRepo
  index: number
  total: number
  ready?: boolean
  onPrev: () => void
  onNext: () => void
  onClose: () => void
}) {
  return (
    <div
      className={`flex h-[21rem] w-[735px] min-h-[12rem] min-w-[320px] max-w-[90vw] resize flex-col overflow-hidden rounded-xl border-2 border-[#E5EEFDFF] bg-white p-3 shadow-2xl transition-[transform,opacity] duration-150 ease-out ${
        ready
          ? 'translate-x-0 translate-y-0 scale-100 opacity-100'
          : '-translate-x-4 -translate-y-4 scale-90 opacity-0 pointer-events-none'
      }`}
    >
      <div className="flex shrink-0 items-center gap-2">
        <span className="rounded-md bg-slate-100 px-2 py-1 font-mono text-base text-slate-600">
          drc={repo.commitId.slice(0, 4)}
        </span>
        <span className="rounded-md bg-slate-100 px-2 py-1 text-base font-medium text-slate-600">{repo.branch}</span>
        <div className="ml-auto flex items-center gap-1 text-slate-400">
          <button type="button" onClick={onClose} className="rounded p-1 hover:bg-slate-100 hover:text-slate-600" aria-label="Close comment">
            <CloseIcon className="h-4 w-4" />
          </button>
        </div>
      </div>

      <p className="mt-3 min-h-0 flex-1 overflow-y-auto rounded-lg bg-slate-50 p-3 text-lg text-slate-700">{note.text}</p>

      <div className="mt-3 flex shrink-0 items-center justify-between">
        <button
          type="button"
          disabled={index === 0}
          onClick={onPrev}
          className="rounded-lg border border-slate-200 px-3 py-1.5 text-lg font-medium text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:text-slate-300 disabled:hover:bg-transparent"
        >
          Prev
        </button>
        <span className="text-lg text-slate-400">
          {index + 1} of {total}
        </span>
        <button
          type="button"
          disabled={index === total - 1}
          onClick={onNext}
          className="flex items-center gap-1.5 rounded-lg bg-blue-600 px-3 py-1.5 text-lg font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-slate-200 disabled:text-slate-400"
        >
          Next
          <ArrowRightIcon className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  )
}
