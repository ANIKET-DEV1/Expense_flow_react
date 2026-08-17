import React from 'react'
import Navbar from '../components/navbar'
import Sidebar from '../components/sidebar'
import { useAuth } from '../context/authcontext'
const Dashboard = () => {
  const { user, logout } = useAuth();
  return (
    <div>
      Dashboard
      <p>Welcome, {user?.username}!</p>
      <p>Email: {user?.email}</p>
      <button onClick={logout}>Logout</button>
    </div>
  )
}

export default Dashboard