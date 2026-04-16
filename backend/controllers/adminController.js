const Booking = require('../models/Booking');
const Trek = require('../models/Trek');
const User = require('../models/User');
const ApiResponse = require('../utils/ApiResponse');
const asyncHandler = require('../utils/asyncHandler');

/**
 * @desc    Get comprehensive admin statistics
 * @route   GET /api/admin/stats
 * @access  Private/Admin
 */
exports.getAdminStats = asyncHandler(async (req, res, next) => {
  // Aggregate revenue
  const revenueAggregation = await Booking.aggregate([
    {
      $match: {
        paymentStatus: 'Paid',
        status: { $in: ['Confirmed', 'Completed'] }
      }
    },
    {
      $group: {
        _id: null,
        totalRevenue: { $sum: '$totalAmount' }
      }
    }
  ]);

  const totalRevenue = revenueAggregation[0] ? revenueAggregation[0].totalRevenue : 0;

  // Counts
  const totalBookings = await Booking.countDocuments();
  const activeBookings = await Booking.countDocuments({ status: 'Confirmed' });
  
  const totalUsers = await User.countDocuments({ role: 'user' });
  const totalTreks = await Trek.countDocuments();

  // Recent 5 bookings
  const recentBookings = await Booking.find()
    .sort('-createdAt')
    .limit(5)
    .populate('user', 'name')
    .populate('trek', 'title');

  res.status(200).json(
    new ApiResponse(200, 'Admin statistics fetched successfully', {
      totalRevenue,
      totalBookings,
      activeBookings,
      totalUsers,
      totalTreks,
      recentBookings,
    })
  );
});
