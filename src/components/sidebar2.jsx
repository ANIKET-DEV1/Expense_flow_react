import React from 'react'
import { Link } from 'react-router-dom'

const Sidebar2 = () => {
  return (
    <div >
        <nav className='flex flex-col gap-4 px-4'>
            <ul>
              <li><Link to="/dashboard">Dashboard</Link></li>
              <li><Link to="/expenses">Expenses</Link></li>
              <li><Link to="/tags">Tags</Link></li>
              <li><Link to="/settlements">Settlements</Link></li>
              <li><Link to="/profile">Profile</Link></li>
            </ul>
      </nav>
    </div>
  )
}

export default Sidebar2