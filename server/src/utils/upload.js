import multer from 'multer'
import path from 'path'
import fs from 'fs'

const uploadDir = path.resolve('server/uploads')

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true })
}

const storage = multer.diskStorage({
  destination: (_, __, cb) => cb(null, uploadDir),
  filename: (_, file, cb) => {
    const ext = path.extname(file.originalname)
    const safeName = file.fieldname + '-' + Date.now() + ext
    cb(null, safeName)
  },
})

const fileFilter = (_, file, cb) => {
  const isImage = file.mimetype.startsWith('image/')
  cb(isImage ? null : new Error('Only image uploads are allowed'), isImage)
}

const upload = multer({ storage, fileFilter })

export default upload
