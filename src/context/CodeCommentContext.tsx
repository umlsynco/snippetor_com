import { createContext, useContext, useMemo, useSyncExternalStore, type ReactNode } from 'react'
import { CodeCommentService, type CodeComment } from '../services/codeCommentService'

const CodeCommentServiceContext = createContext<CodeCommentService | null>(null)

export function CodeCommentServiceProvider({ children }: { children: ReactNode }) {
  const service = useMemo(() => new CodeCommentService(), [])
  return <CodeCommentServiceContext.Provider value={service}>{children}</CodeCommentServiceContext.Provider>
}

export function useCodeCommentService(): CodeCommentService {
  const service = useContext(CodeCommentServiceContext)
  if (!service) throw new Error('useCodeCommentService must be used within a CodeCommentServiceProvider')
  return service
}

// Subscribes a component to the current comment command (show/hide/update).
export function useCodeComment(): CodeComment | null {
  const service = useCodeCommentService()
  return useSyncExternalStore(service.subscribe, service.getSnapshot)
}
