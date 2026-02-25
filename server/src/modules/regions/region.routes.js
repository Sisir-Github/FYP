import { Router } from 'express'
import { z } from 'zod'
import authMiddleware from '../../middleware/authMiddleware.js'
import roleMiddleware from '../../middleware/roleMiddleware.js'
import {
  listRegions,
  getRegion,
  createRegion,
  updateRegion,
  deleteRegion,
} from './region.controller.js'

const validate = (schema) => (req, res, next) => {
  try {
    req.body = schema.parse(req.body)
    next()
  } catch (error) {
    res.status(400).json({ message: 'Validation error', errors: error.errors })
  }
}

const regionSchema = z.object({
  name: z.string().min(2),
  description: z.string().optional(),
  image: z.string().optional(),
})

const regionUpdateSchema = regionSchema.partial()

const regionRoutes = Router()
const adminRegionRoutes = Router()

regionRoutes.get('/', listRegions)
regionRoutes.get('/:id', getRegion)

adminRegionRoutes.use(authMiddleware, roleMiddleware('ADMIN'))
adminRegionRoutes.get('/', listRegions)
adminRegionRoutes.post('/', validate(regionSchema), createRegion)
adminRegionRoutes.get('/:id', getRegion)
adminRegionRoutes.put('/:id', validate(regionUpdateSchema), updateRegion)
adminRegionRoutes.delete('/:id', deleteRegion)

export { regionRoutes, adminRegionRoutes }
