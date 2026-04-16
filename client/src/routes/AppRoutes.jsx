import { Suspense, lazy } from 'react'
import { Routes, Route } from 'react-router-dom'
import MainLayout from '../layouts/MainLayout.jsx'
import AdminLayout from '../layouts/AdminLayout.jsx'
import AdminRoute from '../components/AdminRoute.jsx'
import ProtectedRoute from '../components/ProtectedRoute.jsx'
import Loader from '../components/Loader.jsx'

const Home = lazy(() => import('../pages/Home.jsx'))
const TrekList = lazy(() => import('../pages/TrekList.jsx'))
const TrekDetails = lazy(() => import('../pages/TrekDetails.jsx'))
const Login = lazy(() => import('../pages/Login.jsx'))
const Register = lazy(() => import('../pages/Register.jsx'))
const Guide = lazy(() => import('../pages/Guide.jsx'))
const Gallery = lazy(() => import('../pages/Gallery.jsx'))
const Payment = lazy(() => import('../pages/Payment.jsx'))
const PaymentSuccess = lazy(() => import('../pages/PaymentSuccess.jsx'))
const PaymentCancel = lazy(() => import('../pages/PaymentCancel.jsx'))
const MyBookings = lazy(() => import('../pages/user/MyBookings.jsx'))
const MyProfile = lazy(() => import('../pages/user/MyProfile.jsx'))
const UserChat = lazy(() => import('../pages/user/UserChat.jsx'))
const UserDashboard = lazy(() => import('../pages/user/UserDashboard.jsx'))

const AdminDashboard = lazy(() => import('../pages/admin/AdminDashboard.jsx'))
const ManageTreks = lazy(() => import('../pages/admin/ManageTreks.jsx'))
const AddTrek = lazy(() => import('../pages/admin/AddTrek.jsx'))
const ManageRegions = lazy(() => import('../pages/admin/ManageRegions.jsx'))
const ManageBookings = lazy(() => import('../pages/admin/ManageBookings.jsx'))
const ManagePayments = lazy(() => import('../pages/admin/ManagePayments.jsx'))
const ManageGallery = lazy(() => import('../pages/admin/ManageGallery.jsx'))
const ManageHero = lazy(() => import('../pages/admin/ManageHero.jsx'))
const ManageUsers = lazy(() => import('../pages/admin/ManageUsers.jsx'))
const AdminChat = lazy(() => import('../pages/admin/AdminChat.jsx'))
const ManageReviews = lazy(() => import('../pages/admin/ManageReviews.jsx'))
const ManageInquiries = lazy(() => import('../pages/admin/ManageInquiries.jsx'))

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

        <Route element={<ProtectedRoute />}>
          <Route path="user" element={loadPage(<MyBookings />)} />
          <Route path="user/bookings" element={loadPage(<MyBookings />)} />
          <Route path="user/profile" element={loadPage(<MyProfile />)} />
          <Route path="user/chat" element={loadPage(<UserChat />)} />
          <Route path="payment/:bookingId" element={loadPage(<Payment />)} />
          <Route path="payment/success" element={loadPage(<PaymentSuccess />)} />
          <Route path="payment/cancel" element={loadPage(<PaymentCancel />)} />
        </Route>
      </Route>

      <Route path="/admin" element={<AdminRoute />}>
        <Route element={<AdminLayout />}>
          <Route index element={loadPage(<AdminDashboard />)} />
          <Route path="treks" element={loadPage(<ManageTreks />)} />
          <Route path="treks/new" element={loadPage(<AddTrek />)} />
          <Route path="regions" element={loadPage(<ManageRegions />)} />
          <Route path="bookings" element={loadPage(<ManageBookings />)} />
          <Route path="payments" element={loadPage(<ManagePayments />)} />
          <Route path="gallery" element={loadPage(<ManageGallery />)} />
          <Route path="hero" element={loadPage(<ManageHero />)} />
          <Route path="users" element={loadPage(<ManageUsers />)} />
          <Route path="chat" element={loadPage(<AdminChat />)} />
          <Route path="reviews" element={loadPage(<ManageReviews />)} />
          <Route path="inquiries" element={loadPage(<ManageInquiries />)} />
        </Route>
      </Route>
    </Routes>
  )
}

export default AppRoutes
