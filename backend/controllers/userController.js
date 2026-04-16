const User = require('../models/User');
const ApiError = require('../utils/ApiError');
const ApiResponse = require('../utils/ApiResponse');
const asyncHandler = require('../utils/asyncHandler');
const cloudinary = require('../config/cloudinary');
const streamifier = require('streamifier');

/**
 * @desc    Update user profile & avatar
 * @route   PUT /api/users/profile
 * @access  Private
 */
exports.updateProfile = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user.id);

  if (!user) {
    throw new ApiError(404, 'User not found');
  }

  // Update plain fields
  if (req.body.name) user.name = req.body.name;
  if (req.body.email) user.email = req.body.email; // Note: In a real app we might re-verify if email changes

  // Handle avatar upload via Cloudinary
  if (req.file) {
    // Delete old avatar if exists
    if (user.avatar && user.avatar.public_id) {
      try {
        await cloudinary.uploader.destroy(user.avatar.public_id);
      } catch (err) {
        console.error('Cloudinary delete error:', err);
      }
    }

    // Upload new image from memory buffer using buffer stream
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: 'everest_encounter/avatars',
        width: 150,
        height: 150,
        crop: 'fill',
      },
      async (error, result) => {
        if (error) {
          return next(new ApiError(500, 'Image upload failed'));
        }

        user.avatar = {
          public_id: result.public_id,
          url: result.secure_url,
        };

        await user.save({ validateBeforeSave: false });

        res.status(200).json(
          new ApiResponse(200, 'Profile updated successfully', {
            _id: user._id,
            name: user.name,
            email: user.email,
            avatar: user.avatar,
            role: user.role,
          })
        );
      }
    );

    streamifier.createReadStream(req.file.buffer).pipe(uploadStream);
  } else {
    await user.save({ validateBeforeSave: false });

    res.status(200).json(
      new ApiResponse(200, 'Profile updated successfully', {
        _id: user._id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
        role: user.role,
      })
    );
  }
});

/**
 * @desc    Get all users
 * @route   GET /api/admin/users
 * @access  Private/Admin
 */
exports.getAllUsers = asyncHandler(async (req, res, next) => {
  const users = await User.find({});
  res.status(200).json(new ApiResponse(200, 'Users fetched', users));
});

/**
 * @desc    Create a new user
 * @route   POST /api/admin/users
 * @access  Private/Admin
 */
exports.createUser = asyncHandler(async (req, res, next) => {
  const { name, email, password, role, isVerified } = req.body;
  
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new ApiError(400, 'User already exists with this email');
  }

  const user = await User.create({
    name,
    email,
    password,
    role: role || 'user',
    isVerified: isVerified || false
  });

  res.status(201).json(new ApiResponse(201, 'User created successfully', user));
});

/**
 * @desc    Get single user
 * @route   GET /api/admin/users/:id
 * @access  Private/Admin
 */
exports.getUser = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.params.id);
  if (!user) {
    throw new ApiError(404, 'User not found');
  }
  res.status(200).json(new ApiResponse(200, 'User fetched', user));
});

/**
 * @desc    Update user
 * @route   PUT /api/admin/users/:id
 * @access  Private/Admin
 */
exports.updateUser = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.params.id);
  if (!user) {
    throw new ApiError(404, 'User not found');
  }

  user.name = req.body.name || user.name;
  user.email = req.body.email || user.email;
  user.role = req.body.role || user.role;
  if (req.body.isVerified !== undefined) {
    user.isVerified = req.body.isVerified;
  }
  if (req.body.password) {
     user.password = req.body.password;
  }

  await user.save({ validateBeforeSave: false });

  res.status(200).json(new ApiResponse(200, 'User updated successfully', user));
});

/**
 * @desc    Delete user
 * @route   DELETE /api/admin/users/:id
 * @access  Private/Admin
 */
exports.deleteUser = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.params.id);
  if (!user) {
    throw new ApiError(404, 'User not found');
  }
  
  await user.deleteOne();
  res.status(200).json(new ApiResponse(200, 'User deleted successfully', {}));
});
