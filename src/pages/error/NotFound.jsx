import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Compass, ArrowLeft, Home, LayoutDashboard } from 'lucide-react';
import { useAuth } from '../../context/authcontext';
import { AppLogo } from '../../components/Logo';
import Cursor from '../../components/Cursor';

const NotFound = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  return (
    <div className="auth-page" style={{ height: '100vh', maxHeight: '100vh', overflow: 'hidden', textAlign: 'center' }}>
      <Cursor />

      <div className="auth-card" style={{ maxWidth: 480, width: '100%', padding: '40px 32px' }}>
        <AppLogo size={36} iconSize={18} style={{ justifyContent: 'center', marginBottom: 24 }} />

        {/* 404 Glitch Number */}
        <div style={{ position: 'relative', display: 'inline-block', marginBottom: 12 }}>
          <div
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: 'clamp(3.6rem, 8vw, 5.5rem)',
              fontWeight: 800,
              lineHeight: 1,
              letterSpacing: '-0.04em',
              background: 'linear-gradient(135deg, var(--gold) 0%, #ffffff 50%, #9a6e28 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              textShadow: '0 0 40px rgba(212,162,76,0.35)',
            }}
          >
            404
          </div>
          <div
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              opacity: 0.12,
              color: 'var(--gold)',
              pointerEvents: 'none',
            }}
          >
            <Compass size={110} />
          </div>
        </div>

        <h1 className="auth-title" style={{ fontSize: '1.45rem', marginBottom: 8 }}>
          Node Not Located
        </h1>

        <p className="auth-sub" style={{ fontSize: '0.86rem', lineHeight: 1.6, marginBottom: 28 }}>
          The requested coordinate or ledger path could not be resolved. It may have been relocated or archived.
        </p>

        {/* Actions */}
        <div style={{ display: 'flex', gap: 10, justifyContent: 'center', flexWrap: 'wrap' }}>
          <button
            type="button"
            className="btn btn-ghost"
            onClick={() => navigate(-1)}
            style={{ padding: '10px 18px', fontSize: '0.82rem' }}
          >
            <ArrowLeft size={15} />
            Go Back
          </button>

          <Link
            to={isAuthenticated ? '/dashboard' : '/'}
            className="btn btn-primary"
            style={{ padding: '10px 20px', fontSize: '0.82rem' }}
          >
            {isAuthenticated ? (
              <>
                <LayoutDashboard size={15} />
                Open Dashboard
              </>
            ) : (
              <>
                <Home size={15} />
                Return Home
              </>
            )}
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
