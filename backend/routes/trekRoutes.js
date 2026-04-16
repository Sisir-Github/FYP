const express = require('express');
const {
  getTreks,
  getTrek,
  getTrekBySlug,
  createTrek,
  updateTrek,
  deleteTrek,
} = require('../controllers/trekController');

const { protect, authorize } = require('../middleware/auth');
const upload = require('../middleware/upload');
const { createTrekValidator } = require('../validators/trekValidator');
const validate = require('../middleware/validate');

const router = express.Router();

router.route('/')
  .get(getTreks)
  .post(protect, authorize('admin'), upload.array('images', 5), createTrekValidator, validate, createTrek);

router.route('/:id')
  .get(getTrek)
  .put(protect, authorize('admin'), upload.array('images', 5), updateTrek)
  .delete(protect, authorize('admin'), deleteTrek);

router.route('/slug/:slug').get(getTrekBySlug);

module.exports = router;
