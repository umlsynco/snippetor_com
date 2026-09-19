import { useEffect, useRef, useState } from 'react'
import type { SnippetRepo } from '../types/snippet'
import { fetchSourceFile, type SourceFileResult, sourceFileUrl } from '../utils/sourceFiles'
import { CodePreview } from './CodePreview'
import { ChevronLeftIcon, ChevronRightIcon, CloseIcon } from './icons'

function basename(path: string) {
  return path.split('/').pop() ?? path
}

export function CodeViewer({
  openPaths,
  activePath,
  onSelectTab,
  onCloseTab,
  repo,
}: {
  openPaths: string[]
  activePath: string | undefined
  onSelectTab: (path: string) => void
  onCloseTab: (path: string) => void
  repo: SnippetRepo
}) {
  const [files, setFiles] = useState<Record<string, SourceFileResult>>({})
  const tabsRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    openPaths.forEach((path) => {
      if (files[path]) return
      fetchSourceFile(sourceFileUrl(repo, path)).then((result) => {
        setFiles((prev) => ({ ...prev, [path]: result }))
      })
    })
  }, [openPaths, files, repo])

  function scrollTabs(direction: -1 | 1) {
    tabsRef.current?.scrollBy({ left: direction * 160, behavior: 'smooth' })
  }

  return (
    <div className="flex h-full flex-col overflow-hidden rounded-xl border border-slate-200 bg-white">
      <div className="flex items-center border-b border-slate-100">
        <button
          type="button"
          onClick={() => scrollTabs(-1)}
          className="flex shrink-0 items-center justify-center px-2 py-2.5 text-slate-400 hover:text-slate-600"
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
                    ? 'border-blue-300 bg-white font-semibold text-blue-600'
                    : 'border-transparent bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
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
                  className={`rounded p-0.5 ${
                    isActive
                      ? 'text-blue-400 hover:bg-blue-50 hover:text-blue-600'
                      : 'text-slate-300 hover:bg-slate-200 hover:text-slate-600'
                  }`}
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
          className="flex shrink-0 items-center justify-center px-2 py-2.5 text-slate-400 hover:text-slate-600"
          aria-label="Scroll tabs right"
        >
          <ChevronRightIcon className="h-4 w-4" />
        </button>
      </div>

      <div className="min-h-0 flex-1">
        {activePath ? (
          <CodePreview path={activePath} repo={repo} file={files[activePath]} />
        ) : (
          <p className="p-4 text-sm text-slate-400">No file open.</p>
        )}
      </div>
    </div>
  )
}
