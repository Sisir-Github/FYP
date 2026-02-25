function Footer() {
  return (
    <footer className="border-t border-blue-100 bg-white/80">
      <div className="container-shell grid gap-6 py-10 md:grid-cols-4">
        <div>
          <h3 className="font-display text-lg text-ink">
            Everest Encounter Treks
          </h3>
          <p className="mt-3 text-sm text-slate-600">
            Curated Himalayan adventures with local guides, responsible travel,
            and unforgettable summit stories.
          </p>
        </div>
        <div>
          <h4 className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-600">
            Contact
          </h4>
          <p className="mt-3 text-sm text-slate-600">
            Thamel, Kathmandu, Nepal
          </p>
          <p className="text-sm text-slate-600">info@everestencounter.com</p>
          <p className="text-sm text-slate-600">+977 01 4440000</p>
        </div>
        <div>
          <h4 className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-600">
            Quick Links
          </h4>
          <ul className="mt-3 space-y-2 text-sm text-slate-600">
            <li>
              <a href="/faq">FAQ</a>
            </li>
            <li>
              <a href="/partners">Partners</a>
            </li>
            <li>
              <a href="/trust">Trust & Safety</a>
            </li>
            <li>
              <a href="/calculator">Cost Calculator</a>
            </li>
          </ul>
        </div>
        <div>
          <h4 className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-600">
            Newsletter
          </h4>
          <p className="mt-3 text-sm text-slate-600">
            Seasonal deals, expedition news, and last-minute seat alerts.
          </p>
          <form className="mt-4 flex gap-2">
            <input
              type="email"
              placeholder="Email address"
              className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"
            />
            <button
              type="button"
              className="rounded-xl bg-blue-700 px-3 py-2 text-xs font-semibold text-white"
            >
              Join
            </button>
          </form>
        </div>
      </div>
      <div className="border-t border-blue-100 py-4 text-center text-xs text-slate-500">
        (c) {new Date().getFullYear()} Everest Encounter Treks and Expedition Pvt.
        Ltd. All rights reserved.
      </div>
    </footer>
  )
}

export default Footer
