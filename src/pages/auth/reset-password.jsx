import React, { useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom';
import authService from '../../services/authService';
import { validatePassword, validateLoginPassword } from '../../services/validation';

const Resetpassword = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const token = searchParams.get('token');

    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        setLoading(true);
        if (!token) {
            setError('Invalid reset link.');
            setLoading(false);
            return;
        }
        const passErr = validatePassword(password) || validateLoginPassword(password);
            if (passErr && passErr.length > 0) {
              setError(Array.isArray(passErr) ? passErr[0] : passErr);
              return;
            }
        
        await authService.resetPassword(token, { password, confirmPassword })
        .then(() => {
            setSuccess('Password reset successfully. Redirecting to login...');
            setTimeout(() => {
                navigate('/login');
            }, 2000);
            })
            .catch((err) => {
                setError(err.response?.data?.detail || 'Password reset failed. Please try again.');
            })
            .finally(() => {
                setLoading(false);
            });
    }

  return (
    <div>
      <h1>ExpenseFlow</h1>
      <form id="passwordResetForm" onSubmit={handleSubmit} autoComplete="on" noValidate>

        <div>
          <label htmlFor="password">Password</label>
          <input
            id="password"
            name="password"
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <div>
          <label htmlFor="confirmPassword">Confirm Password</label>
          <input
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            placeholder="Confirm your password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        </div>

        {error && <p style={{ color: 'red' }}>{error}</p>}
        {success && <p style={{ color: 'green' }}>{success}</p>}

        <button type="submit" id="submitBtn" disabled={loading}>
          {loading ? 'Resetting Password...' : 'Reset Password'}
        </button>
      </form>

    </div>
    
  )
}

export default Resetpassword