export interface SnippetNote {
  path: string
  line: number
  text: string
  rid?: number
}

export interface SnippetRepo {
  id?: number
  url: string
  commitId: string
  branch: string
}

// Shape of an entry in public/theme/{theme}/list.json, as written by
// scripts/add_snippet.py. Notes/repos live in the separate detail file at
// `snippet_path` (see SnippetContent below).
export interface Snippet {
  title: string
  description: string
  modified: number
  uml_path: string
  snippet_path: string
}

// Shape of the per-snippet detail file referenced by `Snippet.snippet_path`
// (public/theme/{theme}/{snippet_path}), as written by scripts/add_snippet.py.
export interface SnippetContent {
  schema: number
  title: string
  description: string
  version: number
  created: number
  modified: number
  repos?: SnippetRepo[]
  notes: SnippetNote[]
  diagrams?: string[]
}

export interface SnippetFile {
  content: SnippetContent
}
