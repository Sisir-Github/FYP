import { Router } from 'express'
import authMiddleware from '../../middleware/authMiddleware.js'
import roleMiddleware from '../../middleware/roleMiddleware.js'
import { getAdminStats } from './admin.controller.js'

const router = Router()

router.use(authMiddleware, roleMiddleware('ADMIN'))
router.get('/stats', getAdminStats)

export default router
