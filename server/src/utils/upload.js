import multer from 'multer'
import { v2 as cloudinary } from 'cloudinary'
import { CloudinaryStorage } from 'multer-storage-cloudinary'
import env from '../config/env.js'

// Configure Cloudinary only if keys exist, else fallback gracefully
if (env.cloudinaryName) {
  cloudinary.config({
    cloud_name: env.cloudinaryName,
    api_key: env.cloudinaryApiKey,
    api_secret: env.cloudinaryApiSecret,
  })
}

// Memory storage fallback if Cloudinary is not configured
const fallbackStorage = multer.memoryStorage()

// Cloudinary storage
const cloudinaryStorage = env.cloudinaryName 
  ? new CloudinaryStorage({
      cloudinary: cloudinary,
      params: {
        folder: 'everest_encounter_treks',
        allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
        transformation: [{ width: 1200, height: 800, crop: 'limit' }]
      }
    })
  : fallbackStorage

const fileFilter = (_, file, cb) => {
  const isImage = file.mimetype.startsWith('image/')
  cb(isImage ? null : new Error('Only image uploads are allowed'), isImage)
}

const upload = multer({ 
  storage: env.cloudinaryName ? cloudinaryStorage : fallbackStorage,
  fileFilter 
})

export default upload
