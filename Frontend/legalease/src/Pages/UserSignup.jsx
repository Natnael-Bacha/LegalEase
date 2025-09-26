import axios from 'axios';
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router';

const UserSignup = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    middleName: '',
    lastName: '',
    email: '',
    phoneNumber: '',   
    password: '',
    confirmPassword: ''
  });
  
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.confirmPassword !== formData.password) {
      alert("Passwords do not match");
      return;
    }
    axios.post(`${import.meta.env.VITE_BACKEND_URL}/clientAuth/signup`, formData).then(response=>{
      if(response.status == 200){
        navigate('/userSignin');
      }
    }) 
  };

  return (
    <div className="user-signup-container">
      <div className="user-signup-content">
        <div className="signup-intro">
          <div className="logo">
            <i className="fas fa-balance-scale"></i>
            <span>Justice Partners</span>
          </div>
          <h1>Find Your Legal Solution</h1>
          <p>Create an account to connect with qualified lawyers, manage your cases, and access legal resources.</p>
          <div className="benefits">
            <div className="benefit-item">
              <i className="fas fa-search"></i>
              <span>Find Lawyers</span>
            </div>
            <div className="benefit-item">
              <i className="fas fa-lock"></i>
              <span>Secure Case Management</span>
            </div>
            <div className="benefit-item">
              <i className="fas fa-comments"></i>
              <span>Direct Communication</span>
            </div>
          </div>
        </div>

        <div className="signup-form-wrapper">
          <div className="form-header">
            <h2>Create User Account</h2>
            <p>Please provide your information to get started</p>
          </div>

          <form onSubmit={handleSubmit} className="user-signup-form">
            <div className="name-fields">
              <div className="input-group">
                <label htmlFor="firstName">First Name *</label>
                <input
                  type="text"
                  id="firstName"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  required
                />
              </div>
              
              <div className="input-group">
                <label htmlFor="middleName">Middle Name</label>
                <input
                  type="text"
                  id="middleName"
                  name="middleName"
                  value={formData.middleName}
                  onChange={handleChange}
                />
              </div>
              
              <div className="input-group">
                <label htmlFor="lastName">Last Name *</label>
                <input
                  type="text"
                  id="lastName"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
            
            <div className="input-group">
              <label htmlFor="email">Email Address *</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>

            {/* ✅ New Phone Number Field */}
            <div className="input-group">
              <label htmlFor="phoneNumber">Phone Number *</label>
              <input
                type="tel"
                id="phoneNumber"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleChange}
                required
              />
            </div>
            
            <div className="password-fields">
              <div className="input-group">
                <label htmlFor="password">Password *</label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
              </div>
              
              <div className="input-group">
                <label htmlFor="confirmPassword">Confirm Password *</label>
                <input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
            
            <div className="terms-agreement">
              <input type="checkbox" id="terms" required />
              <label htmlFor="terms">
                I agree to the <a href="/terms">Terms of Service</a> and <a href="/privacy">Privacy Policy</a>
              </label>
            </div>
            
            <button type="submit" className="signup-btn">Create Account</button>
          </form>

          <div className="signin-redirect">
            <p>Already have an account? <Link to="/userSignin">Sign In</Link></p>
          </div>
        </div>
      </div>

   <style jsx>{`
        .user-signup-container {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background-color: #f8f9fa;
          padding: 2rem;
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        }
        
        .user-signup-content {
          display: grid;
          grid-template-columns: 1fr 1.2fr;
          max-width: 1100px;
          width: 100%;
          background: white;
          border-radius: 10px;
          overflow: hidden;
          box-shadow: 0 10px 30px rgba(0,0,0,0.1);
        }
        
        .signup-intro {
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
        
        .signup-intro h1 {
          font-size: 2rem;
          margin-bottom: 1rem;
        }
        
        .signup-intro p {
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
        
        .signup-form-wrapper {
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
        
        .user-signup-form {
          display: flex;
          flex-direction: column;
          gap: 1.2rem;
        }
        
        .name-fields {
          display: grid;
          grid-template-columns: 1fr 1fr 1fr;
          gap: 1rem;
        }
        
        .password-fields {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1rem;
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
        
        .terms-agreement {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          margin: 0.5rem 0;
        }
        
        .terms-agreement label {
          color: #7b8a9b;
          font-size: 0.9rem;
        }
        
        .terms-agreement a {
          color: #4a6580;
          text-decoration: none;
        }
        
        .terms-agreement a:hover {
          text-decoration: underline;
        }
        
        .signup-btn {
          background: linear-gradient(135deg, #4a6580 0%, #2c3e50 100%);
          color: white;
          border: none;
          padding: 1rem;
          border-radius: 4px;
          font-size: 1rem;
          font-weight: 600;
          cursor: pointer;
          transition: opacity 0.3s;
          margin-top: 0.5rem;
        }
        
        .signup-btn:hover {
          opacity: 0.9;
        }
        
        .signin-redirect {
          text-align: center;
          margin-top: 1.5rem;
          color: #7b8a9b;
        }
        
        .signin-redirect a {
          color: #4a6580;
          text-decoration: none;
          font-weight: 500;
        }
        
        .signin-redirect a:hover {
          text-decoration: underline;
        }
        
        @media (max-width: 900px) {
          .name-fields {
            grid-template-columns: 1fr 1fr;
          }
        }
        
        @media (max-width: 768px) {
          .user-signup-content {
            grid-template-columns: 1fr;
          }
          
          .signup-intro {
            display: none;
          }
          
          .name-fields, .password-fields {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
      
      
      {/* Add Font Awesome for icons */}
      <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.3/css/all.min.css" />
    </div>
  );
};

export default UserSignup;
