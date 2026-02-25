import Region from './region.model.js'

const slugify = (value) =>
  value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '')

export const listRegions = async ({ page = 1, limit = 20, search = '' }) => {
  const query = {}
  if (search) {
    query.name = { $regex: search, $options: 'i' }
  }
  const skip = (Number(page) - 1) * Number(limit)
  const [items, total] = await Promise.all([
    Region.find(query).skip(skip).limit(Number(limit)),
    Region.countDocuments(query),
  ])
  return { items, total, page: Number(page), limit: Number(limit) }
}

export const getRegionById = async (id) => Region.findById(id)

export const createRegion = async (payload) =>
  Region.create({ ...payload, slug: slugify(payload.name) })

export const updateRegion = async (id, payload) => {
  const update = { ...payload }
  if (payload.name) update.slug = slugify(payload.name)
  return Region.findByIdAndUpdate(id, update, { new: true, runValidators: true })
}

export const deleteRegion = async (id) => Region.findByIdAndDelete(id)
