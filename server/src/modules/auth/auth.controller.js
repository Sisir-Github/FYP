import env from '../../config/env.js'
import * as authService from './auth.service.js'

const cookieOptions = {
  httpOnly: true,
  secure: env.cookieSecure,
  sameSite: 'lax',
}

const setAuthCookies = (res, accessToken, refreshToken) => {
  res.cookie('accessToken', accessToken, {
    ...cookieOptions,
    maxAge: 15 * 60 * 1000,
  })
  res.cookie('refreshToken', refreshToken, {
    ...cookieOptions,
    maxAge: 7 * 24 * 60 * 60 * 1000,
  })
}

export const register = async (req, res, next) => {
  try {
    const user = await authService.registerUser(req.body)
    const login = await authService.loginUser({
      email: user.email,
      password: req.body.password,
    })
    setAuthCookies(res, login.accessToken, login.refreshToken)
    res.status(201).json({
      user: { id: login.user._id, name: login.user.name, email: login.user.email, role: login.user.role },
    })
  } catch (error) {
    next(error)
  }
}

export const login = async (req, res, next) => {
  try {
    const { user, accessToken, refreshToken } = await authService.loginUser(req.body)
    setAuthCookies(res, accessToken, refreshToken)
    res.json({
      user: { id: user._id, name: user.name, email: user.email, role: user.role },
    })
  } catch (error) {
    next(error)
  }
}

export const refresh = async (req, res, next) => {
  try {
    const { refreshToken } = req.cookies
    const { user, accessToken, refreshToken: newRefresh } =
      await authService.refreshTokens(refreshToken)
    setAuthCookies(res, accessToken, newRefresh)
    res.json({
      user: { id: user._id, name: user.name, email: user.email, role: user.role },
    })
  } catch (error) {
    next(error)
  }
}

export const logout = async (req, res, next) => {
  try {
    const { refreshToken } = req.cookies
    await authService.logoutUser(refreshToken)
    res.clearCookie('accessToken')
    res.clearCookie('refreshToken')
    res.status(204).end()
  } catch (error) {
    next(error)
  }
}
