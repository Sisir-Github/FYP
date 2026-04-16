import dotenv from 'dotenv'

dotenv.config()

const env = {
  nodeEnv: process.env.NODE_ENV || 'development',
  port: process.env.PORT || 5000,
  mongoUri: process.env.MONGO_URI || process.env.DB_URL,
  accessSecret: process.env.JWT_ACCESS_SECRET || process.env.JWT_SECRET_KEY,
  refreshSecret: process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET_KEY,
  accessExpires:
    process.env.ACCESS_TOKEN_EXPIRES || process.env.JWT_EXPIRES || '15m',
  refreshExpires:
    process.env.REFRESH_TOKEN_EXPIRES || process.env.JWT_EXPIRES || '7d',
  clientOrigin: process.env.CLIENT_ORIGIN || 'http://localhost:5173',
  serverOrigin:
    process.env.SERVER_ORIGIN || `http://localhost:${process.env.PORT || 5000}`,
  cookieSecure: process.env.COOKIE_SECURE === 'true',
  khaltiPublicKey: process.env.KHALTI_PUBLIC_KEY || '9690fdf50f3f439fa465f311c7e3bd39',
  khaltiSecretKey: process.env.KHALTI_SECRET_KEY || '34e67b34995348d992739a6c8f31b44b',
  khaltiApiUrl: process.env.KHALTI_API_URL || 'https://dev.khalti.com/api/v2',
  cloudinaryName: process.env.CLOUDINARY_CLOUD_NAME,
  cloudinaryApiKey: process.env.CLOUDINARY_API_KEY,
  cloudinaryApiSecret: process.env.CLOUDINARY_API_SECRET,
  smtpHost: process.env.SMTP_HOST || 'smtp.gmail.com',
  smtpPort: Number(process.env.SMTP_PORT || 587),
  smtpSecure: process.env.SMTP_SECURE === 'true',
  emailUser: process.env.EMAIL_USER || process.env.SMTP_USER,
  emailPass: (process.env.EMAIL_PASS || process.env.SMTP_PASS || '').replace(/\s+/g, ''),
  emailFrom: process.env.EMAIL_FROM,
}

export default env
