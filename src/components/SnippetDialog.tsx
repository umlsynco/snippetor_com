import { useEffect } from 'react'
import { createPortal } from 'react-dom'
import { Link } from 'react-router-dom'
import type { Snippet } from '../types/snippet'
import { slugify } from '../utils/slug'
import { ChatIcon, ClockIcon, CloseIcon, CodeIcon, DiagramIcon, DocumentIcon, FilesIcon } from './icons'

function formatDate(iso: string) {
  const date = new Date(iso)
  return {
    day: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    year: date.toLocaleDateString('en-US', { year: 'numeric' }),
  }
}

export function SnippetDialog({ snippet, themeSlug, onClose }: { snippet: Snippet; themeSlug: string; onClose: () => void }) {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', handleKeyDown)

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = previousOverflow
    }
  }, [onClose])

  const notes = snippet.notes ?? []
  const itemsCount = notes.length
  const notesCount = notes.filter((note) => note.text.trim().length > 0).length
  const diagramsCount = snippet.uml_path ? 1 : 0
  const filesCount = new Set(notes.map((note) => note.path)).size
  const lastUpdated = formatDate(snippet.modified)

  const stats: { icon: typeof DocumentIcon; value: string; label: string }[] = [
    { icon: DocumentIcon, value: String(itemsCount), label: 'Snippet items' },
    { icon: ChatIcon, value: String(notesCount), label: 'Notes' },
    { icon: DiagramIcon, value: String(diagramsCount), label: 'Diagrams' },
    { icon: FilesIcon, value: String(filesCount), label: 'Files' },
  ]

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-slate-900/50 p-4 py-10 backdrop-blur-sm"
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose()
      }}
    >
      <div role="dialog" aria-modal="true" aria-label={snippet.title} className="relative w-full max-w-3xl rounded-2xl border border-slate-200 bg-white shadow-2xl">
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="absolute right-4 top-4 rounded-full p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"
        >
          <CloseIcon className="h-5 w-5" />
        </button>

        <div className="flex items-center gap-4 border-b border-slate-100 p-8 pb-6">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
            <DocumentIcon className="h-6 w-6" />
          </div>
          <h2 className="text-2xl font-extrabold tracking-tight text-slate-900">{snippet.title}</h2>
        </div>

        <div className="p-8 pt-6">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div>
              <p className="text-sm font-semibold text-blue-700">Title</p>
              <p className="mt-1 text-slate-800">{snippet.title}</p>
            </div>
            <div>
              <p className="text-sm font-semibold text-blue-700">Description</p>
              <p className="mt-1 text-slate-600">{snippet.description}</p>
            </div>
          </div>

          {snippet.projects.length > 0 && (
            <div className="mt-6">
              <p className="text-sm font-semibold text-blue-700">Tags</p>
              <div className="mt-2 flex flex-wrap gap-2">
                {snippet.projects.map((tag) => (
                  <span key={tag} className="rounded-full bg-slate-100 px-3 py-1 text-sm text-slate-600">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-5">
            {stats.map(({ icon: Icon, value, label }) => (
              <div key={label} className="flex items-center gap-3 rounded-lg border border-slate-200 p-4">
                <Icon className="h-5 w-5 shrink-0 text-blue-600" />
                <div>
                  <p className="text-lg font-bold leading-tight text-slate-900">{value}</p>
                  <p className="text-xs text-slate-500">{label}</p>
                </div>
              </div>
            ))}
            <div className="flex items-center gap-3 rounded-lg border border-slate-200 p-4">
              <ClockIcon className="h-5 w-5 shrink-0 text-blue-600" />
              <div>
                <p className="text-sm font-bold leading-tight text-slate-900">
                  {lastUpdated.day}, {lastUpdated.year}
                </p>
                <p className="text-xs text-slate-500">Last updated</p>
              </div>
            </div>
          </div>

          {notes.length > 0 && (
            <div className="mt-8">
              <h3 className="text-lg font-bold text-slate-900">Snippet items preview</h3>
              <div className="mt-4 flex flex-col gap-3">
                {notes.map((note, index) => (
                  <div key={`${note.path}:${note.line}`} className="flex items-start gap-3 rounded-lg border border-slate-200 p-4">
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-blue-50 text-sm font-bold text-blue-600">
                      {index + 1}
                    </span>
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-baseline gap-1.5">
                        <CodeIcon className="h-4 w-4 shrink-0 text-slate-400" />
                        <span className="break-all font-mono text-sm font-semibold text-slate-800">{note.path}</span>
                        <span className="text-sm text-slate-400">:{note.line}</span>
                      </div>
                      <div className="mt-1 flex items-start gap-1.5">
                        <ChatIcon className="mt-0.5 h-4 w-4 shrink-0 text-slate-400" />
                        <span className="text-sm text-slate-500">{note.text}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <Link
            to={`/${themeSlug}/play/${slugify(snippet.title)}`}
            onClick={onClose}
            className="mt-8 flex w-full items-center justify-center gap-2 rounded-lg bg-blue-600 py-3 font-semibold text-white transition hover:bg-blue-700"
          >
            <CodeIcon className="h-4 w-4" />
            View with code
          </Link>
        </div>
      </div>
    </div>,
    document.body,
  )
}
