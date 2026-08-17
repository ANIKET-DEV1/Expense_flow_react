import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import base_url from '../../services/baseApi';
import  authService  from '../../services/authService';
import { validateUsername, validatePassword, validateLoginPassword } from '../../services/validation';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
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


    setLoading(true);
    await authService.login({ username, password })
      .then(() => {
        navigate('/dashboard');
      })
      .catch((err) => {
        setError(err.response?.data?.detail || 'Login failed. Please try again.');
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

        {error && <p style={{ color: 'red' }}>{error}</p>}
        <p>
         <Link to="/forgot-password">forget password?</Link>
        </p>
        <button type="submit" id="submitBtn" disabled={loading}>
          {loading ? 'Signing In...' : 'Sign In'}
        </button>
      </form>

      <p>
        Don't have an account? <Link to="/register">Create one free</Link>
      </p>
    </div>
  );
};

export default Login;