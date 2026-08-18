import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Receipt,
  Handshake,
  Tag,
  User,
  LogOut,
  X,
} from 'lucide-react';
import { useAuth } from '../context/authcontext';
import { AppLogo } from './Logo';

const NAV_ITEMS = [
  {
    to: '/dashboard',
    label: 'Dashboard',
    icon: <LayoutDashboard size={18} />,
  },
  {
    to: '/expenses',
    label: 'Expenses',
    icon: <Receipt size={18} />,
  },
  {
    to: '/settlements',
    label: 'Settlements',
    icon: <Handshake size={18} />,
  },
  {
    to: '/tags',
    label: 'Tags Manager',
    icon: <Tag size={18} />,
  },
  {
    to: '/profile',
    label: 'My Profile',
    icon: <User size={18} />,
  },
];

const Sidebar = ({ mobileOpen, onClose }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const initials = user?.username ? user.username.slice(0, 2).toUpperCase() : 'EX';

  const handleLogout = async () => {
    if (onClose) onClose();
    await logout();
    navigate('/');
  };

  const handleLinkClick = () => {
    if (onClose) onClose();
  };

  return (
    <aside className={`sidebar${mobileOpen ? ' mobile-open' : ''}`}>
      {/* Mobile Drawer Header with Close Button */}
      <div className="sidebar-mobile-head">
        <AppLogo size={28} iconSize={15} />
        <button
          type="button"
          onClick={onClose}
          className="sidebar-close-btn"
          aria-label="Close menu"
        >
          <X size={18} />
        </button>
      </div>

      {/* Nav */}
      <div className="nav-section">
        <p className="nav-label">Menu</p>
        {NAV_ITEMS.map(({ to, label, icon }) => (
          <NavLink
            key={to}
            to={to}
            onClick={handleLinkClick}
            className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}
          >
            {icon}
            {label}
          </NavLink>
        ))}
      </div>

      {/* Footer */}
      <div className="sidebar-foot">
        <div className="sidebar-user">
          <div className="avatar">{initials}</div>
          <div style={{ minWidth: 0, overflow: 'hidden' }}>
            <div
              className="name"
              style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}
            >
              {user?.username || 'User'}
            </div>
            <div className="sub">Premium Pilot</div>
          </div>
        </div>
        <button className="sidebar-signout" onClick={handleLogout}>
          <LogOut size={14} />
          Sign Out
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;