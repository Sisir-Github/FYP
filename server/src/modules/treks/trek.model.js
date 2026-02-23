import mongoose from 'mongoose'

const TrekSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    location: { type: String, default: '' },
    region: { type: mongoose.Schema.Types.ObjectId, ref: 'Region', required: true },
    difficulty: { type: String, default: 'Moderate' },
    days: { type: Number, default: 10 },
    price: { type: Number, default: 0 },
    description: { type: String, default: '' },
    overview: { type: String, default: '' },
    image: { type: String, default: '' },
    galleryImages: [{ type: String }],
    mapImage: { type: String, default: '' },
    elevationChart: { type: String, default: '' },
    maxGroupSize: { type: Number, default: 12 },
    altitude: { type: Number, default: 0 },
    bestSeason: { type: String, default: '' },
    accommodation: { type: String, default: '' },
    included: [{ type: String }],
    excluded: [{ type: String }],
    equipment: [{ type: String }],
    faqs: [
      {
        question: { type: String, default: '' },
        answer: { type: String, default: '' },
      },
    ],
    itinerary: [
      {
        day: { type: Number, default: 1 },
        title: { type: String, default: '' },
        description: { type: String, default: '' },
      },
    ],
    highlights: [{ type: String }],
    availableDates: [{ type: String }],
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true },
)

const Trek = mongoose.model('Trek_Package', TrekSchema)

export default Trek
