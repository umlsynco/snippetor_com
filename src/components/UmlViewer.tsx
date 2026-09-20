import { useEffect, useRef } from 'react'
import * as UMLSync from 'umlsync'

// Read-only UML diagram viewer, backed by umlsync's own DiagramViewer (as
// opposed to its DiagramEditor, which also drives the drag/resize/edit UI
// this app never needs -- see umlsync's examples/index.view.html for the
// same "view mode" usage this mirrors). `fitToParent: true` has it measure
// this component's own wrapper div on every #updateDimention call, so a
// ResizeObserver on that same div is enough to keep it in sync with layout
// changes (tab switches, the Play page's draggable sidebar, window resize).
export function UmlViewer({ diagramModel }: { diagramModel: Record<string, unknown> }) {
  const containerRef = useRef<HTMLDivElement>(null)
  const uniqueIdRef = useRef(`uml-viewer-${Math.random().toString(36).substring(2, 11)}`)
  const viewerRef = useRef<any>(null)
  // Guards against React StrictMode's dev-mode double-invoke -- umlsync's
  // DiagramViewer isn't idempotent to construct twice against the same
  // container (it binds jQuery/DOM state).
  const initializedRef = useRef(false)

  useEffect(() => {
    if (initializedRef.current || !containerRef.current) return
    initializedRef.current = true

    viewerRef.current = new (UMLSync as any).DiagramViewer(`#${uniqueIdRef.current}`, { fitToParent: true, id: 1 })
  }, [])

  useEffect(() => {
    if (!viewerRef.current || !diagramModel) return
    // Cloned so umlsync's own loadDiagram (which stamps a fresh internal id
    // onto whatever object it's handed) never mutates the cached fetch
    // result this prop is fed from.
    viewerRef.current.loadDiagram({ ...diagramModel }, { editmode: false })
  }, [diagramModel])

  useEffect(() => {
    if (!containerRef.current) return
    const observer = new ResizeObserver(() => {
      viewerRef.current?.setOption('dimention', {})
    })
    observer.observe(containerRef.current)
    return () => observer.disconnect()
  }, [])

  return <div ref={containerRef} id={uniqueIdRef.current} className="h-full w-full overflow-auto bg-[#f6f7f9]" />
}
