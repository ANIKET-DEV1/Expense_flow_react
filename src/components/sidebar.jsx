import React from 'react'
import Sidebar2 from './sidebar2'
import Dashboard from '../pages/dashboard'

const Sidebar = () => {
  return (
      <aside id="sidebarBackdrop" className='flex flex-col justify-between gap-3 p-4 bg-gray-900 text-white w-64 h-screen'>
        <div>EXPENSEFLOW</div>
        <Sidebar2/>
      <div id="sidebarUser">
        <div>Name</div>
        <div>Premium Pilot</div>
        <button id="sidebarSignOut">Sign Out</button>
      </div>
    </aside>
  )
}

export default Sidebar