import mongoose from 'mongoose'

const InquirySchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
    name: { type: String, default: '' },
    email: { type: String, default: '' },
    subject: { type: String, required: true },
    message: { type: String, required: true },
    status: { type: String, default: 'NEW' },
  },
  { timestamps: true },
)

const Inquiry = mongoose.model('Inquiry', InquirySchema)

export default Inquiry
