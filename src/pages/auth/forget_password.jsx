import React, { useState } from 'react'
import authService from '../../services/authService'
import { validateEmail } from '../../services/validation';

const Forget_password = () => {
    const [Email, setEmail] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        setLoading(true);

        if (!validateEmail(Email)) {
            setError('Please enter a valid email address.');
            setLoading(false);
            return;
        }

        try {
            await authService.forgetPassword(Email);
            setSuccess('Reset link sent successfully. Please check your email.');
        } catch (err) {
            setError('Failed to send reset link. Please try again.');
        } finally {
            setLoading(false);
        }
    };

  return (
    <div>
        <div>
      <h1>ExpenseFlow</h1>
      <form id="forgetForm" onSubmit={handleSubmit} autoComplete="on" noValidate>
        <div>
          <label htmlFor="Email">Email</label>
          <input
            id="Email"
            name="Email"
            type="text"
            placeholder="Enter your Email"
            value={Email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        {error && <p style={{ color: 'red' }}>{error}</p>}
        {success && <p style={{ color: 'green' }}>{success}</p>}

        <button type="submit" id="submitBtn" disabled={loading}>
          {loading ? 'Sending...' : 'Send Reset Link'}
        </button>
      </form>
    </div>
    </div>
  )
}

export default Forget_password