import { useEffect, useState } from 'react'
import { fetchSnippetDetail } from '../data/snippets'
import type { SnippetContent } from '../types/snippet'

export type SnippetDetailState =
  | { status: 'loading' }
  | { status: 'ready'; content: SnippetContent }
  | { status: 'error'; message: string }

export function useSnippetDetail(theme: string | undefined, snippetPath: string | undefined): SnippetDetailState {
  const key = theme && snippetPath ? `${theme}/${snippetPath}` : undefined
  const [loaded, setLoaded] = useState<{ key: string; result: SnippetDetailState } | null>(null)

  useEffect(() => {
    if (!theme || !snippetPath) return

    let cancelled = false
    fetchSnippetDetail(theme, snippetPath).then((result) => {
      if (!cancelled) setLoaded({ key: `${theme}/${snippetPath}`, result })
    })

    return () => {
      cancelled = true
    }
  }, [theme, snippetPath])

  // While the fetch for the current `key` is still in flight (or hasn't
  // started), report loading instead of a stale result from a prior snippet.
  if (!key || loaded?.key !== key) {
    return { status: 'loading' }
  }
  return loaded.result
}
