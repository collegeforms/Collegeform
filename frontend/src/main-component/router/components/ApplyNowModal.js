import React, { useState, useContext, useEffect } from "react";
import {
  Modal,
  Box,
  Typography,
  TextField,
  Button,
  Grid,
  IconButton,
  CircularProgress,
  InputAdornment,
  Alert,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import PersonIcon from "@mui/icons-material/Person";
import EmailIcon from "@mui/icons-material/Email";
import PhoneIcon from "@mui/icons-material/Phone";
import LocationCityIcon from "@mui/icons-material/LocationCity";
import SchoolIcon from "@mui/icons-material/School";
import LockIcon from "@mui/icons-material/Lock";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { useAuth } from "../context/AuthContext"; // Use useAuth hook instead
import logo from "./college-logo-2.png";
import indiaMap from "./india-map.avif";
import { Link, useNavigate } from "react-router-dom";

const ApplyNowModal = ({ open, handleClose, collegeName, collegeLocation }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [showThankYou, setShowThankYou] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [redirectCountdown, setRedirectCountdown] = useState(1);
  const [formError, setFormError] = useState(""); // Local error state
  const navigate = useNavigate();

  // Use the useAuth hook to get auth context
  const {
    sendSignupOtp,
    verifySignupOtp,
    resendOtp,
    loading,
    error: authError, // Rename to avoid conflict
    clearError,
    resetOtpState,
    user,
  } = useAuth();

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    levelOfEducation: "",
    coursePreferred: "",
    citiesPreferred: "",
    collegeName: collegeName || "Multiple Colleges",
    location: collegeLocation || "Multiple Locations",
  });

  // Education levels
  const educationLevels = [
    "UG - Undergraduate",
    "PG - Postgraduate",
  ];

  // Check authentication status on mount and when modal opens
  useEffect(() => {
    const userToken = localStorage.getItem("userToken");
    const userInfo = localStorage.getItem("userInfo");
    
    if (userToken && userInfo) {
      setIsAuthenticated(true);
      try {
        const userData = JSON.parse(userInfo);
        setFormData(prev => ({
          ...prev,
          name: userData.name || "",
          email: userData.email || "",
          phone: userData.phone || "",
          levelOfEducation: userData.levelOfEducation || "",
          coursePreferred: userData.coursePreferred || "",
          citiesPreferred: userData.citiesPreferred || "",
        }));
      } catch (e) {
        console.error("Error parsing user info:", e);
      }
    } else {
      setIsAuthenticated(false);
    }
    
    // Clear any existing errors when modal opens
    setFormError("");
  }, [open]);

  // Handle countdown and auto-redirect
  useEffect(() => {
    if (showThankYou && redirectCountdown > 0) {
      const timer = setTimeout(() => {
        setRedirectCountdown(redirectCountdown - 1);
      }, 1000);

      return () => clearTimeout(timer);
    } else if (showThankYou && redirectCountdown === 0) {
      redirectToCollegesPage();
    }
  }, [showThankYou, redirectCountdown]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    // Clear error when user starts typing
    if (formError) {
      setFormError("");
    }
  };

  const handleOtpChange = (e) => {
    setOtp(e.target.value);
    // Clear error when user starts typing
    if (formError) {
      setFormError("");
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  // Build college search URL with user preferences
  const buildCollegeSearchUrl = () => {
    // Extract level from education level (e.g., "UG - Undergraduate" -> "UG")
    const level = formData.levelOfEducation.split(' - ')[0] || formData.levelOfEducation;
    
    const params = new URLSearchParams({
      course: formData.coursePreferred || '',
      specialization: '',
      currentCity: '',
      preferredCity: formData.citiesPreferred || '',
      exam: '',
      level: level || '',
      mode: '',
      fees: '',
      payment: ''
    });

    return `/colleges?${params.toString()}`;
  };

  // Save user preferences
  const saveUserPreferences = async () => {
    try {
      const token = localStorage.getItem("userToken");
      const preferencesData = {
        levelOfEducation: formData.levelOfEducation,
        coursePreferred: formData.coursePreferred,
        citiesPreferred: formData.citiesPreferred,
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        collegeName: formData.collegeName,
        location: formData.location
      };

      console.log("Saving preferences:", preferencesData);

      // Try to save preferences to backend
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
      } else {
        console.log("Failed to save preferences, but continuing...");
      }
    } catch (saveError) {
      console.log("Could not save preferences, but continuing...", saveError);
    }
  };

  // Redirect to colleges page with search parameters
  const redirectToCollegesPage = () => {
    const collegeSearchUrl = buildCollegeSearchUrl();
    console.log("Redirecting to:", collegeSearchUrl);
    console.log("Form data being forwarded:", formData);
    
    // Close modal first
    handleCloseAndReset();
    
    // Then navigate to colleges page
    setTimeout(() => {
      navigate(collegeSearchUrl);
    }, 100);
  };

  // Handle direct search for authenticated users
  const handleDirectSearch = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setFormError("");
    clearError(); // Clear auth context error

    // Validation for search inputs only
    if (!formData.levelOfEducation || !formData.coursePreferred || !formData.citiesPreferred) {
      setFormError("Please fill all search fields");
      setIsLoading(false);
      return;
    }

    console.log("Direct search for authenticated user:", formData);
    
    // Save preferences and redirect immediately
    await saveUserPreferences();
    setShowThankYou(true);
    setRedirectCountdown(1);
    setIsLoading(false);
  };

  // Handle OTP sending for new users - FIXED VERSION
  const handleSendOtp = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setFormError("");
    clearError(); // Clear auth context error

    // Validation for all fields including personal info
    if (!formData.name || !formData.phone || !formData.levelOfEducation || !formData.coursePreferred || !formData.citiesPreferred) {
      setFormError("Please fill all required fields (name, phone, education level, course, and city)");
      setIsLoading(false);
      return;
    }

    // Validate phone number
    const phoneRegex = /^[6-9]\d{9}$/;
    if (!phoneRegex.test(formData.phone)) {
      setFormError("Please enter a valid 10-digit phone number starting with 6-9");
      setIsLoading(false);
      return;
    }

    // Validate email (only if provided)
    if (formData.email && formData.email.trim() !== '') {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        setFormError("Please enter a valid email address or leave it empty");
        setIsLoading(false);
        return;
      }
    }

    console.log("Sending OTP with form data:", formData);
    
    // Pass the entire formData object to sendSignupOtp
    const result = await sendSignupOtp(formData);
    setIsLoading(false);
    
    if (result.success) {
      setOtpSent(true);
    } else {
      // Use error from auth context if available
      if (authError) {
        setFormError(authError);
      } else if (result.error) {
        setFormError(result.error);
      }
    }
  };

  // Handle OTP verification for new users - FIXED VERSION
  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setFormError("");
    clearError(); // Clear auth context error

    if (!otp) {
      setFormError("Please enter OTP");
      setIsLoading(false);
      return;
    }

    if (otp.length !== 6) {
      setFormError("Please enter a valid 6-digit OTP");
      setIsLoading(false);
      return;
    }

    console.log("Verifying OTP:", otp, "for phone:", formData.phone);
    console.log("Form data to be saved:", formData);
    
    // Pass the OTP only to verifySignupOtp
    const result = await verifySignupOtp(otp);
    
    if (result.success) {
      console.log("OTP verified successfully, saving preferences");
      // Save user preferences
      await saveUserPreferences();
      setShowThankYou(true);
      setRedirectCountdown(1); // Start 1 second countdown
    } else {
      console.log("OTP verification failed");
      if (result.error) {
        setFormError(result.error);
      }
    }
    
    setIsLoading(false);
  };

  const handleResendOtp = async () => {
    setFormError("");
    clearError(); // Clear auth context error
    
    // Create a minimal object with just phone for resending
    const resendData = {
      phone: formData.phone,
      name: formData.name,
      email: formData.email
    };
    
    const result = await resendOtp();
    if (!result.success && result.error) {
      setFormError(result.error);
    }
  };

  const goBackToForm = () => {
    resetOtpState();
    setOtp("");
    setOtpSent(false);
    setFormError("");
    clearError(); // Clear auth context error
  };

  const handleCloseAndReset = () => {
    setShowThankYou(false);
    setOtpSent(false);
    setOtp("");
    setShowPassword(false);
    setRedirectCountdown(1);
    setFormError("");
    resetOtpState();
    clearError(); // Clear auth context error
    handleClose();
    
    // Reset form data but keep college info
    setFormData({
      name: "",
      phone: "",
      email: "",
      levelOfEducation: "",
      coursePreferred: "",
      citiesPreferred: "",
      collegeName: collegeName || "Multiple Colleges",
      location: collegeLocation || "Multiple Locations",
    });
  };

  const ThankYouMessage = () => (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100%",
        textAlign: "center",
        p: 2,
      }}
    >
      <Box sx={{ mb: 2 }}>
        <CheckCircleIcon sx={{ fontSize: 80, color: "#4CAF50" }} />
      </Box>
      <Typography variant="h5" fontWeight={700} color="#4CAF50" gutterBottom>
        {isAuthenticated ? "Searching Colleges..." : "Thank You for Registering!"}
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
        {isAuthenticated 
          ? "We're finding colleges that match your preferences..." 
          : "Your account has been created successfully and your preferences have been saved."
        }
      </Typography>

      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Redirecting you to colleges matching your preferences...
        <br />
        <br />
        <strong>Course:</strong> {formData.coursePreferred}
        <br />
        <strong>Level:</strong> {formData.levelOfEducation}
        <br />
        <strong>Location:</strong> {formData.citiesPreferred}
      </Typography>

      <Typography variant="caption" color="text.secondary">
        Redirecting in {redirectCountdown} second{redirectCountdown !== 1 ? 's' : ''}...
      </Typography>

      <Button
        onClick={redirectToCollegesPage}
        sx={{
          mt: 3,
          textTransform: "none",
          color: "#2d6cdf",
          fontWeight: 600,
        }}
      >
        Click here to redirect immediately
      </Button>
    </Box>
  );

  // Render search-only form for authenticated users
  const renderSearchForm = () => (
    <form onSubmit={handleDirectSearch}>
      <Grid container spacing={2}>
        {/* Level of Education */}
        <Grid item xs={12}>
          <FormControl fullWidth size="small">
            <InputLabel>Level of Education *</InputLabel>
            <Select
              name="levelOfEducation"
              value={formData.levelOfEducation}
              onChange={handleChange}
              label="Level of Education *"
              required
            >
              {educationLevels.map((level) => (
                <MenuItem key={level} value={level}>
                  {level}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>

        {/* Course Preferred - Text Input */}
        <Grid item xs={12}>
          <TextField
            fullWidth
            size="small"
            variant="outlined"
            label="Course Preferred *"
            name="coursePreferred"
            value={formData.coursePreferred}
            onChange={handleChange}
            required
            disabled={isLoading}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SchoolIcon sx={{ color: "gray" }} />
                </InputAdornment>
              ),
            }}
            placeholder="e.g., Engineering, MBA, Computer Science"
          />
        </Grid>

        {/* Cities Preferred - Text Input */}
        <Grid item xs={12}>
          <TextField
            fullWidth
            size="small"
            variant="outlined"
            label="Cities Preferred *"
            name="citiesPreferred"
            value={formData.citiesPreferred}
            onChange={handleChange}
            required
            disabled={isLoading}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <LocationCityIcon sx={{ color: "gray" }} />
                </InputAdornment>
              ),
            }}
            placeholder="e.g., Delhi, Mumbai, Bangalore"
          />
        </Grid>
      </Grid>

      <Button
        type="submit"
        variant="contained"
        fullWidth
        disabled={isLoading}
        sx={{
          mt: 3,
          backgroundColor: "#2d6cdf",
          "&:hover": { backgroundColor: "#255bb5" },
          padding: "10px 0",
          fontWeight: 600,
          fontSize: "0.9rem",
          textTransform: "none",
          borderRadius: "6px",
        }}
      >
        {isLoading ? (
          <>
            <CircularProgress size={20} sx={{ color: "white", mr: 1 }} />
            Searching Colleges...
          </>
        ) : (
          "SEARCH COLLEGES"
        )}
      </Button>
    </form>
  );

  // Render full signup form for new users
  const renderSignupForm = () => (
    !otpSent ? (
      <form onSubmit={handleSendOtp}>
        <Grid container spacing={2}>
          {/* Name */}
          <Grid item xs={12}>
            <TextField
              fullWidth
              size="small"
              variant="outlined"
              label="Full Name *"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              disabled={isLoading}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <PersonIcon sx={{ color: "gray" }} />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>

          {/* Phone */}
          <Grid item xs={12}>
            <TextField
              fullWidth
              size="small"
              variant="outlined"
              label="Mobile Number *"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              required
              disabled={isLoading}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <PhoneIcon sx={{ color: "gray" }} />
                  </InputAdornment>
                ),
              }}
              placeholder="10-digit mobile number starting with 6-9"
            />
          </Grid>

          {/* Email */}
          <Grid item xs={12}>
            <TextField
              fullWidth
              size="small"
              variant="outlined"
              label="Email Address (Optional)"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              disabled={isLoading}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <EmailIcon sx={{ color: "gray" }} />
                  </InputAdornment>
                ),
              }}
              placeholder="Optional - you can leave this empty"
            />
          </Grid>

          {/* Level of Education */}
          <Grid item xs={12}>
            <FormControl fullWidth size="small">
              <InputLabel>Level of Education *</InputLabel>
              <Select
                name="levelOfEducation"
                value={formData.levelOfEducation}
                onChange={handleChange}
                label="Level of Education *"
                required
              >
                {educationLevels.map((level) => (
                  <MenuItem key={level} value={level}>
                    {level}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          {/* Course Preferred - Text Input */}
          <Grid item xs={12}>
            <TextField
              fullWidth
              size="small"
              variant="outlined"
              label="Course Preferred *"
              name="coursePreferred"
              value={formData.coursePreferred}
              onChange={handleChange}
              required
              disabled={isLoading}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SchoolIcon sx={{ color: "gray" }} />
                  </InputAdornment>
                ),
              }}
              placeholder="e.g., Engineering, MBA, Computer Science"
            />
          </Grid>

          {/* Cities Preferred - Text Input */}
          <Grid item xs={12}>
            <TextField
              fullWidth
              size="small"
              variant="outlined"
              label="Cities Preferred *"
              name="citiesPreferred"
              value={formData.citiesPreferred}
              onChange={handleChange}
              required
              disabled={isLoading}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LocationCityIcon sx={{ color: "gray" }} />
                  </InputAdornment>
                ),
              }}
              placeholder="e.g., Delhi, Mumbai, Bangalore"
            />
          </Grid>
        </Grid>

        <Typography
          variant="caption"
          color="text.secondary"
          display="block"
          sx={{ mt: 2, mb: 1 }}
        >
          Already have an account? <Link to="/user/login" style={{ color: "#2d6cdf", textDecoration: "none" }}>Log in</Link>
        </Typography>

        <Button
          type="submit"
          variant="contained"
          fullWidth
          disabled={isLoading}
          sx={{
            mt: 1,
            backgroundColor: "#2d6cdf",
            "&:hover": { backgroundColor: "#255bb5" },
            padding: "10px 0",
            fontWeight: 600,
            fontSize: "0.9rem",
            textTransform: "none",
            borderRadius: "6px",
          }}
        >
          {isLoading ? (
            <>
              <CircularProgress size={20} sx={{ color: "white", mr: 1 }} />
              Sending OTP...
            </>
          ) : (
            "SEND OTP & FIND COLLEGES"
          )}
        </Button>
      </form>
    ) : (
      <form onSubmit={handleVerifyOtp}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              We've sent a 6-digit OTP to <strong>{formData.phone}</strong>. 
              Please check your phone and enter the code below.
            </Typography>
            <TextField
              fullWidth
              size="small"
              variant="outlined"
              label="Enter OTP *"
              name="otp"
              value={otp}
              onChange={handleOtpChange}
              required
              disabled={isLoading}
              inputProps={{ maxLength: 6 }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LockIcon sx={{ color: "gray" }} />
                  </InputAdornment>
                ),
              }}
              placeholder="6-digit OTP"
            />
          </Grid>
        </Grid>

        <Button
          type="submit"
          variant="contained"
          fullWidth
          disabled={isLoading}
          sx={{
            mt: 2,
            backgroundColor: "#2d6cdf",
            "&:hover": { backgroundColor: "#255bb5" },
            padding: "10px 0",
            fontWeight: 600,
            fontSize: "0.9rem",
            textTransform: "none",
            borderRadius: "6px",
          }}
        >
          {isLoading ? (
            <>
              <CircularProgress size={20} sx={{ color: "white", mr: 1 }} />
              Verifying...
            </>
          ) : (
            "VERIFY OTP & GET COLLEGES"
          )}
        </Button>

        <Box sx={{ mt: 2, textAlign: "center" }}>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
            Didn't receive the OTP?
          </Typography>
          <Button
            onClick={handleResendOtp}
            disabled={isLoading}
            sx={{
              color: "#2d6cdf",
              textTransform: "none",
              fontWeight: 600,
            }}
          >
            Resend OTP
          </Button>
        </Box>

        <Button
          onClick={goBackToForm}
          fullWidth
          sx={{
            mt: 1,
            textTransform: "none",
            color: "text.secondary",
          }}
        >
          Back to form
        </Button>
      </form>
    )
  );

  return (
    <Modal
      open={open}
      onClose={handleCloseAndReset}
      aria-labelledby="apply-now-modal"
      sx={{
        backdropFilter: "blur(12px)",
        backgroundColor: "rgba(0, 0, 0, 0.6)",
      }}
    >
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: { xs: "95%", sm: 900 },
          maxWidth: 900,
          maxHeight: "90vh",
          bgcolor: "#fff",
          boxShadow: 24,
          borderRadius: 2,
          overflow: "hidden",
          display: "flex",
          flexDirection: { xs: "column", sm: "row" },
        }}
      >
        {/* Left Side - Branding */}
        <Box
          sx={{
            flex: 1,
            p: 3,
            bgcolor: "#f9fafc",
            display: { xs: "none", sm: "flex" },
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            textAlign: "center",
          }}
        >
          <img 
            src={logo} 
            alt="College Forms Logo" 
            style={{ 
              width: "150px", 
              height: "auto",
              marginBottom: "20px" 
            }} 
          />
          <Typography variant="h6" fontWeight={600} color="#002147" gutterBottom>
            Find Your Perfect College & Career Path
          </Typography>
          <Typography variant="body2" color="text.secondary" mb={2}>
            Get Personalized College Recommendations & Shortlisting
          </Typography>
          <img
            src={indiaMap}
            alt="India Map"
            style={{ 
              width: "200px", 
              height: "auto",
              borderRadius: "8px", 
              marginBottom: "20px" 
            }}
          />
          <Typography variant="subtitle2" fontWeight={600} color="#002147">
            Your Guide to College Admissions
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Unlock Deadlines, Checklists, Documents List, and Expert Advice
          </Typography>
        </Box>

        {/* Right Side - Form Content */}
        <Box sx={{ 
          flex: 1.2, 
          p: 4, 
          position: "relative", 
          minHeight: 500, 
          overflow: "auto",
          display: "flex",
          flexDirection: "column"
        }}>
          <IconButton
            onClick={handleCloseAndReset}
            sx={{
              position: "absolute",
              top: 15,
              right: 15,
              color: "#002147",
            }}
          >
            <CloseIcon />
          </IconButton>

          {showThankYou ? (
            <ThankYouMessage />
          ) : (
            <>
              <Box sx={{ mb: 3 }}>
                <Typography variant="h6" fontWeight={700} color="#002147" gutterBottom>
                  {isAuthenticated 
                    ? "Find Your Perfect College" 
                    : otpSent ? "Verify Your Phone Number" : "Find Your Perfect College"
                  }
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {isAuthenticated 
                    ? "Tell us what you're looking for and we'll find the best colleges for you"
                    : otpSent 
                      ? `Enter the 6-digit OTP sent to ${formData.phone}` 
                      : "Tell us about your preferences to get personalized college recommendations"
                  }
                </Typography>
              </Box>

              {/* Show form errors */}
              {formError && (
                <Alert 
                  severity="error" 
                  sx={{ mb: 2 }}
                  onClose={() => setFormError("")}
                >
                  {formError}
                </Alert>
              )}

              {/* Show auth context errors */}
              {authError && (
                <Alert 
                  severity="error" 
                  sx={{ mb: 2 }}
                  onClose={clearError}
                >
                  {authError}
                </Alert>
              )}

              {isAuthenticated ? renderSearchForm() : renderSignupForm()}
            </>
          )}
        </Box>
      </Box>
    </Modal>
  );
};

export default ApplyNowModal;