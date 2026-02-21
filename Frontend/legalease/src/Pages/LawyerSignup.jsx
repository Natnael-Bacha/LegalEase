import React, { useState } from "react";
import { useNavigate, Link } from "react-router";
import axios from "axios";

const LawyerSignup = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    middleName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();

  const validateField = (name, value) => {
    const newErrors = { ...errors };

    switch (name) {
      case "firstName":
        if (!value.trim()) {
          newErrors.firstName = "First name is required";
        } else {
          delete newErrors.firstName;
        }
        break;

      case "middleName":
        if (!value.trim()) {
          newErrors.middleName = "Middle name is required";
        } else {
          delete newErrors.middleName;
        }
        break;

      case "lastName":
        if (!value.trim()) {
          newErrors.lastName = "Last name is required";
        } else {
          delete newErrors.lastName;
        }
        break;

      case "email":
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!value) {
          newErrors.email = "Email is required";
        } else if (!emailRegex.test(value)) {
          newErrors.email = "Please enter a valid email address";
        } else {
          delete newErrors.email;
        }
        break;

      case "password":
        const passwordRegex =
          /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
        if (!value) {
          newErrors.password = "Password is required";
        } else if (!passwordRegex.test(value)) {
          newErrors.password =
            "Password must be at least 8 characters with uppercase, lowercase, number, and special character";
        } else {
          delete newErrors.password;
        }
        break;

      case "confirmPassword":
        if (!value) {
          newErrors.confirmPassword = "Please confirm your password";
        } else if (value !== formData.password) {
          newErrors.confirmPassword = "Passwords do not match";
        } else {
          delete newErrors.confirmPassword;
        }
        break;

      default:
        break;
    }

    setErrors(newErrors);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    validateField(name, value);
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.firstName.trim())
      newErrors.firstName = "First name is required";
    if (!formData.middleName.trim())
      newErrors.middleName = "Middle name is required";
    if (!formData.lastName.trim()) newErrors.lastName = "Last name is required";

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (!passwordRegex.test(formData.password)) {
      newErrors.password =
        "Password must be at least 8 characters with uppercase, lowercase, number, and special character";
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password";
    } else if (formData.confirmPassword !== formData.password) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/auth/signup`,
        formData,
      );
      if (response.status === 200) {
        navigate("/lawyerSignin");
      }
    } catch (error) {
      console.error("Signup error:", error);
      alert("Signup failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
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
          <p>
            Register your practice to access premium client matching and legal
            resources.
          </p>
          <div className="benefits">
            <div className="benefit-item">
              <i className="fas fa-user-friends"></i>
              <span>Client Matching</span>
            </div>
            <div className="benefit-item">
              <i className="fas fa-network-wired"></i>
              <span>Professional Network</span>
            </div>
            <div className="benefit-item">
              <i className="fas fa-briefcase"></i>
              <span>Case Management</span>
            </div>
          </div>
        </div>

        <div className="signup-form-wrapper">
          <div className="form-header">
            <h2>Create Account</h2>
            <p>Fill in your professional details</p>
          </div>

          <form onSubmit={handleSubmit} className="lawyer-signup-form">
            <div className="name-fields">
              <div className="input-group">
                <label htmlFor="firstName">First *</label>
                <input
                  type="text"
                  id="firstName"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  required
                  disabled={isLoading}
                  placeholder="John"
                  className={errors.firstName ? "error" : ""}
                />
                {errors.firstName && (
                  <span className="field-error-message">
                    {errors.firstName}
                  </span>
                )}
              </div>

              <div className="input-group">
                <label htmlFor="middleName">Middle *</label>
                <input
                  type="text"
                  id="middleName"
                  name="middleName"
                  value={formData.middleName}
                  onChange={handleChange}
                  required
                  disabled={isLoading}
                  placeholder="Michael"
                  className={errors.middleName ? "error" : ""}
                />
                {errors.middleName && (
                  <span className="field-error-message">
                    {errors.middleName}
                  </span>
                )}
              </div>

              <div className="input-group">
                <label htmlFor="lastName">Last *</label>
                <input
                  type="text"
                  id="lastName"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  required
                  disabled={isLoading}
                  placeholder="Doe"
                  className={errors.lastName ? "error" : ""}
                />
                {errors.lastName && (
                  <span className="field-error-message">{errors.lastName}</span>
                )}
              </div>
            </div>

            <div className="input-group">
              <label htmlFor="email">Email *</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                disabled={isLoading}
                placeholder="your.email@lawfirm.com"
                className={errors.email ? "error" : ""}
              />
              {errors.email && (
                <span className="field-error-message">{errors.email}</span>
              )}
            </div>

            <div className="password-fields">
              <div className="input-group password-input-group">
                <label htmlFor="password">Password *</label>
                <div className="password-wrapper">
                  <input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    disabled={isLoading}
                    placeholder="Create password"
                    className={errors.password ? "error" : ""}
                  />
                  <button
                    type="button"
                    className="password-toggle-btn"
                    onClick={togglePasswordVisibility}
                    tabIndex="-1"
                    aria-label={
                      showPassword ? "Hide password" : "Show password"
                    }
                  >
                    <i
                      className={`fas ${showPassword ? "fa-eye-slash" : "fa-eye"}`}
                    ></i>
                  </button>
                </div>
                {errors.password && (
                  <span className="field-error-message">{errors.password}</span>
                )}
              </div>

              <div className="input-group password-input-group">
                <label htmlFor="confirmPassword">Confirm *</label>
                <div className="password-wrapper">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    id="confirmPassword"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    required
                    disabled={isLoading}
                    placeholder="Confirm password"
                    className={errors.confirmPassword ? "error" : ""}
                  />
                  <button
                    type="button"
                    className="password-toggle-btn"
                    onClick={toggleConfirmPasswordVisibility}
                    tabIndex="-1"
                    aria-label={
                      showConfirmPassword ? "Hide password" : "Show password"
                    }
                  >
                    <i
                      className={`fas ${showConfirmPassword ? "fa-eye-slash" : "fa-eye"}`}
                    ></i>
                  </button>
                </div>
                {errors.confirmPassword && (
                  <span className="field-error-message">
                    {errors.confirmPassword}
                  </span>
                )}
              </div>
            </div>

            <div className="terms-agreement">
              <input type="checkbox" id="terms" required disabled={isLoading} />
              <label htmlFor="terms">
                I agree to the <a href="/terms">Terms</a> &{" "}
                <a href="/privacy">Privacy</a>
              </label>
            </div>

            <button
              type="submit"
              className={`signup-btn ${isLoading ? "loading" : ""}`}
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <i className="fas fa-spinner fa-spin"></i>
                  Registering...
                </>
              ) : (
                <>
                  <i className="fas fa-user-plus"></i>
                  Register
                </>
              )}
            </button>
          </form>

          <div className="signin-redirect">
            <p>
              Have an account? <Link to={"/lawyerSignin"}>Sign In</Link>
            </p>
          </div>
        </div>
      </div>

      <style jsx>{`
        .lawyer-signup-container {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
          padding: 2rem;
          font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
          font-size: 14px;
        }

        .lawyer-signup-content {
          display: grid;
          grid-template-columns: 1fr 1.2fr;
          max-width: 1100px;
          width: 80%;
          background: white;
          border-radius: 10px;
          overflow: hidden;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
          border: 1px solid #e0e0e0;
        }

        .signup-intro {
          background: linear-gradient(135deg, #1a3a5f 0%, #2d5a8c 100%);
          color: white;
          padding: 2.5rem;
          display: flex;
          flex-direction: column;
          justify-content: center;
          position: relative;
          overflow: hidden;
        }

        .signup-intro::before {
          content: "";
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" fill="rgba(255,255,255,0.05)"><path d="M30,30 Q50,10 70,30 T90,50 T70,70 T50,90 T30,70 T10,50 T30,30 Z"/></svg>');
          background-size: 250px;
        }

        .logo {
          display: flex;
          align-items: center;
          margin-bottom: 1.8rem;
          font-size: 1.3rem;
          font-weight: bold;
          position: relative;
          z-index: 1;
        }

        .logo i {
          margin-right: 0.5rem;
          font-size: 1.8rem;
          color: #ffffff;
        }

        .signup-intro h1 {
          font-size: 2rem;
          margin-bottom: 1.2rem;
          line-height: 1.3;
          position: relative;
          z-index: 1;
          font-weight: 600;
        }

        .signup-intro p {
          margin-bottom: 1.8rem;
          line-height: 1.5;
          opacity: 0.95;
          font-size: 0.95rem;
          position: relative;
          z-index: 1;
        }

        .benefits {
          display: flex;
          flex-direction: column;
          gap: 0.8rem;
          position: relative;
          z-index: 1;
        }

        .benefit-item {
          display: flex;
          align-items: center;
          gap: 0.8rem;
          padding: 0.6rem;
          background: rgba(255, 255, 255, 0.1);
          border-radius: 6px;
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.2);
          font-size: 0.9rem;
        }

        .benefit-item i {
          font-size: 1.1rem;
          width: 22px;
          color: #ffffff;
        }

        .signup-form-wrapper {
          padding: 2.5rem;
          display: flex;
          flex-direction: column;
          justify-content: center;
          background: white;
        }

        .form-header {
          margin-bottom: 1.8rem;
          text-align: center;
        }

        .form-header h2 {
          color: #1a3a5f;
          margin-bottom: 0.3rem;
          font-size: 1.7rem;
          font-weight: 600;
        }

        .form-header p {
          color: #6c757d;
          font-size: 0.9rem;
        }

        .lawyer-signup-form {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .name-fields {
          display: grid;
          grid-template-columns: 1fr 1fr 1fr;
          gap: 0.8rem;
        }

        .password-fields {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 0.8rem;
        }

        .input-group {
          display: flex;
          flex-direction: column;
        }

        .input-group label {
          color: #495057;
          margin-bottom: 0.3rem;
          font-weight: 500;
          font-size: 0.85rem;
        }

        .input-group input {
          padding: 0.7rem;
          border: 2px solid #e9ecef;
          border-radius: 5px;
          font-size: 0.9rem;
          transition: all 0.3s ease;
          background: #f8f9fa;
        }

        .input-group input:focus {
          outline: none;
          border-color: #1a3a5f;
          background: white;
          box-shadow: 0 0 0 3px rgba(26, 58, 95, 0.1);
        }

        .input-group input:disabled {
          background-color: #f1f3f4;
          cursor: not-allowed;
          opacity: 0.7;
        }

        .input-group input.error {
          border-color: #d32f2f;
          background: #fff5f5;
        }

        /* Password input styles */
        .password-input-group {
          position: relative;
        }

        .password-wrapper {
          position: relative;
          display: flex;
          align-items: center;
        }

        .password-wrapper input {
          width: 100%;
          padding-right: 2.5rem;
        }

        .password-toggle-btn {
          position: absolute;
          right: 0;
          top: 0;
          height: 100%;
          width: 2.5rem;
          background: transparent;
          border: none;
          color: #6c757d;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: color 0.2s ease;
          padding: 0;
          font-size: 1rem;
        }

        .password-toggle-btn:hover {
          color: #1a3a5f;
        }

        .password-toggle-btn:focus {
          outline: none;
        }

        .password-toggle-btn i {
          font-size: 1rem;
        }

        .field-error-message {
          color: #d32f2f;
          font-size: 0.75rem;
          margin-top: 0.2rem;
          font-weight: 500;
        }

        .input-group input::placeholder {
          color: #adb5bd;
          font-size: 0.8rem;
        }

        .terms-agreement {
          display: flex;
          align-items: flex-start;
          gap: 0.6rem;
          margin: 0.5rem 0;
          padding: 0.6rem;
          background: #f8f9fa;
          border-radius: 5px;
          font-size: 0.8rem;
        }

        .terms-agreement input[type="checkbox"] {
          margin-top: 0.1rem;
          width: 14px;
          height: 14px;
        }

        .terms-agreement label {
          color: #495057;
          font-size: 0.8rem;
          line-height: 1.4;
        }

        .terms-agreement a {
          color: #1a3a5f;
          text-decoration: none;
          font-weight: 500;
        }

        .terms-agreement a:hover {
          text-decoration: underline;
        }

        .signup-btn {
          background: linear-gradient(135deg, #1a3a5f 0%, #2d5a8c 100%);
          color: white;
          border: none;
          padding: 0.8rem;
          border-radius: 5px;
          font-size: 0.95rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          margin-top: 0.3rem;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          box-shadow: 0 4px 15px rgba(26, 58, 95, 0.2);
        }

        .signup-btn:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(26, 58, 95, 0.3);
        }

        .signup-btn:active:not(:disabled) {
          transform: translateY(0);
        }

        .signup-btn:disabled {
          opacity: 0.7;
          cursor: not-allowed;
          transform: none;
        }

        .signup-btn.loading {
          background: linear-gradient(135deg, #6c757d 0%, #495057 100%);
        }

        .signin-redirect {
          text-align: center;
          margin: 0.8rem 0 0 0;
          padding: 0.6rem;
          background: #f8f9fa;
          border-radius: 5px;
          color: #6c757d;
          font-size: 0.85rem;
        }

        .signin-redirect a {
          color: #1a3a5f;
          text-decoration: none;
          font-weight: 500;
          transition: color 0.3s;
        }

        .signin-redirect a:hover {
          color: #2d5a8c;
          text-decoration: underline;
        }

        .fa-spin {
          animation: fa-spin 1s infinite linear;
        }

        @keyframes fa-spin {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }

        @media (max-width: 968px) {
          .name-fields {
            grid-template-columns: 1fr 1fr;
            gap: 0.8rem;
          }

          .password-fields {
            grid-template-columns: 1fr;
            gap: 0.8rem;
          }
        }

        @media (max-width: 768px) {
          .lawyer-signup-content {
            grid-template-columns: 1fr;
            max-width: 450px;
          }

          .signup-intro {
            padding: 1.5rem;
            text-align: center;
          }

          .signup-form-wrapper {
            padding: 1.5rem;
          }

          .name-fields {
            grid-template-columns: 1fr;
          }
        }

        @media (max-width: 480px) {
          .lawyer-signup-container {
            padding: 1rem;
          }

          .signup-intro,
          .signup-form-wrapper {
            padding: 1.2rem;
          }

          .signup-intro h1 {
            font-size: 1.6rem;
          }
        }
      `}</style>

      <link
        rel="stylesheet"
        href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.3/css/all.min.css"
      />
    </div>
  );
};

export default LawyerSignup;
