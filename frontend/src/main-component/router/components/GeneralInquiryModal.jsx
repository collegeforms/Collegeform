import React, { useState } from "react";
import {
  Modal,
  Box,
  Typography,
  TextField,
  Button,
  IconButton,
  Alert,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import PersonIcon from "@mui/icons-material/Person";
import EmailIcon from "@mui/icons-material/Email";
import PhoneIcon from "@mui/icons-material/Phone";
import MessageIcon from "@mui/icons-material/Message";

const GeneralInquiryModal = ({ open, handleClose }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: ""
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    setSuccess("");

    // Basic validation
    if (!formData.name || !formData.email || !formData.phone) {
      setError("Please fill in all required fields");
      setIsLoading(false);
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError("Please enter a valid email address");
      setIsLoading(false);
      return;
    }

    // Phone validation
    const phoneRegex = /^[6-9]\d{9}$/;
    if (!phoneRegex.test(formData.phone)) {
      setError("Please enter a valid 10-digit phone number");
      setIsLoading(false);
      return;
    }

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setSuccess("Thank you for your inquiry! We'll get back to you soon.");
      setFormData({ name: "", email: "", phone: "", message: "" });
      
      setTimeout(() => {
        handleClose();
      }, 2000);
    } catch (err) {
      setError("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCloseModal = () => {
    setFormData({ name: "", email: "", phone: "", message: "" });
    setError("");
    setSuccess("");
    handleClose();
  };

  return (
    <Modal
      open={open}
      onClose={handleCloseModal}
      aria-labelledby="general-inquiry-modal"
      sx={{
        backdropFilter: "blur(8px)",
        backgroundColor: "rgba(0, 0, 0, 0.5)",
      }}
    >
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: { xs: "90%", sm: 500 },
          maxWidth: 500,
          bgcolor: "background.paper",
          boxShadow: 24,
          borderRadius: 2,
          overflow: "hidden",
        }}
      >
        {/* Header */}
        <Box
          sx={{
            p: 3,
            bgcolor: "#2d6cdf",
            color: "white",
            position: "relative",
          }}
        >
          <IconButton
            onClick={handleCloseModal}
            sx={{
              position: "absolute",
              top: 8,
              right: 8,
              color: "white",
            }}
          >
            <CloseIcon />
          </IconButton>
          
          <Typography variant="h5" fontWeight={600} gutterBottom>
            General Inquiry
          </Typography>
          <Typography variant="body2" sx={{ opacity: 0.9 }}>
            Have questions? We're here to help!
          </Typography>
        </Box>

        {/* Form Content */}
        <Box sx={{ p: 3 }}>
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}
          
          {success && (
            <Alert severity="success" sx={{ mb: 2 }}>
              {success}
            </Alert>
          )}

          <form onSubmit={handleSubmit}>
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
                startAdornment: <PersonIcon sx={{ color: "gray", mr: 1 }} />,
              }}
              sx={{ mb: 2 }}
            />

            <TextField
              fullWidth
              size="small"
              variant="outlined"
              label="Email Address *"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              required
              disabled={isLoading}
              InputProps={{
                startAdornment: <EmailIcon sx={{ color: "gray", mr: 1 }} />,
              }}
              sx={{ mb: 2 }}
            />

            <TextField
              fullWidth
              size="small"
              variant="outlined"
              label="Phone Number *"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              required
              disabled={isLoading}
              InputProps={{
                startAdornment: <PhoneIcon sx={{ color: "gray", mr: 1 }} />,
              }}
              placeholder="10-digit mobile number"
              sx={{ mb: 2 }}
            />

            <TextField
              fullWidth
              multiline
              rows={3}
              size="small"
              variant="outlined"
              label="Your Message"
              name="message"
              value={formData.message}
              onChange={handleChange}
              disabled={isLoading}
              InputProps={{
                startAdornment: <MessageIcon sx={{ color: "gray", mr: 1, mt: 2 }} />,
              }}
              placeholder="Tell us how we can help you..."
              sx={{ mb: 3 }}
            />

            <Button
              type="submit"
              variant="contained"
              fullWidth
              disabled={isLoading}
              sx={{
                backgroundColor: "#2d6cdf",
                "&:hover": { backgroundColor: "#255bb5" },
                padding: "10px 0",
                fontWeight: 600,
                textTransform: "none",
                borderRadius: "6px",
              }}
            >
              {isLoading ? "Sending..." : "Submit Inquiry"}
            </Button>
          </form>

          <Typography variant="caption" color="text.secondary" display="block" sx={{ mt: 2, textAlign: "center" }}>
            We'll respond within 24 hours
          </Typography>
        </Box>
      </Box>
    </Modal>
  );
};

export default GeneralInquiryModal;