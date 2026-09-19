import { useState } from 'react'
import { Navigate, useParams } from 'react-router-dom'
import { CodeViewer } from '../components/CodeViewer'
import { SnippetComment } from '../components/SnippetComment'
import { SnippetNotes } from '../components/SnippetNotes'
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

function PlayView({ topic, content }: { topic: Topic; content: SnippetContent }) {
  const notes = content.notes ?? []
  const repo = resolveRepo(content)
  const uniquePaths = Array.from(new Set(notes.map((note) => note.path)))

  const [activeIndex, setActiveIndex] = useState(0)
  const [openPaths, setOpenPaths] = useState<string[]>(uniquePaths)
  const [activePath, setActivePath] = useState<string | undefined>(uniquePaths[0])
  const [commentVisible, setCommentVisible] = useState(true)

  const activeNote = notes[activeIndex]

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
      <div className="flex flex-1 overflow-hidden">
        <div className="w-80 shrink-0">
          <SnippetNotes
            backHref={`/${topic.slug}`}
            title={topic.pageTitle}
            notes={notes}
            repo={repo}
            activeIndex={activeIndex}
            onSelect={selectNote}
          />
        </div>

        <div className="relative min-w-0 flex-1 p-4">
          {notes.length > 0 ? (
            <CodeViewer
              openPaths={openPaths}
              activePath={activePath}
              onSelectTab={setActivePath}
              onCloseTab={closeTab}
              repo={repo}
              highlightPath={activeNote?.path}
              highlightLine={activeNote?.line}
            />
          ) : (
            <div className="flex h-full items-center justify-center text-sm text-slate-400">
              No steps recorded for this snippet yet.
            </div>
          )}

          {commentVisible && activeNote && (
            <SnippetComment
              note={activeNote}
              repo={repo}
              index={activeIndex}
              total={notes.length}
              onPrev={() => selectNote(activeIndex - 1)}
              onNext={() => selectNote(activeIndex + 1)}
              onClose={() => setCommentVisible(false)}
            />
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

  return <PlayView topic={topic} content={detailState.content} />
}
