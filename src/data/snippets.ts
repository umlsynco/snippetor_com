import type { Snippet, SnippetContent, SnippetFile } from '../types/snippet'

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

export type SnippetDetailResult = { status: 'ready'; content: SnippetContent } | { status: 'error'; message: string }

const detailCache = new Map<string, Promise<SnippetDetailResult>>()

// Fetches the per-snippet detail file at public/theme/{theme}/{snippetPath}
// (Snippet.snippet_path), which holds the notes/repos that list.json omits.
export function fetchSnippetDetail(theme: string, snippetPath: string): Promise<SnippetDetailResult> {
  const key = `${theme}/${snippetPath}`
  let pending = detailCache.get(key)
  if (!pending) {
    pending = fetch(`/theme/${key}`)
      .then(async (res): Promise<SnippetDetailResult> => {
        if (!res.ok) return { status: 'error', message: `Failed to load snippet (${res.status})` }
        const file = (await res.json()) as SnippetFile
        return { status: 'ready', content: file.content }
      })
      .catch((): SnippetDetailResult => ({ status: 'error', message: 'Failed to load snippet' }))
    detailCache.set(key, pending)
  }
  return pending
}
