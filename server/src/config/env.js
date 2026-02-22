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
  cookieSecure: process.env.COOKIE_SECURE === 'true',
  stripeSecret: process.env.STRIPE_SECRET_KEY,
  stripeWebhookSecret: process.env.STRIPE_WEBHOOK_SECRET,
}

export default env
