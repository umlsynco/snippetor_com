import type { Snippet } from '../types/snippet'

const modules = import.meta.glob<Snippet[]>('../assets/*/index.json', {
  eager: true,
  import: 'default',
})

const snippetsByTheme = new Map<string, Snippet[]>()

for (const [path, data] of Object.entries(modules)) {
  const theme = path.match(/\.\.\/assets\/([^/]+)\/index\.json$/)?.[1]
  if (theme) {
    snippetsByTheme.set(theme, data)
  }
}

export function getSnippets(theme: string): Snippet[] {
  return snippetsByTheme.get(theme) ?? []
}
