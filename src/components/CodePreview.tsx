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

const DIALOG_RIGHT = 28
const CONNECTOR_ANCHOR_LEFT = 600
const DIALOG_GAP_PX = 16
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
  const dialogWrapRef = useRef<HTMLDivElement>(null)
  const [dialogTop, setDialogTop] = useState<number>()
  const [connectorTop, setConnectorTop] = useState<number>()
  const [connectorDialogLeft, setConnectorDialogLeft] = useState<number>()
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
      setConnectorTop(undefined)
      prevPathRef.current = path
      return
    }

    const row = container.querySelector<HTMLElement>(`[data-line-number="${highlightLine}"]`)
    if (!row) return

    const containerRect = container.getBoundingClientRect()
    const rowRect = row.getBoundingClientRect()
    const rowTopInScroll = rowRect.top - containerRect.top + container.scrollTop
    const rowCenterY = rowTopInScroll + rowRect.height / 2

    const jitterLines = 0 // Math.floor(Math.random() * 11) - 5
    const targetScrollTop = Math.max(0, rowTopInScroll - container.clientHeight / 3 + jitterLines * rowRect.height)

    // Position the dialog in the scrollable content's own coordinate space
    // (just under the row), so it scrolls together with the code for free
    // instead of needing to track the row's viewport position on every scroll.
    const nextDialogTop = rowTopInScroll + rowRect.height + DIALOG_GAP_PX

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
            setConnectorTop(rowCenterY)
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
      setConnectorTop(rowCenterY)
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

  // The dialog is pinned to the right edge (`right: DIALOG_RIGHT`), so its
  // left edge depends on the container's actual rendered width rather than a
  // fixed offset -- measure it directly to route the connector line there.
  useEffect(() => {
    const container = scrollRef.current
    const dialogEl = dialogWrapRef.current
    if (!container || !dialogEl || dialogTop === undefined) {
      setConnectorDialogLeft(undefined)
      return
    }

    function measure() {
      if (!container || !dialogEl) return
      const containerRect = container.getBoundingClientRect()
      const dialogRect = dialogEl.getBoundingClientRect()
      setConnectorDialogLeft(dialogRect.left - containerRect.left + container.scrollLeft)
    }

    measure()
    window.addEventListener('resize', measure)
    return () => window.removeEventListener('resize', measure)
  }, [dialogTop, dialogReady])

  return (
    <div className="flex h-full flex-col">
      <div className="relative border-b border-[var(--border)]">
        <div className="flex items-center gap-2 bg-[var(--bg-subtle)] px-4 py-2.5 text-sm text-[var(--text-muted)]">
          <a
            href={sourceFileUrl(repo, path)}
            target="_blank"
            rel="noreferrer"
            className="shrink-0 text-[var(--text-faint)] transition hover:text-[var(--blue)]"
            aria-label="Open raw file"
          >
            <ExternalLinkIcon className="h-4 w-4" />
          </a>
          <span className="truncate font-mono">
            {repoShortName(repo)}/{repo.commitId.slice(0, 7)}:{path}
            {highlightLine ? `;l=${highlightLine}` : ''}
          </span>
        </div>
        <div key={progressKey} className="file-progress-bar pointer-events-none absolute inset-x-0 top-0 h-0.5 bg-[var(--blue)]" />
      </div>

      <div ref={scrollRef} className="code-block relative flex-1 overflow-auto bg-[var(--bg-page)] font-mono text-[13px] leading-6 text-[var(--text)]">
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
                  <tr key={lineNumber} data-line-number={lineNumber} className={isActive ? 'bg-[var(--blue-soft)]' : undefined}>
                    <td
                      className={`w-12 select-none border-r border-slate-100 px-2 text-right align-top text-[#656d76] ${
                        isActive ? 'shadow-[inset_2px_0_0_var(--blue)]' : ''
                      }`}
                    >
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

        {isActiveComment && dialogTop !== undefined && connectorTop !== undefined && connectorDialogLeft !== undefined && (
          <div
            className={`pointer-events-none absolute inset-0 z-20 transition-opacity duration-150 ${
              dialogReady ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <span
              className="absolute rounded-full bg-[var(--blue)]"
              style={{ top: connectorTop - 3, left: CONNECTOR_ANCHOR_LEFT - 3, width: 6, height: 6 }}
            />
            <span
              className="absolute h-px bg-[var(--blue)]"
              style={{ top: connectorTop, left: CONNECTOR_ANCHOR_LEFT, width: Math.max(0, connectorDialogLeft - CONNECTOR_ANCHOR_LEFT) }}
            />
            <span
              className="absolute w-px bg-[var(--blue)]"
              style={{ top: connectorTop, left: connectorDialogLeft, height: Math.max(0, dialogTop - connectorTop) }}
            />
            <span
              className="absolute h-0 w-0 border-x-4 border-x-transparent border-t-[5px] border-t-[var(--blue)]"
              style={{ top: dialogTop - 1, left: connectorDialogLeft - 4 }}
            />
          </div>
        )}

        {isActiveComment && dialogTop !== undefined && (
          <div ref={dialogWrapRef} className="absolute z-20" style={{ top: dialogTop, right: DIALOG_RIGHT }}>
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
