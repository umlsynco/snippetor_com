const folders = ['/base', '/content', '/chrome', '/net', '/sandbox', '/ui', '/third_party', '...']

function FolderIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} className="h-4 w-4 shrink-0 text-blue-300">
      <path d="M3 6.5a1.5 1.5 0 0 1 1.5-1.5H9l2 2h8.5A1.5 1.5 0 0 1 21 8.5v9A1.5 1.5 0 0 1 19.5 19h-15A1.5 1.5 0 0 1 3 17.5v-11Z" />
    </svg>
  )
}

export function Hero() {
  return (
    <section id="home" className="relative overflow-hidden bg-gradient-to-br from-blue-50 via-blue-50/60 to-white">
      <div className="mx-auto grid max-w-6xl grid-cols-1 items-center gap-12 px-6 py-20 lg:grid-cols-2">
        <div>
          <p className="text-xs font-semibold tracking-[0.2em] text-slate-500">CODE · CONTEXT · DIAGRAMS</p>
          <h1 className="mt-4 text-5xl font-extrabold leading-tight tracking-tight text-slate-900">
            Chromium
            <br />
            Architecture Notes
          </h1>
          <p className="mt-6 max-w-md text-lg text-slate-600">
            A collection of short code walkthroughs and diagrams from my exploration of the Chromium codebase.
          </p>
          <p className="mt-4 max-w-md text-sm text-slate-400">Focused topics. Real code. Diagrams. No noise.</p>
        </div>

        <div className="relative hidden h-80 lg:block">
          {/* faint background cube outlines */}
          <svg viewBox="0 0 100 100" className="absolute inset-0 h-full w-full text-blue-200/60">
            <path d="M15 70 30 62 30 40 15 48Z" fill="none" stroke="currentColor" strokeWidth="0.5" />
            <path d="M15 48 30 40 45 48 30 56Z" fill="none" stroke="currentColor" strokeWidth="0.5" />
            <path d="M30 56 45 48 45 70 30 78Z" fill="none" stroke="currentColor" strokeWidth="0.5" />
            <path d="M70 85 85 78 85 60 70 67Z" fill="none" stroke="currentColor" strokeWidth="0.5" />
          </svg>

          {/* file tree card */}
          <div className="absolute left-0 top-4 w-64 rounded-xl border border-blue-100 bg-white p-4 shadow-xl">
            <p className="mb-3 font-mono text-sm italic text-slate-700">Chromium</p>
            <ul className="space-y-2">
              {folders.map((f) => (
                <li key={f} className="flex items-center gap-2 text-sm text-slate-500">
                  <FolderIcon />
                  <span className="font-mono">{f}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* code comment card */}
          <div className="absolute right-0 top-0 w-48 rounded-xl border border-slate-100 bg-slate-50 p-4 font-mono text-xs leading-relaxed text-slate-400 shadow-lg">
            <p>// Understand</p>
            <p>// Explore</p>
            <p>// Document</p>
            <p>// Share</p>
          </div>

          {/* diagram card */}
          <div className="absolute bottom-8 right-6 w-40 rounded-xl border border-slate-100 bg-white p-4 shadow-lg">
            <div className="flex flex-col items-center gap-3">
              <div className="h-8 w-full rounded-md border-2 border-slate-300" />
              <svg viewBox="0 0 24 10" className="h-3 w-6 text-slate-300">
                <path d="M0 5h20M15 1l5 4-5 4" fill="none" stroke="currentColor" strokeWidth="1.5" />
              </svg>
              <div className="h-8 w-full rounded-md border-2 border-slate-300" />
            </div>
          </div>

          <p className="absolute bottom-0 left-8 max-w-[11rem] text-right text-sm italic leading-snug text-slate-400">
            Better understanding builds better software.
          </p>
        </div>
      </div>
    </section>
  )
}
