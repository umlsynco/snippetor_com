import { Link } from 'react-router-dom'

export function Breadcrumb({ current }: { current: string }) {
  return (
    <nav className="border-b border-slate-200 bg-white">
      <div className="mx-auto max-w-6xl px-6 py-3 text-sm text-slate-500">
        <Link to="/" className="hover:text-slate-900">
          Home
        </Link>
        <span className="mx-2 text-slate-300">&gt;</span>
        <span className="text-slate-700">{current}</span>
      </div>
    </nav>
  )
}
