import Prism from 'prismjs'
import 'prismjs/components/prism-c'
import 'prismjs/components/prism-cpp'
import { useEffect, useMemo, useRef, useState } from 'react'
import { useCodeComment } from '../context/CodeCommentContext'
import type { SnippetRepo } from '../types/snippet'
import type { SourceFileResult } from '../utils/sourceFiles'
import { repoShortName, sourceFileUrl } from '../utils/sourceFiles'
import { ExternalLinkIcon } from './icons'
import { SnippetComment } from './SnippetComment'

const DIALOG_LEFT = 500
const DIALOG_LINE_GAP = 3
const DIALOG_READY_DELAY = 180
// Matches SnippetComment's own "duration-150" hide transition, so the scroll
// only starts once the dialog has actually faded out of view.
const DIALOG_HIDE_DELAY = 150
const SCROLL_ANIMATION_DURATION = 500

function highlightLines(content: string): string[] {
  const grammar = Prism.languages.cpp ?? Prism.languages.clike
  const html = Prism.highlight(content, grammar, 'cpp')
  return html.split('\n')
}

function easeOutCubic(t: number): number {
  return 1 - (1 - t) ** 3
}

function animateScrollTo(container: HTMLDivElement, target: number, duration: number, onFrame: (frame: number) => void, onDone: () => void) {
  const start = container.scrollTop
  const change = target - start
  const startTime = performance.now()

  function step(now: number) {
    const t = Math.min(1, (now - startTime) / duration)
    container.scrollTop = start + change * easeOutCubic(t)
    if (t < 1) {
      onFrame(requestAnimationFrame(step))
    } else {
      onDone()
    }
  }

  onFrame(requestAnimationFrame(step))
}

