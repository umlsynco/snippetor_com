import { GithubIcon } from './icons'

export function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-slate-50">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-3 px-6 py-8 text-sm text-slate-500 sm:flex-row">
        <div className="text-center sm:text-left">
          <p className="font-bold text-slate-900">Snippetor</p>
          <p>Chromium Architecture Notes · Just code, context and diagrams.</p>
        </div>
        <a
          href="https://github.com"
          target="_blank"
          rel="noreferrer"
          className="flex items-center gap-2 transition hover:text-slate-900"
        >
          <GithubIcon className="h-4 w-4" />
          <span>Open source on GitHub</span>
          <span className="text-slate-300">|</span>
          <span>Built with curiosity</span>
        </a>
      </div>
    </footer>
  )
}
