import { Router } from 'express'
import { z } from 'zod'
import authMiddleware from '../../middleware/authMiddleware.js'
import roleMiddleware from '../../middleware/roleMiddleware.js'
import {
  getProfile,
  updateProfile,
  listUsers,
  getUser,
  createUser,
  updateUser,
  removeUser,
} from './user.controller.js'

const validate = (schema) => (req, res, next) => {
  try {
    req.body = schema.parse(req.body)
    next()
  } catch (error) {
    res.status(400).json({ message: 'Validation error', errors: error.errors })
  }
}

const profileSchema = z.object({
  name: z.string().min(2).optional(),
  email: z.string().email().optional(),
  phone: z.string().optional(),
  password: z.string().min(6).optional(),
})

const adminUserSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(6),
  phone: z.string().optional(),
  role: z.enum(['USER', 'ADMIN']).optional(),
})

const userRoutes = Router()
const adminUserRoutes = Router()

userRoutes.get('/me', authMiddleware, getProfile)
userRoutes.put('/me', authMiddleware, validate(profileSchema), updateProfile)

adminUserRoutes.use(authMiddleware, roleMiddleware('ADMIN'))
adminUserRoutes.get('/', listUsers)
adminUserRoutes.post('/', validate(adminUserSchema), createUser)
adminUserRoutes.get('/:id', getUser)
adminUserRoutes.put('/:id', validate(profileSchema), updateUser)
adminUserRoutes.delete('/:id', removeUser)

export { userRoutes, adminUserRoutes }
