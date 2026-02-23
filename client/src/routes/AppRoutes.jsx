import { Routes, Route } from 'react-router-dom'
import MainLayout from '../layouts/MainLayout.jsx'
import AdminLayout from '../layouts/AdminLayout.jsx'
import ProtectedRoute from '../components/ProtectedRoute.jsx'
import AdminRoute from '../components/AdminRoute.jsx'
import Home from '../pages/Home.jsx'
import TrekList from '../pages/TrekList.jsx'
import TrekDetails from '../pages/TrekDetails.jsx'
import About from '../pages/About.jsx'
import Blog from '../pages/Blog.jsx'
import Gallery from '../pages/Gallery.jsx'
import Contact from '../pages/Contact.jsx'
import FAQ from '../pages/FAQ.jsx'
import Guide from '../pages/Guide.jsx'
import Partners from '../pages/Partners.jsx'
import TrustSafety from '../pages/TrustSafety.jsx'
import Calculator from '../pages/Calculator.jsx'
import Login from '../pages/Login.jsx'
import Register from '../pages/Register.jsx'
import Payment from '../pages/Payment.jsx'
import PaymentSuccess from '../pages/PaymentSuccess.jsx'
import PaymentCancel from '../pages/PaymentCancel.jsx'
import UserDashboard from '../pages/user/UserDashboard.jsx'
import MyBookings from '../pages/user/MyBookings.jsx'
import MyProfile from '../pages/user/MyProfile.jsx'
import SubmitReview from '../pages/user/SubmitReview.jsx'
import InquiryForm from '../pages/user/InquiryForm.jsx'
import AdminDashboard from '../pages/admin/AdminDashboard.jsx'
import ManageTreks from '../pages/admin/ManageTreks.jsx'
import ManageRegions from '../pages/admin/ManageRegions.jsx'
import ManageBookings from '../pages/admin/ManageBookings.jsx'
import ManagePayments from '../pages/admin/ManagePayments.jsx'
import ManageGallery from '../pages/admin/ManageGallery.jsx'
import ManageHero from '../pages/admin/ManageHero.jsx'
import ManageUsers from '../pages/admin/ManageUsers.jsx'
import ManageReviews from '../pages/admin/ManageReviews.jsx'
import ManageInquiries from '../pages/admin/ManageInquiries.jsx'

function AppRoutes() {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route index element={<Home />} />
        <Route path="treks" element={<TrekList />} />
        <Route path="treks/:id" element={<TrekDetails />} />
        <Route path="about" element={<About />} />
        <Route path="blog" element={<Blog />} />
        <Route path="gallery" element={<Gallery />} />
        <Route path="contact" element={<Contact />} />
        <Route path="faq" element={<FAQ />} />
        <Route path="guide" element={<Guide />} />
        <Route path="partners" element={<Partners />} />
        <Route path="trust" element={<TrustSafety />} />
        <Route path="calculator" element={<Calculator />} />
        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />

        <Route element={<ProtectedRoute />}>
          <Route path="user" element={<UserDashboard />} />
          <Route path="user/bookings" element={<MyBookings />} />
          <Route path="bookings" element={<MyBookings />} />
          <Route path="user/profile" element={<MyProfile />} />
          <Route path="user/review" element={<SubmitReview />} />
          <Route path="user/inquiry" element={<InquiryForm />} />
          <Route path="payment/:bookingId" element={<Payment />} />
          <Route path="payment/success" element={<PaymentSuccess />} />
          <Route path="payment/cancel" element={<PaymentCancel />} />
        </Route>
      </Route>

      <Route path="admin" element={<AdminRoute />}>
        <Route element={<AdminLayout />}>
          <Route index element={<AdminDashboard />} />
          <Route path="treks" element={<ManageTreks />} />
          <Route path="regions" element={<ManageRegions />} />
          <Route path="bookings" element={<ManageBookings />} />
          <Route path="payments" element={<ManagePayments />} />
          <Route path="gallery" element={<ManageGallery />} />
          <Route path="hero" element={<ManageHero />} />
          <Route path="users" element={<ManageUsers />} />
          <Route path="reviews" element={<ManageReviews />} />
          <Route path="inquiries" element={<ManageInquiries />} />
        </Route>
      </Route>
    </Routes>
  )
}

export default AppRoutes
