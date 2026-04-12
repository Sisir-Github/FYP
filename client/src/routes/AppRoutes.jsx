import { Suspense, lazy } from 'react'
import { Routes, Route } from 'react-router-dom'
import MainLayout from '../layouts/MainLayout.jsx'
import Loader from '../components/Loader.jsx'

const Home = lazy(() => import('../pages/Home.jsx'))
const TrekList = lazy(() => import('../pages/TrekList.jsx'))
const TrekDetails = lazy(() => import('../pages/TrekDetails.jsx'))
const Login = lazy(() => import('../pages/Login.jsx'))
const Register = lazy(() => import('../pages/Register.jsx'))
const Guide = lazy(() => import('../pages/Guide.jsx'))
const Gallery = lazy(() => import('../pages/Gallery.jsx'))

const pageFallback = <Loader label="Loading page..." />

function loadPage(page) {
  return <Suspense fallback={pageFallback}>{page}</Suspense>
}

function AppRoutes() {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route index element={loadPage(<Home />)} />
        <Route path="treks" element={loadPage(<TrekList />)} />
        <Route path="treks/:id" element={loadPage(<TrekDetails />)} />
        <Route path="guide" element={loadPage(<Guide />)} />
        <Route path="gallery" element={loadPage(<Gallery />)} />
        <Route path="login" element={loadPage(<Login />)} />
        <Route path="register" element={loadPage(<Register />)} />
      </Route>
    </Routes>
  )
}

export default AppRoutes
