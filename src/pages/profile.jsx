import React, { useState, useEffect } from 'react';
import authService from '../services/authService';
import { useAuth } from '../context/authcontext';
import { useNavigate } from 'react-router-dom';

const Profile = () => {
  const { user, logout } = useAuth();
  const navigate  = useNavigate();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try { const d = await authService.getMe(); setProfile(d.user || d); }
      catch { /* fallback */ }
      finally { setLoading(false); }
    })();
  }, []);

  const display  = profile || user;
  const initials = display?.username ? display.username.slice(0, 2).toUpperCase() : 'EX';

  const handleLogout = async () => { await logout(); navigate('/'); };

  return (
    <>
      <div className="page-head">
        <div>
          <h1 className="page-title">My Profile</h1>
          <p className="page-sub">Your account information</p>
        </div>
      </div>

      {loading && (
        <div className="card" style={{ maxWidth: 480 }}>
          {[1,2,3].map(i => <div key={i} className="skel skel-row" />)}
        </div>
      )}

      {!loading && display && (
        <div style={{ maxWidth: 480 }}>
          {/* Avatar card */}
          <div className="card" style={{ display: 'flex', alignItems: 'center', gap: 18, marginBottom: 16 }}>
            <div style={{
              width: 64, height: 64, borderRadius: 14,
              background: 'linear-gradient(145deg, var(--gold) 0%, #9a6e28 100%)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: 'var(--gold-ink)', fontWeight: 800, fontSize: '1.4rem',
              fontFamily: 'var(--font-display)',
              boxShadow: '0 0 0 1px rgba(212,162,76,0.4), 0 8px 24px rgba(212,162,76,0.2)',
              flexShrink: 0,
            }}>
              {initials}
            </div>
            <div>
              <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1.15rem' }}>{display.username}</div>
              <div style={{ fontSize: '0.78rem', color: 'var(--gold)', marginTop: 4, fontFamily: 'var(--font-mono)' }}>Premium Pilot</div>
            </div>
          </div>

          {/* Info rows */}
          <div className="card" style={{ marginBottom: 16 }}>
            {[
              { label: 'Username',     val: display.username },
              { label: 'Email',        val: display.email },
              { label: 'Member since', val: display.created_at ? new Date(display.created_at).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' }) : null },
            ].map(({ label, val }, i, arr) => (
              <div key={label} style={{
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                padding: '13px 0',
                borderBottom: i < arr.length - 1 ? '1px solid var(--border)' : 'none',
              }}>
                <span style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-faint)', textTransform: 'uppercase', letterSpacing: '0.06em', fontFamily: 'var(--font-mono)' }}>{label}</span>
                <span style={{ fontSize: '0.88rem', fontWeight: 500, color: 'var(--text)' }}>{val || '—'}</span>
              </div>
            ))}
          </div>

          {/* Logout */}
          <button className="btn btn-danger" onClick={handleLogout} style={{ width: '100%', justifyContent: 'center' }}>
            <svg className="icon-sm" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
              <polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/>
            </svg>
            Sign Out
          </button>
        </div>
      )}
    </>
  );
};

export default Profile;