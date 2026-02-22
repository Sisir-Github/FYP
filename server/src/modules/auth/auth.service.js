import bcrypt from 'bcryptjs'
import User from '../users/user.model.js'
import { signAccessToken, signRefreshToken, verifyRefreshToken } from '../../utils/jwt.js'

export const registerUser = async (payload) => {
  const normalizedEmail = payload.email?.toLowerCase()
  const exists = await User.findOne({ email: normalizedEmail })
  if (exists) {
    const error = new Error('Email already exists')
    error.status = 400
    throw error
  }
  const hashedPassword = await bcrypt.hash(payload.password, 10)
  const user = await User.create({
    ...payload,
    email: normalizedEmail,
    password: hashedPassword,
  })
  return user
}

export const loginUser = async ({ email, password }) => {
  const user = await User.findOne({ email })
  if (!user) {
    const error = new Error('Invalid credentials')
    error.status = 401
    throw error
  }
  const match = await bcrypt.compare(password, user.password)
  if (!match) {
    const error = new Error('Invalid credentials')
    error.status = 401
    throw error
  }
  const normalizedRole =
    typeof user.role === 'string' ? user.role.toUpperCase() : user.role
  if (normalizedRole && normalizedRole !== user.role) {
    user.role = normalizedRole
  }
  const payload = { id: user._id.toString(), role: user.role }
  const accessToken = signAccessToken(payload)
  const refreshToken = signRefreshToken(payload)
  user.refreshTokens.push(refreshToken)
  await user.save()
  return { user, accessToken, refreshToken }
}

export const refreshTokens = async (refreshToken) => {
  const decoded = verifyRefreshToken(refreshToken)
  const user = await User.findById(decoded.id)
  if (!user || !user.refreshTokens.includes(refreshToken)) {
    const error = new Error('Invalid refresh token')
    error.status = 401
    throw error
  }
  user.refreshTokens = user.refreshTokens.filter((token) => token !== refreshToken)
  const payload = { id: user._id.toString(), role: user.role }
  const newAccessToken = signAccessToken(payload)
  const newRefreshToken = signRefreshToken(payload)
  user.refreshTokens.push(newRefreshToken)
  await user.save()
  return { user, accessToken: newAccessToken, refreshToken: newRefreshToken }
}

export const logoutUser = async (refreshToken) => {
  if (!refreshToken) return
  const decoded = verifyRefreshToken(refreshToken)
  const user = await User.findById(decoded.id)
  if (!user) return
  user.refreshTokens = user.refreshTokens.filter((token) => token !== refreshToken)
  await user.save()
}
