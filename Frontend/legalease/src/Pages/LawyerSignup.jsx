import React, { useState } from 'react';
import { useNavigate , Link} from 'react-router';
import axios from 'axios'

const LawyerSignup = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    middleName: '',
    lastName: '',
    email: '',
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
    if(formData.confirmPassword !== formData.password){
        alert("Password Should be matching")
        return;
    }
    e.preventDefault();
    axios.post(`${import.meta.env.VITE_BACKEND_URL}/auth/signup`, formData).then(response=>{
      if(response.status == 200){
        navigate('/lawyerSignin');
      }
    }) 
  };



  return (
    <div className="lawyer-signup-container">
      <div className="lawyer-signup-content">
        <div className="signup-intro">
          <div className="logo">
            <i className="fas fa-balance-scale"></i>
            <span>Justice Partners</span>
          </div>
          <h1>Join Our Legal Network</h1>
          <p>Register your practice to access premium client matching, legal resources, and professional networking.</p>
          <div className="benefits">
            <div className="benefit-item">
              <i className="fas fa-user-friends"></i>
              <span>Client Matching</span>
            </div>
            <div className="benefit-item">
              <i className="fas fa-network-wired"></i>
              <span>Professional Network</span>
            </div>
          </div>
        </div>

        <div className="signup-form-wrapper">
          <div className="form-header">
            <h2>Create Attorney Account</h2>
            <p>Please provide your professional information</p>
          </div>

          <form onSubmit={handleSubmit} className="lawyer-signup-form">
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
                <label htmlFor="middleName">Middle Name *</label>
                <input
                  type="text"
                  id="middleName"
                  name="middleName"
                  value={formData.middleName}
                  onChange={handleChange}
                  required
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
            
            <button type="submit" className="signup-btn">Register Now</button>
          </form>

          <div className="signin-redirect">
            <p>Already have an account?  <Link to={'/lawyerSignin'}>Sign In</Link></p>
          </div>
        </div>
      </div>

    
      
      {/* Add Font Awesome for icons */}
      <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.3/css/all.min.css" />
    </div>
  );
};

export default LawyerSignup;