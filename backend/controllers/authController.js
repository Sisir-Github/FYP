const User = require('../models/User');
const jwt = require('jsonwebtoken');
const ApiError = require('../utils/ApiError');
const ApiResponse = require('../utils/ApiResponse');
const asyncHandler = require('../utils/asyncHandler');
const sendEmail = require('../utils/sendEmail');
const emailTemplates = require('../utils/emailTemplates');

/**
 * Generate JWT tokens and set cookie
 */
const sendTokenResponse = (user, statusCode, res, message = 'Success') => {
  const payload = { id: user._id, role: user.role };

  // Create tokens
  const accessToken = jwt.sign(payload, process.env.JWT_ACCESS_SECRET, {
    expiresIn: process.env.JWT_ACCESS_EXPIRE,
  });

  const refreshToken = jwt.sign(payload, process.env.JWT_REFRESH_SECRET, {
    expiresIn: process.env.JWT_REFRESH_EXPIRE,
  });

  // Save refresh token in DB
  user.refreshToken = refreshToken;
  user.save({ validateBeforeSave: false });

  // Options for cookie
  const options = {
    expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
  };

  const userData = {
    _id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    avatar: user.avatar,
    isVerified: user.isVerified,
  };

  res.status(statusCode)
    .cookie('accessToken', accessToken, options)
    .cookie('refreshToken', refreshToken, options)
    .json(new ApiResponse(statusCode, message, { user: userData, accessToken }));
};

/**
 * @desc    Register user
 * @route   POST /api/auth/register
 * @access  Public
 */
exports.register = asyncHandler(async (req, res, next) => {
  const { name, email, password } = req.body;

  // Check if user already exists
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new ApiError(400, 'User with this email already exists');
  }

  // Create user
  const user = await User.create({
    name,
    email,
    password,
  });

  // Generate verification OTP
  const verificationOTP = user.generateVerificationOTP();
  await user.save({ validateBeforeSave: false });

  try {
    await sendEmail({
      to: user.email,
      subject: 'Your Verification OTP - Everest Encounter Treks',
      html: emailTemplates.verifyEmailOTP(user.name, verificationOTP),
    });

    sendTokenResponse(user, 201, res, 'Registration successful. Please check your email to verify your account.');
  } catch (error) {
    user.verificationToken = undefined;
    user.verificationTokenExpire = undefined;
    await user.save({ validateBeforeSave: false });

    // Since we're in early phases and might not have working SMTP yet, we still let them log in
    sendTokenResponse(user, 201, res, 'Registration successful. Email service unavailable for verification link.');
  }
});

/**
 * @desc    Login user
 * @route   POST /api/auth/login
 * @access  Public
 */
exports.login = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;

  // Check for user
  const user = await User.findOne({ email }).select('+password');
  if (!user) {
    throw new ApiError(401, 'Invalid credentials');
  }

  // Check if password matches
  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    throw new ApiError(401, 'Invalid credentials');
  }

  sendTokenResponse(user, 200, res, 'Logged in successfully');
});

/**
 * @desc    Log user out / clear cookie
 * @route   POST /api/auth/logout
 * @access  Private
 */
exports.logout = asyncHandler(async (req, res, next) => {
  // Clear refresh token from DB if user provided
  if (req.user) {
    req.user.refreshToken = undefined;
    await req.user.save({ validateBeforeSave: false });
  }

  res.cookie('accessToken', 'none', {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true,
  });

  res.cookie('refreshToken', 'none', {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true,
  });

  res.status(200).json(new ApiResponse(200, 'Logged out successfully'));
});

/**
 * @desc    Get current logged in user
 * @route   GET /api/auth/me
 * @access  Private
 */
exports.getMe = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user.id);
  res.status(200).json(new ApiResponse(200, 'User data retrieved', user));
});

/**
 * @desc    Refresh access token
 * @route   POST /api/auth/refresh-token
 * @access  Public
 */
exports.refreshToken = asyncHandler(async (req, res, next) => {
  const token = req.cookies.refreshToken;

  if (!token) {
    throw new ApiError(401, 'Not authorized to refresh token');
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
    const user = await User.findById(decoded.id);

    if (!user || user.refreshToken !== token) {
      throw new ApiError(401, 'Invalid refresh token');
    }

    sendTokenResponse(user, 200, res, 'Token refreshed successfully');
  } catch (error) {
    throw new ApiError(401, 'Invalid or expired refresh token');
  }
});

