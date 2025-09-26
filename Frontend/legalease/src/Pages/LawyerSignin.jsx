import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router';
import axios from 'axios';
import Axios from 'axios'

const LawyerSignin = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const navigate = useNavigate();
  Axios.defaults.withCredentials = true;
  
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/Auth/login`, {
        email: formData.email,
        password: formData.password
      });
      
      if (response.status === 200) {
        navigate('/lawyerPage');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please check your credentials.');
      console.error('Login error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="lawyer-signin-container">
      <div className="lawyer-signin-content">
        <div className="signin-intro">
          <div className="logo">
            <i className="fas fa-balance-scale"></i>
            <span>Justice Partners</span>
          </div>
          <h1>Welcome Back</h1>
          <p>Access your legal dashboard to manage cases, clients, and professional connections.</p>
          <div className="benefits">
            <div className="benefit-item">
              <i className="fas fa-briefcase"></i>
              <span>Case Management</span>
            </div>
            <div className="benefit-item">
              <i className="fas fa-calendar-alt"></i>
              <span>Appointment Scheduling</span>
            </div>
            <div className="benefit-item">
              <i className="fas fa-file-contract"></i>
              <span>Document Library</span>
            </div>
          </div>
        </div>

        <div className="signin-form-wrapper">
          <div className="form-header">
            <h2>Attorney Sign In</h2>
            <p>Enter your credentials to access your account</p>
          </div>

          {error && <div className="error-message">{error}</div>}

          <form onSubmit={handleSubmit} className="lawyer-signin-form">
            <div className="input-group">
              <label htmlFor="email">Email Address *</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                placeholder="your.email@lawfirm.com"
              />
            </div>
            
            <div className="input-group">
              <label htmlFor="password">Password *</label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                placeholder="Enter your password"
              />
            </div>
            
            <div className="forgot-password">
              <a href="/forgot-password">Forgot your password?</a>
            </div>
            
            <button 
              type="submit" 
              className="signin-btn"
              disabled={loading}
            >
              {loading ? 'Signing In...' : 'Sign In'}
            </button>
          </form>

          <div className="signup-redirect">
            <p>Don't have an account? <Link to={'/lawyerSignup'}>Register Now</Link></p>
          </div>
          
          {/* Added "I am a user" button */}
          <div className="user-redirect">
            <button 
              className="user-btn"
              onClick={() => navigate('/userSignin')}
            >
              I am a user
            </button>
          </div>
        </div>
      </div>
      
      <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.3/css/all.min.css" />
      
      <style jsx>{`
        .lawyer-signin-container {
          display: flex;
          min-height: 100vh;
          font-family: 'Arial', sans-serif;
        }
        
        .lawyer-signin-content {
          display: flex;
          width: 100%;
        }
        
        .signin-intro {
          flex: 1;
          background: linear-gradient(135deg, #1a3a4a 0%, #2c5c7a 100%);
          color: white;
          padding: 3rem;
          display: flex;
          flex-direction: column;
          justify-content: center;
        }
        
        .logo {
          display: flex;
          align-items: center;
          margin-bottom: 2rem;
          font-size: 1.5rem;
          font-weight: bold;
        }
        
        .logo i {
          margin-right: 0.5rem;
          font-size: 2rem;
        }
        
        .signin-intro h1 {
          font-size: 2.5rem;
          margin-bottom: 1rem;
        }
        
        .signin-intro p {
          margin-bottom: 2rem;
          font-size: 1.1rem;
          line-height: 1.6;
        }
        
        .benefits {
          margin-top: 2rem;
        }
        
        .benefit-item {
          display: flex;
          align-items: center;
          margin-bottom: 1.5rem;
        }
        
        .benefit-item i {
          margin-right: 1rem;
          font-size: 1.5rem;
          color: #4db6ac;
        }
        
        .signin-form-wrapper {
          flex: 1;
          padding: 3rem;
          display: flex;
          flex-direction: column;
          justify-content: center;
          background-color: #f9f9f9;
        }
        
        .form-header {
          margin-bottom: 2rem;
          text-align: center;
        }
        
        .form-header h2 {
          font-size: 2rem;
          color: #2c5c7a;
          margin-bottom: 0.5rem;
        }
        
        .error-message {
          background-color: #ffebee;
          color: #c62828;
          padding: 0.75rem;
          border-radius: 4px;
          margin-bottom: 1rem;
          text-align: center;
        }
        
        .lawyer-signin-form {
          margin-bottom: 1.5rem;
        }
        
        .input-group {
          margin-bottom: 1.5rem;
        }
        
        .input-group label {
          display: block;
          margin-bottom: 0.5rem;
          font-weight: bold;
          color: #333;
        }
        
        .input-group input {
          width: 100%;
          padding: 0.75rem;
          border: 1px solid #ddd;
          border-radius: 4px;
          font-size: 1rem;
        }
        
        .forgot-password {
          text-align: right;
          margin-bottom: 1.5rem;
        }
        
        .forgot-password a {
          color: #2c5c7a;
          text-decoration: none;
        }
        
        .forgot-password a:hover {
          text-decoration: underline;
        }
        
        .signin-btn {
          width: 100%;
          padding: 0.75rem;
          background-color: #2c5c7a;
          color: white;
          border: none;
          border-radius: 4px;
          font-size: 1rem;
          cursor: pointer;
          transition: background-color 0.3s;
        }
        
        .signin-btn:hover:not(:disabled) {
          background-color: #1a3a4a;
        }
        
        .signin-btn:disabled {
          background-color: #9ab3c5;
          cursor: not-allowed;
        }
        
        .signup-redirect {
          text-align: center;
          margin-bottom: 1.5rem;
        }
        
        .signup-redirect a {
          color: #2c5c7a;
          text-decoration: none;
          font-weight: bold;
        }
        
        .signup-redirect a:hover {
          text-decoration: underline;
        }
        
        /* Styles for the new user button */
        .user-redirect {
          text-align: center;
        }
        
        .user-btn {
          padding: 0.75rem 1.5rem;
          background-color: transparent;
          color: #2c5c7a;
          border: 2px solid #2c5c7a;
          border-radius: 4px;
          font-size: 1rem;
          cursor: pointer;
          transition: all 0.3s;
          width: 100%;
        }
        
        .user-btn:hover {
          background-color: #2c5c7a;
          color: white;
        }
      `}</style>
    </div>
  );
};

export default LawyerSignin;