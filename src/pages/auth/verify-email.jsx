import React, { useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { MailCheck, ArrowRight, CheckCircle2, AlertCircle, RefreshCw } from 'lucide-react';
import apiClient from '../../services/baseApi';
import { AppLogo } from '../../components/Logo';

const VerifyEmail = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const email = searchParams.get('email') || '';

  const [loading, setLoading] = useState(false);
  const [verified, setVerified] = useState(false);
  const [error, setError] = useState('');
  const [resending, setResending] = useState(false);
  const [resendSuccess, setResendSuccess] = useState('');

  const handleVerify = async () => {
    if (!token) {
      setError('Verification token is missing from the link.');
      return;
    }
    setLoading(true);
    setError('');
    try {
      await apiClient.post(`/auth/verify-email/${token}`);
      setVerified(true);
    } catch (err) {
      setError(err.response?.data?.detail || 'Email verification failed. The link may have expired.');
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (!email) {
      setError('Email address is required to resend verification.');
      return;
    }
    setResending(true);
    setResendSuccess('');
    try {
      await apiClient.post('/auth/resend-verification', { email });
      setResendSuccess('New verification link sent to your email.');
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to resend verification link.');
    } finally {
      setResending(false);
    }
  };

  return (
    <div className="auth-page" style={{ height: '100vh', maxHeight: '100vh', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div className="auth-card" style={{ maxWidth: 440, width: '100%', padding: '36px 32px', textAlign: 'center' }}>
        <AppLogo size={36} iconSize={18} style={{ justifyContent: 'center', marginBottom: 20 }} />

        <div style={{
          width: 56, height: 56, borderRadius: '50%',
          background: 'var(--gold-dim)', border: '1px solid var(--border2)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: 'var(--gold)', margin: '0 auto 16px',
          boxShadow: '0 0 20px var(--gold-glow)',
        }}>
          <MailCheck size={26} />
        </div>

        <h1 className="auth-title" style={{ fontSize: '1.4rem', marginBottom: 6 }}>Verify your email</h1>
        <p className="auth-sub" style={{ fontSize: '0.84rem', marginBottom: 24, lineHeight: 1.6 }}>
          {email
            ? <>We've sent a verification link to <strong style={{ color: 'var(--gold)' }}>{email}</strong>. Click below or check your inbox to confirm your account.</>
            : 'Click the button below to verify your email address and activate your account.'}
        </p>

        {verified ? (
          <div>
            <div className="success-box show" style={{ marginBottom: 20 }}>
              <CheckCircle2 size={16} />
              <span>Email verified successfully!</span>
            </div>
            <Link to="/login" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center', padding: '11px 18px' }}>
              Proceed to Sign In <ArrowRight size={15} />
            </Link>
          </div>
        ) : (
          <div>
            {token && (
              <button
                onClick={handleVerify}
                className="btn btn-primary"
                disabled={loading}
                style={{ width: '100%', justifyContent: 'center', padding: '11px 18px', marginBottom: 14 }}
              >
                {loading ? 'Verifying account...' : 'Confirm Verification'}
              </button>
            )}

            {error && (
              <div className="err-box show" style={{ marginBottom: 14, textAlign: 'left' }}>
                <AlertCircle size={14} />
                <span>{error}</span>
              </div>
            )}

            {resendSuccess && (
              <div className="success-box show" style={{ marginBottom: 14, textAlign: 'left' }}>
                <CheckCircle2 size={14} />
                <span>{resendSuccess}</span>
              </div>
            )}

            {email && (
              <button
                type="button"
                onClick={handleResend}
                disabled={resending}
                className="btn btn-ghost"
                style={{ width: '100%', justifyContent: 'center', fontSize: '0.8rem', marginBottom: 16 }}
              >
                <RefreshCw size={13} className={resending ? 'animate-spin' : ''} />
                {resending ? 'Sending link...' : 'Resend verification email'}
              </button>
            )}

            <div style={{ marginTop: 10 }}>
              <Link to="/login" style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                Back to sign in
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default VerifyEmail;
