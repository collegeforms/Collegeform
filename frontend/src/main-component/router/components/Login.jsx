// components/Login.js
import React, { useState, useContext } from 'react';
import './Signup.css';
import { Link, useNavigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import PhoneIcon from "@mui/icons-material/Phone";
import LockIcon from "@mui/icons-material/Lock";

const Login = () => {
  const { sendOtp, verifyOtp, loading, error, otpSent, otpPhone, resendOtp } = useContext(AuthContext);
  const navigate = useNavigate();
  
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [localError, setLocalError] = useState("");

  const handleSendOtp = async (e) => {
    e.preventDefault();
    setLocalError("");
    
    if (!phone || phone.length !== 10) {
      setLocalError("Please enter a valid 10-digit phone number");
      return;
    }

    const result = await sendOtp(phone);
    if (!result.success) {
      setLocalError(result.error);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setLocalError("");
    
    if (!otp || otp.length !== 6) {
      setLocalError("Please enter a valid 6-digit OTP");
      return;
    }

    const result = await verifyOtp({ phone }, otp);
    if (result.success) {
      navigate("/");
    } else {
      setLocalError(result.error);
    }
  };

  const handleResendOtp = async () => {
    setLocalError("");
    const result = await resendOtp();
    if (!result.success) {
      setLocalError(result.error);
    }
  };

  return (
    <div className="containerss">
      <div className="signup-form text-start">
        <Link to={'/'} className="img-div">
          <img src="/img/college-logo-2.png" width={"200px"} alt="College Logo" />
        </Link>
        
        <h1 className='text-start'>{otpSent ? "Verify OTP" : "Login to Your Account"}</h1>
        
        {(error || localError) && <p className="error text-danger">{error || localError}</p>}
        
        {!otpSent ? (
          <form onSubmit={handleSendOtp} className='attractive-form'>
            <div className="form-group">
              <div className="input-container">
                <PhoneIcon className="input-icon" />
                <input 
                  type="tel" 
                  id="phone" 
                  name="phone" 
                  placeholder="Enter your 10-digit phone number" 
                  value={phone}
                  onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                  required 
                  className="sleek-input"
                  maxLength="10"
                />
              </div>
            </div>
            
            <button type="submit" className="submit-btn" disabled={loading}>
              {loading ? "Sending OTP..." : "Send OTP"} <LockIcon className="ms-2" />
            </button>
          </form>
        ) : (
          <form onSubmit={handleVerifyOtp} className='attractive-form'>
            <div className="form-group">
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
                />
              </div>
            </div>
            
            <p className='mt-2'>
              OTP sent to {otpPhone}. 
              <button 
                type="button" 
                className="btn btn-link p-0 ms-1" 
                onClick={handleResendOtp}
                disabled={loading}
              >
                Resend OTP
              </button>
            </p>

            <button type="submit" className="submit-btn" disabled={loading}>
              {loading ? "Verifying..." : "Verify OTP"} <LockIcon className="ms-2" />
            </button>
          </form>
        )}

        <p className='mt-4'>Don't have an account? <Link to={"/user/signup"}>Sign Up</Link></p>
      </div>
      <div className="image-section"></div>
    </div>
  );
};

export default Login;