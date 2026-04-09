import { useLanguage } from '../contexts/LanguageContext.jsx'

const checklist = [
  'Build trekking fitness with regular walking, stairs, and light cardio.',
  'Carry valid travel documents, permits, and emergency contact details.',
  'Prepare layered clothing for changing mountain temperatures.',
  'Use broken-in trekking boots, sun protection, and a reusable water bottle.',
]

const safetyNotes = [
  'Acclimatize gradually and report altitude symptoms early.',
  'Follow guide instructions on trail, weather, and pace changes.',
  'Keep basic medicines, insurance details, and personal essentials ready.',
]

function Guide() {
  const { t } = useLanguage()

  return (
    <div className="container-shell py-12">
      <div className="mx-auto max-w-4xl space-y-8">
        <section className="card-surface p-8">
          <p className="text-xs uppercase tracking-[0.3em] text-blue-600">
            Expedition Planning
          </p>
          <h1 className="mt-3 font-display text-3xl text-ink">
            {t('guideTitle')}
          </h1>
          <p className="mt-4 text-sm text-slate-600">
            Use this quick guide to prepare for trekking conditions, essential
            gear, permit checks, and altitude safety before departure.
          </p>
        </section>

        <section className="grid gap-6 md:grid-cols-2">
          <div className="card-surface p-6">
            <h2 className="font-display text-2xl text-ink">
              Pre-departure checklist
            </h2>
            <ul className="mt-4 space-y-3 text-sm text-slate-600">
              {checklist.map((item) => (
                <li key={item}>- {item}</li>
              ))}
            </ul>
          </div>
          <div className="card-surface p-6">
            <h2 className="font-display text-2xl text-ink">Safety notes</h2>
            <ul className="mt-4 space-y-3 text-sm text-slate-600">
              {safetyNotes.map((item) => (
                <li key={item}>- {item}</li>
              ))}
            </ul>
          </div>
        </section>

        <section className="card-surface p-6">
          <h2 className="font-display text-2xl text-ink">
            Recommended packing focus
          </h2>
          <div className="mt-4 grid gap-4 md:grid-cols-3">
            <div className="rounded-2xl bg-slate-50 p-4 text-sm text-slate-600">
              <p className="font-semibold text-ink">Clothing</p>
              <p className="mt-2">
                Thermal layers, fleece, waterproof shell, gloves, and warm cap.
              </p>
            </div>
            <div className="rounded-2xl bg-slate-50 p-4 text-sm text-slate-600">
              <p className="font-semibold text-ink">Equipment</p>
              <p className="mt-2">
                Trekking poles, daypack, headlamp, bottle, and power bank.
              </p>
            </div>
            <div className="rounded-2xl bg-slate-50 p-4 text-sm text-slate-600">
              <p className="font-semibold text-ink">Documents</p>
              <p className="mt-2">
                Passport copy, insurance, permits, and emergency contacts.
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}

export default Guide
