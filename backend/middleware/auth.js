const jwt = require('jsonwebtoken');
const User = require('../models/User');
const ApiError = require('../utils/ApiError');

/**
 * Protect routes - verify JWT access token
 */
const protect = async (req, res, next) => {
  let token;

  // Check Authorization header
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }
  // Also check cookies
  else if (req.cookies && req.cookies.accessToken) {
    token = req.cookies.accessToken;
  }

  if (!token) {
    throw new ApiError(401, 'Not authorized. Please log in.');
  }

  // Verify token
  const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET);

  // Attach user to request
  const user = await User.findById(decoded.id).select('-password');
  if (!user) {
    throw new ApiError(401, 'User belonging to this token no longer exists.');
  }

  req.user = user;
  next();
};

/**
 * Restrict to specific roles
 */
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      throw new ApiError(403, 'You do not have permission to perform this action.');
    }
    next();
  };
};

/**
 * Optional auth - attach user if token exists, but don't block
 */
const optionalAuth = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  } else if (req.cookies && req.cookies.accessToken) {
    token = req.cookies.accessToken;
  }

  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
      req.user = await User.findById(decoded.id).select('-password');
    } catch (err) {
      // Token invalid, continue without user
    }
  }

  next();
};

module.exports = { protect, authorize, optionalAuth };
