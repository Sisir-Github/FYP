import { useState } from 'react'

function Calculator() {
  const [days, setDays] = useState(10)
  const [people, setPeople] = useState(2)
  const [porters, setPorters] = useState(0)
  const [guide, setGuide] = useState(true)
  const [flights, setFlights] = useState(false)

  const baseRate = 150
  const guideRate = 35
  const porterRate = 20
  const flightCost = 320

  const total =
    days * people * baseRate +
    (guide ? days * guideRate : 0) +
    porters * days * porterRate +
    (flights ? people * flightCost : 0)

  return (
    <div className="container-shell py-12">
      <h1 className="font-display text-3xl text-ink">Trip Cost Calculator</h1>
      <p className="mt-2 text-sm text-slate-600">
        Estimate your trek cost based on group size, duration, and services.
      </p>
      <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_0.9fr]">
        <form className="card-surface space-y-4 p-6">
          <div>
            <label className="text-xs uppercase tracking-[0.2em] text-slate-500">
              Number of people
            </label>
            <input
              type="number"
              min="1"
              value={people}
              onChange={(event) => setPeople(Number(event.target.value || 1))}
              className="mt-2 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"
            />
          </div>
          <div>
            <label className="text-xs uppercase tracking-[0.2em] text-slate-500">
              Trek length (days)
            </label>
            <input
              type="number"
              min="1"
              value={days}
              onChange={(event) => setDays(Number(event.target.value || 1))}
              className="mt-2 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"
            />
          </div>
          <div>
            <label className="text-xs uppercase tracking-[0.2em] text-slate-500">
              Porters
            </label>
            <input
              type="number"
              min="0"
              value={porters}
              onChange={(event) => setPorters(Number(event.target.value || 0))}
              className="mt-2 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"
            />
          </div>
          <label className="flex items-center gap-2 text-sm text-slate-600">
            <input
              type="checkbox"
              checked={guide}
              onChange={(event) => setGuide(event.target.checked)}
            />
            Include certified guide
          </label>
          <label className="flex items-center gap-2 text-sm text-slate-600">
            <input
              type="checkbox"
              checked={flights}
              onChange={(event) => setFlights(event.target.checked)}
            />
            Add domestic flights
          </label>
        </form>
        <div className="card-surface p-6">
          <h2 className="font-display text-2xl text-ink">Estimated Total</h2>
          <p className="mt-3 text-sm text-slate-600">
            Based on the selections above.
          </p>
          <div className="mt-6 rounded-2xl bg-blue-50 p-6 text-center">
            <p className="text-4xl font-semibold text-blue-700">
              USD {total.toFixed(0)}
            </p>
            <p className="mt-2 text-xs text-slate-500">
              Prices vary by season and permits.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Calculator
