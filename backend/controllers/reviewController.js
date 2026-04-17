const Review = require('../models/Review');
const Trek = require('../models/Trek');
const ApiError = require('../utils/ApiError');
const ApiResponse = require('../utils/ApiResponse');
const asyncHandler = require('../utils/asyncHandler');

/**
 * @desc    Get reviews for a trek
 * @route   GET /api/treks/:trekId/reviews
 * @route   GET /api/reviews
 * @access  Public
 */
exports.getReviews = asyncHandler(async (req, res, next) => {
  let query;

  if (req.params.trekId) {
    query = Review.find({ trek: req.params.trekId });
  } else {
    query = Review.find();
  }

  const reviews = await query
    .populate({
      path: 'user',
      select: 'name avatar',
    })
    .populate({
      path: 'trek',
      select: 'title',
    })
    .sort('-createdAt');

  res.status(200).json(new ApiResponse(200, 'Reviews fetched successfully', reviews));
});

/**
 * @desc    Add review
 * @route   POST /api/treks/:trekId/reviews
 * @access  Private
 */
exports.addReview = asyncHandler(async (req, res, next) => {
  req.body.trek = req.params.trekId;
  req.body.user = req.user.id;

  const trek = await Trek.findById(req.params.trekId);

  if (!trek) {
    throw new ApiError(404, `No trek with the id of ${req.params.trekId}`);
  }

  // To prevent multiple reviews, Mongo unique index on trek-user will throw Mongoose error 11000
  // we catch it globally or here
  try {
    const review = await Review.create(req.body);

    const populatedReview = await Review.findById(review._id).populate({
      path: 'user',
      select: 'name avatar',
    });

    res.status(201).json(new ApiResponse(201, 'Review created successfully', populatedReview));
  } catch (err) {
    if (err.code === 11000) {
      throw new ApiError(400, 'You have already submitted a review for this trek');
    }
    throw err;
  }
});

/**
 * @desc    Delete review
 * @route   DELETE /api/reviews/:id
 * @access  Private (Owner or Admin)
 */
exports.deleteReview = asyncHandler(async (req, res, next) => {
  const review = await Review.findById(req.params.id);

  if (!review) {
    throw new ApiError(404, `No review with the id of ${req.params.id}`);
  }

  // Make sure review belongs to user or user is admin
  if (review.user.toString() !== req.user.id && req.user.role !== 'admin') {
    throw new ApiError(403, 'Not authorized to delete this review');
  }

  await review.deleteOne(); // this triggers the post delete hook

  res.status(200).json(new ApiResponse(200, 'Review deleted successfully', {}));
});
