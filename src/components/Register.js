import React, { useState } from 'react';
import ApiClient from '../generated-api/src/ApiClient';
import AuthApi from '../generated-api/src/api/AuthenticationRegistrationApi';

const Register = () => {
  const [formData, setFormData] = useState({
    email: '',
    firstname: '',
    lastname: '',
    password: '',
    phoneNumber: ''
  });

  const apiClient = new ApiClient();
  apiClient.basePath = 'http://localhost:8088/api/v1';
  const authApi = new AuthApi(apiClient);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleRegister = (e) => {
    e.preventDefault();

    authApi.register(formData, (error, data, response) => {
      if (error) {
        console.error('Registration failed:', error);
        alert('Registration failed');
      } else {
        console.log('Registration successful:', data);
        alert('Registration successful!');
      }
    });
  };

  return (
    <div className="container mt-5">
      <h2>Register</h2>
      <form onSubmit={handleRegister}>
        <div className="form-group">
          <label>First Name</label>
          <input type="text" className="form-control" name="firstname" onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label>Last Name</label>
          <input type="text" className="form-control" name="lastname" onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label>Email</label>
          <input type="email" className="form-control" name="email" onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label>Password</label>
          <input type="password" className="form-control" name="password" onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label>Phone Number</label>
          <input type="text" className="form-control" name="phoneNumber" onChange={handleChange} required />
        </div>
        <button type="submit" className="btn btn-primary mt-3">Register</button>
      </form>
    </div>
  );
};

export default Register;
