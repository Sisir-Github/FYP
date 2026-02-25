const roleMiddleware = (roles = []) => {
  const allow = Array.isArray(roles) ? roles : [roles]
  return (req, res, next) => {
    if (!req.user || !allow.includes(req.user.role)) {
      return res.status(403).json({ message: 'Forbidden' })
    }
    return next()
  }
}

export default roleMiddleware
