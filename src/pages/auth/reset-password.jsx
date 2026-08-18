import React, { useState } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { Lock, Eye, EyeOff, CheckCircle2, AlertCircle, ArrowLeft } from 'lucide-react';
import authService from '../../services/authService';
import { validatePassword, validateLoginPassword, PASSWORD_RULES } from '../../services/validation';
import { AppLogo } from '../../components/Logo';

const Resetpassword = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get('token');

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [showCpw, setShowCpw] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const pwRules = PASSWORD_RULES.map((r) => ({ ...r, ok: r.test(password) }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!token) {
      setError('Invalid or expired reset link.');
      return;
    }

    const passErr = validatePassword(password) || validateLoginPassword(password);
    if (passErr && passErr.length > 0) {
      setError(Array.isArray(passErr) ? passErr[0] : passErr);
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);
    try {
      await authService.resetPassword(token, { password, confirmPassword });
      setSuccess('Password reset successfully! Redirecting to sign in...');
      setTimeout(() => {
        navigate('/login');
      }, 1800);
    } catch (err) {
      setError(err.response?.data?.detail || 'Password reset failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page" style={{ height: '100vh', maxHeight: '100vh', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div className="auth-card" style={{ maxWidth: 440, width: '100%', padding: '34px 32px' }}>
        <AppLogo size={36} iconSize={18} style={{ justifyContent: 'center', marginBottom: 18 }} />

        <h1 className="auth-title" style={{ fontSize: '1.4rem', marginBottom: 4 }}>Create new password</h1>
        <p className="auth-sub" style={{ marginBottom: 20, fontSize: '0.84rem' }}>
          Enter a secure password for your account.
        </p>

        <form onSubmit={handleSubmit} noValidate>
          {/* New Password */}
          <div className="form-group" style={{ marginBottom: 10 }}>
            <label className="form-label">New Password</label>
            <div style={{ position: 'relative' }}>
              <input
                className="form-input"
                id="password"
                name="password"
                type={showPw ? 'text' : 'password'}
                placeholder="••••••••"
                autoComplete="new-password"
                style={{ paddingRight: 40 }}
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (error) setError('');
                }}
              />
              <button
                type="button"
                onClick={() => setShowPw((p) => !p)}
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

          {/* Password rules indicator */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '3px 12px',
              marginBottom: 12,
            }}
          >
            {pwRules.map((r) => (
              <div
                key={r.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 4,
                  fontSize: '0.7rem',
                  color: r.ok ? 'var(--green)' : 'var(--text-faint)',
                  transition: 'color 0.18s ease',
                }}
              >
                <span
                  style={{
                    width: 5,
                    height: 5,
                    borderRadius: '50%',
                    background: r.ok ? 'var(--green)' : 'var(--text-faint)',
                  }}
                />
                {r.msg}
              </div>
            ))}
          </div>

          {/* Confirm Password */}
          <div className="form-group" style={{ marginBottom: 16 }}>
            <label className="form-label">Confirm New Password</label>
            <div style={{ position: 'relative' }}>
              <input
                className="form-input"
                id="confirmPassword"
                name="confirmPassword"
                type={showCpw ? 'text' : 'password'}
                placeholder="••••••••"
                autoComplete="new-password"
                style={{ paddingRight: 40 }}
                value={confirmPassword}
                onChange={(e) => {
                  setConfirmPassword(e.target.value);
                  if (error) setError('');
                }}
              />
              <button
                type="button"
                onClick={() => setShowCpw((p) => !p)}
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
                {showCpw ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            </div>
          </div>

          {error && (
            <div className="err-box show" style={{ marginBottom: 14 }}>
              <AlertCircle size={14} />
              <span>{error}</span>
            </div>
          )}

          {success && (
            <div className="success-box show" style={{ marginBottom: 14 }}>
              <CheckCircle2 size={14} />
              <span>{success}</span>
            </div>
          )}

          <button
            type="submit"
            className="btn btn-primary"
            disabled={loading}
            style={{ width: '100%', justifyContent: 'center', padding: '11px 18px', marginBottom: 16 }}
          >
            {loading ? 'Resetting password...' : (
              <>
                <Lock size={15} />
                Reset password
              </>
            )}
          </button>
        </form>

        <div style={{ textAlign: 'center' }}>
          <Link
            to="/login"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              fontSize: '0.82rem',
              color: 'var(--text-muted)',
            }}
          >
            <ArrowLeft size={14} /> Back to login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Resetpassword;