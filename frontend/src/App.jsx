import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CurrencyProvider } from './context/CurrencyContext';

// Layouts
import MainLayout from './components/layout/MainLayout';
import AdminLayout from './components/layout/AdminLayout';

// Route Guards
import ProtectedRoute from './components/common/ProtectedRoute';
import AdminRoute from './components/common/AdminRoute';

// Public Pages
import Home from './pages/public/Home';
import TrekListing from './pages/public/TrekListing';
import TrekDetails from './pages/public/TrekDetails';
import About from './pages/public/About';
import Contact from './pages/public/Contact';
import Login from './pages/public/Login';
import Register from './pages/public/Register';
import VerifyEmail from './pages/public/VerifyEmail';
import ForgotPassword from './pages/public/ForgotPassword';
import ResetPassword from './pages/public/ResetPassword';
import NotFound from './pages/public/NotFound';
import Blogs from './pages/public/Blogs';
import BlogDetail from './pages/public/BlogDetail';
import VerifyKhalti from './pages/public/VerifyKhalti';

// User Pages
import Dashboard from './pages/user/Dashboard';
import Profile from './pages/user/Profile';
import MyBookings from './pages/user/MyBookings';

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminTreks from './pages/admin/AdminTreks';
import ManageTrek from './pages/admin/ManageTrek';
import AdminBookings from './pages/admin/AdminBookings';
import AdminUsers from './pages/admin/AdminUsers';
import AdminPayments from './pages/admin/AdminPayments';
import AdminReviews from './pages/admin/AdminReviews';
import AdminNotifications from './pages/admin/AdminNotifications';
import AdminSettings from './pages/admin/AdminSettings';
import AdminContacts from './pages/admin/AdminContacts';
import AdminBlogs from './pages/admin/AdminBlogs';

function App() {
  return (
    <AuthProvider>
      <CurrencyProvider>
        <Router>
          <Routes>
          <Route element={<MainLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/treks" element={<TrekListing />} />
            <Route path="/treks/:slug" element={<TrekDetails />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/verify-email" element={<VerifyEmail />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password/:token" element={<ResetPassword />} />
            <Route path="/blogs" element={<Blogs />} />
            <Route path="/blogs/:slug" element={<BlogDetail />} />
            <Route path="/payments/verify" element={<VerifyKhalti />} />

            {/* ========== USER PROTECTED ROUTES ========== */}
            <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
            <Route path="/my-bookings" element={<ProtectedRoute><MyBookings /></ProtectedRoute>} />
            <Route path="/payments" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            <Route path="/my-reviews" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />

            {/* 404 */}
            <Route path="*" element={<NotFound />} />
          </Route>

          {/* ========== ADMIN ROUTES ========== */}
          <Route
            path="/admin"
            element={
              <AdminRoute>
                <AdminLayout />
              </AdminRoute>
            }
          >
            <Route index element={<AdminDashboard />} />
            <Route path="users" element={<AdminUsers />} />
            
            {/* Admin Trek Management */}
            <Route path="treks" element={<AdminTreks />} />
            <Route path="treks/add" element={<ManageTrek />} />
            <Route path="treks/edit/:id" element={<ManageTrek />} />

            <Route path="bookings" element={<AdminBookings />} />
            <Route path="payments" element={<AdminPayments />} />
            <Route path="reviews" element={<AdminReviews />} />
            <Route path="notifications" element={<AdminNotifications />} />
            <Route path="contacts" element={<AdminContacts />} />
            <Route path="blogs" element={<AdminBlogs />} />
            <Route path="settings" element={<AdminSettings />} />
          </Route>
        </Routes>
      </Router>
      </CurrencyProvider>
    </AuthProvider>
  );
}

export default App;
