import React, { useState, useEffect } from "react";
import "./Universalform.css";
import Navbar from "../../../components/Navbar/Navbar";
import Footer from "../../../components/footer/Footer";
import CategorySection from "../../../components/CategorySection/CategorySection";
import EducationBlocks from "../../HomePage/EducationBlocks";
import Commonform from "./Commonform";
import PersonalisedSection from "../../../components/PersonalisedSection/PersonalisedSection";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import {
  Alert,
  CircularProgress,
  Box,
  Typography,
  Button,
} from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

const UniversalForm = () => {
  const navigate = useNavigate();
  const { 
    sendSignupOtp, 
    verifySignupOtp, 
    resendOtp,
    loading, 
    error, 
    clearError, 
    user,
    resetOtpState 
  } = useAuth();
  
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    state: "",
    city: "",
    program: "",
    course: "",
    agreeToTerms: false
  });

  const [errors, setErrors] = useState({});
  const [otp, setOtp] = useState("");
  const [showOtpInput, setShowOtpInput] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [redirectCountdown, setRedirectCountdown] = useState(5);
  const [isProcessing, setIsProcessing] = useState(false);
  const [otpSentTime, setOtpSentTime] = useState(null);

  // States data
  const states = [
    "Select State *",
    "Delhi",
    "Maharashtra",
    "Karnataka",
    "Tamil Nadu",
    "Uttar Pradesh",
    "West Bengal",
    "Rajasthan",
    "Gujarat",
    "Madhya Pradesh",
    "Haryana",
    "Punjab",
    "Bihar",
    "Jharkhand",
    "Chhattisgarh",
    "Odisha",
    "Telangana",
    "Andhra Pradesh",
    "Kerala",
    "Uttarakhand",
    "Himachal Pradesh",
    "Assam"
  ];

  // Cities data based on state
  const getCitiesByState = (state) => {
    const cityMap = {
      "Delhi": ["Select City *", "New Delhi", "North Delhi", "South Delhi", "East Delhi", "West Delhi"],
      "Maharashtra": ["Select City *", "Mumbai", "Pune", "Nagpur", "Nashik", "Aurangabad", "Thane", "Kolhapur", "Solapur"],
      "Karnataka": ["Select City *", "Bangalore", "Mysore", "Hubli", "Mangalore", "Belgaum", "Davangere", "Shimoga"],
      "Tamil Nadu": ["Select City *", "Chennai", "Coimbatore", "Madurai", "Salem", "Trichy", "Tirunelveli", "Vellore"],
      "Uttar Pradesh": ["Select City *", "Lucknow", "Kanpur", "Varanasi", "Agra", "Prayagraj", "Noida", "Ghaziabad", "Meerut", "Aligarh"],
      "West Bengal": ["Select City *", "Kolkata", "Howrah", "Durgapur", "Siliguri", "Asansol", "Kharagpur"],
      "Rajasthan": ["Select City *", "Jaipur", "Jodhpur", "Udaipur", "Kota", "Ajmer", "Bikaner", "Alwar"],
      "Gujarat": ["Select City *", "Ahmedabad", "Surat", "Vadodara", "Rajkot", "Bhavnagar", "Jamnagar", "Gandhinagar"],
      "Madhya Pradesh": ["Select City *", "Bhopal", "Indore", "Gwalior", "Jabalpur", "Ujjain", "Rewa"],
      "Haryana": ["Select City *", "Gurgaon", "Faridabad", "Panipat", "Ambala", "Hisar", "Rohtak"],
      "Punjab": ["Select City *", "Chandigarh", "Ludhiana", "Amritsar", "Jalandhar", "Patiala", "Bathinda"],
      "Bihar": ["Select City *", "Patna", "Gaya", "Bhagalpur", "Muzaffarpur", "Darbhanga"],
      "Jharkhand": ["Select City *", "Ranchi", "Jamshedpur", "Dhanbad", "Bokaro", "Hazaribagh"],
      "Chhattisgarh": ["Select City *", "Raipur", "Bilaspur", "Durg", "Bhilai", "Korba"],
      "Odisha": ["Select City *", "Bhubaneswar", "Cuttack", "Rourkela", "Sambalpur", "Berhampur"],
      "Telangana": ["Select City *", "Hyderabad", "Warangal", "Karimnagar", "Nizamabad", "Khammam"],
      "Andhra Pradesh": ["Select City *", "Visakhapatnam", "Vijayawada", "Guntur", "Tirupati", "Nellore", "Kurnool"],
      "Kerala": ["Select City *", "Kochi", "Trivandrum", "Kozhikode", "Thrissur", "Kollam"],
      "Uttarakhand": ["Select City *", "Dehradun", "Haridwar", "Roorkee", "Haldwani", "Nainital"],
      "Himachal Pradesh": ["Select City *", "Shimla", "Solan", "Dharamshala", "Mandi", "Kullu"],
      "Assam": ["Select City *", "Guwahati", "Silchar", "Dibrugarh", "Jorhat", "Tezpur"]
    };

    return cityMap[state] || ["Select City *"];
  };

  const programs = [
    "Select Program *",
    "UG - Undergraduate",
    "PG - Postgraduate",
    "Diploma",
    "Certificate",
    "PhD"
  ];

  const courses = [
    "Select Course *",
    "Engineering",
    "MBA",
    "Medical",
    "Law",
    "Computer Science",
    "Commerce",
    "Arts",
    "Science"
  ];

  // Handle redirect countdown
  useEffect(() => {
    if (showSuccess && redirectCountdown > 0) {
      const timer = setTimeout(() => {
        setRedirectCountdown(redirectCountdown - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (showSuccess && redirectCountdown === 0) {
      redirectToColleges();
    }
  }, [showSuccess, redirectCountdown]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    const newFormData = {
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    };
    
    // If state changes, reset city
    if (name === "state" && value !== formData.state) {
      newFormData.city = "";
    }
    
    setFormData(newFormData);
    
    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ""
      }));
    }
    
    // Clear auth error
    if (error) {
      clearError();
    }
  };

  const handleOtpChange = (e) => {
    setOtp(e.target.value);
    if (error) {
      clearError();
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) newErrors.name = "Name is required";
    if (!formData.email.trim()) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = "Email is invalid";
    
    if (!formData.phone.trim()) newErrors.phone = "Phone number is required";
    else if (!/^\d{10}$/.test(formData.phone)) newErrors.phone = "Phone must be 10 digits";
    
    if (!formData.state || formData.state === "Select State *") newErrors.state = "State is required";
    if (!formData.city || formData.city === "Select City *") newErrors.city = "City is required";
    if (!formData.program || formData.program === "Select Program *") newErrors.program = "Program is required";
    if (!formData.course || formData.course === "Select Course *") newErrors.course = "Course is required";
    
    if (!formData.agreeToTerms) newErrors.agreeToTerms = "You must agree to the terms";
    
    return newErrors;
  };

  // Save user preferences to backend
  const saveUserPreferences = async () => {
    try {
      const token = localStorage.getItem("userToken");
      const preferencesData = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        state: formData.state,
        city: formData.city,
        levelOfEducation: formData.program,
        coursePreferred: formData.course,
        citiesPreferred: formData.city
      };

      console.log("Saving preferences:", preferencesData);

      const response = await fetch("https://www.collegeforms.in/api/user/preferences", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token && { "Authorization": `Bearer ${token}` })
        },
        body: JSON.stringify(preferencesData)
      });

      if (response.ok) {
        console.log("Preferences saved successfully");
        return true;
      } else {
        console.log("Failed to save preferences, but continuing...");
        return true;
      }
    } catch (saveError) {
      console.log("Could not save preferences, but continuing...", saveError);
      return true;
    }
  };

  // Build college search URL
  const buildCollegeSearchUrl = () => {
    const level = formData.program.split(' - ')[0] || formData.program;
    
    const params = new URLSearchParams({
      course: formData.course || '',
      specialization: '',
      currentCity: '',
      preferredCity: formData.city || '',
      exam: '',
      level: level || '',
      mode: '',
      fees: '',
      payment: ''
    });

    return `/colleges?${params.toString()}`;
  };

  const redirectToColleges = () => {
    const collegeSearchUrl = buildCollegeSearchUrl();
    console.log("Redirecting to:", collegeSearchUrl);
    
    // Reset everything
    setFormData({
      name: "",
      email: "",
      phone: "",
      state: "",
      city: "",
      program: "",
      course: "",
      agreeToTerms: false
    });
    setErrors({});
    setShowOtpInput(false);
    setShowSuccess(false);
    setRedirectCountdown(5);
    setOtp("");
    setIsProcessing(false);
    resetOtpState();
    clearError();
    
    // Navigate to colleges page
    navigate(collegeSearchUrl);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (showOtpInput) {
      // If OTP input is showing, verify OTP
      await handleVerifyOtp();
      return;
    }
    
    // Otherwise, validate and send OTP
    setIsProcessing(true);
    setErrors({});
    
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      setIsProcessing(false);
      return;
    }
    
    try {
      clearError();
      
      // Check if user is already authenticated
      const userToken = localStorage.getItem("userToken");
      const userInfo = localStorage.getItem("userInfo");
      
      if (userToken && userInfo) {
        // User is authenticated, save preferences and redirect
        await saveUserPreferences();
        setShowSuccess(true);
      } else {
        // New user - send OTP
        const otpData = {
          name: formData.name,
          phone: formData.phone,
          email: formData.email
        };
        
        console.log("Sending OTP with data:", otpData);
        
        const result = await sendSignupOtp(otpData);
        
        if (result.success) {
          setShowOtpInput(true);
          setOtpSentTime(Date.now());
        }
      }
    } catch (err) {
      console.error("Error in form submission:", err);
      setErrors(prev => ({ ...prev, general: "Something went wrong. Please try again." }));
    } finally {
      setIsProcessing(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (!otp) {
      setErrors(prev => ({ ...prev, otp: "OTP is required" }));
      return;
    }
    
    if (otp.length !== 6) {
      setErrors(prev => ({ ...prev, otp: "Please enter a valid 6-digit OTP" }));
      return;
    }
    
    setIsProcessing(true);
    
    try {
      clearError();
      
      console.log("Verifying OTP:", otp, "for phone:", formData.phone);
      
      // Pass only OTP (same as ApplyNowModal)
      const result = await verifySignupOtp(otp);
      
      if (result.success) {
        // Save preferences
        await saveUserPreferences();
        
        // Show success message
        setShowSuccess(true);
        setShowOtpInput(false);
        setOtp("");
      }
    } catch (err) {
      console.error("Error verifying OTP:", err);
      setErrors(prev => ({ ...prev, otp: "Failed to verify OTP. Please try again." }));
    } finally {
      setIsProcessing(false);
    }
  };

  const handleResendOtp = async () => {
    try {
      clearError();
      setIsProcessing(true);
      
      const otpData = {
        name: formData.name,
        phone: formData.phone,
        email: formData.email
      };
      
      const result = await sendSignupOtp(otpData);
      if (result.success) {
        console.log("OTP resent successfully");
        setOtpSentTime(Date.now());
      }
    } catch (err) {
      console.error("Error resending OTP:", err);
    } finally {
      setIsProcessing(false);
    }
  };

  const goBackToForm = () => {
    setShowOtpInput(false);
    setOtp("");
    clearError();
    resetOtpState();
    setIsProcessing(false);
    setErrors(prev => ({ ...prev, otp: "" }));
  };

  const features = [
    "Profile Based College & University Shortlisting",
    "One Form, Multiple College Applications",
    "Free Application for Exclusive Colleges",
    "24×7 Online Admission Support",
    "Expert Career Counseling",
    "Scholarship Assistance"
  ];

  // Success Message Component
  const SuccessMessage = () => (
    <Box sx={{ 
      backgroundColor: '#f0f9ff', 
      p: 3, 
      borderRadius: 2, 
      mb: 3,
      textAlign: 'center',
      border: '1px solid #bae6fd'
    }}>
      <CheckCircleIcon sx={{ fontSize: 40, color: "#4CAF50", mb: 1 }} />
      <Typography variant="h6" fontWeight={700} color="#4CAF50" gutterBottom>
        {user ? "Searching Colleges..." : "Thank You for Registering!"}
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        {user 
          ? "We're finding colleges that match your preferences..." 
          : "Your account has been created successfully and your preferences have been saved."
        }
      </Typography>

      <Typography variant="body2" color="text.secondary" sx={{ mb: 2, textAlign: 'left' }}>
        <strong>Course:</strong> {formData.course}<br />
        <strong>Level:</strong> {formData.program}<br />
        <strong>Location:</strong> {formData.city}<br />
        <strong>State:</strong> {formData.state}
      </Typography>

      <Typography variant="caption" color="text.secondary" sx={{ mb: 2, display: "block" }}>
        Redirecting in {redirectCountdown} second{redirectCountdown !== 1 ? 's' : ''}...
      </Typography>

      <Button
        onClick={redirectToColleges}
        sx={{
          color: "#2d6cdf",
          fontWeight: 600,
          textTransform: "none",
          fontSize: "0.9rem"
        }}
      >
        Click here to redirect immediately
      </Button>
    </Box>
  );

  return (
    <>
      <Navbar/>
      
      <div className="universal-form-wrapper">
        <div className="universal-form-container">
          
          {/* LEFT CONTENT SECTION */}
          <div className="universal-form-left">
            <h1 className="universal-form-title">
              Register <span className="universal-form-highlight">at just ₹99/- Only!</span>
            </h1>
            <h3 className="universal-form-subtitle">
              Unlock Exclusive CollegeForms Benefits
            </h3>

            <div className="universal-form-offer">
              <h2 className="universal-form-offer-title" style={{ color: '#ff6a00' }}>
                Up to <span>100% Discount</span>
              </h2>
              <p className="universal-form-offer-text">on College Application Forms</p>
            </div>

            <ul className="universal-form-features">
              {features.map((feature, index) => (
                <li key={index} className="universal-form-feature-item">
                  <span className="universal-form-feature-icon">✓</span>
                  {feature}
                </li>
              ))}
            </ul>
          </div>

          {/* RIGHT FORM SECTION */}
          <div className="universal-form-right">
            <h3 className="universal-form-section-title">Admissions Open 2026 - 2027</h3>

            {showSuccess ? (
              <SuccessMessage />
            ) : (
              <>
                {error && !showOtpInput && (
                  <Alert 
                    severity="error" 
                    sx={{ mb: 2 }}
                    onClose={clearError}
                  >
                    {error}
                  </Alert>
                )}

                {errors.general && (
                  <Alert 
                    severity="error" 
                    sx={{ mb: 2 }}
                    onClose={() => setErrors(prev => ({ ...prev, general: "" }))}
                  >
                    {errors.general}
                  </Alert>
                )}

                <form className="universal-form" onSubmit={handleSubmit}>
                  {!showOtpInput ? (
                    // MAIN FORM FIELDS
                    <>
                      <div>
                        <input
                          type="text"
                          name="name"
                          placeholder="Enter Name *"
                          className="universal-form-input"
                          value={formData.name}
                          onChange={handleChange}
                          disabled={isProcessing || loading}
                        />
                        {errors.name && <span style={{ color: '#ff6a00', fontSize: '14px', display: 'block', marginTop: '5px' }}>{errors.name}</span>}
                      </div>

                      <div>
                        <input
                          type="email"
                          name="email"
                          placeholder="Enter Email Address *"
                          className="universal-form-input"
                          value={formData.email}
                          onChange={handleChange}
                          disabled={isProcessing || loading}
                        />
                        {errors.email && <span style={{ color: '#ff6a00', fontSize: '14px', display: 'block', marginTop: '5px' }}>{errors.email}</span>}
                      </div>

                      <div>
                        <div className="universal-form-phone-wrapper">
                          <span className="universal-form-phone-prefix">+91</span>
                          <input
                            type="tel"
                            name="phone"
                            placeholder="Enter Mobile Number *"
                            className="universal-form-input"
                            value={formData.phone}
                            onChange={handleChange}
                            maxLength="10"
                            disabled={isProcessing || loading}
                          />
                        </div>
                        {errors.phone && <span style={{ color: '#ff6a00', fontSize: '14px', display: 'block', marginTop: '5px' }}>{errors.phone}</span>}
                      </div>

                      <div className="universal-form-grid">
                        <div>
                          <select
                            name="state"
                            className="universal-form-select"
                            value={formData.state}
                            onChange={handleChange}
                            disabled={isProcessing || loading}
                          >
                            {states.map((state, index) => (
                              <option key={index} value={state}>
                                {state}
                              </option>
                            ))}
                          </select>
                          {errors.state && <span style={{ color: '#ff6a00', fontSize: '12px', display: 'block', marginTop: '5px' }}>{errors.state}</span>}
                        </div>

                        <div>
                          <select
                            name="city"
                            className="universal-form-select"
                            value={formData.city}
                            onChange={handleChange}
                            disabled={isProcessing || loading || !formData.state || formData.state === "Select State *"}
                          >
                            {getCitiesByState(formData.state).map((city, index) => (
                              <option key={index} value={city}>
                                {city}
                              </option>
                            ))}
                          </select>
                          {errors.city && <span style={{ color: '#ff6a00', fontSize: '12px', display: 'block', marginTop: '5px' }}>{errors.city}</span>}
                        </div>
                      </div>

                      <div className="universal-form-grid">
                        <div>
                          <select
                            name="program"
                            className="universal-form-select"
                            value={formData.program}
                            onChange={handleChange}
                            disabled={isProcessing || loading}
                          >
                            {programs.map((program, index) => (
                              <option key={index} value={program}>
                                {program}
                              </option>
                            ))}
                          </select>
                          {errors.program && <span style={{ color: '#ff6a00', fontSize: '12px', display: 'block', marginTop: '5px' }}>{errors.program}</span>}
                        </div>

                        <div>
                          <select
                            name="course"
                            className="universal-form-select"
                            value={formData.course}
                            onChange={handleChange}
                            disabled={isProcessing || loading}
                          >
                            {courses.map((course, index) => (
                              <option key={index} value={course}>
                                {course}
                              </option>
                            ))}
                          </select>
                          {errors.course && <span style={{ color: '#ff6a00', fontSize: '12px', display: 'block', marginTop: '5px' }}>{errors.course}</span>}
                        </div>
                      </div>

                      <div className="universal-form-checkbox-wrapper">
                        <input
                          type="checkbox"
                          id="agreeToTerms"
                          name="agreeToTerms"
                          className="universal-form-checkbox"
                          checked={formData.agreeToTerms}
                          onChange={handleChange}
                          disabled={isProcessing || loading}
                        />
                        <label htmlFor="agreeToTerms" className="universal-form-checkbox-label">
                          I agree to receive information regarding my submitted application and accept the 
                          <a href="/terms" target="_blank" rel="noopener noreferrer"> Terms & Conditions</a>.
                        </label>
                      </div>
                      {errors.agreeToTerms && <span style={{ color: '#ff6a00', fontSize: '14px', display: 'block', marginTop: '-10px', marginBottom: '10px' }}>{errors.agreeToTerms}</span>}
                    </>
                  ) : (
                    // OTP INPUT FIELD
                    <>
                      <div style={{ marginBottom: '20px' }}>
                        <Typography variant="body2" color="text.light" sx={{ mb: 2 }}>
                          We've sent a 6-digit OTP to <strong>{formData.phone}</strong>. 
                          Please check your phone and enter the code below.
                        </Typography>
                        
                        {error && (
                          <Alert 
                            severity="error" 
                            sx={{ mb: 2 }}
                            onClose={clearError}
                          >
                            {error}
                          </Alert>
                        )}
                        
                        {errors.otp && (
                          <Alert severity="error" sx={{ mb: 2 }}>
                            {errors.otp}
                          </Alert>
                        )}
                        
                        <input
                          type="text"
                          name="otp"
                          placeholder="Enter 6-digit OTP *"
                          className="universal-form-input"
                          value={otp}
                          onChange={handleOtpChange}
                          disabled={isProcessing}
                          maxLength="6"
                          style={{ fontSize: '18px', textAlign: 'center', letterSpacing: '8px' }}
                        />
                      </div>
                      
                      <div style={{ textAlign: 'center', marginBottom: '15px' }}>
                        <Typography variant="body2" color="text.light" sx={{ mb: 1 }}>
                          Didn't receive the OTP?
                        </Typography>
                        <Button
                          onClick={handleResendOtp}
                          disabled={isProcessing}
                          sx={{
                            color: "#2d6cdf",
                            textTransform: "none",
                            fontWeight: 600,
                            fontSize: "0.9rem"
                          }}
                        >
                          Resend OTP
                        </Button>
                      </div>
                      
                      <Button
                        onClick={goBackToForm}
                        disabled={isProcessing}
                        sx={{
                          color: "text.light",
                          textTransform: "none",
                          fontSize: "0.9rem",
                          width: '100%',
                          marginBottom: '15px'
                        }}
                      >
                        Back to form
                      </Button>
                    </>
                  )}

                  <button 
                    type="submit" 
                    className="universal-form-submit-button"
                    disabled={isProcessing || loading}
                  >
                    {isProcessing || loading ? (
                      <>
                        <CircularProgress size={20} sx={{ color: "white", mr: 1, verticalAlign: 'middle' }} />
                        {showOtpInput ? "Verifying..." : "Processing..."}
                      </>
                    ) : (
                      showOtpInput ? "VERIFY OTP & GET COLLEGES" : "Register Now"
                    )}
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      </div>

      <br />
      <br />
      <CategorySection/>
      <EducationBlocks/>
      <Commonform/>
      <PersonalisedSection/>

      <Footer/>
    </>
  );
};

export default UniversalForm;