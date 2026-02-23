import { Router } from 'express'
import { z } from 'zod'
import validate from '../../middleware/validate.js'
import authMiddleware from '../../middleware/authMiddleware.js'
import roleMiddleware from '../../middleware/roleMiddleware.js'
import upload from '../../utils/upload.js'
import {
  listHeroSlides,
  getHeroSlide,
  createHeroSlide,
  updateHeroSlide,
  deleteHeroSlide,
} from './hero.controller.js'

const heroSchema = z.object({
  title: z.string().min(2, 'Title is required'),
  subtitle: z.string().optional(),
  description: z.string().optional(),
  image: z
    .string()
    .optional()
    .refine(
      (value) =>
        !value || value.startsWith('/uploads/') || value.startsWith('http'),
      'Image must be a valid URL',
    ),
  ctaLabel: z.string().optional(),
  ctaHref: z.string().optional(),
  sortOrder: z.coerce.number().optional(),
  isActive: z.coerce.boolean().optional(),
})

const heroUpdateSchema = heroSchema.partial()

const heroRoutes = Router()
heroRoutes.get('/', listHeroSlides)
heroRoutes.get('/:id', getHeroSlide)

const adminHeroRoutes = Router()
adminHeroRoutes.use(authMiddleware, roleMiddleware('ADMIN'))
adminHeroRoutes.get('/', listHeroSlides)
adminHeroRoutes.post(
  '/',
  upload.single('imageFile'),
  validate(heroSchema),
  createHeroSlide,
)
adminHeroRoutes.put(
  '/:id',
  upload.single('imageFile'),
  validate(heroUpdateSchema),
  updateHeroSlide,
)
adminHeroRoutes.delete('/:id', deleteHeroSlide)

export { heroRoutes, adminHeroRoutes }
