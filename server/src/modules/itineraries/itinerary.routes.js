import { Router } from 'express'
import { z } from 'zod'
import authMiddleware from '../../middleware/authMiddleware.js'
import roleMiddleware from '../../middleware/roleMiddleware.js'
import {
  listItineraries,
  getItinerary,
  createItinerary,
  updateItinerary,
  deleteItinerary,
} from './itinerary.controller.js'

const validate = (schema) => (req, res, next) => {
  try {
    req.body = schema.parse(req.body)
    next()
  } catch (error) {
    res.status(400).json({ message: 'Validation error', errors: error.errors })
  }
}

const itinerarySchema = z.object({
  trek: z.string().min(1),
  dayNumber: z.coerce.number().min(1),
  title: z.string().min(2),
  description: z.string().optional(),
  altitude: z.coerce.number().optional(),
  meals: z.string().optional(),
  accommodation: z.string().optional(),
})

const itineraryUpdateSchema = itinerarySchema.partial()

const itineraryRoutes = Router()
const adminItineraryRoutes = Router()

itineraryRoutes.get('/', listItineraries)
itineraryRoutes.get('/:id', getItinerary)

adminItineraryRoutes.use(authMiddleware, roleMiddleware('ADMIN'))
adminItineraryRoutes.get('/', listItineraries)
adminItineraryRoutes.post('/', validate(itinerarySchema), createItinerary)
adminItineraryRoutes.get('/:id', getItinerary)
adminItineraryRoutes.put('/:id', validate(itineraryUpdateSchema), updateItinerary)
adminItineraryRoutes.delete('/:id', deleteItinerary)

export { itineraryRoutes, adminItineraryRoutes }
