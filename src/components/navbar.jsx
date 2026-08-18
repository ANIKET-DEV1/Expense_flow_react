import React from 'react';
import { Menu, X } from 'lucide-react';
import { useAuth } from '../context/authcontext';
import { AppLogo } from './Logo';

const Navbar = ({ mobileMenuOpen, onToggleMobileMenu }) => {
  const { user } = useAuth();
  const initials = user?.username ? user.username.slice(0, 2).toUpperCase() : 'EX';

  return (
    <>
      {/* Left: Mobile hamburger + Logo */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <button
          type="button"
          className="menu-btn"
          onClick={onToggleMobileMenu}
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>

        <AppLogo size={32} iconSize={17} />
      </div>

      {/* Right side */}
      <div className="topnav-right">
        <div className="status-pill">Secure Node Active</div>
        <div className="profile-btn">{initials}</div>
      </div>
    </>
  );
};

export default Navbar;