import { useState } from 'react'
import { Navigate, useParams } from 'react-router-dom'
import { CodeViewer } from '../components/CodeViewer'
import { SnippetComment } from '../components/SnippetComment'
import { SnippetNotes } from '../components/SnippetNotes'
import { getSnippets } from '../data/snippets'
import { getTopic, type Topic } from '../data/topics'
import type { Snippet } from '../types/snippet'
import { DEFAULT_REPO } from '../utils/sourceFiles'
import { slugify } from '../utils/slug'

function PlayView({ topic, snippet }: { topic: Topic; snippet: Snippet }) {
  const notes = snippet.notes ?? []
  const repo = snippet.repo ?? DEFAULT_REPO
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
  const snippet = topic ? getSnippets(topic.slug).find((item) => slugify(item.title) === snippetId) : undefined

  if (!topic || !snippet) {
    return <Navigate to={topic ? `/${topic.slug}` : '/'} replace />
  }

  return <PlayView key={snippet.snippet_path} topic={topic} snippet={snippet} />
}
