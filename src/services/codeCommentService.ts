import type { SnippetNote, SnippetRepo } from '../types/snippet'

export type CodeComment = {
  path: string
  line: number
  note: SnippetNote
  repo: SnippetRepo
  index: number
  total: number
  onPrev: () => void
  onNext: () => void
  onClose: () => void
}

type Listener = (comment: CodeComment | null) => void

// Decouples "which note is active" (owned by the Play page) from "where the
// dialog renders" (owned by whichever CodePreview currently matches the
// comment's path). A CodePreview subscribes and reacts to show/hide/update
// commands instead of receiving the comment through prop drilling.
export class CodeCommentService {
  private current: CodeComment | null = null
  private listeners = new Set<Listener>()

  getSnapshot = (): CodeComment | null => this.current

  subscribe = (listener: Listener): (() => void) => {
    this.listeners.add(listener)
    return () => {
      this.listeners.delete(listener)
    }
  }

  show(comment: CodeComment) {
    this.current = comment
    this.notify()
  }

  hide() {
    if (!this.current) return
    this.current = null
    this.notify()
  }

  private notify() {
    for (const listener of this.listeners) listener(this.current)
  }
}
