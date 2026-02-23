import { Router } from 'express'
import { z } from 'zod'
import authMiddleware from '../../middleware/authMiddleware.js'
import roleMiddleware from '../../middleware/roleMiddleware.js'
import upload from '../../utils/upload.js'
import {
  listTreks,
  getTrek,
  getAvailability,
  createTrek,
  updateTrek,
  deleteTrek,
} from './trek.controller.js'

const validate = (schema) => (req, res, next) => {
  try {
    req.body = schema.parse(req.body)
    next()
  } catch (error) {
    res.status(400).json({ message: 'Validation error', errors: error.errors })
  }
}

const trekSchema = z.object({
  name: z.string().min(2),
  location: z.string().optional(),
  region: z.string().min(1),
  difficulty: z.string().optional(),
  days: z.coerce.number().optional(),
  price: z.coerce.number().optional(),
  description: z.string().optional(),
  overview: z.string().optional(),
  mapImage: z.string().optional(),
  elevationChart: z.string().optional(),
  maxGroupSize: z.coerce.number().optional(),
  altitude: z.coerce.number().optional(),
  bestSeason: z.string().optional(),
  accommodation: z.string().optional(),
  included: z.array(z.string()).optional(),
  excluded: z.array(z.string()).optional(),
  equipment: z.array(z.string()).optional(),
  availableDates: z.array(z.string()).optional(),
  faqs: z
    .array(
      z.object({
        question: z.string().optional(),
        answer: z.string().optional(),
      }),
    )
    .optional(),
  itinerary: z
    .array(
      z.object({
        day: z.coerce.number().optional(),
        title: z.string().optional(),
        description: z.string().optional(),
      }),
    )
    .optional(),
  highlights: z.array(z.string()).optional(),
  isActive: z.coerce.boolean().optional(),
})

const trekUpdateSchema = trekSchema.partial()

const trekRoutes = Router()
const adminTrekRoutes = Router()

trekRoutes.get('/', listTreks)
trekRoutes.get('/:id', getTrek)
trekRoutes.get('/:id/availability', getAvailability)

adminTrekRoutes.use(authMiddleware, roleMiddleware('ADMIN'))
adminTrekRoutes.get('/', listTreks)
adminTrekRoutes.post(
  '/',
  upload.fields([
    { name: 'image', maxCount: 1 },
    { name: 'galleryImages', maxCount: 6 },
  ]),
  validate(trekSchema),
  createTrek,
)
adminTrekRoutes.get('/:id', getTrek)
adminTrekRoutes.put(
  '/:id',
  upload.fields([
    { name: 'image', maxCount: 1 },
    { name: 'galleryImages', maxCount: 6 },
  ]),
  validate(trekUpdateSchema),
  updateTrek,
)
adminTrekRoutes.delete('/:id', deleteTrek)

export { trekRoutes, adminTrekRoutes }
