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
import AuthContext from "../context/AuthContext";
import logo from "./college-logo-2.png";
import indiaMap from "./india-map.avif";
import { Link } from "react-router";

const ApplyNowModal = ({ open, handleClose, collegeName, collegeLocation }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [showThankYou, setShowThankYou] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const {
    sendOtp,
    verifyOtp,
    resendOtp,
    loading,
    error,
    clearError,
    resetOtpState,
    user,
  } = useContext(AuthContext);

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    city: "",
    course: "",
    password: "",
    collegeName,
    location: collegeLocation,
  });

  // Check authentication status and pre-fill user data
  useEffect(() => {
    if (user && user.info) {
      setIsAuthenticated(true);
      // Pre-fill form with user data
      setFormData(prev => ({
        ...prev,
        name: user.info.name || "",
        email: user.info.email || "",
        phone: user.info.phone || "",
        city: user.info.city || "",
        course: user.info.course || "",
      }));
    } else {
      setIsAuthenticated(false);
    }
  }, [user, open]); // Reset when modal opens

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleOtpChange = (e) => {
    setOtp(e.target.value);
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  // Handle direct application submission for authenticated users
  const handleDirectApplication = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    clearError();

    // Validation for authenticated users
    if (!formData.course || !formData.name || !formData.phone) {
      setIsLoading(false);
      return;
    }

    try {
      // Call your API to submit application directly
      const applicationData = {
        name: formData.name,
        phone: formData.phone,
        email: formData.email,
        city: formData.city,
        course: formData.course,
        collegeName: formData.collegeName,
        location: formData.location,
        userId: user?.info?.id, // Include user ID for authenticated users
      };

      // Replace this with your actual API call
      const response = await submitApplicationDirectly(applicationData);
      
      if (response.success) {
        setShowThankYou(true);
        setTimeout(() => {
          handleCloseAndReset();
        }, 3000);
      }
    } catch (err) {
      console.error("Error submitting application:", err);
    } finally {
      setIsLoading(false);
    }
  };

  // Mock function for direct application submission
  const submitApplicationDirectly = async (applicationData) => {
    // Replace this with your actual API call
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ success: true, message: "Application submitted successfully" });
      }, 1500);
    });
  };

  const handleSendOtp = async (e) => {
    e.preventDefault();
    
    // If user is authenticated, use direct submission
    if (isAuthenticated) {
      await handleDirectApplication(e);
      return;
    }

    // Original OTP flow for unauthenticated users
    setIsLoading(true);
    clearError();

    // Basic validation
    if (!formData.email || !formData.name || !formData.phone || !formData.password || !formData.city || !formData.course) {
      setIsLoading(false);
      return;
    }

    const result = await sendOtp(formData.email);
    setIsLoading(false);
    
    if (result.success) {
      setOtpSent(true);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    clearError();

    if (!otp) {
      setIsLoading(false);
      return;
    }

    const result = await verifyOtp(formData, otp);
    setIsLoading(false);
    
    if (result.success) {
      setShowThankYou(true);
      setTimeout(() => {
        handleCloseAndReset();
      }, 3000);
    }
  };

  const handleResendOtp = async () => {
    clearError();
    await resendOtp();
  };

  const goBackToForm = () => {
    resetOtpState();
    setOtp("");
    setOtpSent(false);
  };

  const handleCloseAndReset = () => {
    setShowThankYou(false);
    setOtpSent(false);
    setOtp("");
    setShowPassword(false);
    handleClose();
    
    // Reset form data but keep college info
    setFormData({
      name: "",
      phone: "",
      email: "",
      city: "",
      course: "",
      password: "",
      collegeName,
      location: collegeLocation,
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
      }}
    >
      <Box sx={{ mb: 2 }}>
        <CheckCircleIcon sx={{ fontSize: 80, color: "#4CAF50" }} />
      </Box>
      <Typography variant="h5" fontWeight={700} color="#4CAF50" gutterBottom>
        Thank you!
      </Typography>
      <Typography variant="body1" color="text.secondary">
        Your application has been submitted successfully.
      </Typography>
      {isAuthenticated && (
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
          You can track your application in your dashboard.
        </Typography>
      )}
      {!isAuthenticated && (
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
          Your account has been created and you are now logged in.
        </Typography>
      )}
    </Box>
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
          bgcolor: "#fff",
          boxShadow: 24,
          borderRadius: 2,
          overflow: "hidden",
          display: "flex",
          flexDirection: { xs: "column", sm: "row" },
        }}
      >
        {/* Left Side */}
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
          <img src={logo} alt="Logo" style={{ width: "150px", marginBottom: "20px" }} />
          <Typography variant="h6" fontWeight={600} color="#002147" gutterBottom>
            Find Your Perfect College & Career Path
          </Typography>
          <Typography variant="body2" color="text.secondary" mb={2}>
            Get Personalized College Recommendations & Shortlisting
          </Typography>
          <img
            src={indiaMap}
            alt="India Map"
            style={{ width: "200px", borderRadius: "8px", marginBottom: "20px" }}
          />
          <Typography variant="subtitle2" fontWeight={600}>
            Your Guide to College Admissions
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Unlock Deadlines, Checklists, Documents List, and Expert Advice
          </Typography>
        </Box>

        {/* Right Side (Form or Thank You Message) */}
        <Box sx={{ flex: 1.2, p: 4, position: "relative", minHeight: 500 }}>
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
              {isAuthenticated && (
                <Alert severity="info" sx={{ mb: 2 }}>
                  You're applying as {user?.info?.name}. Some fields are pre-filled.
                </Alert>
              )}

              <Typography variant="h6" fontWeight={700} color="#002147" gutterBottom>
                {otpSent ? "Verify Your Email" : "Apply to " + collegeName}
              </Typography>
              <Typography variant="body2" color="text.secondary" mb={3}>
                {otpSent 
                  ? "Enter the OTP sent to your email" 
                  : isAuthenticated 
                    ? "Complete your application details" 
                    : "Register now to apply"
                }
              </Typography>

              {error && (
                <Alert severity="error" sx={{ mb: 2 }}>
                  {error}
                </Alert>
              )}

              {!otpSent ? (
                <form onSubmit={handleSendOtp}>
                  <Grid container spacing={2}>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        size="small"
                        variant="outlined"
                        label="Full Name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        disabled={isLoading || isAuthenticated}
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <PersonIcon sx={{ color: "gray" }} />
                            </InputAdornment>
                          ),
                        }}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        size="small"
                        variant="outlined"
                        label="Email Address"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        disabled={isLoading || isAuthenticated}
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <EmailIcon sx={{ color: "gray" }} />
                            </InputAdornment>
                          ),
                        }}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        size="small"
                        variant="outlined"
                        label="Mobile Number"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        required
                        disabled={isLoading || isAuthenticated}
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <PhoneIcon sx={{ color: "gray" }} />
                            </InputAdornment>
                          ),
                        }}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        size="small"
                        variant="outlined"
                        label="City You Live In"
                        name="city"
                        value={formData.city}
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
                      />
                    </Grid>
                    
                    {/* Password field only for unauthenticated users */}
                    {!isAuthenticated && (
                      <Grid item xs={12}>
                        <TextField
                          fullWidth
                          size="small"
                          variant="outlined"
                          label="Password"
                          name="password"
                          type={showPassword ? "text" : "password"}
                          value={formData.password}
                          onChange={handleChange}
                          required
                          disabled={isLoading}
                          InputProps={{
                            startAdornment: (
                              <InputAdornment position="start">
                                <LockIcon sx={{ color: "gray" }} />
                              </InputAdornment>
                            ),
                            endAdornment: (
                              <InputAdornment position="end">
                                <IconButton
                                  onClick={togglePasswordVisibility}
                                  edge="end"
                                  size="small"
                                >
                                  {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                                </IconButton>
                              </InputAdornment>
                            ),
                          }}
                        />
                      </Grid>
                    )}
                    
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        size="small"
                        variant="outlined"
                        label="Course Interested In"
                        name="course"
                        value={formData.course}
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
                      />
                    </Grid>
                  </Grid>

                  <Typography
                    variant="caption"
                    color="text.secondary"
                    display="block"
                    sx={{ mt: 2, mb: 1 }}
                  >
                    Already have an account? <Link to={'/user/login'}>Log in</Link>
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
                        {isAuthenticated ? "Submitting..." : "Sending OTP..."}
                      </>
                    ) : (
                      isAuthenticated ? "SUBMIT APPLICATION" : "SEND OTP"
                    )}
                  </Button>
                </form>
              ) : (
                <form onSubmit={handleVerifyOtp}>
                  <Grid container spacing={2}>
                    <Grid item xs={12}>
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                        We've sent a 6-digit OTP to <strong>{formData.email}</strong>. 
                        Please check your email and enter the code below.
                      </Typography>
                      <TextField
                        fullWidth
                        size="small"
                        variant="outlined"
                        label="Enter OTP"
                        name="otp"
                        value={otp}
                        onChange={handleOtpChange}
                        required
                        disabled={isLoading}
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <LockIcon sx={{ color: "gray" }} />
                            </InputAdornment>
                          ),
                        }}
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
                      "VERIFY OTP"
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
              )}
            </>
          )}
        </Box>
      </Box>
    </Modal>
  );
};

export default ApplyNowModal;