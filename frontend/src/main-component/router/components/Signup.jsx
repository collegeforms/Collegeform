// components/Signup.js
import React, { useState, useContext } from 'react';
import './Signup.css';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import PhoneIcon from "@mui/icons-material/Phone";
import LockIcon from "@mui/icons-material/Lock";
import PersonIcon from "@mui/icons-material/Person";
import EmailIcon from "@mui/icons-material/Email";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import CarouselSection from './CarouselSection';

const Signup = () => {
  const { 
    sendSignupOtp, 
    verifySignupOtp, 
    loading, 
    error, 
    otpSent, 
    otpPhone, 
    resendOtp,
    clearError,
    resetOtpState,
    resendTimer
  } = useContext(AuthContext);
  
  const navigate = useNavigate();
  const location = useLocation();
  
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
  });
  const [otp, setOtp] = useState("");
  const [localError, setLocalError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const from = location.state?.from?.pathname || "/";

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSendOtp = async (e) => {
    e.preventDefault();
    setLocalError("");
    setSuccessMessage("");
    clearError();
    
    // Validation
    if (!formData.name) {
      setLocalError("Name is required");
      return;
    }
    
    if (!formData.phone || formData.phone.length !== 10) {
      setLocalError("Please enter a valid 10-digit phone number");
      return;
    }

    if (!/^\d+$/.test(formData.phone)) {
      setLocalError("Phone number should contain only digits");
      return;
    }

    // Email validation
    if (!formData.email) {
      setLocalError("Email address is required");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      setLocalError("Please enter a valid email address");
      return;
    }

    // Debug: Show what's being sent
    console.log("Form data being sent:", formData);
    console.log("Is form valid?", isFormValid);

    // Send OTP for signup
    const result = await sendSignupOtp(formData);
    
    if (result.success) {
      setSuccessMessage(`OTP sent successfully to ${formData.phone}`);
    } else {
      setLocalError(result.error || "Failed to send OTP. Please try again.");
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setLocalError("");
    setSuccessMessage("");
    clearError();
    
    if (!otp || otp.length !== 6) {
      setLocalError("Please enter a valid 6-digit OTP");
      return;
    }

    if (!/^\d+$/.test(otp)) {
      setLocalError("OTP should contain only digits");
      return;
    }

    // Now only passing OTP (formData already saved)
    const result = await verifySignupOtp(otp);
    
    if (result.success) {
      setSuccessMessage("Account created successfully! Redirecting...");
      
      // 🔴 GOOGLE ADS CONVERSION TRACKING - SIGNUP SUCCESS
      // Only track conversion if not already tracked in this session
      if (!localStorage.getItem('signup_conversion')) {
        try {
          // Check if gtag is available
          if (typeof window !== 'undefined' && window.gtag) {
            window.gtag('event', 'conversion', {
              send_to: 'AW-17353115810/nEF_CN-g_94bFKKRztJA'
            });
            console.log('Google Ads conversion tracked: Signup completed');
          }
          
          // Set flag to prevent duplicate tracking
          localStorage.setItem('signup_conversion', 'true');
        } catch (conversionError) {
          console.warn('Failed to track conversion:', conversionError);
          // Don't fail the signup if conversion tracking fails
        }
      }
      
      // Redirect after a short delay
      setTimeout(() => {
        navigate(from, { replace: true });
      }, 1000);
    } else {
      setLocalError(result.error || "Invalid OTP. Please try again.");
    }
  };

  const handleResendOtp = async () => {
    setLocalError("");
    setSuccessMessage("");
    clearError();

    const result = await resendOtp();
    
    if (result.success) {
      setSuccessMessage("OTP resent successfully!");
    } else {
      setLocalError(result.error || "Failed to resend OTP. Please try again.");
    }
  };

  const handleBack = () => {
    resetOtpState();
    setLocalError("");
    setSuccessMessage("");
    setOtp("");
  };

  const formatTimer = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  // Check if form is valid for submission
  const isFormValid = formData.name && 
                     formData.phone.length === 10 && 
                     formData.email && 
                     /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email);

  return (
    <div className="containerss">
      <div className="signup-form text-start">
        <Link to={'/'} className="img-div">
          <img src="/img/college-logo-2.png" width={"200px"} alt="College Logo" />
        </Link>
        
        <h1 className='text-start'>
          {otpSent ? (
            <div className="d-flex align-items-center">
              <button 
                type="button" 
                className="btn btn-link p-0 me-2 back-btn"
                onClick={handleBack}
                disabled={loading}
              >
                <ArrowBackIcon />
              </button>
              Verify OTP
            </div>
          ) : (
            "Create Your Account"
          )}
        </h1>
        
        {/* Success Message */}
        {successMessage && (
          <div className="alert alert-success alert-dismissible fade show" role="alert">
            <i className="fas fa-check-circle me-2"></i>
            {successMessage}
            <button 
              type="button" 
              className="btn-close" 
              onClick={() => setSuccessMessage("")}
            ></button>
          </div>
        )}
        
        {/* Error Messages */}
        {(error || localError) && (
          <div className="alert alert-danger alert-dismissible fade show" role="alert">
            <i className="fas fa-exclamation-triangle me-2"></i>
            {error || localError}
            <button 
              type="button" 
              className="btn-close" 
              onClick={() => { clearError(); setLocalError(""); }}
            ></button>
          </div>
        )}
        
        {!otpSent ? (
          <form onSubmit={handleSendOtp} className='attractive-form'>
            <div className="form-group">
              <label htmlFor="name" className="form-label">
                Full Name <span className="text-danger">*</span>
              </label>
              <div className="input-container">
                <PersonIcon className="input-icon" />
                <input 
                  type="text" 
                  id="name" 
                  name="name" 
                  placeholder="Enter your full name" 
                  value={formData.name}
                  onChange={handleChange}
                  required 
                  className="sleek-input"
                  disabled={loading}
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="phone" className="form-label">
                Phone Number <span className="text-danger">*</span>
              </label>
              <div className="input-container">
                <PhoneIcon className="input-icon" />
                <input 
                  type="tel" 
                  id="phone" 
                  name="phone" 
                  placeholder="Enter your 10-digit phone number" 
                  value={formData.phone}
                  onChange={(e) => setFormData({
                    ...formData, 
                    phone: e.target.value.replace(/\D/g, '').slice(0, 10)
                  })}
                  required 
                  className="sleek-input"
                  maxLength="10"
                  disabled={loading}
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="email" className="form-label">
                Email Address <span className="text-danger">*</span>
              </label>
              <div className="input-container">
                <EmailIcon className="input-icon" />
                <input 
                  type="email" 
                  id="email" 
                  name="email" 
                  placeholder="Enter your email address"  
                  value={formData.email}
                  onChange={handleChange}
                  className="sleek-input"
                  required  
                  disabled={loading}
                />
              </div>
              <div className="form-text">
                We'll send important updates to this email
              </div>
            </div>
            
            <button 
              type="submit" 
              className="submit-btn w-100" 
              disabled={loading || !isFormValid}  
            >
              {loading ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                  Sending OTP...
                </>
              ) : (
                <>
                  Send OTP <LockIcon className="ms-2" />
                </>
              )}
            </button>
          </form>
        ) : (
          <form onSubmit={handleVerifyOtp} className='attractive-form'>
            <div className="form-group">
              <label htmlFor="otp" className="form-label">
                OTP Verification <span className="text-danger">*</span>
              </label>
              <div className="input-container">
                <LockIcon className="input-icon" />
                <input 
                  type="text" 
                  id="otp" 
                  name="otp" 
                  placeholder="Enter 6-digit OTP" 
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  required 
                  className="sleek-input"
                  maxLength="6"
                  disabled={loading}
                />
              </div>
              <div className="form-text">
                Enter the OTP sent to your phone number
              </div>
            </div>
            
            <div className="otp-info mb-3">
              <p className="mb-1">
                <small>OTP sent to: <strong>+91 {otpPhone}</strong></small>
              </p>
              <div className="d-flex justify-content-between align-items-center">
                <small className="text-muted">
                  Didn't receive OTP? 
                </small>
                <button 
                  type="button" 
                  className="btn btn-link p-0 text-primary resend-btn" 
                  onClick={handleResendOtp}
                  disabled={loading || resendTimer > 0}
                >
                  {resendTimer > 0 ? (
                    `Resend in ${formatTimer(resendTimer)}`
                  ) : (
                    "Resend OTP"
                  )}
                </button>
              </div>
            </div>

            <button 
              type="submit" 
              className="submit-btn w-100" 
              disabled={loading || !otp || otp.length !== 6}
            >
              {loading ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                  Creating Account...
                </>
              ) : (
                <>
                  Verify & Create Account <LockIcon className="ms-2" />
                </>
              )}
            </button>
          </form>
        )}

        <div className="text-center mt-4">
          <p className="mb-0">
            Already have an account?{' '}
            <Link 
              to="/user/login" 
              className="text-primary fw-bold"
              onClick={() => resetOtpState()}
              state={{ from: location.state?.from || { pathname: "/" } }}
            >
              Login
            </Link>
          </p>
        </div>
      </div>
      <div className="image-section">
        <CarouselSection/>
      </div>
    </div>
  );
};

export default Signup;