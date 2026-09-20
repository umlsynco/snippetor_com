import { useEffect, useRef, useState } from 'react'
import * as UMLSync from 'umlsync'
import { fetchDiagramModel } from '../utils/diagramFiles'

// umlsync's DiagramThumbnailRenderer only knows how to render these
// nameTemplates (see its bundled loadDiagram switch); anything else
// silently no-ops (returns "" instead of rendering) if handed to it.
const SUPPORTED_TEMPLATES = new Set([
  'classDiagram',
  'packageDiagram',
  'componentsDiagram',
  'stateDiagram',
  'sequenceDiagram',
])

interface DiagramElement {
  left?: number
  top?: number
  width?: number
  height?: number
}

// umlsync's own DiagramThumbnailRenderer clips elements against its *local*
// (pre-zoom) coordinate space -- an element positioned beyond the renderer's
// own `width`/`height` options is dropped entirely by an `overflow: hidden`
// it sets on the diagram's own node, before the zoom transform ever runs (so
// zoom alone can't "zoom out" to reveal more; it only shrinks what already
// survived that clip). So the world passed to it has to cover the diagram's
// full extent -- its own declared canvas, widened to fit any element that
// spills past it -- and zoom is computed from that to fit the whole thing
// into the thumbnail box instead of an arbitrary crop of it.
function estimateDiagramExtent(model: Record<string, unknown>): { width: number; height: number } {
  let width = Number(model.width) || 1000
  let height = Number(model.height) || 600
  const elements = Array.isArray(model.elements) ? (model.elements as DiagramElement[]) : []
  for (const element of elements) {
    const right = Number(element?.left) + Number(element?.width)
    const bottom = Number(element?.top) + Number(element?.height)
    if (Number.isFinite(right)) width = Math.max(width, right)
    if (Number.isFinite(bottom)) height = Math.max(height, bottom)
  }
  return { width, height }
}

// Static, read-only diagram preview for a SnippetCard's placeholder box.
// Fetches the diagram model itself (SnippetCard only has the card-grid
// summary, not the full snippet detail) and fills the box behind the
// existing play-button overlay; renders nothing (leaving the plain
// placeholder background visible) while loading, on fetch failure, or for a
// diagram type the thumbnail renderer can't draw -- the play button and
// border/background are still there either way.
export function UmlThumbnail({ url }: { url: string }) {
  const containerRef = useRef<HTMLDivElement>(null)
  const uniqueIdRef = useRef(`uml-thumbnail-${Math.random().toString(36).substring(2, 11)}`)
  const initializedRef = useRef(false)
  const [model, setModel] = useState<Record<string, unknown>>()

  useEffect(() => {
    let cancelled = false
    fetchDiagramModel(url).then((result) => {
      if (!cancelled && result.status === 'ready') setModel(result.model)
    })
    return () => {
      cancelled = true
    }
  }, [url])

  const supported = typeof model?.nameTemplate === 'string' && SUPPORTED_TEMPLATES.has(model.nameTemplate)

  useEffect(() => {
    if (initializedRef.current || !supported || !containerRef.current || !model) return
    initializedRef.current = true

    const rect = containerRef.current.getBoundingClientRect()
    const extent = estimateDiagramExtent(model)
    // Shrink the whole (uncropped) extent down to fit the box -- capped at 1
    // so a diagram smaller than the box isn't blown up past its own size.
    const zoom = rect.width > 0 && rect.height > 0 ? Math.min(rect.width / extent.width, rect.height / extent.height, 1) : 0.2

    const renderer = new (UMLSync as any).DiagramThumbnailRenderer({
      width: extent.width,
      height: extent.height,
      zoom,
      prefix: uniqueIdRef.current,
    })
    renderer.loadDiagram(model, `#${uniqueIdRef.current}`)
  }, [model, supported])

  if (!supported) return null

  return (
    <div
      ref={containerRef}
      id={uniqueIdRef.current}
      className="absolute inset-0 [&_canvas]:h-full [&_canvas]:w-full [&_svg]:h-full [&_svg]:w-full"
    />
  )
}
