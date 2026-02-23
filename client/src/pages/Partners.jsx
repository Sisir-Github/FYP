const partners = [
  { name: 'Himalayan Air', detail: 'Scenic flight partner' },
  { name: 'Summit Lodges', detail: 'Mountain lodge network' },
  { name: 'Everest Gear', detail: 'Equipment supplier' },
  { name: 'Local Porters Association', detail: 'Porter coordination' },
]

function Partners() {
  return (
    <div className="container-shell py-12">
      <h1 className="font-display text-3xl text-ink">Partners & Affiliates</h1>
      <p className="mt-2 text-sm text-slate-600">
        Local partnerships that keep every expedition safe and sustainable.
      </p>
      <div className="mt-8 grid gap-4 md:grid-cols-2">
        {partners.map((partner) => (
          <div key={partner.name} className="card-surface p-6">
            <p className="text-sm font-semibold text-ink">{partner.name}</p>
            <p className="mt-2 text-sm text-slate-600">{partner.detail}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Partners
