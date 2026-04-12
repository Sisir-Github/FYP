import { useGetGalleryQuery } from '../api/galleryApi.js'
import Loader from '../components/Loader.jsx'
import { useLanguage } from '../contexts/LanguageContext.jsx'

function Gallery() {
  const { t } = useLanguage()
  const { data, isLoading, error } = useGetGalleryQuery()
  const apiBase = import.meta.env.VITE_API_URL || 'http://localhost:5000'
  const rawItems = data?.items ?? data?.data?.items ?? data?.data ?? data
  const items = Array.isArray(rawItems) ? rawItems : []
  const resolveImage = (src) =>
    src?.startsWith('/uploads') ? `${apiBase}${src}` : src

  if (isLoading) {
    return (
      <div className="container-shell py-12">
        <Loader label="Loading gallery..." />
      </div>
    )
  }

  return (
    <div className="container-shell py-12">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-blue-600">
            Visual Stories
          </p>
          <h1 className="mt-3 font-display text-3xl text-ink">
            {t('navGallery')}
          </h1>
          <p className="mt-2 text-sm text-slate-600">
            Moments from trekking routes, mountain landscapes, and expedition
            operations.
          </p>
        </div>
      </div>

      {error ? (
        <div className="mt-8 rounded-2xl bg-rose-50 p-4 text-sm text-rose-700">
          Unable to load gallery items right now.
        </div>
      ) : items.length === 0 ? (
        <div className="mt-8 rounded-2xl bg-slate-50 p-6 text-sm text-slate-600">
          Gallery content has not been added yet.
        </div>
      ) : (
        <div className="mt-8 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {items.map((item) => (
            <article key={item._id || item.title} className="card-surface p-4">
              <img
                src={resolveImage(item.image)}
                alt={item.title}
                className="h-56 w-full rounded-2xl object-cover"
              />
              <p className="mt-4 text-sm font-semibold text-ink">
                {item.title}
              </p>
              <p className="mt-1 text-xs uppercase tracking-[0.2em] text-blue-600">
                {item.category}
              </p>
              {item.description && (
                <p className="mt-3 text-sm text-slate-600">
                  {item.description}
                </p>
              )}
            </article>
          ))}
        </div>
      )}
    </div>
  )
}

export default Gallery
