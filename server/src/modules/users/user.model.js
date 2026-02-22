import mongoose from 'mongoose'

const UserSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true },
    phone: { type: String, default: '' },
    role: {
      type: String,
      enum: ['USER', 'ADMIN', 'user', 'admin'],
      default: 'USER',
      set: (value) => (typeof value === 'string' ? value.toUpperCase() : value),
    },
    refreshTokens: [{ type: String }],
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true },
)

const User = mongoose.model('User', UserSchema)

export { UserSchema }
export default User
