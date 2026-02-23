import { Router } from 'express'
import { z } from 'zod'
import validate from '../../middleware/validate.js'
import authMiddleware from '../../middleware/authMiddleware.js'
import roleMiddleware from '../../middleware/roleMiddleware.js'
import upload from '../../utils/upload.js'
import {
  listGallery,
  getGalleryItem,
  createGalleryItem,
  updateGalleryItem,
  deleteGalleryItem,
} from './gallery.controller.js'

const gallerySchema = z.object({
  title: z.string().min(2, 'Title is required'),
  category: z.string().min(2, 'Category is required'),
  description: z.string().optional(),
  image: z
    .string()
    .optional()
    .refine(
      (value) =>
        !value || value.startsWith('/uploads/') || value.startsWith('http'),
      'Image must be a valid URL',
    ),
  isFeatured: z.coerce.boolean().optional(),
})

const galleryUpdateSchema = gallerySchema.partial()

const galleryRoutes = Router()
galleryRoutes.get('/', listGallery)
galleryRoutes.get('/:id', getGalleryItem)

const adminGalleryRoutes = Router()
adminGalleryRoutes.use(authMiddleware, roleMiddleware('ADMIN'))
adminGalleryRoutes.get('/', listGallery)
adminGalleryRoutes.post(
  '/',
  upload.single('imageFile'),
  validate(gallerySchema),
  createGalleryItem,
)
adminGalleryRoutes.put(
  '/:id',
  upload.single('imageFile'),
  validate(galleryUpdateSchema),
  updateGalleryItem,
)
adminGalleryRoutes.delete('/:id', deleteGalleryItem)

export { galleryRoutes, adminGalleryRoutes }
