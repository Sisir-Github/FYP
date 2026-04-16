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
