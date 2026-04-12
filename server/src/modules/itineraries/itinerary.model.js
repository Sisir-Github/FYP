import mongoose from 'mongoose'

const ItinerarySchema = new mongoose.Schema(
  {
    trek: { type: mongoose.Schema.Types.ObjectId, ref: 'Trek_Package', required: true },
    dayNumber: { type: Number, required: true },
    title: { type: String, required: true },
    description: { type: String, default: '' },
    altitude: { type: Number, default: 0 },
    meals: { type: String, default: '' },
    accommodation: { type: String, default: '' },
  },
  { timestamps: true },
)

const ItineraryDay = mongoose.model('Itinerary_Day', ItinerarySchema)

export default ItineraryDay
