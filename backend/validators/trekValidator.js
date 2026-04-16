const { body } = require('express-validator');

exports.createTrekValidator = [
  body('title').notEmpty().withMessage('Title is required').isLength({ max: 100 }).withMessage('Title cannot exceed 100 characters'),
  body('description').notEmpty().withMessage('Description is required').isLength({ max: 2000 }),
  body('duration').isNumeric().withMessage('Duration must be a number'),
  body('price').isNumeric().withMessage('Price must be a number'),
  body('difficulty').isIn(['Easy', 'Moderate', 'Challenging', 'Strenuous']).withMessage('Invalid difficulty level'),
  body('maxAltitude').isNumeric().withMessage('Max altitude must be a number'),
  body('startPoint').notEmpty().withMessage('Start point is required'),
  body('endPoint').notEmpty().withMessage('End point is required'),
];
