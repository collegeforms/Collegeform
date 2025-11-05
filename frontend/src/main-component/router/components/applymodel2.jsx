import React, { useState, useContext } from "react";
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
import AuthContext from "../context/AuthContext";
import logo from "./college-logo-2.png";
import indiaMap from "./india-map.avif";

const ApplyNowModal = ({ open, handleClose, collegeName, collegeLocation }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [showThankYou, setShowThankYou] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);

  const {
    sendOtp,
    verifyOtp,
    resendOtp,
    loading,
    error,
    clearError,
    resetOtpState,
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

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleOtpChange = (e) => {
    setOtp(e.target.value);
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleSendOtp = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    clearError();

    // Basic validation
    if (!formData.email || !formData.name || !formData.phone || !formData.password) {
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
      // Show thank you message
      setShowThankYou(true);
      
      // Wait for 3 seconds then close the modal
      setTimeout(() => {
        setShowThankYou(false);
        setOtpSent(false);
        setOtp("");
        handleClose();
        
        // Reset form data
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
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="80"
          height="80"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#4CAF50"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="12" cy="12" r="10" />
          <path d="M9 12l2 2 4-4" />
        </svg>
      </Box>
      <Typography variant="h5" fontWeight={700} color="#4CAF50" gutterBottom>
        Thank you!
      </Typography>
      <Typography variant="body1" color="text.secondary">
        Your submission has been sent.
      </Typography>
    </Box>
  );

  return (
    <Modal
      open={open}
      onClose={handleClose}
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
            onClick={handleClose}
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
              <Typography variant="h6" fontWeight={700} color="#002147" gutterBottom>
                {otpSent ? "Verify Your Email" : "Register Now To Apply"}
              </Typography>
              <Typography variant="body2" color="text.secondary" mb={3}>
                {otpSent ? "Enter the OTP sent to your email" : "Get details and latest updates"}
              </Typography>

              {error && (
                <Typography variant="body2" color="error" sx={{ mb: 2 }}>
                  {error}
                </Typography>
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
                        disabled={isLoading}
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <PersonIcon sx={{ color: "gray" }} />
                            </InputAdornment>
                          ),
                        }}
                        sx={{ borderRadius: "8px" }}
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
                        disabled={isLoading}
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
                        disabled={isLoading}
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
                    By submitting this form you accept and agree to our{" "}
                    <span style={{ color: "#002147", fontWeight: 600 }}>Terms Of Use.</span>
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
                      "SEND OTP"
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