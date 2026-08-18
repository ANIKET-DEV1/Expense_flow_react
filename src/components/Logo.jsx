import React from 'react';

export const LogoIcon = ({ size = 20, className = "" }) => (
  <img
    src="/logo.png"
    alt="ExpenseFlow Logo"
    width={size}
    height={size}
    className={className}
    style={{
      objectFit: 'contain',
      display: 'inline-block',
      verticalAlign: 'middle',
      borderRadius: Math.max(4, Math.round(size * 0.22)),
    }}
  />
);

export const AppLogo = ({ size = 32, iconSize = 32, showText = true, className = "", style = {} }) => (
  <div
    className={`topnav-logo ${className}`}
    style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none', color: 'inherit', ...style }}
  >
    <img
      src="/logo.png"
      alt="ExpenseFlow"
      width={size}
      height={size}
      style={{
        borderRadius: Math.max(6, Math.round(size * 0.24)),
        boxShadow: '0 0 0 1px rgba(212,162,76,0.4), 0 4px 16px rgba(212,162,76,0.22)',
        objectFit: 'cover',
        display: 'block',
        flexShrink: 0,
      }}
    />
    {showText && (
      <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, letterSpacing: '-0.01em', fontSize: '1.08rem' }}>
        ExpenseFlow
      </span>
    )}
  </div>
);

export default AppLogo;
