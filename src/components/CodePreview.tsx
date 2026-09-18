import Prism from 'prismjs'
import 'prismjs/components/prism-c'
import 'prismjs/components/prism-cpp'
import { useMemo } from 'react'
import type { SnippetRepo } from '../types/snippet'
import type { SourceFileResult } from '../utils/sourceFiles'
import { repoShortName, sourceFileUrl } from '../utils/sourceFiles'
import { ExternalLinkIcon } from './icons'

function highlightLines(content: string): string[] {
  const grammar = Prism.languages.cpp ?? Prism.languages.clike
  const html = Prism.highlight(content, grammar, 'cpp')
  return html.split('\n')
}

export function CodePreview({
  path,
  repo,
  highlightLine,
  file,
}: {
  path: string
  repo: SnippetRepo
  highlightLine?: number
  file: SourceFileResult | undefined
}) {
  const lines = useMemo(() => {
    if (!file || file.status !== 'ready') return []
    return highlightLines(file.content)
  }, [file])

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center gap-2 border-b border-slate-100 px-4 py-2.5 text-sm text-slate-500">
        <span className="truncate font-mono">
          {repoShortName(repo)}/{repo.commitId.slice(0, 7)}:{path}
          {highlightLine ? `;l=${highlightLine}` : ''}
        </span>
        <a
          href={sourceFileUrl(repo, path)}
          target="_blank"
          rel="noreferrer"
          className="ml-auto shrink-0 text-slate-400 transition hover:text-blue-600"
          aria-label="Open raw file"
        >
          <ExternalLinkIcon className="h-4 w-4" />
        </a>
      </div>

      <div className="code-block flex-1 overflow-auto bg-white font-mono text-[13px] leading-6">
        {!file && <p className="p-4 text-sm text-slate-400">Loading…</p>}
        {file?.status === 'error' && (
          <p className="p-4 text-sm text-slate-400">{file.message} — preview not available for this file in the demo.</p>
        )}
        {file?.status === 'ready' && (
          <table className="w-full border-collapse">
            <tbody>
              {lines.map((lineHtml, index) => {
                const lineNumber = index + 1
                const isActive = lineNumber === highlightLine
                return (
                  <tr key={lineNumber} className={isActive ? 'bg-blue-50' : undefined}>
                    <td className="w-12 select-none border-r border-slate-100 px-2 text-right align-top text-slate-300">
                      {lineNumber}
                    </td>
                    <td className="whitespace-pre px-4">
                      <span dangerouslySetInnerHTML={{ __html: lineHtml || ' ' }} />
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}
