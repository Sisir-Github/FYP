import Gallery from './gallery.model.js'

export const listGallery = async () => {
  const items = await Gallery.find().sort({ createdAt: -1 })
  return { items }
}

export const getGalleryItem = async (id) => Gallery.findById(id)

export const createGalleryItem = async (payload) => Gallery.create(payload)

export const updateGalleryItem = async (id, payload) =>
  Gallery.findByIdAndUpdate(id, payload, { new: true, runValidators: true })

export const deleteGalleryItem = async (id) => Gallery.findByIdAndDelete(id)
