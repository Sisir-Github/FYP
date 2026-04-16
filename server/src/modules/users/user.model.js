import mongoose from 'mongoose'

const UserSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true },
    phone: { type: String, default: '' },
    profileImage: { type: String, default: '' },
    role: {
      type: String,
      enum: ['USER', 'ADMIN', 'user', 'admin'],
      default: 'USER',
      set: (value) => (typeof value === 'string' ? value.toUpperCase() : value),
    },
    refreshTokens: [{ type: String }],
    isActive: { type: Boolean, default: true },
    isEmailVerified: { type: Boolean, default: false },
    verificationToken: { type: String },
    emailOtp: { type: String },
    emailOtpExpires: { type: Date },
    resetPasswordToken: { type: String },
    resetPasswordExpires: { type: Date },
  },
  { timestamps: true },
)

const User = mongoose.model('User', UserSchema)

export { UserSchema }
export default User
