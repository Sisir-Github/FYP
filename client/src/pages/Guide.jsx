function Guide() {
  return (
    <div className="container-shell py-12">
      <h1 className="font-display text-3xl text-ink">
        Pre-departure Guide & Preparation
      </h1>
      <p className="mt-2 text-sm text-slate-600">
        Plan your fitness, permits, and gear checklist before heading to the
        Himalayas.
      </p>
      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <div className="card-surface p-6">
          <h2 className="font-display text-2xl text-ink">Fitness & Training</h2>
          <ul className="mt-4 space-y-2 text-sm text-slate-600">
            <li>- Build endurance with 3-4 hikes per week</li>
            <li>- Add stair climbs and weighted pack training</li>
            <li>- Practice breathing routines for altitude adaptation</li>
          </ul>
        </div>
        <div className="card-surface p-6">
          <h2 className="font-display text-2xl text-ink">Permits Required</h2>
          <ul className="mt-4 space-y-2 text-sm text-slate-600">
            <li>- TIMS Card</li>
            <li>- Sagarmatha National Park Permit</li>
            <li>- Annapurna Conservation Area Permit (ACAP)</li>
          </ul>
        </div>
        <div className="card-surface p-6">
          <h2 className="font-display text-2xl text-ink">
            Safety & Emergency Plan
          </h2>
          <ul className="mt-4 space-y-2 text-sm text-slate-600">
            <li>- Daily health checks by trek leaders</li>
            <li>- Emergency evacuation protocols (heli support)</li>
            <li>- Satellite communication for remote sections</li>
          </ul>
        </div>
        <div className="card-surface p-6">
          <h2 className="font-display text-2xl text-ink">
            Packing Checklist
          </h2>
          <ul className="mt-4 space-y-2 text-sm text-slate-600">
            <li>- Base layers, fleece, down jacket</li>
            <li>- Waterproof shell and trekking boots</li>
            <li>- Headlamp, water bottles, trekking poles</li>
          </ul>
        </div>
      </div>
    </div>
  )
}

export default Guide
