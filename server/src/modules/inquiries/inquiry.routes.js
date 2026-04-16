import { Router } from 'express'
import { z } from 'zod'
import authMiddleware from '../../middleware/authMiddleware.js'
import roleMiddleware from '../../middleware/roleMiddleware.js'
import {
  createInquiry,
  listInquiries,
  getInquiry,
  updateInquiry,
  deleteInquiry,
} from './inquiry.controller.js'

const validate = (schema) => (req, res, next) => {
  try {
    req.body = schema.parse(req.body)
    next()
  } catch (error) {
    res.status(400).json({ message: 'Validation error', errors: error.errors })
  }
}

const inquirySchema = z.object({
  name: z.string().optional(),
  email: z.string().email().optional(),
  subject: z.string().min(3),
  message: z.string().min(10),
})

const inquiryUpdateSchema = z.object({
  status: z.enum(['NEW', 'RESPONDED', 'CLOSED']).optional(),
  message: z.string().optional(),
})

const inquiryRoutes = Router()
const adminInquiryRoutes = Router()

inquiryRoutes.post('/', validate(inquirySchema), createInquiry)

adminInquiryRoutes.use(authMiddleware, roleMiddleware('ADMIN'))
adminInquiryRoutes.get('/', listInquiries)
adminInquiryRoutes.get('/:id', getInquiry)
adminInquiryRoutes.put('/:id', validate(inquiryUpdateSchema), updateInquiry)
adminInquiryRoutes.delete('/:id', deleteInquiry)

export { inquiryRoutes, adminInquiryRoutes }
