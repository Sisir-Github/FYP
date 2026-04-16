const express = require('express');
const {
  getReviews,
  addReview,
  deleteReview,
} = require('../controllers/reviewController');

const { protect } = require('../middleware/auth');
const validate = require('../middleware/validate');
const { body } = require('express-validator');

// mergeParams: true allows capturing trekId from /api/treks/:trekId/reviews
const router = express.Router({ mergeParams: true });

const reviewValidator = [
  body('rating').isFloat({ min: 1, max: 5 }).withMessage('Rating must be between 1 and 5'),
  body('title').notEmpty().withMessage('Please add a title'),
  body('text').notEmpty().withMessage('Please add review text'),
];

router
  .route('/')
  .get(getReviews)
  .post(protect, reviewValidator, validate, addReview);

router
  .route('/:id')
  .delete(protect, deleteReview);

module.exports = router;
