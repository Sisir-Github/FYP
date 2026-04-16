import * as userService from './user.service.js'

export const getProfile = async (req, res, next) => {
  try {
    const user = await userService.getUserById(req.user.id)
    res.json(user)
  } catch (error) {
    next(error)
  }
}

export const updateProfile = async (req, res, next) => {
  try {
    const payload = { ...req.body }
    if (req.file?.path) {
      payload.profileImage = req.file.path
    } else if (req.file?.buffer && req.file?.mimetype) {
      const base64 = req.file.buffer.toString('base64')
      payload.profileImage = `data:${req.file.mimetype};base64,${base64}`
    }
    const user = await userService.updateMyProfile(req.user.id, payload)
    res.json(user)
  } catch (error) {
    next(error)
  }
}

export const changeMyPassword = async (req, res, next) => {
  try {
    const result = await userService.changeMyPassword(
      req.user.id,
      req.body.currentPassword,
      req.body.newPassword,
    )
    res.json(result)
  } catch (error) {
    next(error)
  }
}

export const listUsers = async (req, res, next) => {
  try {
    const result = await userService.getUsers(req.query)
    res.json(result)
  } catch (error) {
    next(error)
  }
}

export const getUser = async (req, res, next) => {
  try {
    const user = await userService.getUserById(req.params.id)
    res.json(user)
  } catch (error) {
    next(error)
  }
}

export const createUser = async (req, res, next) => {
  try {
    const user = await userService.createUser(req.body)
    res.status(201).json(user)
  } catch (error) {
    next(error)
  }
}

export const updateUser = async (req, res, next) => {
  try {
    const user = await userService.updateUser(req.params.id, req.body)
    res.json(user)
  } catch (error) {
    next(error)
  }
}

export const removeUser = async (req, res, next) => {
  try {
    await userService.deleteUser(req.params.id)
    res.status(204).end()
  } catch (error) {
    next(error)
  }
}
