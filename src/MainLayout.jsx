import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './components/navbar';
import Sidebar from './components/sidebar';
import Cursor from './components/Cursor';
import useScrollReveal from './components/useScrollReveal';
import './style/global.css';

export default function MainLayout() {
  useScrollReveal();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <>
      <Cursor />
      {/* Fixed topnav */}
      <header className="topnav">
        <Navbar
          mobileMenuOpen={mobileMenuOpen}
          onToggleMobileMenu={() => setMobileMenuOpen((p) => !p)}
        />
      </header>

      {/* Backdrop for mobile sidebar drawer */}
      <div
        className={`sidebar-backdrop${mobileMenuOpen ? ' show' : ''}`}
        onClick={() => setMobileMenuOpen(false)}
      />

      {/* Sidebar + main container */}
      <div className="shell">
        <Sidebar
          mobileOpen={mobileMenuOpen}
          onClose={() => setMobileMenuOpen(false)}
        />
        <div className="main">
          <div className="page">
            <Outlet />
          </div>
        </div>
      </div>
    </>
  );
}