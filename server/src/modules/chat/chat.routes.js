import { Router } from 'express'
import { z } from 'zod'
import authMiddleware from '../../middleware/authMiddleware.js'
import roleMiddleware from '../../middleware/roleMiddleware.js'
import {
  getMyChatMessages,
  getMyChatUnreadCount,
  sendMyChatMessage,
  getAdminChatUsers,
  getAdminChatMessages,
  sendAdminChatMessage,
} from './chat.controller.js'

const validate = (schema) => (req, res, next) => {
  try {
    req.body = schema.parse(req.body)
    next()
  } catch (error) {
    res.status(400).json({ message: 'Validation error', errors: error.errors || error.issues || [] })
  }
}

const messageSchema = z.object({
  text: z.string().min(1).max(2000),
})

const chatRoutes = Router()
const adminChatRoutes = Router()

chatRoutes.use(authMiddleware)
chatRoutes.get('/me', getMyChatMessages)
chatRoutes.get('/me/unread-count', getMyChatUnreadCount)
chatRoutes.post('/me', validate(messageSchema), sendMyChatMessage)

adminChatRoutes.use(authMiddleware, roleMiddleware('ADMIN'))
adminChatRoutes.get('/users', getAdminChatUsers)
adminChatRoutes.get('/:userId', getAdminChatMessages)
adminChatRoutes.post('/:userId', validate(messageSchema), sendAdminChatMessage)

export { chatRoutes, adminChatRoutes }
