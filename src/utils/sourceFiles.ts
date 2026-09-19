import type { SnippetRepo } from '../types/snippet'

export const DEFAULT_REPO: SnippetRepo = {
  url: 'https://chromium.googlesource.com/chromium/src',
  commitId: 'test_sha',
  branch: 'main',
}

export function repoShortName(repo: SnippetRepo): string {
  const match = repo.url.match(/([^/]+\/[^/]+?)(\.git)?$/)
  return match ? match[1] : repo.url
}

export function sourceFileUrl(repo: SnippetRepo, path: string): string {
  return `/chromium/${repo.commitId}/${path}`
}

export type SourceFileResult = { status: 'ready'; content: string } | { status: 'error'; message: string }

const cache = new Map<string, Promise<SourceFileResult>>()

export function fetchSourceFile(url: string): Promise<SourceFileResult> {
  let pending = cache.get(url)
  if (!pending) {
    pending = fetch(url)
      .then(async (res): Promise<SourceFileResult> => {
        if (!res.ok) return { status: 'error', message: `File not found (${res.status})` }
        return { status: 'ready', content: await res.text() }
      })
      .catch((): SourceFileResult => ({ status: 'error', message: 'Failed to load file' }))
    cache.set(url, pending)
  }
  return pending
}
