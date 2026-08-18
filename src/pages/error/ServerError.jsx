import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ServerCrash, RefreshCw, Home, ShieldAlert } from 'lucide-react';
import { AppLogo } from '../../components/Logo';
import Cursor from '../../components/Cursor';

const ServerError = () => {
  const navigate = useNavigate();
  const [refreshing, setRefreshing] = useState(false);

  const handleRefresh = () => {
    setRefreshing(true);
    setTimeout(() => {
      window.location.reload();
    }, 400);
  };

  return (
    <div className="auth-page" style={{ height: '100vh', maxHeight: '100vh', overflow: 'hidden', textAlign: 'center' }}>
      <Cursor />

      <div className="auth-card" style={{ maxWidth: 480, width: '100%', padding: '40px 32px' }}>
        <AppLogo size={36} iconSize={18} style={{ justifyContent: 'center', marginBottom: 24 }} />

        {/* 500 Glitch Number */}
        <div style={{ position: 'relative', display: 'inline-block', marginBottom: 12 }}>
          <div
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: 'clamp(3.6rem, 8vw, 5.5rem)',
              fontWeight: 800,
              lineHeight: 1,
              letterSpacing: '-0.04em',
              background: 'linear-gradient(135deg, var(--red) 0%, #ffffff 50%, #b3261e 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              textShadow: '0 0 40px rgba(255,107,107,0.35)',
            }}
          >
            500
          </div>
          <div
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              opacity: 0.12,
              color: 'var(--red)',
              pointerEvents: 'none',
            }}
          >
            <ServerCrash size={110} />
          </div>
        </div>

        <h1 className="auth-title" style={{ fontSize: '1.45rem', marginBottom: 8 }}>
          Internal Server Anomaly
        </h1>

        <p className="auth-sub" style={{ fontSize: '0.86rem', lineHeight: 1.6, marginBottom: 28 }}>
          Our backend node encountered an unexpected condition. The ledger is protected, but the request could not complete.
        </p>

        {/* Actions */}
        <div style={{ display: 'flex', gap: 10, justifyContent: 'center', flexWrap: 'wrap' }}>
          <button
            type="button"
            className="btn btn-primary"
            onClick={handleRefresh}
            disabled={refreshing}
            style={{ padding: '10px 20px', fontSize: '0.82rem' }}
          >
            <RefreshCw size={15} className={refreshing ? 'animate-spin' : ''} />
            {refreshing ? 'Connecting…' : 'Retry Request'}
          </button>

          <Link
            to="/"
            className="btn btn-ghost"
            style={{ padding: '10px 18px', fontSize: '0.82rem' }}
          >
            <Home size={15} />
            Return Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ServerError;
