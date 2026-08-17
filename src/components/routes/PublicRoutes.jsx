import React from 'react'
import { Navigate,Outlet } from 'react-router-dom'
import { useAuth } from '../../context/authcontext'
const PublicRoutes = () => {
  const {isAuthenticated,loading }= useAuth()
      if (loading) {
          return <div className="loading-spinner">Verifying session...</div>;
      }
  
      return isAuthenticated ? <Navigate to="/dashboard" replace />: <Outlet/>
}

export default PublicRoutes