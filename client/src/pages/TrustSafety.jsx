function TrustSafety() {
  return (
    <div className="container-shell py-12">
      <h1 className="font-display text-3xl text-ink">Trust & Safety</h1>
      <p className="mt-2 text-sm text-slate-600">
        Our safety protocols and traveler protections.
      </p>
      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <div className="card-surface p-6">
          <h2 className="font-display text-2xl text-ink">Secure Checkout</h2>
          <p className="mt-3 text-sm text-slate-600">
            Payments are processed through Stripe, bank transfer, or Khalti with
            encrypted transactions.
          </p>
        </div>
        <div className="card-surface p-6">
          <h2 className="font-display text-2xl text-ink">Cancellation Policy</h2>
          <p className="mt-3 text-sm text-slate-600">
            Flexible rescheduling with refunds based on partner coverage and
            notice periods.
          </p>
        </div>
        <div className="card-surface p-6">
          <h2 className="font-display text-2xl text-ink">Health Protocols</h2>
          <p className="mt-3 text-sm text-slate-600">
            Altitude monitoring, emergency evacuation plans, and daily medical
            checks by team leaders.
          </p>
        </div>
        <div className="card-surface p-6">
          <h2 className="font-display text-2xl text-ink">
            COVID & Travel Health
          </h2>
          <p className="mt-3 text-sm text-slate-600">
            We align with local health advisories and maintain hygiene protocols
            for lodges, transport, and shared equipment.
          </p>
        </div>
        <div className="card-surface p-6">
          <h2 className="font-display text-2xl text-ink">
            Certifications & Affiliations
          </h2>
          <p className="mt-3 text-sm text-slate-600">
            Licensed guides, certified operators, and compliance with Nepal
            tourism regulations.
          </p>
        </div>
      </div>
    </div>
  )
}

export default TrustSafety
