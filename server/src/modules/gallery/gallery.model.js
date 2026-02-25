import mongoose from 'mongoose'

const GallerySchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    category: { type: String, required: true, trim: true },
    description: { type: String, trim: true },
    image: { type: String, required: true, trim: true },
    isFeatured: { type: Boolean, default: false },
  },
  { timestamps: true },
)

export default mongoose.model('Gallery', GallerySchema)
