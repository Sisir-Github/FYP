import bcrypt from 'bcryptjs'
import crypto from 'crypto'
import User from '../users/user.model.js'
import env from '../../config/env.js'
import { sendEmail } from '../../utils/email.js'
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
  const verificationToken = crypto.randomBytes(32).toString('hex')

  const user = await User.create({
    ...payload,
    email: normalizedEmail,
    password: hashedPassword,
    verificationToken
  })

  // Send verification email
  const verifyUrl = `${env.clientOrigin}/verify-email?token=${verificationToken}`
  await sendEmail({
    to: user.email,
    subject: 'Verify your Everest Encounter Account',
    html: `<h2>Welcome ${user.name}!</h2><p>Please click the link below to verify your email address:</p><a href="${verifyUrl}">Verify Email</a>`
  })

  return user
}

export const sendEmailVerificationOtp = async (userId) => {
  const user = await User.findById(userId)
  if (!user) {
    const error = new Error('User not found')
    error.status = 404
    throw error
  }

  if (user.isEmailVerified) {
    return { message: 'Email is already verified.' }
  }

  const otp = `${Math.floor(100000 + Math.random() * 900000)}`
  user.emailOtp = otp
  user.emailOtpExpires = new Date(Date.now() + 10 * 60 * 1000)
  await user.save()

  await sendEmail({
    to: user.email,
    subject: 'Your Everest Encounter verification code',
    html: `
      <h2>Email Verification OTP</h2>
      <p>Hello ${user.name || 'Traveler'},</p>
      <p>Your OTP code is:</p>
      <h1 style="letter-spacing: 0.25em;">${otp}</h1>
      <p>This code will expire in 10 minutes.</p>
    `,
  })

  return { message: 'OTP sent to your email.' }
}

export const verifyEmailOtp = async (userId, otp) => {
  const user = await User.findById(userId)
  if (!user) {
    const error = new Error('User not found')
    error.status = 404
    throw error
  }

  if (user.isEmailVerified) {
    return { message: 'Email is already verified.' }
  }

  if (!user.emailOtp || !user.emailOtpExpires || user.emailOtpExpires < new Date()) {
    const error = new Error('OTP is invalid or expired')
    error.status = 400
    throw error
  }

  if (user.emailOtp !== otp) {
    const error = new Error('Invalid OTP code')
    error.status = 400
    throw error
  }

  user.isEmailVerified = true
  user.emailOtp = undefined
  user.emailOtpExpires = undefined
  user.verificationToken = undefined
  await user.save()

  return { message: 'Email verified successfully.' }
}

export const verifyEmailToken = async (token) => {
  const user = await User.findOne({ verificationToken: token });
  if (!user) {
    const error = new Error('Invalid or expired verification token');
    error.status = 400;
    throw error;
  }
  user.isEmailVerified = true;
  user.verificationToken = undefined;
  await user.save();
  return { message: 'Email verified successfully.' };
};

export const requestPasswordReset = async (email) => {
  const user = await User.findOne({ email: email.toLowerCase() });
  if (!user) {
    const error = new Error('User not found');
    error.status = 404;
    throw error;
  }

  const resetToken = crypto.randomBytes(32).toString('hex');
  user.resetPasswordToken = resetToken;
  user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
  await user.save();

  const resetUrl = `${env.clientOrigin}/reset-password?token=${resetToken}`;
  await sendEmail({
    to: user.email,
    subject: 'Password Reset Request',
    html: `<p>You requested a password reset. Click the link below to set a new password:</p><a href="${resetUrl}">Reset Password</a><p>It expires in 1 hour.</p>`
  });

  return { message: 'Password reset link sent to your email.' };
};

export const resetPassword = async (token, newPassword) => {
  const user = await User.findOne({ 
    resetPasswordToken: token, 
    resetPasswordExpires: { $gt: Date.now() } 
  });
  
  if (!user) {
    const error = new Error('Invalid or expired reset token');
    error.status = 400;
    throw error;
  }

  user.password = await bcrypt.hash(newPassword, 10);
  user.resetPasswordToken = undefined;
  user.resetPasswordExpires = undefined;
  await user.save();

  return { message: 'Password has been safely reset. You can now login.' };
};

export const loginUser = async ({ email, password }) => {
  const normalizedEmail = email?.toLowerCase()
  const user = await User.findOne({ email: normalizedEmail })
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
