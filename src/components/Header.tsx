import { GithubIcon } from './icons'

export function Header() {
  return (
    <header className="border-b border-slate-200 bg-white">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <div>
          <p className="text-lg font-bold tracking-tight text-slate-900">Snippetor</p>
          <p className="text-xs text-slate-500">Chromium Architecture Notes</p>
        </div>
        <nav className="flex items-center gap-6 text-sm font-medium">
          <a href="#home" className="border-b-2 border-blue-600 pb-1 text-blue-600">
            Home
          </a>
          <a href="#about" className="text-slate-600 transition hover:text-slate-900">
            About
          </a>
          <a
            href="https://github.com"
            target="_blank"
            rel="noreferrer"
            className="text-slate-700 transition hover:text-slate-900"
            aria-label="GitHub"
          >
            <GithubIcon className="h-5 w-5" />
          </a>
        </nav>
      </div>
    </header>
  )
}
