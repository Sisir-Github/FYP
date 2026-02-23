import * as heroService from './hero.service.js'

export const listHeroSlides = async (req, res, next) => {
  try {
    const includeInactive = req.query.includeInactive === 'true'
    const result = await heroService.listHeroSlides({ includeInactive })
    res.json(result)
  } catch (error) {
    next(error)
  }
}

export const getHeroSlide = async (req, res, next) => {
  try {
    const item = await heroService.getHeroSlide(req.params.id)
    if (!item) {
      return res.status(404).json({ message: 'Hero slide not found' })
    }
    return res.json(item)
  } catch (error) {
    return next(error)
  }
}

export const createHeroSlide = async (req, res, next) => {
  try {
    const payload = { ...req.body }
    if (req.file) {
      payload.image = `/uploads/${req.file.filename}`
    }
    if (!payload.image) {
      return res.status(400).json({ message: 'Image is required' })
    }
    const item = await heroService.createHeroSlide(payload)
    res.status(201).json(item)
  } catch (error) {
    next(error)
  }
}

export const updateHeroSlide = async (req, res, next) => {
  try {
    const payload = { ...req.body }
    if (req.file) {
      payload.image = `/uploads/${req.file.filename}`
    }
    if (payload.image === '') {
      delete payload.image
    }
    const item = await heroService.updateHeroSlide(req.params.id, payload)
    if (!item) {
      return res.status(404).json({ message: 'Hero slide not found' })
    }
    return res.json(item)
  } catch (error) {
    return next(error)
  }
}

export const deleteHeroSlide = async (req, res, next) => {
  try {
    await heroService.deleteHeroSlide(req.params.id)
    res.status(204).end()
  } catch (error) {
    next(error)
  }
}
