import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, ArrowRight, CheckCircle2, TrendingUp, Users, Shield } from 'lucide-react';
import { useAuth } from '../../context/authcontext';
import { validateUsername, validateLoginPassword } from '../../services/validation';
import { AppLogo } from '../../components/Logo';

const FEATURES = [
  { icon: <TrendingUp size={14} />, text: 'Log expenses in seconds' },
  { icon: <Users size={14} />,      text: 'Track who owes you what' },
  { icon: <Shield size={14} />,     text: 'Secure sessions, zero data leaks' },
];

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [form,    setForm]    = useState({ username: '', password: '' });
  const [showPw,  setShowPw]  = useState(false);
  const [error,   setError]   = useState('');
  const [loading, setLoading] = useState(false);

  const set = (k, v) => { setForm(p => ({ ...p, [k]: v })); setError(''); };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const uErr = validateUsername(form.username);
    if (uErr.length) { setError(uErr[0]); return; }
    const pErr = validateLoginPassword(form.password);
    if (pErr.length) { setError(pErr[0]); return; }

    setLoading(true);
    try {
      await login({ username: form.username, password: form.password });
      navigate('/dashboard', { replace: true });
    } catch (err) {
      setError(err.response?.data?.detail || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-split">
      {/* ── Left panel ── */}
      <div className="auth-split-left">
        {/* Top logo */}
        <AppLogo size={32} iconSize={17} style={{ marginBottom: 40 }} />

        {/* Hero center */}
        <div style={{ maxWidth: 520, margin: 'auto 0' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 7,
            fontFamily: 'var(--font-mono)',
            fontSize: '0.66rem',
            fontWeight: 600,
            textTransform: 'uppercase',
            letterSpacing: '0.14em',
            color: 'var(--gold)',
            padding: '4px 12px',
            border: '1px solid rgba(212,162,76,0.28)',
            borderRadius: 20,
            background: 'rgba(212,162,76,0.08)',
            width: 'fit-content',
            marginBottom: 16,
          }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--gold)', animation: 'pulse-dot 2s infinite', display: 'inline-block' }} />
            Why ExpenseFlow?
          </div>

          <h1 style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(1.9rem, 3.2vw, 2.6rem)',
            fontWeight: 700,
            lineHeight: 1.1,
            letterSpacing: '-0.03em',
            marginBottom: 14,
          }}>
            Track every rupee.<br />
            <em style={{ color: 'var(--gold)', fontStyle: 'italic', fontWeight: 600 }}>Own your finances.</em>
          </h1>

          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: 1.6, maxWidth: 440, marginBottom: 24 }}>
            A premium expense tracker with custom tags, peer settlements, and a dashboard that makes your financial life clear at a glance.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 24 }}>
            {FEATURES.map(f => (
              <div key={f.text} style={{ display: 'flex', alignItems: 'center', gap: 9, color: 'var(--text-muted)', fontSize: '0.84rem' }}>
                <div style={{
                  width: 22,
                  height: 22,
                  borderRadius: 6,
                  background: 'var(--green-dim)',
                  border: '1px solid rgba(61,220,132,0.2)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--green)',
                  flexShrink: 0,
                }}>
                  <CheckCircle2 size={13} />
                </div>
                {f.text}
              </div>
            ))}
          </div>

          {/* Testimonial */}
          <div style={{
            background: 'var(--surface)',
            border: '1px solid var(--border)',
            borderRadius: 'var(--r)',
            padding: '14px 18px',
            maxWidth: 460,
          }}>
            <p style={{ fontStyle: 'italic', color: 'var(--text-muted)', fontSize: '0.82rem', lineHeight: 1.55, marginBottom: 10 }}>
              "Finally a finance tracker that doesn't look like a spreadsheet. Clean, fast, and actually useful."
            </p>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{
                width: 28,
                height: 28,
                borderRadius: 7,
                background: 'linear-gradient(145deg, var(--gold), #9a6e28)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--gold-ink)',
                fontWeight: 800,
                fontSize: '0.75rem',
                fontFamily: 'var(--font-display)',
              }}>R</div>
              <div>
                <div style={{ fontSize: '0.78rem', fontWeight: 700 }}>Rohit S.</div>
                <div style={{ fontSize: '0.68rem', color: 'var(--text-faint)' }}>Freelance developer</div>
              </div>
            </div>
          </div>
        </div>

        <div style={{ fontSize: '0.72rem', color: 'var(--text-faint)' }}>
          © {new Date().getFullYear()} ExpenseFlow. All rights reserved.
        </div>
      </div>

      {/* ── Right panel (auth card) ── */}
      <div className="auth-split-right">
        <div style={{ width: '100%', maxWidth: 350 }}>
          <AppLogo size={36} iconSize={18} style={{ justifyContent: 'center', marginBottom: 20 }} />
          <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1.4rem', marginBottom: 4 }}>Welcome back</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.82rem', marginBottom: 20 }}>Sign in to continue to your dashboard</p>

          <form onSubmit={handleSubmit} autoComplete="on" noValidate>
            {/* Username */}
            <div className="form-group" style={{ marginBottom: 14 }}>
              <label className="form-label">Username</label>
              <input
                className="form-input"
                id="username"
                name="username"
                type="text"
                placeholder="your_username"
                autoComplete="username"
                value={form.username}
                onChange={e => set('username', e.target.value)}
              />
            </div>

            {/* Password */}
            <div className="form-group" style={{ marginBottom: 6 }}>
              <label className="form-label">Password</label>
              <div style={{ position: 'relative' }}>
                <input
                  className="form-input"
                  id="password"
                  name="password"
                  type={showPw ? 'text' : 'password'}
                  placeholder="••••••••"
                  autoComplete="current-password"
                  style={{ paddingRight: 38 }}
                  value={form.password}
                  onChange={e => set('password', e.target.value)}
                />
                <button
                  type="button"
                  onClick={() => setShowPw(p => !p)}
                  style={{
                    position: 'absolute',
                    right: 10,
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none',
                    border: 'none',
                    color: 'var(--text-faint)',
                    display: 'flex',
                  }}
                >
                  {showPw ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>

            {/* Forgot link */}
            <div style={{ textAlign: 'right', marginBottom: 16 }}>
              <Link to="/forgot-password" style={{ fontSize: '0.78rem', color: 'var(--gold)', fontWeight: 600 }}>
                Forgot password?
              </Link>
            </div>

            {/* Error */}
            {error && (
              <div className="err-box show" style={{ marginBottom: 14 }}>
                <Shield size={14} />
                <span>{error}</span>
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading}
              style={{ width: '100%', justifyContent: 'center', padding: '10px 16px' }}
            >
              {loading ? 'Signing in…' : (
                <>
                  <ArrowRight size={15} />
                  SIGN IN
                </>
              )}
            </button>
          </form>

          <p style={{ textAlign: 'center', fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: 18 }}>
            Don't have an account?{' '}
            <Link to="/register" style={{ color: 'var(--gold)', fontWeight: 600 }}>Create one free</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;