import { verifyAccessToken } from '../utils/jwt.js'
import User from '../modules/users/user.model.js'

const authMiddleware = async (req, res, next) => {
  const token = req.cookies?.accessToken || req.headers.authorization?.split(' ')[1]
  if (!token) {
    return res.status(401).json({ message: 'Unauthorized' })
  }

  try {
    const decoded = verifyAccessToken(token)
    const user = await User.findById(decoded.id).select('-password')
    if (!user) {
      return res.status(401).json({ message: 'Unauthorized' })            
    }
    req.user = user
    return next()
  } catch (error) {
    return res.status(401).json({ message: 'Invalid token' })
  }
}

export default authMiddleware
