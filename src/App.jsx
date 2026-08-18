import React from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Landing from './pages/landing'
import Login from './pages/auth/login'
import Dashboard from './pages/dashboard'
import MainLayout from './MainLayout'
import Expenses from './pages/expense'
import Settlements from './pages/settlements'
import Profile from './pages/profile'
import Tags from './pages/tags';
import { AuthProvider } from './context/authcontext';
import Register from './pages/auth/register';
import Forget_password from './pages/auth/forget_password';
import Resetpassword from './pages/auth/reset-password';
import VerifyEmail from './pages/auth/verify-email';
import NotFound from './pages/error/NotFound';
import ServerError from './pages/error/ServerError';
import ProtectedRoutes from './components/routes/ProtectedRoutes';
import PublicRoutes from './components/routes/PublicRoutes';

const App = () => {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Landing />} />

          <Route element ={<PublicRoutes/>} >
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/forgot-password" element={<Forget_password />} />
                <Route path="/reset-password" element={<Resetpassword/>} />
                <Route path="/verify-email" element={<VerifyEmail />} />
          </Route>  

        <Route element={<ProtectedRoutes />}>
            <Route element={<MainLayout />}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/expenses" element={<Expenses />} />
              <Route path="/settlements" element={<Settlements />} />
              <Route path="/tags" element={<Tags />} />
              <Route path="/profile" element={<Profile />} />
            </Route>
        </Route>

        <Route path="/500" element={<ServerError />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
    </AuthProvider>
  )
}

export default App