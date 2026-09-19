import { useEffect, useState } from 'react'
import { fetchSnippets } from '../data/snippets'
import type { Snippet } from '../types/snippet'

export type SnippetsState =
  | { status: 'loading' }
  | { status: 'ready'; snippets: Snippet[] }
  | { status: 'error'; message: string }

export function useSnippets(theme: string | undefined): SnippetsState {
  const [loaded, setLoaded] = useState<{ theme: string; result: SnippetsState } | null>(null)

  useEffect(() => {
    if (!theme) return

    let cancelled = false
    fetchSnippets(theme).then((result) => {
      if (!cancelled) setLoaded({ theme, result })
    })

    return () => {
      cancelled = true
    }
  }, [theme])

  // While the fetch for the current `theme` is still in flight (or hasn't
  // started), report loading instead of a stale result from a prior theme.
  if (!theme || loaded?.theme !== theme) {
    return { status: 'loading' }
  }
  return loaded.result
}
