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

        <div className="hidden lg:block">
          <img src="/images/hero.png" alt="" className="w-full" />
        </div>
      </div>
    </section>
  )
}
