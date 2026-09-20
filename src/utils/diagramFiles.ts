// Resolves a diagram's path (as recorded in Snippet.uml_path, or a
// SnippetContent.diagrams filename joined onto its snippet's own folder via
// resolveDiagramPath below) against the theme's static folder -- mirrors
// sourceFileUrl in sourceFiles.ts, but under /theme/{theme}/ instead of
// /chromium/{commit}/.
export function diagramFileUrl(theme: string, path: string): string {
  return `/theme/${theme}/${path}`
}

// SnippetContent.diagrams entries are filenames only, resolved relative to
// the snippet file's own folder (see add_snippet.py's validate_diagrams) --
// this mirrors that resolution using the snippet's `snippet_path` (e.g.
// "init/profile_impl_lifecycle.snippet.json") to recover the folder.
export function resolveDiagramPath(snippetPath: string, diagramFileName: string): string {
  const folder = snippetPath.split('/').slice(0, -1).join('/')
  return folder ? `${folder}/${diagramFileName}` : diagramFileName
}

export type DiagramFileResult = { status: 'ready'; model: Record<string, unknown> } | { status: 'error'; message: string }

const cache = new Map<string, Promise<DiagramFileResult>>()

export function fetchDiagramModel(url: string): Promise<DiagramFileResult> {
  let pending = cache.get(url)
  if (!pending) {
    pending = fetch(url)
      .then(async (res): Promise<DiagramFileResult> => {
        if (!res.ok) return { status: 'error', message: `Diagram not found (${res.status})` }
        return { status: 'ready', model: await res.json() }
      })
      .catch((): DiagramFileResult => ({ status: 'error', message: 'Failed to load diagram' }))
    cache.set(url, pending)
  }
  return pending
}
