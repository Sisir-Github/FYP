const express = require('express');
const {
  submitContact,
  getAllContacts,
  getContactById,
  updateContactStatus,
  deleteContact,
} = require('../controllers/contactController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// Public route
router.post('/', submitContact);

// Admin routes
router.use(protect);
router.use(authorize('admin'));

router.get('/', getAllContacts);
router.route('/:id').get(getContactById).patch(updateContactStatus).delete(deleteContact);

module.exports = router;
