const express = require('express');
const { getAdminStats } = require('../controllers/adminController');
const { 
  getAllUsers, 
  getUser, 
  createUser, 
  updateUser, 
  deleteUser 
} = require('../controllers/userController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

router.use(protect);
router.use(authorize('admin'));

router.get('/stats', getAdminStats);
router.route('/users').get(getAllUsers).post(createUser);
router.route('/users/:id').get(getUser).put(updateUser).delete(deleteUser);

module.exports = router;
