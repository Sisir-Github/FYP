const validate = (schema) => (req, res, next) => {
  if (!schema) return next()
  const result = schema.safeParse(req.body)
  if (result.success) {
    req.body = result.data
    return next()
  }
  const errors = result.error?.errors?.map((error) => ({
    path: error.path?.join('.') || 'body',
    message: error.message,
  }))
  return res.status(400).json({
    message: 'Validation failed',
    errors,
  })
}

export default validate