export function CodePreview({ path, repo, file }: { path: string; repo: SnippetRepo; file: SourceFileResult | undefined }) {
  const comment = useCodeComment()
  const isActiveComment = comment?.path === path
  const highlightLine = isActiveComment ? comment.line : undefined

  const lines = useMemo(() => {
    if (!file || file.status !== 'ready') return []
    return highlightLines(file.content)
  }, [file])

  const scrollRef = useRef<HTMLDivElement>(null)
  const [dialogTop, setDialogTop] = useState<number>()
  const [dialogReady, setDialogReady] = useState(false)
  const dialogReadyTimeoutRef = useRef<ReturnType<typeof setTimeout>>(undefined)
  const dialogHideTimeoutRef = useRef<ReturnType<typeof setTimeout>>(undefined)
  const scrollAnimationFrameRef = useRef<number>(undefined)
  const prevPathRef = useRef<string>(undefined)

  // Remounts the progress bar (restarting its CSS animation) each time the
  // viewed file changes, so switching or re-selecting a tab always replays it.
  const [progressKey, setProgressKey] = useState(0)
  useEffect(() => {
    setProgressKey((key) => key + 1)
  }, [path])

  // Jitter the scroll target by a few lines each time so switching notes/files
  // visibly moves the view, even when two highlighted lines land close together.
  useEffect(() => {
    const container = scrollRef.current
    if (!container) return

    if (dialogReadyTimeoutRef.current) clearTimeout(dialogReadyTimeoutRef.current)
    if (dialogHideTimeoutRef.current) clearTimeout(dialogHideTimeoutRef.current)
    if (scrollAnimationFrameRef.current) cancelAnimationFrame(scrollAnimationFrameRef.current)

    if (!highlightLine || file?.status !== 'ready') {
      setDialogTop(undefined)
      prevPathRef.current = path
      return
    }

    const row = container.querySelector<HTMLElement>(`[data-line-number="${highlightLine}"]`)
    if (!row) return

    const containerRect = container.getBoundingClientRect()
    const rowRect = row.getBoundingClientRect()
    const rowTopInScroll = rowRect.top - containerRect.top + container.scrollTop

    const jitterLines = Math.floor(Math.random() * 11) - 5
    const targetScrollTop = Math.max(0, rowTopInScroll - container.clientHeight / 3 + jitterLines * rowRect.height)

    // Position the dialog in the scrollable content's own coordinate space
    // (3 lines below the row), so it scrolls together with the code for free
    // instead of needing to track the row's viewport position on every scroll.
    const nextDialogTop = rowTopInScroll + rowRect.height * DIALOG_LINE_GAP

    const isSameFile = prevPathRef.current === path
    prevPathRef.current = path

    setDialogReady(false)

    if (isSameFile) {
      // Same file, just a different note: hide the dialog first, then glide
      // to the new line, instead of jumping straight there.
      dialogHideTimeoutRef.current = setTimeout(() => {
        animateScrollTo(
          container,
          targetScrollTop,
          SCROLL_ANIMATION_DURATION,
          (frame) => {
            scrollAnimationFrameRef.current = frame
          },
          () => {
            setDialogTop(nextDialogTop)
            dialogReadyTimeoutRef.current = setTimeout(() => setDialogReady(true), DIALOG_READY_DELAY)
          },
        )
      }, DIALOG_HIDE_DELAY)
    } else {
      // Freshly opened file: jump straight there instantly. A smooth
      // animation here could be interrupted by a second effect run (e.g.
      // React StrictMode) and settle at the wrong offset.
      container.scrollTop = targetScrollTop
      setDialogTop(nextDialogTop)
      dialogReadyTimeoutRef.current = setTimeout(() => setDialogReady(true), DIALOG_READY_DELAY)
    }
  }, [highlightLine, path, file?.status, comment?.index])

  useEffect(() => {
    return () => {
      if (dialogReadyTimeoutRef.current) clearTimeout(dialogReadyTimeoutRef.current)
      if (dialogHideTimeoutRef.current) clearTimeout(dialogHideTimeoutRef.current)
      if (scrollAnimationFrameRef.current) cancelAnimationFrame(scrollAnimationFrameRef.current)
    }
  }, [])

  return (
    <div className="flex h-full flex-col">
      <div className="relative border-b border-slate-100">
        <div className="flex items-center gap-2 bg-[#F6F8FAFF] px-4 py-2.5 text-sm text-slate-500">
          <a
            href={sourceFileUrl(repo, path)}
            target="_blank"
            rel="noreferrer"
            className="shrink-0 text-slate-400 transition hover:text-blue-600"
            aria-label="Open raw file"
          >
            <ExternalLinkIcon className="h-4 w-4" />
          </a>
          <span className="truncate font-mono">
            {repoShortName(repo)}/{repo.commitId.slice(0, 7)}:{path}
            {highlightLine ? `;l=${highlightLine}` : ''}
          </span>
        </div>
        <div key={progressKey} className="file-progress-bar pointer-events-none absolute inset-x-0 top-0 h-0.5 bg-blue-500" />
      </div>

      <div ref={scrollRef} className="code-block relative flex-1 overflow-auto bg-white font-mono text-[13px] leading-6">
        {!file && <p className="p-4 text-sm text-slate-400">Loading…</p>}
        {file?.status === 'error' && (
          <p className="p-4 text-sm text-slate-400">{file.message} — preview not available for this file in the demo.</p>
        )}
        {file?.status === 'ready' && (
          <table className="w-full border-collapse">
            <tbody>
              {lines.map((lineHtml, index) => {
                const lineNumber = index + 1
                const isActive = lineNumber === highlightLine
                return (
                  <tr key={lineNumber} data-line-number={lineNumber} className={isActive ? 'bg-blue-50' : undefined}>
                    <td className="w-12 select-none border-r border-slate-100 px-2 text-right align-top text-[#7E8BADFF]">
                      {lineNumber}
                    </td>
                    <td className="whitespace-pre px-4">
                      <span dangerouslySetInnerHTML={{ __html: lineHtml || ' ' }} />
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        )}

        {isActiveComment && dialogTop !== undefined && (
          <div className="absolute" style={{ top: dialogTop, left: DIALOG_LEFT }}>
            <SnippetComment
              note={comment.note}
              repo={comment.repo}
              index={comment.index}
              total={comment.total}
              ready={dialogReady}
              onPrev={comment.onPrev}
              onNext={comment.onNext}
              onClose={comment.onClose}
            />
          </div>
        )}
      </div>
    </div>
  )
}
