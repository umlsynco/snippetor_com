import { useEffect, useRef, useState } from 'react'
import { Navigate, useParams } from 'react-router-dom'
import { CodeViewer } from '../components/CodeViewer'
import { SnippetNotes } from '../components/SnippetNotes'
import { CodeCommentServiceProvider, useCodeCommentService } from '../context/CodeCommentContext'
import { getTopic, type Topic } from '../data/topics'
import { useSnippetDetail } from '../hooks/useSnippetDetail'
import { useSnippets } from '../hooks/useSnippets'
import type { SnippetContent, SnippetRepo } from '../types/snippet'
import { DEFAULT_REPO } from '../utils/sourceFiles'
import { slugify } from '../utils/slug'

// Notes reference their repo by `rid` into `content.repos`; the viewer only
// renders against a single repo at a time, so the first note's repo stands
// in for the whole snippet (every snippet authored so far has just one).
function resolveRepo(content: SnippetContent): SnippetRepo {
  const repoById = new Map<number, SnippetRepo>()
  for (const repo of content.repos ?? []) {
    if (repo.id !== undefined) repoById.set(repo.id, repo)
  }
  const rid = content.notes[0]?.rid
  return (rid !== undefined ? repoById.get(rid) : undefined) ?? content.repos?.[0] ?? DEFAULT_REPO
}

const MIN_SIDEBAR_WIDTH = 260
const MAX_SIDEBAR_WIDTH = 560
const DEFAULT_SIDEBAR_WIDTH = 320

function PlayView({ topic, content }: { topic: Topic; content: SnippetContent }) {
  const notes = content.notes ?? []
  const repo = resolveRepo(content)
  const uniquePaths = Array.from(new Set(notes.map((note) => note.path)))

  const [activeIndex, setActiveIndex] = useState(0)
  const [openPaths, setOpenPaths] = useState<string[]>(uniquePaths)
  const [activePath, setActivePath] = useState<string | undefined>(uniquePaths[0])
  const [commentVisible, setCommentVisible] = useState(true)

  const [sidebarWidth, setSidebarWidth] = useState(DEFAULT_SIDEBAR_WIDTH)
  const containerRef = useRef<HTMLDivElement>(null)
  const isResizing = useRef(false)

  const commentService = useCodeCommentService()
  const activeNote = notes[activeIndex]

  // The dialog itself is now owned by whichever CodePreview matches the
  // active note's path — this just issues show/hide commands to the service.
  useEffect(() => {
    if (!activeNote || !commentVisible) {
      commentService.hide()
      return
    }
    commentService.show({
      path: activeNote.path,
      line: activeNote.line,
      note: activeNote,
      repo,
      index: activeIndex,
      total: notes.length,
      onPrev: () => selectNote(activeIndex - 1),
      onNext: () => selectNote(activeIndex + 1),
      onClose: () => setCommentVisible(false),
    })
  }, [commentService, activeNote, commentVisible, activeIndex, notes.length, repo])

  function handleResizerPointerDown(event: React.PointerEvent<HTMLDivElement>) {
    isResizing.current = true
    event.currentTarget.setPointerCapture(event.pointerId)
  }

  function handleResizerPointerMove(event: React.PointerEvent<HTMLDivElement>) {
    if (!isResizing.current || !containerRef.current) return
    const { left } = containerRef.current.getBoundingClientRect()
    const nextWidth = event.clientX - left
    setSidebarWidth(Math.min(MAX_SIDEBAR_WIDTH, Math.max(MIN_SIDEBAR_WIDTH, nextWidth)))
  }

  function handleResizerPointerUp(event: React.PointerEvent<HTMLDivElement>) {
    isResizing.current = false
    event.currentTarget.releasePointerCapture(event.pointerId)
  }

  function selectNote(index: number) {
    setActiveIndex(index)
    setCommentVisible(true)
    const path = notes[index]?.path
    if (!path) return
    setOpenPaths((prev) => (prev.includes(path) ? prev : [...prev, path]))
    setActivePath(path)
  }

  function closeTab(path: string) {
    const remaining = openPaths.filter((p) => p !== path)
    setOpenPaths(remaining)
    if (activePath === path) {
      setActivePath(remaining[remaining.length - 1])
    }
  }

  return (
    <div className="flex h-screen flex-col bg-slate-50">
      <div ref={containerRef} className="flex flex-1 overflow-hidden">
        <div className="shrink-0 p-3" style={{ width: sidebarWidth }}>
          <SnippetNotes
            backHref={`/${topic.slug}`}
            title={topic.pageTitle}
            notes={notes}
            repo={repo}
            activeIndex={activeIndex}
            onSelect={selectNote}
          />
        </div>

        <div
          role="separator"
          aria-orientation="vertical"
          onPointerDown={handleResizerPointerDown}
          onPointerMove={handleResizerPointerMove}
          onPointerUp={handleResizerPointerUp}
          className="group relative w-2 shrink-0 cursor-col-resize touch-none select-none"
        >
          <div className="absolute left-1/2 top-1/2 h-10 w-1 -translate-x-1/2 -translate-y-1/2 rounded-full bg-slate-300 transition group-hover:bg-blue-400 group-active:bg-blue-500" />
        </div>

        <div className="relative min-w-0 flex-1 p-4">
          {notes.length > 0 ? (
            <CodeViewer
              openPaths={openPaths}
              activePath={activePath}
              onSelectTab={setActivePath}
              onCloseTab={closeTab}
              repo={repo}
            />
          ) : (
            <div className="flex h-full items-center justify-center text-sm text-slate-400">
              No steps recorded for this snippet yet.
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export function Play() {
  const { theme, snippetId } = useParams<{ theme: string; snippetId: string }>()
  const topic = theme ? getTopic(theme) : undefined
  const snippetsState = useSnippets(topic?.slug)

  if (!topic) {
    return <Navigate to="/" replace />
  }

  if (snippetsState.status === 'loading') {
    return <div className="flex h-screen items-center justify-center text-sm text-slate-400">Loading snippet…</div>
  }

  if (snippetsState.status === 'error') {
    return <div className="flex h-screen items-center justify-center text-sm text-slate-400">{snippetsState.message}</div>
  }

  const snippet = snippetsState.snippets.find((item) => slugify(item.title) === snippetId)
  if (!snippet) {
    return <Navigate to={`/${topic.slug}`} replace />
  }

  return <PlayDetail key={snippet.snippet_path} topic={topic} theme={topic.slug} snippetPath={snippet.snippet_path} />
}

function PlayDetail({ topic, theme, snippetPath }: { topic: Topic; theme: string; snippetPath: string }) {
  const detailState = useSnippetDetail(theme, snippetPath)

  if (detailState.status === 'loading') {
    return <div className="flex h-screen items-center justify-center text-sm text-slate-400">Loading snippet…</div>
  }

  if (detailState.status === 'error') {
    return <div className="flex h-screen items-center justify-center text-sm text-slate-400">{detailState.message}</div>
  }

  return (
    <CodeCommentServiceProvider>
      <PlayView topic={topic} content={detailState.content} />
    </CodeCommentServiceProvider>
  )
}
