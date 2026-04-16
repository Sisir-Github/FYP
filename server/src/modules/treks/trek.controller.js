import * as trekService from './trek.service.js'

export const listTreks = async (req, res, next) => {
  try {
    const result = await trekService.listTreks(req.query)
    res.json(result)
  } catch (error) {
    next(error)
  }
}

export const getTrek = async (req, res, next) => {
  try {
    const trek = await trekService.getTrekById(req.params.id)
    res.json(trek)
  } catch (error) {
    next(error)
  }
}

export const getAvailability = async (req, res, next) => {
  try {
    const result = await trekService.getTrekAvailability(req.params.id)
    res.json(result)
  } catch (error) {
    next(error)
  }
}

export const createTrek = async (req, res, next) => {
  try {
    const payload = { ...req.body }
    if (req.files?.image?.[0]) payload.image = `/uploads/${req.files.image[0].filename}`
    if (req.files?.galleryImages?.length) {
      payload.galleryImages = req.files.galleryImages.map(
        (file) => `/uploads/${file.filename}`,
      )
    }
    if (typeof payload.highlights === 'string') {
      payload.highlights = payload.highlights.split(',').map((item) => item.trim()).filter(Boolean)
    }
    if (typeof payload.included === 'string') {
      payload.included = payload.included.split(',').map((item) => item.trim()).filter(Boolean)
    }
    if (typeof payload.excluded === 'string') {
      payload.excluded = payload.excluded.split(',').map((item) => item.trim()).filter(Boolean)
    }
    if (typeof payload.availableDates === 'string') {
      payload.availableDates = payload.availableDates
        .split(',')
        .map((item) => item.trim())
        .filter(Boolean)
    }
    const trek = await trekService.createTrek(payload)
    res.status(201).json(trek)
  } catch (error) {
    next(error)
  }
}

export const updateTrek = async (req, res, next) => {
  try {
    const payload = { ...req.body }
    if (req.files?.image?.[0]) payload.image = `/uploads/${req.files.image[0].filename}`
    if (req.files?.galleryImages?.length) {
      payload.galleryImages = req.files.galleryImages.map(
        (file) => `/uploads/${file.filename}`,
      )
    }
    if (typeof payload.highlights === 'string') {
      payload.highlights = payload.highlights.split(',').map((item) => item.trim()).filter(Boolean)
    }
    if (typeof payload.included === 'string') {
      payload.included = payload.included.split(',').map((item) => item.trim()).filter(Boolean)
    }
    if (typeof payload.excluded === 'string') {
      payload.excluded = payload.excluded.split(',').map((item) => item.trim()).filter(Boolean)
    }
    if (typeof payload.availableDates === 'string') {
      payload.availableDates = payload.availableDates
        .split(',')
        .map((item) => item.trim())
        .filter(Boolean)
    }
    const trek = await trekService.updateTrek(req.params.id, payload)
    res.json(trek)
  } catch (error) {
    next(error)
  }
}

export const deleteTrek = async (req, res, next) => {
  try {
    await trekService.deleteTrek(req.params.id)
    res.status(204).end()
  } catch (error) {
    next(error)
  }
}
