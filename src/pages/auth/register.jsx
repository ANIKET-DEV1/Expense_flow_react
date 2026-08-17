import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import base_url from '../../services/baseApi';
import authService  from '../../services/authService';
import { validateUsername, validatePassword, validateLoginPassword } from '../../services/validation';

const Register = () => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const userErr = validateUsername(username);
    if (userErr && userErr.length > 0) {
      setError(Array.isArray(userErr) ? userErr[0] : userErr);
      return;
    }

    const passErr = validatePassword(password) || validateLoginPassword(password);
    if (passErr && passErr.length > 0) {
      setError(Array.isArray(passErr) ? passErr[0] : passErr);
      return;
    }

    const confirmPassErr = validatePassword(password) || validateLoginPassword(password);
    if (confirmPassErr && confirmPassErr.length > 0) {
      setError(Array.isArray(confirmPassErr) ? confirmPassErr[0] : confirmPassErr);
      return;
    }
    const passMatch = password !== confirmPassword ? 'Passwords do not match' : null;
    if (passMatch) {
      setError(passMatch);
      return;
    }
    const emailErr = validateEmail(email);
    if (emailErr && emailErr.length > 0) {
      setError(Array.isArray(emailErr) ? emailErr[0] : emailErr);
      return;
    }

    setLoading(true);
    await authService.register({ username, email, password ,confirmPassword })
      .then(() => {
        navigate('/login');
      })
      .catch((err) => {
        setError(err.response?.data?.detail || 'Registration failed. Please try again.');
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <div>
      <h1>ExpenseFlow</h1>
      <form id="loginForm" onSubmit={handleSubmit} autoComplete="on" noValidate>
        <div>
          <label htmlFor="username">Username</label>
          <input
            id="username"
            name="username"
            type="text"
            placeholder="Enter your username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>

        <div>
          <label htmlFor="email">Email</label>
          <input
            id="email"
            name="email"
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

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

        <button type="submit" id="submitBtn" disabled={loading}>
          {loading ? 'Signing In...' : 'Sign In'}
        </button>
      </form>

      <p>
       Already have an account? <Link to="/login">Sign in</Link>
      </p>
    </div>
  )

}

export default Register


