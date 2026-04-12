import { useLanguage } from '../contexts/LanguageContext.jsx'

function About() {
  const { t } = useLanguage()
  return (
    <div className="container-shell py-12">
      <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="space-y-6">
          <h1 className="font-display text-3xl text-ink">{t('aboutTitle')}</h1>
          <p className="text-slate-600">
            {t('aboutIntro1')}
          </p>
          <p className="text-slate-600">
            {t('aboutIntro2')}
          </p>
          <div className="card-surface grid gap-4 p-6 md:grid-cols-3">
            <div>
              <p className="text-2xl font-semibold text-ink">20+</p>
              <p className="text-sm text-slate-500">{t('aboutStatYears')}</p>
            </div>
            <div>
              <p className="text-2xl font-semibold text-ink">3500+</p>
              <p className="text-sm text-slate-500">{t('aboutStatTrekkers')}</p>
            </div>
            <div>
              <p className="text-2xl font-semibold text-ink">12</p>
              <p className="text-sm text-slate-500">{t('aboutStatRoutes')}</p>
            </div>
          </div>
          <div className="card-surface p-6">
            <h2 className="font-display text-2xl text-ink">{t('aboutTeamTitle')}</h2>
            <div className="mt-4 grid gap-4 md:grid-cols-2">
              <div className="rounded-xl border border-slate-100 bg-white p-4">
                <p className="font-semibold text-ink">Sisir K.</p>
                <p className="text-xs uppercase tracking-[0.2em] text-blue-600">
                  {t('aboutRoleLeadGuide')}
                </p>
                <p className="mt-2 text-sm text-slate-600">
                  {t('aboutRoleLeadGuideBody')}
                </p>
              </div>
              <div className="rounded-xl border border-slate-100 bg-white p-4">
                <p className="font-semibold text-ink">Nima Sherpa</p>
                <p className="text-xs uppercase tracking-[0.2em] text-blue-600">
                  {t('aboutRoleOps')}
                </p>
                <p className="mt-2 text-sm text-slate-600">
                  {t('aboutRoleOpsBody')}
                </p>
              </div>
              <div className="rounded-xl border border-slate-100 bg-white p-4">
                <p className="font-semibold text-ink">Rita Gurung</p>
                <p className="text-xs uppercase tracking-[0.2em] text-blue-600">
                  {t('aboutRoleCulture')}
                </p>
                <p className="mt-2 text-sm text-slate-600">
                  {t('aboutRoleCultureBody')}
                </p>
              </div>
              <div className="rounded-xl border border-slate-100 bg-white p-4">
                <p className="font-semibold text-ink">Tenzing L.</p>
                <p className="text-xs uppercase tracking-[0.2em] text-blue-600">
                  {t('aboutRoleSafety')}
                </p>
                <p className="mt-2 text-sm text-slate-600">
                  {t('aboutRoleSafetyBody')}
                </p>
              </div>
            </div>
          </div>
        </div>
        <div className="card-surface flex flex-col justify-between p-6">
          <div>
            <h2 className="font-display text-2xl text-ink">{t('aboutPromiseTitle')}</h2>
            <ul className="mt-4 space-y-3 text-sm text-slate-600">
              <li>{t('aboutPromiseItem1')}</li>
              <li>{t('aboutPromiseItem2')}</li>
              <li>{t('aboutPromiseItem3')}</li>
              <li>{t('aboutPromiseItem4')}</li>
            </ul>
          </div>
          <div className="mt-6 rounded-xl bg-blue-700/10 p-4 text-sm text-blue-800">
            {t('aboutPromiseNote')}
          </div>
        </div>
      </div>
    </div>
  )
}

export default About
