import * as galleryService from './gallery.service.js'

export const listGallery = async (req, res, next) => {
  try {
    const result = await galleryService.listGallery()
    res.json(result)
  } catch (error) {
    next(error)
  }
}

export const getGalleryItem = async (req, res, next) => {
  try {
    const item = await galleryService.getGalleryItem(req.params.id)
    if (!item) {
      return res.status(404).json({ message: 'Gallery item not found' })
    }
    return res.json(item)
  } catch (error) {
    return next(error)
  }
}

export const createGalleryItem = async (req, res, next) => {
  try {
    const payload = { ...req.body }
    if (req.file) {
      payload.image = `/uploads/${req.file.filename}`
    }
    if (!payload.image) {
      return res.status(400).json({ message: 'Image is required' })
    }
    const item = await galleryService.createGalleryItem(payload)
    res.status(201).json(item)
  } catch (error) {
    next(error)
  }
}

export const updateGalleryItem = async (req, res, next) => {
  try {
    const payload = { ...req.body }
    if (req.file) {
      payload.image = `/uploads/${req.file.filename}`
    }
    if (payload.image === '') {
      delete payload.image
    }
    const item = await galleryService.updateGalleryItem(req.params.id, payload)
    if (!item) {
      return res.status(404).json({ message: 'Gallery item not found' })
    }
    return res.json(item)
  } catch (error) {
    return next(error)
  }
}

export const deleteGalleryItem = async (req, res, next) => {
  try {
    await galleryService.deleteGalleryItem(req.params.id)
    res.status(204).end()
  } catch (error) {
    next(error)
  }
}
