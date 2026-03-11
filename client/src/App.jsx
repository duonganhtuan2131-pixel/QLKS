import React from 'react'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import { Routes, Route, useLocation } from 'react-router-dom'
import Register from './login/Register.jsx'
import Login from './login/login.jsx'
import ViewProfile from './login/Viewprofile.jsx'
import HomeAdmin from './admin/dashboard/homeadmin.jsx'
import UserAdmin from './admin/main/user.jsx'
import SidebarAdmin from './admin/components/SidebarAdmin.jsx'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const App = () => {

  const isOwnerPath = useLocation().pathname.includes("owner");

  return (
    <div className='flex flex-col min-h-screen bg-white'>
      <ToastContainer position="top-right" autoClose={3000} />
      {!isOwnerPath && <Navbar />}
      {isOwnerPath && <SidebarAdmin />}
      
      <div className={`flex-1 transition-all duration-300 ${isOwnerPath ? 'pl-64' : ''}`}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/rooms" element={<div>Trang danh sách phòng</div>} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/profile" element={<ViewProfile />} />
          <Route path="/owner" element={<HomeAdmin />} />
          <Route path="/owner/user" element={<UserAdmin />} />
        </Routes>
      </div>
    </div>
  )
}

export default App