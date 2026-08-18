import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, ArrowLeft, CheckCircle2, AlertCircle } from 'lucide-react';
import authService from '../../services/authService';
import { validateEmail } from '../../services/validation';
import { AppLogo } from '../../components/Logo';

const Forget_password = () => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    const emailErr = validateEmail(email);
    if (emailErr && emailErr.length > 0) {
      setError(emailErr[0]);
      return;
    }

    setLoading(true);
    try {
      await authService.forgetPassword(email);
      setSuccess("Reset link sent successfully. Please check your email inbox.");
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to send reset link. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page" style={{ height: '100vh', maxHeight: '100vh', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div className="auth-card" style={{ maxWidth: 430, width: '100%', padding: '36px 32px' }}>
        <AppLogo size={36} iconSize={18} style={{ justifyContent: 'center', marginBottom: 20 }} />

        <h1 className="auth-title" style={{ fontSize: '1.4rem', textAlign: 'left', marginBottom: 4 }}>Reset your password</h1>
        <p className="auth-sub" style={{ textAlign: 'left', marginBottom: 22, fontSize: '0.84rem' }}>
          We'll send a reset link to your email address.
        </p>

        <form onSubmit={handleSubmit} noValidate>
          <div className="form-group" style={{ marginBottom: 18 }}>
            <label className="form-label">Email Address</label>
            <input
              className="form-input"
              id="Email"
              name="Email"
              type="email"
              placeholder="you@example.com"
              autoComplete="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (error) setError('');
              }}
            />
          </div>

          {error && (
            <div className="err-box show" style={{ marginBottom: 16 }}>
              <AlertCircle size={14} />
              <span>{error}</span>
            </div>
          )}

          {success && (
            <div className="success-box show" style={{ marginBottom: 16 }}>
              <CheckCircle2 size={14} />
              <span>{success}</span>
            </div>
          )}

          <button
            type="submit"
            className="btn btn-primary"
            disabled={loading}
            style={{ width: '100%', justifyContent: 'center', padding: '11px 18px', marginBottom: 18 }}
          >
            {loading ? 'Sending link...' : (
              <>
                <Mail size={15} />
                Send reset link
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
              transition: 'color var(--t)',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--gold)')}
            onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-muted)')}
          >
            <ArrowLeft size={14} /> Back to login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Forget_password;