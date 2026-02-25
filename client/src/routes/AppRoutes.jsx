import { Routes, Route } from 'react-router-dom'
import MainLayout from '../layouts/MainLayout.jsx'
import Home from '../pages/Home.jsx'
import TrekList from '../pages/TrekList.jsx'
import TrekDetails from '../pages/TrekDetails.jsx'
import Login from '../pages/Login.jsx'
import Register from '../pages/Register.jsx'

function AppRoutes() {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route index element={<Home />} />
        <Route path="treks" element={<TrekList />} />
        <Route path="treks/:id" element={<TrekDetails />} />
        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />
      </Route>
    </Routes>
  )
}

export default AppRoutes
