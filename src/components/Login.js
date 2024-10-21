// src/components/Login.js
import React, { useState, useContext } from 'react';
import ApiClient from '../generated-api/src/ApiClient';
import AuthApi from '../generated-api/src/api/AuthenticationRegistrationApi';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const { setIsLoggedIn, setUserName } = useContext(AuthContext);

  const apiClient = new ApiClient();
  apiClient.basePath = 'http://localhost:8088/api/v1';
  const authApi = new AuthApi(apiClient);

  const handleLogin = (e) => {
    e.preventDefault();

    const authenticationRequest = { email, password };

    authApi.authenticate(authenticationRequest, (error, data) => {
      if (error) {
        console.error('Login failed:', error);
        alert('Invalid credentials');
      } else {
        setIsLoggedIn(true);
        setUserName(email.split('@')[0]);
        navigate('/ride-offers');
      }
    });
  };

  return (
    <div className="container mt-5">
      <h2>Login</h2>
      <form onSubmit={handleLogin}>
        <div className="form-group">
          <label>Email</label>
          <input type="email" className="form-control" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </div>
        <div className="form-group">
          <label>Password</label>
          <input type="password" className="form-control" value={password} onChange={(e) => setPassword(e.target.value)} required />
        </div>
        <button type="submit" className="btn btn-primary mt-3">Login</button>
      </form>
      <p className="mt-3">
        Don't have an account? <Link to="/register">Register</Link>
      </p>
    </div>
  );
};

export default Login;
