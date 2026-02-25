import app from './src/app.js'
import connectDb from './src/config/db.js'
import env from './src/config/env.js'

const startServer = async () => {
  await connectDb()
  app.listen(env.port, () => {
    // eslint-disable-next-line no-console
    console.log(`Server running on port ${env.port}`)
  })
}

startServer()
