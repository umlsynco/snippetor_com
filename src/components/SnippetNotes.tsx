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
    <div className="flex h-full flex-col overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--bg-page)]">
      <div className="border-b border-[var(--border)] p-4">
        <div className="relative flex items-center justify-center">
          <Link
            to={backHref}
            className="absolute left-0 inline-flex items-center gap-1.5 text-sm font-medium text-[var(--text-muted)] hover:text-[var(--text)]"
          >
            <ArrowLeftIcon className="h-4 w-4" />
            Back
          </Link>
          <div className="text-center">
            <h1 className="text-lg font-bold text-[var(--text)]">{title}</h1>
            <p className="text-xs text-[var(--text-muted)]">
              {notes.length} snippet{notes.length === 1 ? '' : 's'}
            </p>
          </div>
        </div>

        <div className="mt-3 flex justify-end">
          <div className="inline-flex rounded-full bg-[var(--bg-subtle)] p-1 text-sm font-medium">
            {(['blob', 'master'] as const).map((value) => (
              <button
                key={value}
                type="button"
                onClick={() => setMode(value)}
                className={`rounded-full px-4 py-1 capitalize transition ${
                  mode === value ? 'bg-[var(--blue-soft)] font-semibold text-[var(--blue)]' : 'text-[var(--text-muted)]'
                }`}
              >
                {value}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-2">
        {notes.map((note, index) => {
          const active = index === activeIndex
          return (
            <button
              key={`${note.path}:${note.line}`}
              type="button"
              onClick={() => onSelect(index)}
              className={`flex w-full items-start gap-2 rounded-md px-3 py-2.5 text-left text-[var(--text)] transition ${
                active ? 'bg-[var(--bg-selected)] shadow-[inset_3px_0_0_var(--blue)]' : 'hover:bg-[var(--bg-subtle)]'
              }`}
            >
              <span className={`mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full ${active ? 'bg-[var(--blue)]' : 'bg-[var(--text-faint)]'}`} />
              <span className="min-w-0 flex-1">
                <span className="block truncate font-mono text-sm font-semibold text-[var(--text)]">
                  {basename(note.path)} &middot; {note.line}
                </span>
                <span className="mt-0.5 block truncate text-xs text-[#656d76]">{repoShortName(repo)}</span>
                {active && note.text.trim().length > 0 && (
                  <span className="mt-1.5 block break-words text-xs leading-[1.45] text-[var(--text-muted)]">{note.text}</span>
                )}
              </span>
              {active && <ChevronRightIcon className="mt-1 h-4 w-4 shrink-0 text-[var(--text-faint)]" />}
            </button>
          )
        })}
      </div>

      <div className="flex items-center justify-between border-t border-[var(--border)] p-3 text-sm">
        <button
          type="button"
          disabled={activeIndex === 0}
          onClick={() => onSelect(activeIndex - 1)}
          className="rounded-lg bg-[var(--bg-selected)] px-4 py-1.5 font-medium text-[var(--text-muted)] transition hover:bg-[var(--border-muted)] disabled:cursor-not-allowed disabled:text-[var(--text-faint)] disabled:hover:bg-[var(--bg-selected)]"
        >
          Prev
        </button>
        <span className="font-medium text-[var(--text-muted)]">
          {activeIndex + 1} of {notes.length}
        </span>
        <button
          type="button"
          disabled={activeIndex === notes.length - 1}
          onClick={() => onSelect(activeIndex + 1)}
          className="rounded-lg border border-[var(--blue-border)] bg-[var(--blue-soft)] px-4 py-1.5 font-semibold text-[var(--blue)] transition hover:bg-[#b6e3ff] disabled:cursor-not-allowed disabled:border-[var(--border)] disabled:bg-[var(--bg-subtle)] disabled:text-[var(--text-faint)]"
        >
          Next
        </button>
      </div>
    </div>
  )
}
