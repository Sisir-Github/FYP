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
      user: {
        id: login.user._id,
        name: login.user.name,
        email: login.user.email,
        role: login.user.role,
        isEmailVerified: login.user.isEmailVerified,
        profileImage: login.user.profileImage || '',
      },
      message: "Registration successful. Please check your email to verify your account."
    })
  } catch (error) {
    next(error)
  }
}

export const me = async (req, res, next) => {
  try {
    res.json({
      user: {
        id: req.user._id,
        name: req.user.name,
        email: req.user.email,
        role: req.user.role,
        phone: req.user.phone || '',
        isEmailVerified: req.user.isEmailVerified,
        profileImage: req.user.profileImage || '',
      },
    })
  } catch (error) {
    next(error)
  }
}

export const verifyEmail = async (req, res, next) => {
  try {
    const result = await authService.verifyEmailToken(req.query.token);
    res.json(result);
  } catch (error) {
    next(error);
  }
};

export const forgotPassword = async (req, res, next) => {
  try {
    const result = await authService.requestPasswordReset(req.body.email);
    res.json(result);
  } catch (error) {
    next(error);
  }
};

export const resetPassword = async (req, res, next) => {
  try {
    const result = await authService.resetPassword(req.body.token, req.body.password);
    res.json(result);
  } catch (error) {
    next(error);
  }
};

export const login = async (req, res, next) => {
  try {
    const { user, accessToken, refreshToken } = await authService.loginUser(req.body)
    setAuthCookies(res, accessToken, refreshToken)
    res.json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        isEmailVerified: user.isEmailVerified,
        phone: user.phone || '',
        profileImage: user.profileImage || '',
      },
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
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        isEmailVerified: user.isEmailVerified,
        phone: user.phone || '',
        profileImage: user.profileImage || '',
      },
    })
  } catch (error) {
    next(error)
  }
}

export const sendEmailOtp = async (req, res, next) => {
  try {
    const result = await authService.sendEmailVerificationOtp(req.user.id)
    res.json(result)
  } catch (error) {
    next(error)
  }
}

export const verifyOtp = async (req, res, next) => {
  try {
    const result = await authService.verifyEmailOtp(req.user.id, req.body.otp)
    res.json(result)
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
