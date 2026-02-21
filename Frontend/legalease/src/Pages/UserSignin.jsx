import { useState } from "react";
import { Link, useNavigate } from "react-router";
import axios from "axios";

const UserSignin = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const validateField = (name, value) => {
    const newErrors = { ...errors };

    switch (name) {
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
        if (!value) {
          newErrors.password = "Password is required";
        } else {
          delete newErrors.password;
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

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
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
        `${import.meta.env.VITE_BACKEND_URL}/clientAuth/login`,
        formData,
        {
          withCredentials: true,
        },
      );

      if (response.status === 200) {
        navigate("/userPage");
      }
    } catch (error) {
      setErrors({
        submit:
          error.response?.data?.message ||
          "Signin failed. Please check your credentials and try again.",
      });
      console.error("Signin error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
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
          <p>
            Sign in to access your legal resources, connect with your lawyer,
            and manage your cases efficiently.
          </p>
          <div className="benefits">
            <div className="benefit-item">
              <i className="fas fa-briefcase"></i>
              <span>Case Management</span>
            </div>
            <div className="benefit-item">
              <i className="fas fa-file-alt"></i>
              <span>Document Access</span>
            </div>
            <div className="benefit-item">
              <i className="fas fa-comments"></i>
              <span>Legal Communication</span>
            </div>
            <div className="benefit-item">
              <i className="fas fa-calendar-check"></i>
              <span>Appointment Tracking</span>
            </div>
          </div>
        </div>

        <div className="signin-form-wrapper">
          <div className="form-header">
            <h2>Sign In to Your Account</h2>
            <p>Enter your credentials to continue your legal journey</p>
          </div>

          {errors.submit && (
            <div className="error-message">
              <i className="fas fa-exclamation-circle"></i>
              {errors.submit}
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
                placeholder="your.email@example.com"
                className={errors.email ? "error" : ""}
              />
              {errors.email && (
                <span className="field-error-message">{errors.email}</span>
              )}
            </div>

            <div className="input-group">
              <label htmlFor="password">Password *</label>
              <div className="password-input-wrapper">
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  disabled={isLoading}
                  placeholder="Enter your password"
                  className={errors.password ? "error" : ""}
                />
                <button
                  type="button"
                  className={`password-toggle-btn ${showPassword ? "showing" : ""}`}
                  onClick={togglePasswordVisibility}
                  disabled={isLoading}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  title={showPassword ? "Hide password" : "Show password"}
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

            <div className="form-options"></div>

            <button
              type="submit"
              className={`signin-btn ${isLoading ? "loading" : ""}`}
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
            <div className="divider">
              <span>Are you a lawyer?</span>
            </div>
            <button
              className="lawyer-btn"
              onClick={() => navigate("/lawyerSignin")}
              disabled={isLoading}
            >
              <i className="fas fa-gavel"></i>
              Sign in as Lawyer
            </button>
          </div>

          <div className="signup-redirect">
            <p>
              Don't have an account? <Link to="/userSignup">Sign Up</Link>
            </p>
          </div>
        </div>
      </div>

      <style jsx>{`
        .user-signin-container {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
          padding: 1.5rem;
          font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
          font-size: 14px;
        }

        .user-signin-content {
          display: grid;
          grid-template-columns: 1fr 1.2fr;
          max-width: 1000px;
          width: 50%;
          background: white;
          border-radius: 10px;
          overflow: hidden;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
          border: 1px solid #e0e0e0;
        }

        .signin-intro {
          background: linear-gradient(135deg, #1a3a5f 0%, #2d5a8c 100%);
          color: white;
          padding: 2rem;
          display: flex;
          flex-direction: column;
          justify-content: center;
          position: relative;
          overflow: hidden;
        }

        .signin-intro::before {
          content: "";
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" fill="rgba(255,255,255,0.05)"><circle cx="50" cy="50" r="2"/><circle cx="20" cy="20" r="1"/><circle cx="80" cy="80" r="1.5"/><circle cx="30" cy="70" r="1"/><circle cx="70" cy="30" r="1.5"/></svg>');
          background-size: 250px;
        }

        .logo {
          display: flex;
          align-items: center;
          margin-bottom: 1.5rem;
          font-size: 1.2rem;
          font-weight: bold;
          position: relative;
          z-index: 1;
        }

        .logo i {
          margin-right: 0.5rem;
          font-size: 1.6rem;
          color: #ffffff;
        }

        .signin-intro h1 {
          font-size: 1.8rem;
          margin-bottom: 1rem;
          line-height: 1.3;
          position: relative;
          z-index: 1;
          font-weight: 600;
        }

        .signin-intro p {
          margin-bottom: 2rem;
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
          width: 20px;
          color: #ffffff;
        }

        .signin-form-wrapper {
          padding: 2rem;
          display: flex;
          flex-direction: column;
          justify-content: center;
          background: white;
        }

        .form-header {
          margin-bottom: 2rem;
          text-align: center;
        }

        .form-header h2 {
          color: #2d5a8c;
          margin-bottom: 0.3rem;
          font-size: 1.5rem;
          font-weight: 600;
        }

        .form-header p {
          color: #6c757d;
          font-size: 0.9rem;
        }

        .error-message {
          background: #ffeaea;
          color: #d32f2f;
          padding: 0.8rem;
          border-radius: 5px;
          margin-bottom: 1.2rem;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          border-left: 4px solid #d32f2f;
          font-weight: 500;
          font-size: 0.9rem;
        }

        .error-message i {
          font-size: 1rem;
        }

        .user-signin-form {
          display: flex;
          flex-direction: column;
          gap: 1.2rem;
          margin-bottom: 1.2rem;
        }

        .input-group {
          display: flex;
          flex-direction: column;
        }

        .input-group label {
          color: #495057;
          margin-bottom: 0.4rem;
          font-weight: 500;
          font-size: 0.9rem;
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
          border-color: #2d5a8c;
          background: white;
          box-shadow: 0 0 0 3px rgba(45, 90, 140, 0.1);
        }

        .input-group input.error {
          border-color: #d32f2f;
          background: #fff5f5;
        }

        .input-group input:disabled {
          background-color: #f1f3f4;
          cursor: not-allowed;
          opacity: 0.7;
        }

        /* Password input wrapper styles */
        .password-input-wrapper {
          position: relative;
          display: flex;
          align-items: center;
        }

        .password-input-wrapper input {
          width: 100%;
          padding-right: 2.8rem;
        }

        .password-toggle-btn {
          position: absolute;
          right: 8px;
          background: none;
          border: none;
          color: #6c757d;
          cursor: pointer;
          padding: 0.4rem;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 4px;
          transition: all 0.2s ease;
          font-size: 1rem;
        }

        .password-toggle-btn:hover:not(:disabled) {
          color: #2d5a8c;
          background-color: rgba(45, 90, 140, 0.1);
        }

        .password-toggle-btn.showing {
          color: #2d5a8c;
        }

        .password-toggle-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .password-toggle-btn i {
          font-size: 1rem;
          transition: transform 0.2s ease;
        }

        .password-toggle-btn:hover i {
          transform: scale(1.1);
        }

        .field-error-message {
          color: #d32f2f;
          font-size: 0.8rem;
          margin-top: 0.3rem;
          font-weight: 500;
        }

        .input-group input::placeholder {
          color: #adb5bd;
          font-size: 0.85rem;
        }

        .form-options {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin: 0.3rem 0;
        }

        .remember-me {
          display: flex;
          align-items: center;
          gap: 0.4rem;
        }

        .remember-me input[type="checkbox"] {
          margin: 0;
          width: 14px;
          height: 14px;
        }

        .remember-me label {
          color: #495057;
          font-size: 0.85rem;
          cursor: pointer;
        }

        .forgot-password a {
          color: #2d5a8c;
          text-decoration: none;
          font-size: 0.85rem;
          font-weight: 500;
          transition: color 0.3s;
        }

        .forgot-password a:hover {
          color: #3a7bd5;
          text-decoration: underline;
        }

        .signin-btn {
          background: linear-gradient(135deg, #2d5a8c 0%, #3a7bd5 100%);
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
          box-shadow: 0 4px 15px rgba(45, 90, 140, 0.2);
        }

        .signin-btn:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(45, 90, 140, 0.3);
        }

        .signin-btn:active:not(:disabled) {
          transform: translateY(0);
        }

        .signin-btn:disabled {
          opacity: 0.7;
          cursor: not-allowed;
          transform: none;
        }

        .signin-btn.loading {
          background: linear-gradient(135deg, #6c757d 0%, #495057 100%);
        }

        .lawyer-redirect {
          margin: 1.2rem 0;
        }

        .divider {
          display: flex;
          align-items: center;
          text-align: center;
          margin: 1.2rem 0;
          color: #6c757d;
          font-size: 0.85rem;
        }

        .divider::before,
        .divider::after {
          content: "";
          flex: 1;
          border-bottom: 1px solid #e9ecef;
        }

        .divider span {
          padding: 0 1rem;
        }

        .lawyer-btn {
          width: 100%;
          padding: 0.7rem;
          background: transparent;
          color: #2d5a8c;
          border: 2px solid #2d5a8c;
          border-radius: 5px;
          font-size: 0.9rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
        }

        .lawyer-btn:hover:not(:disabled) {
          background: #2d5a8c;
          color: white;
          transform: translateY(-1px);
        }

        .lawyer-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .signup-redirect {
          text-align: center;
          margin-top: 1.2rem;
          padding: 0.8rem;
          background: #f8f9fa;
          border-radius: 5px;
          color: #6c757d;
          font-size: 0.9rem;
        }

        .signup-redirect a {
          color: #2d5a8c;
          text-decoration: none;
          font-weight: 500;
          transition: color 0.3s;
        }

        .signup-redirect a:hover {
          color: #3a7bd5;
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

        @media (max-width: 768px) {
          .user-signin-content {
            grid-template-columns: 1fr;
            max-width: 450px;
          }

          .signin-intro {
            padding: 1.5rem;
            text-align: center;
          }

          .signin-form-wrapper {
            padding: 1.5rem;
          }

          .form-options {
            flex-direction: column;
            gap: 0.8rem;
            align-items: flex-start;
          }
        }

        @media (max-width: 480px) {
          .user-signin-container {
            padding: 0.8rem;
          }

          .signin-intro,
          .signin-form-wrapper {
            padding: 1.2rem;
          }

          .signin-intro h1 {
            font-size: 1.5rem;
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

export default UserSignin;
