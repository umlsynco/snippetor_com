import type { Snippet } from '../types/snippet'

export type SnippetsResult = { status: 'ready'; snippets: Snippet[] } | { status: 'error'; message: string }

const cache = new Map<string, Promise<SnippetsResult>>()

export function fetchSnippets(theme: string): Promise<SnippetsResult> {
  let pending = cache.get(theme)
  if (!pending) {
    pending = fetch(`/theme/${theme}/list.json`)
      .then(async (res): Promise<SnippetsResult> => {
        if (!res.ok) return { status: 'error', message: `Failed to load snippets (${res.status})` }
        const snippets = (await res.json()) as Snippet[]
        return { status: 'ready', snippets }
      })
      .catch((): SnippetsResult => ({ status: 'error', message: 'Failed to load snippets' }))
    cache.set(theme, pending)
  }
  return pending
}
