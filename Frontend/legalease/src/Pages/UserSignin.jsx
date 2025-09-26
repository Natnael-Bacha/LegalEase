import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router';
import axios from 'axios';
import Axios from 'axios';

const UserSignin = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    
    if (error) setError('');
  };

  Axios.defaults.withCredentials = true;

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    axios.post('http://localhost:5001/clientAuth/login', formData)
    .then(response => {
      if (response.status === 200) {
        navigate('/userPage');
      }
    })
    .catch(error => {
      setError(error.response?.data?.message || 'Signin failed. Please try again.');
    })
    .finally(() => {
      setIsLoading(false);
    });
  };

  return (
    <div className="user-signin-container">
      <div className="user-signin-content">
        <div className="signin-intro">
          <div className="logo">
            <i className="fas fa-balance-scale"></i>
            <span>Justice Partners</span>
          </div>
          <h1>Welcome Back</h1>
          <p>Sign in to access your legal resources, connect with your lawyer, and manage your cases.</p>
          <div className="benefits">
            <div className="benefit-item">
              <i className="fas fa-case"></i>
              <span>Case Management</span>
            </div>
            <div className="benefit-item">
              <i className="fas fa-comments"></i>
              <span>Secure Messaging</span>
            </div>
            <div className="benefit-item">
              <i className="fas fa-document"></i>
              <span>Document Access</span>
            </div>
          </div>
        </div>

        <div className="signin-form-wrapper">
          <div className="form-header">
            <h2>Sign In to Your Account</h2>
            <p>Enter your credentials to continue</p>
          </div>

          {error && (
            <div className="error-message">
              <i className="fas fa-exclamation-circle"></i>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="user-signin-form">
            <div className="input-group">
              <label htmlFor="email">Email Address *</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                disabled={isLoading}
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
                disabled={isLoading}
              />
            </div>
            
            <button 
              type="submit" 
              className="signin-btn"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <i className="fas fa-spinner fa-spin"></i>
                  Signing In...
                </>
              ) : (
                <>
                  <i className="fas fa-sign-in-alt"></i>
                  Sign In
                </>
              )}
            </button>
          </form>

          <div className="lawyer-redirect">
            <p>Are you a lawyer? <Link to="/lawyerSignin">Sign in to your lawyer account</Link></p>
          </div>

          <div className="signup-redirect">
            <p>Don't have an account? <Link to="/userSignup">Sign Up</Link></p>
          </div>
        </div>
      </div>

      <style jsx>{`
        .user-signin-container {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background-color: #f8f9fa;
          padding: 2rem;
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        }
        
        .user-signin-content {
          display: grid;
          grid-template-columns: 1fr 1fr;
          max-width: 1000px;
          width: 100%;
          background: white;
          border-radius: 10px;
          overflow: hidden;
          box-shadow: 0 10px 30px rgba(0,0,0,0.1);
        }
        
        .signin-intro {
          background: linear-gradient(135deg, #2c3e50 0%, #4a6580 100%);
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
          font-size: 1.8rem;
        }
        
        .signin-intro h1 {
          font-size: 2rem;
          margin-bottom: 1rem;
        }
        
        .signin-intro p {
          margin-bottom: 2rem;
          line-height: 1.6;
          opacity: 0.9;
        }
        
        .benefits {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }
        
        .benefit-item {
          display: flex;
          align-items: center;
          gap: 0.8rem;
        }
        
        .benefit-item i {
          font-size: 1.2rem;
          width: 20px;
        }
        
        .signin-form-wrapper {
          padding: 3rem;
          display: flex;
          flex-direction: column;
          justify-content: center;
        }
        
        .form-header {
          margin-bottom: 2rem;
        }
        
        .form-header h2 {
          color: #2c3e50;
          margin-bottom: 0.5rem;
          font-size: 1.8rem;
        }
        
        .form-header p {
          color: #7b8a9b;
        }
        
        .error-message {
          background-color: #fee;
          color: #c53030;
          padding: 0.8rem;
          border-radius: 4px;
          margin-bottom: 1.5rem;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          border-left: 4px solid #c53030;
        }
        
        .user-signin-form {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }
        
        .input-group {
          display: flex;
          flex-direction: column;
        }
        
        .input-group label {
          color: #2c3e50;
          margin-bottom: 0.5rem;
          font-weight: 500;
        }
        
        .input-group input {
          padding: 0.8rem;
          border: 1px solid #ddd;
          border-radius: 4px;
          font-size: 1rem;
          transition: border-color 0.3s;
        }
        
        .input-group input:focus {
          outline: none;
          border-color: #4a6580;
        }
        
        .input-group input:disabled {
          background-color: #f8f9fa;
          cursor: not-allowed;
        }
        
        .form-options {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        
        .remember-me {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }
        
        .remember-me label {
          color: #7b8a9b;
          font-size: 0.9rem;
        }
        
        .forgot-password {
          color: #4a6580;
          text-decoration: none;
          font-size: 0.9rem;
        }
        
        .forgot-password:hover {
          text-decoration: underline;
        }
        
        .signin-btn {
          background: linear-gradient(135deg, #4a6580 0%, #2c3e50 100%);
          color: white;
          border: none;
          padding: 1rem;
          border-radius: 4px;
          font-size: 1rem;
          font-weight: 600;
          cursor: pointer;
          transition: opacity 0.3s;
          display: flex;
          justify-content: center;
          align-items: center;
          gap: 0.5rem;
        }
        
        .signin-btn:hover:not(:disabled) {
          opacity: 0.9;
        }
        
        .signin-btn:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }
        
        .lawyer-redirect {
          text-align: center;
          margin-top: 1.5rem;
          padding: 1rem;
          background-color: #f0f7ff;
          border-radius: 4px;
          border-left: 4px solid #4a6580;
        }
        
        .lawyer-redirect p {
          color: #4a6580;
          margin: 0;
        }
        
        .lawyer-redirect a {
          color: #2c3e50;
          text-decoration: none;
          font-weight: 600;
        }
        
        .lawyer-redirect a:hover {
          text-decoration: underline;
        }
        
        .signup-redirect {
          text-align: center;
          margin-top: 1.5rem;
          color: #7b8a9b;
        }
        
        .signup-redirect a {
          color: #4a6580;
          text-decoration: none;
          font-weight: 500;
        }
        
        .signup-redirect a:hover {
          text-decoration: underline;
        }
        
        @media (max-width: 768px) {
          .user-signin-content {
            grid-template-columns: 1fr;
          }
          
          .signin-intro {
            display: none;
          }
          
          .form-options {
            flex-direction: column;
            align-items: flex-start;
            gap: 0.8rem;
          }
        }
      `}</style>
      

      <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.3/css/all.min.css" />
    </div>
  );
};

export default UserSignin;