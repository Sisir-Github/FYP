import mongoose from 'mongoose'

const RegionSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true, trim: true },
    slug: { type: String, required: true, unique: true },
    description: { type: String, default: '' },
    image: { type: String, default: '' },
  },
  { timestamps: true },
)

const Region = mongoose.model('Region', RegionSchema)

export default Region
