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
      className={`flex w-[min(580px,42vw)] min-w-[320px] max-w-[90vw] max-h-[50vh] flex-col overflow-hidden rounded-lg border border-[#8c959f] bg-[var(--bg-page)] font-sans shadow-[0_8px_24px_rgba(140,149,159,0.22),0_1px_3px_rgba(31,35,40,0.12)] transition-[transform,opacity] duration-150 ease-out ${
        ready
          ? 'translate-x-0 translate-y-0 scale-100 opacity-100'
          : '-translate-x-4 -translate-y-4 scale-90 opacity-0 pointer-events-none'
      }`}
    >
      <div className="flex h-10 shrink-0 items-center gap-2 rounded-t-lg border-b border-[var(--border)] bg-[var(--bg-subtle)] px-3 py-1.5">
        <span className="rounded-md bg-[var(--blue-soft)] px-2 py-1 font-mono text-[13px] font-medium text-[var(--blue)]">
          drc={repo.commitId.slice(0, 4)}
        </span>
        <span className="rounded-md bg-[var(--blue-soft)] px-2 py-1 text-[13px] font-medium text-[var(--blue)]">{repo.branch}</span>
        <div className="ml-auto flex items-center gap-1 text-[var(--text-faint)]">
          <button
            type="button"
            onClick={onClose}
            className="rounded p-1 hover:bg-[var(--bg-selected)] hover:text-[var(--text)]"
            aria-label="Close comment"
          >
            <CloseIcon className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className="flex min-h-0 flex-1 flex-col p-3">
        <p className="min-h-0 flex-1 overflow-y-auto border-l-[3px] border-l-[var(--blue)] bg-[var(--bg-page)] px-4 py-3 text-[15px] font-normal leading-[1.55] text-[var(--text)]">
          {note.text}
        </p>

        <div className="mt-3 flex h-11 shrink-0 items-center justify-between">
          <button
            type="button"
            disabled={index === 0}
            onClick={onPrev}
            className="flex h-8 items-center justify-center rounded-lg border border-[var(--border)] px-3 text-sm font-medium text-[var(--text-muted)] transition hover:bg-[var(--bg-subtle)] disabled:cursor-not-allowed disabled:text-[var(--text-faint)] disabled:hover:bg-transparent"
          >
            Prev
          </button>
          <span className="text-sm text-[var(--text-faint)]">
            {index + 1} of {total}
          </span>
          <button
            type="button"
            disabled={index === total - 1}
            onClick={onNext}
            className="flex h-8 items-center gap-1.5 rounded-lg bg-[var(--blue)] px-3 text-sm font-medium text-white transition hover:bg-[#0757ba] disabled:cursor-not-allowed disabled:bg-slate-200 disabled:text-slate-400"
          >
            Next
            <ArrowRightIcon className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </div>
  )
}
