import bcrypt from 'bcryptjs'
import User from './user.model.js'

export const createUser = async (payload) => {
  const hashedPassword = await bcrypt.hash(payload.password, 10)
  const user = await User.create({ ...payload, password: hashedPassword })
  return user
}

export const getUsers = async ({ page = 1, limit = 10, search = '' }) => {
  const query = {}
  if (search) {
    query.$or = [
      { name: { $regex: search, $options: 'i' } },
      { email: { $regex: search, $options: 'i' } },
    ]
  }
  const skip = (Number(page) - 1) * Number(limit)
  const [items, total] = await Promise.all([
    User.find(query).select('-password -refreshTokens').skip(skip).limit(Number(limit)),
    User.countDocuments(query),
  ])
  return { items, total, page: Number(page), limit: Number(limit) }
}

export const getUserById = async (id) =>
  User.findById(id).select('-password -refreshTokens')

export const updateUser = async (id, payload) => {
  const update = { ...payload }
  if (payload.password) {
    update.password = await bcrypt.hash(payload.password, 10)
  }
  return User.findByIdAndUpdate(id, update, {
    new: true,
    runValidators: true,
  }).select('-password -refreshTokens')
}

export const updateMyProfile = async (id, payload) => {
  const update = { ...payload }
  if (update.email) {
    update.email = update.email.toLowerCase()
  }
  return User.findByIdAndUpdate(id, update, {
    new: true,
    runValidators: true,
  }).select('-password -refreshTokens')
}

export const changeMyPassword = async (id, currentPassword, newPassword) => {
  const user = await User.findById(id)
  if (!user) {
    const error = new Error('User not found')
    error.status = 404
    throw error
  }

  const isMatch = await bcrypt.compare(currentPassword, user.password)
  if (!isMatch) {
    const error = new Error('Current password is incorrect')
    error.status = 400
    throw error
  }

  user.password = await bcrypt.hash(newPassword, 10)
  await user.save()
  return { message: 'Password changed successfully.' }
}

export const deleteUser = async (id) => User.findByIdAndDelete(id)