const crypto = require('crypto');

/**
 * @desc    Verify user email using OTP
 * @route   POST /api/auth/verify-otp
 * @access  Private (Since it's accessed via Navbar when logged in)
 */
exports.verifyEmailOTP = asyncHandler(async (req, res, next) => {
  const { otp } = req.body;
  if (!otp) {
    throw new ApiError(400, 'Please provide the OTP');
  }

  // Get hashed OTP
  const verificationToken = crypto
    .createHash('sha256')
    .update(otp)
    .digest('hex');

  const user = await User.findById(req.user.id);
  
  if (!user) {
    throw new ApiError(404, 'User not found');
  }

  if (user.isVerified) {
    return res.status(400).json(new ApiResponse(400, 'User is already verified'));
  }

  if (user.verificationToken !== verificationToken || user.verificationTokenExpire < Date.now()) {
    throw new ApiError(400, 'Invalid or expired OTP');
  }

  user.isVerified = true;
  user.verificationToken = undefined;
  user.verificationTokenExpire = undefined;
  await user.save({ validateBeforeSave: false });

  // Optionally send a new token to update the cookies so isVerified is true in frontend
  sendTokenResponse(user, 200, res, 'Email verified successfully');
});

/**
 * @desc    Resend OTP
 * @route   POST /api/auth/resend-otp
 * @access  Private
 */
exports.resendOTP = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user.id);
  
  if (!user) {
    throw new ApiError(404, 'User not found');
  }

  if (user.isVerified) {
     return res.status(400).json(new ApiResponse(400, 'User is already verified'));
  }

  const verificationOTP = user.generateVerificationOTP();
  await user.save({ validateBeforeSave: false });

  try {
    await sendEmail({
      to: user.email,
      subject: 'Your New Verification OTP - Everest Encounter Treks',
      html: emailTemplates.verifyEmailOTP(user.name, verificationOTP),
    });

    res.status(200).json(new ApiResponse(200, 'A new OTP has been sent to your email'));
  } catch (error) {
    user.verificationToken = undefined;
    user.verificationTokenExpire = undefined;
    await user.save({ validateBeforeSave: false });
    throw new ApiError(500, 'Email service failed. Could not send OTP.');
  }
});

/**
 * @desc    Forgot password
 * @route   POST /api/auth/forgot-password
 * @access  Public
 */
exports.forgotPassword = asyncHandler(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });

  if (!user) {
    // Return standard message even if user doesn't exist to prevent email enumeration
    return res.status(200).json(new ApiResponse(200, 'If your email is registered, you will receive a password reset link shortly'));
  }

  // Get reset token
  const resetToken = user.generateResetPasswordToken();
  await user.save({ validateBeforeSave: false });

  // Create reset url
  const resetUrl = `${process.env.CLIENT_URL}/reset-password/${resetToken}`;

  try {
    await sendEmail({
      to: user.email,
      subject: 'Password Reset Request - Everest Encounter Treks',
      html: emailTemplates.resetPassword(user.name, resetUrl),
    });

    res.status(200).json(new ApiResponse(200, 'If your email is registered, you will receive a password reset link shortly'));
  } catch (error) {
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save({ validateBeforeSave: false });

    throw new ApiError(500, 'Email could not be sent');
  }
});

/**
 * @desc    Reset password
 * @route   PUT /api/auth/reset-password/:token
 * @access  Public
 */
exports.resetPassword = asyncHandler(async (req, res, next) => {
  if (!req.body.password || req.body.password.length < 6) {
    throw new ApiError(400, 'Password must be at least 6 characters');
  }

  // Get hashed token
  const resetPasswordToken = crypto
    .createHash('sha256')
    .update(req.params.token)
    .digest('hex');

  const user = await User.findOne({
    resetPasswordToken,
    resetPasswordExpire: { $gt: Date.now() },
  });

  if (!user) {
    throw new ApiError(400, 'Invalid or expired password reset token');
  }

  // Set new password
  user.password = req.body.password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;
  await user.save();

  sendTokenResponse(user, 200, res, 'Password reset successful. You are now logged in.');
});
