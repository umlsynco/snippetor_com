import { useEffect, useRef, useState } from 'react'
import type { SnippetRepo } from '../types/snippet'
import { diagramFileUrl, fetchDiagramModel, resolveDiagramPath, type DiagramFileResult } from '../utils/diagramFiles'
import { fetchSourceFile, type SourceFileResult, sourceFileUrl } from '../utils/sourceFiles'
import { CodePreview } from './CodePreview'
import { ChevronLeftIcon, ChevronRightIcon, CloseIcon, DiagramIcon } from './icons'
import { UmlViewer } from './UmlViewer'

function basename(path: string) {
  return path.split('/').pop() ?? path
}

// A note whose `path` is a bare ".umlsync" filename (see
// profile_impl_lifecycle_android.snippet.json) points at a diagram, not
// source code -- resolved relative to the snippet's own file, same as
// SnippetContent.diagrams entries (see resolveDiagramPath).
function isDiagramPath(path: string): boolean {
  return path.endsWith('.umlsync')
}

export function CodeViewer({
  openPaths,
  activePath,
  onSelectTab,
  onCloseTab,
  repo,
  theme,
  snippetPath,
}: {
  openPaths: string[]
  activePath: string | undefined
  onSelectTab: (path: string) => void
  onCloseTab: (path: string) => void
  repo: SnippetRepo
  theme: string
  snippetPath: string
}) {
  const [files, setFiles] = useState<Record<string, SourceFileResult>>({})
  const [diagrams, setDiagrams] = useState<Record<string, DiagramFileResult>>({})
  const tabsRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    openPaths.forEach((path) => {
      if (isDiagramPath(path)) {
        if (diagrams[path]) return
        fetchDiagramModel(diagramFileUrl(theme, resolveDiagramPath(snippetPath, path))).then((result) => {
          setDiagrams((prev) => ({ ...prev, [path]: result }))
        })
        return
      }
      if (files[path]) return
      fetchSourceFile(sourceFileUrl(repo, path)).then((result) => {
        setFiles((prev) => ({ ...prev, [path]: result }))
      })
    })
  }, [openPaths, files, diagrams, repo, theme, snippetPath])

  function scrollTabs(direction: -1 | 1) {
    tabsRef.current?.scrollBy({ left: direction * 160, behavior: 'smooth' })
  }

  return (
    <div className="flex h-full flex-col overflow-hidden rounded-xl border border-[var(--border)] bg-[var(--bg-page)]">
      <div className="flex items-center border-b border-[var(--border)] bg-[var(--bg-subtle)]">
        <button
          type="button"
          onClick={() => scrollTabs(-1)}
          className="flex shrink-0 items-center justify-center px-2 py-2.5 text-[var(--text-faint)] hover:text-[var(--text)]"
          aria-label="Scroll tabs left"
        >
          <ChevronLeftIcon className="h-4 w-4" />
        </button>
        <div ref={tabsRef} className="flex flex-1 items-center gap-1 overflow-x-auto px-1.5 py-1.5">
          {openPaths.map((path) => {
            const isActive = path === activePath
            return (
              <button
                key={path}
                type="button"
                onClick={() => onSelectTab(path)}
                className={`flex shrink-0 items-center gap-2 rounded-md border px-3 py-1 text-sm ${
                  isActive
                    ? 'border-[var(--border)] border-b-[var(--bg-page)] bg-[var(--bg-page)] font-semibold text-[var(--text)]'
                    : 'border-transparent bg-transparent text-[var(--text-muted)] hover:bg-[var(--bg-selected)]'
                }`}
              >
                {isDiagramPath(path) && <DiagramIcon className="h-3.5 w-3.5 shrink-0" />}
                <span className="max-w-[10rem] truncate font-mono">{basename(path)}</span>
                <span
                  role="button"
                  tabIndex={0}
                  onClick={(event) => {
                    event.stopPropagation()
                    onCloseTab(path)
                  }}
                  onKeyDown={(event) => {
                    if (event.key === 'Enter' || event.key === ' ') {
                      event.preventDefault()
                      event.stopPropagation()
                      onCloseTab(path)
                    }
                  }}
                  className="rounded p-0.5 text-[var(--text-faint)] hover:bg-[var(--bg-selected)] hover:text-[var(--text)]"
                  aria-label={`Close ${basename(path)}`}
                >
                  <CloseIcon className="h-3 w-3" />
                </span>
              </button>
            )
          })}
        </div>
        <button
          type="button"
          onClick={() => scrollTabs(1)}
          className="flex shrink-0 items-center justify-center px-2 py-2.5 text-[var(--text-faint)] hover:text-[var(--text)]"
          aria-label="Scroll tabs right"
        >
          <ChevronRightIcon className="h-4 w-4" />
        </button>
      </div>

      <div className="min-h-0 flex-1">
        {activePath && isDiagramPath(activePath) ? (
          diagrams[activePath]?.status === 'ready' ? (
            <UmlViewer diagramModel={diagrams[activePath].model} />
          ) : diagrams[activePath]?.status === 'error' ? (
            <p className="p-4 text-sm text-slate-400">{diagrams[activePath].message}</p>
          ) : (
            <p className="p-4 text-sm text-slate-400">Loading…</p>
          )
        ) : activePath ? (
          <CodePreview path={activePath} repo={repo} file={files[activePath]} />
        ) : (
          <p className="p-4 text-sm text-slate-400">No file open.</p>
        )}
      </div>
    </div>
  )
}
