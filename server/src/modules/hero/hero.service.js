import HeroSlide from './hero.model.js'

export const listHeroSlides = async ({ includeInactive = false } = {}) => {
  const query = includeInactive ? {} : { isActive: true }
  const items = await HeroSlide.find(query).sort({ sortOrder: 1, createdAt: -1 })
  return { items }
}

export const getHeroSlide = async (id) => HeroSlide.findById(id)

export const createHeroSlide = async (payload) => HeroSlide.create(payload)

export const updateHeroSlide = async (id, payload) =>
  HeroSlide.findByIdAndUpdate(id, payload, { new: true, runValidators: true })

export const deleteHeroSlide = async (id) => HeroSlide.findByIdAndDelete(id)
