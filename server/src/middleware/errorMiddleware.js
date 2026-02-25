const errorMiddleware = (err, req, res, next) => {
  const status = err.status || 500
  const message = err.message || 'Server error'
  if (req.app.get('env') !== 'test') {
    // eslint-disable-next-line no-console
    console.error(err)
  }
  res.status(status).json({ message })
}

export default errorMiddleware
