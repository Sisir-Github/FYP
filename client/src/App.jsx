import { useEffect } from 'react'
import AppRoutes from './routes/AppRoutes.jsx'
import { initAnalytics } from './utils/analytics.js'

function App() {
  useEffect(() => {
    initAnalytics()
  }, [])
  return <AppRoutes />
}

export default App
