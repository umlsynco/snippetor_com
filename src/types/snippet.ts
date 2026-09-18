export interface SnippetNote {
  path: string
  line: number
  text: string
}

export interface SnippetRepo {
  url: string
  commitId: string
  branch: string
}

export interface Snippet {
  title: string
  description: string
  modified: string
  projects: string[]
  uml_path: string
  snippet_path: string
  notes?: SnippetNote[]
  repo?: SnippetRepo
}
