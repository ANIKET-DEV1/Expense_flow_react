import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { UserPlus, Eye, EyeOff, CheckCircle2, Circle, AlertCircle } from 'lucide-react';
import authService from '../../services/authService';
import { validateUsername, validatePassword, validateEmail, PASSWORD_RULES } from '../../services/validation';
import { AppLogo } from '../../components/Logo';

const Register = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ username: '', email: '', password: '', confirmPassword: '' });
  const [showPw,  setShowPw]  = useState(false);
  const [showCpw, setShowCpw] = useState(false);
  const [error,   setError]   = useState('');
  const [loading, setLoading] = useState(false);

  const set = (k, v) => { setForm(p => ({ ...p, [k]: v })); setError(''); };

  const pwRules = PASSWORD_RULES.map(r => ({ ...r, ok: r.test(form.password) }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const uErr = validateUsername(form.username);
    if (uErr.length) { setError(uErr[0]); return; }

    const eErr = validateEmail(form.email);
    if (eErr.length) { setError(eErr[0]); return; }

    const pErr = validatePassword(form.password);
    if (pErr.length) { setError(pErr[0]); return; }

    if (form.password !== form.confirmPassword) { setError('Passwords do not match'); return; }

    setLoading(true);
    try {
      await authService.register({ username: form.username, email: form.email, password: form.password, confirmPassword: form.confirmPassword });
      navigate('/login');
    } catch (err) {
      setError(err.response?.data?.detail || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page" style={{ height: '100vh', maxHeight: '100vh', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div className="auth-card" style={{ maxWidth: 440, width: '100%', padding: '28px 30px' }}>
        <AppLogo size={36} iconSize={18} style={{ justifyContent: 'center', marginBottom: 14 }} />

        <h1 className="auth-title" style={{ fontSize: '1.35rem', marginBottom: 2 }}>Create your account</h1>
        <p className="auth-sub" style={{ fontSize: '0.82rem', marginBottom: 16 }}>Free forever. No credit card needed.</p>

        <form onSubmit={handleSubmit} autoComplete="on" noValidate>
          {/* Username */}
          <div className="form-group" style={{ marginBottom: 10 }}>
            <label className="form-label" style={{ fontSize: '0.7rem' }}>Username</label>
            <input
              className="form-input"
              style={{ padding: '7px 12px', fontSize: '0.82rem' }}
              id="username"
              name="username"
              type="text"
              placeholder="your_username"
              autoComplete="username"
              value={form.username}
              onChange={e => set('username', e.target.value)}
            />
          </div>

          {/* Email */}
          <div className="form-group" style={{ marginBottom: 10 }}>
            <label className="form-label" style={{ fontSize: '0.7rem' }}>Email</label>
            <input
              className="form-input"
              style={{ padding: '7px 12px', fontSize: '0.82rem' }}
              id="email"
              name="email"
              type="email"
              placeholder="you@example.com"
              autoComplete="email"
              value={form.email}
              onChange={e => set('email', e.target.value)}
            />
          </div>

          {/* Password */}
          <div className="form-group" style={{ marginBottom: 4 }}>
            <label className="form-label" style={{ fontSize: '0.7rem' }}>Password</label>
            <div style={{ position: 'relative' }}>
              <input
                className="form-input"
                style={{ padding: '7px 12px', paddingRight: 36, fontSize: '0.82rem' }}
                id="password"
                name="password"
                type={showPw ? 'text' : 'password'}
                placeholder="••••••••"
                autoComplete="new-password"
                value={form.password}
                onChange={e => set('password', e.target.value)}
              />
              <button
                type="button"
                onClick={() => setShowPw(p => !p)}
                style={{
                  position: 'absolute',
                  right: 9,
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  color: 'var(--text-faint)',
                  display: 'flex',
                }}
              >
                {showPw ? <EyeOff size={14} /> : <Eye size={14} />}
              </button>
            </div>
          </div>

          {/* Password rules indicator */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '2px 10px',
              marginBottom: 10,
            }}
          >
            {pwRules.map(r => (
              <div
                key={r.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 4,
                  fontSize: '0.68rem',
                  color: r.ok ? 'var(--green)' : 'var(--text-faint)',
                  transition: 'color 0.18s ease',
                }}
              >
                {r.ok ? <CheckCircle2 size={10} strokeWidth={2.5} /> : <Circle size={10} strokeWidth={1.5} />}
                {r.msg}
              </div>
            ))}
          </div>

          {/* Confirm Password */}
          <div className="form-group" style={{ marginBottom: 14 }}>
            <label className="form-label" style={{ fontSize: '0.7rem' }}>Confirm Password</label>
            <div style={{ position: 'relative' }}>
              <input
                className="form-input"
                style={{ padding: '7px 12px', paddingRight: 36, fontSize: '0.82rem' }}
                id="confirmPassword"
                name="confirmPassword"
                type={showCpw ? 'text' : 'password'}
                placeholder="••••••••"
                autoComplete="new-password"
                value={form.confirmPassword}
                onChange={e => set('confirmPassword', e.target.value)}
              />
              <button
                type="button"
                onClick={() => setShowCpw(p => !p)}
                style={{
                  position: 'absolute',
                  right: 9,
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  color: 'var(--text-faint)',
                  display: 'flex',
                }}
              >
                {showCpw ? <EyeOff size={14} /> : <Eye size={14} />}
              </button>
            </div>
          </div>

          {/* Error */}
          {error && (
            <div className="err-box show" style={{ marginBottom: 12, padding: '7px 10px', fontSize: '0.78rem' }}>
              <AlertCircle size={13} />
              <span>{error}</span>
            </div>
          )}

          <button
            type="submit"
            className="btn btn-primary"
            disabled={loading}
            style={{ width: '100%', justifyContent: 'center', padding: '9px 16px' }}
          >
            {loading ? 'Creating account…' : (
              <>
                <UserPlus size={14} />
                Create account
              </>
            )}
          </button>
        </form>

        <p className="auth-foot" style={{ marginTop: 14, fontSize: '0.8rem' }}>
          Already have an account? <Link to="/login">Log in</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
