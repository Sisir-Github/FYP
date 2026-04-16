import mongoose from 'mongoose'

const ChatMessageSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    senderRole: {
      type: String,
      enum: ['USER', 'ADMIN'],
      required: true,
    },
    text: { type: String, required: true, trim: true },
    readByUser: { type: Boolean, default: false },
    readByAdmin: { type: Boolean, default: false },
  },
  { timestamps: true },
)

const ChatMessage = mongoose.model('ChatMessage', ChatMessageSchema)

export default ChatMessage
