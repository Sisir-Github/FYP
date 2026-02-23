import mongoose from 'mongoose'

const ReviewSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    trek: { type: mongoose.Schema.Types.ObjectId, ref: 'Trek_Package', required: true },
    booking: { type: mongoose.Schema.Types.ObjectId, ref: 'Booking', required: true },
    rating: { type: Number, min: 1, max: 5, required: true },
    comment: { type: String, default: '' },
  },
  { timestamps: true },
)

const Review = mongoose.model('Review', ReviewSchema)

export default Review
