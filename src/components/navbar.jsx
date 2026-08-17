import React from 'react'

const Navbar = () => {
  return (
    <header id="topnav" className='flex flex-row justify-between items-center p-4 bg-gray-800 text-white'>
      <button id="menuBtn" type="button" aria-label="Open menu">icon</button>
      <div>Welcome, AwsmX</div>
      <div>
        <button id="themeToggle" type="button">Toggle</button>
        <span>Secure Node Active</span>
      </div>
    </header>
  )
}

export default Navbar