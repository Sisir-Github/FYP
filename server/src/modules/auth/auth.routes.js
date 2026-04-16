import { Router } from 'express'
import { z } from 'zod'
import authMiddleware from '../../middleware/authMiddleware.js'
import {
  register,
  login,
  refresh,
  logout,
  verifyEmail,
  forgotPassword,
  resetPassword,
  me,
  sendEmailOtp,
  verifyOtp,
} from './auth.controller.js'

const validate = (schema) => (req, res, next) => {
  try {
    req.body = schema.parse(req.body)
    next()
  } catch (error) {
    res.status(400).json({ message: 'Validation error', errors: error.errors }) 
  }
}

const registerSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(6),
  phone: z.string().optional(),
})

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
})

const forgotSchema = z.object({
  email: z.string().email(),
})

const resetSchema = z.object({
  token: z.string().min(1),
  password: z.string().min(6),
})

const otpSchema = z.object({
  otp: z.string().length(6),
})

const router = Router()

router.post('/register', validate(registerSchema), register)
router.post('/login', validate(loginSchema), login)
router.get('/me', authMiddleware, me)
router.post('/refresh', refresh)
router.post('/logout', logout)
router.get('/verify-email', verifyEmail)
router.post('/send-email-otp', authMiddleware, sendEmailOtp)
router.post('/verify-email-otp', authMiddleware, validate(otpSchema), verifyOtp)
router.post('/forgot-password', validate(forgotSchema), forgotPassword)
router.post('/reset-password', validate(resetSchema), resetPassword)

export default router
