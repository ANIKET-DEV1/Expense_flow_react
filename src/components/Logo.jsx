import React from 'react';

export const LogoIcon = ({ size = 18, className = "" }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    {/* First Coin */}
    <circle cx="8" cy="8" r="6" />
    <path d="M7 6h1v4" />
    {/* Second Overlapping Coin */}
    <path d="M18.09 10.37A6 6 0 1 1 10.34 18" />
    <path d="m16.71 13.88.7.71-2.82 2.82" />
  </svg>
);

export const AppLogo = ({ size = 32, iconSize = 17, showText = true, className = "", style = {} }) => (
  <div
    className={`topnav-logo ${className}`}
    style={{ display: 'flex', alignItems: 'center', gap: 10, ...style }}
  >
    <div
      className="licon"
      style={{
        width: size,
        height: size,
        borderRadius: size > 34 ? 10 : 8,
        background: 'linear-gradient(145deg, var(--gold) 0%, #9a6e28 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        boxShadow: '0 0 0 1px rgba(212,162,76,0.45), 0 4px 16px rgba(212,162,76,0.22)',
        color: 'var(--gold-ink)',
        flexShrink: 0,
      }}
    >
      <LogoIcon size={iconSize} />
    </div>
    {showText && <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700 }}>ExpenseFlow</span>}
  </div>
);

export default AppLogo;
