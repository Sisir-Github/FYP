import mongoose from 'mongoose'
import { UserSchema } from './user.model.js'

const AdminSchema = UserSchema.clone()
AdminSchema.path('role').default('ADMIN')

const Admin = mongoose.model('Admin', AdminSchema)

export default Admin
