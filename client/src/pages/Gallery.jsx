import { useGetGalleryQuery } from '../api/galleryApi.js'

const galleryImages = {
  hero: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=1200&q=80',
  airplane:
    'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=900&q=80',
  heli:
    'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=900&q=80',
  paraglide:
    'https://images.unsplash.com/photo-1489515217757-5fd1be406fef?auto=format&fit=crop&w=900&q=80',
  trek: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=900&q=80',
}

const fallbackItems = [
  { label: 'High Himalayas', category: 'Everest', image: galleryImages.hero },
  {
    label: 'Scenic Flights',
    category: 'Kathmandu',
    image: galleryImages.airplane,
  },
  { label: 'Heli Access', category: 'Annapurna', image: galleryImages.heli },
  {
    label: 'Paragliding Valleys',
    category: 'Pokhara',
    image: galleryImages.paraglide,
  },
  { label: 'Trail Expeditions', category: 'Langtang', image: galleryImages.trek },
]

function Gallery() {
  const { data, isLoading } = useGetGalleryQuery()
  const apiBase = import.meta.env.VITE_API_URL || 'http://localhost:5000'
  const resolveImage = (src) =>
    src?.startsWith('/uploads') ? `${apiBase}${src}` : src
  const items =
    data?.items ||
    data?.data?.items ||
    data?.data ||
    data ||
    fallbackItems
  const galleryItems = Array.isArray(items) ? items : fallbackItems

  return (
    <div className="container-shell py-12">
      <h1 className="font-display text-3xl text-ink">Gallery & Media</h1>
      <p className="mt-2 text-sm text-slate-600">
        Mountain vistas, village life, and expedition highlights from across
        Nepal.
      </p>
      <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {isLoading && (
          <div className="card-surface p-6 text-sm text-slate-600">
            Loading gallery...
          </div>
        )}
        {!isLoading &&
          galleryItems.map((item) => (
            <div key={item._id || item.label} className="card-surface p-4">
              <img
                src={resolveImage(item.image)}
                alt={item.title || item.label}
                className="h-44 w-full rounded-2xl object-cover"
              />
              <p className="mt-3 text-sm font-semibold text-ink">
                {item.title || item.label}
              </p>
              <p className="mt-1 text-xs uppercase tracking-[0.2em] text-blue-600">
                {item.category}
              </p>
              <p className="mt-1 text-xs text-slate-500">
                {item.description ||
                  'Curated shots from field teams and travelers.'}
              </p>
            </div>
          ))}
      </div>
      <div className="card-surface mt-10 p-6">
        <h2 className="font-display text-2xl text-ink">Video Highlights</h2>
        <p className="mt-2 text-sm text-slate-600">
          Expedition recaps and trail walkthroughs are shared with confirmed
          travelers.
        </p>
        <div className="mt-4 rounded-2xl border border-dashed border-blue-200 bg-blue-50/50 p-6 text-center text-sm text-blue-700">
          Video library access available upon booking confirmation.
        </div>
      </div>
    </div>
  )
}

export default Gallery
