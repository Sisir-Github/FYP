const posts = [
  {
    id: 1,
    title: 'Preparing for High Altitude: A Practical Checklist',
    date: 'Dec 12, 2025',
    image:
      'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=900&q=80',
  },
  {
    id: 2,
    title: 'Choosing Between Everest Base Camp and Gokyo Lakes',
    date: 'Nov 28, 2025',
    image:
      'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=900&q=80',
  },
  {
    id: 3,
    title: 'A Guide to Himalayan Teahouse Etiquette',
    date: 'Nov 03, 2025',
    image:
      'https://images.unsplash.com/photo-1523413651479-597eb2da0ad6?auto=format&fit=crop&w=900&q=80',
  },
  {
    id: 4,
    title: 'Packing List for Nepal Treks: Essentials Only',
    date: 'Oct 20, 2025',
    image:
      'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=900&q=80',
  },
  {
    id: 5,
    title: 'Altitude Sickness: Signs, Prevention, and Response',
    date: 'Oct 02, 2025',
    image:
      'https://images.unsplash.com/photo-1473625247510-8ceb1760943f?auto=format&fit=crop&w=900&q=80',
  },
  {
    id: 6,
    title: 'Best Seasons for Nepal: Weather & Visibility Guide',
    date: 'Sep 18, 2025',
    image:
      'https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=900&q=80',
  },
]

function Blog() {
  return (
    <div className="container-shell py-12">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl text-ink">Trail Journal</h1>
          <p className="text-sm text-slate-600">
            Stories, planning guides, and field notes from our expedition team.
          </p>
        </div>
        <button
          type="button"
          className="rounded-full border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-600"
        >
          Subscribe
        </button>
      </div>
      <div className="mt-10 grid gap-6 md:grid-cols-3">
        {posts.map((post) => (
          <article key={post.id} className="card-surface p-6">
            <div className="overflow-hidden rounded-xl bg-slate-100">
              <img
                src={post.image}
                alt={post.title}
                className="h-32 w-full object-cover"
              />
            </div>
            <p className="mt-4 text-xs uppercase tracking-[0.2em] text-slate-500">
              {post.date}
            </p>
            <h3 className="mt-2 font-semibold text-ink">{post.title}</h3>
            <p className="mt-3 text-sm text-slate-600">
              Read this guide to plan gear, pacing, and acclimatization for
              high-altitude adventures.
            </p>
          </article>
        ))}
      </div>
    </div>
  )
}

export default Blog
