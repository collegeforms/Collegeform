import React, { useState } from "react";
import { Modal, Box, Typography, TextField, Button, Grid, IconButton } from "@mui/material";
import CloseIcon from '@mui/icons-material/Close'; 
import axios from "axios";

const ApplyNowModal = ({ open, handleClose, collegeName, collegeLocation }) => {
  const [formData, setFormData] = useState({
    name: '',
    number: '',
    email: '',
    city: '',
    course: '',
    collegeName, 
    location: collegeLocation, 
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/api/applications', formData);
      console.log('Form Submitted:', response.data);
      handleClose();
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="apply-now-modal"
      sx={{
        backdropFilter: "blur(12px)", // Enhanced blur effect
        backgroundColor: "rgba(0, 0, 0, 0.6)", // Darker black background
        transition: "all 0.5s ease-in-out", // Smooth transition for modal
      }}
    >
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: { xs: "90%", sm: 650 }, // Make modal responsive
          maxWidth: 650,
          bgcolor: "#fff",
          boxShadow: 24,
          p: 4,
          borderRadius: 3,
          position: "relative",
          overflowY: "auto",
          animation: "fadeIn 1s ease-out", // Add fade-in animation for modal
        }}
      >
        <IconButton
          onClick={handleClose}
          sx={{
            position: "absolute",
            top: 12,
            right: 12,
            color: "#fff",
            backgroundColor: "#213567",
            '&:hover': { backgroundColor: "#1a2b3c" },
            boxShadow: 3,
          }}
        >
          <CloseIcon />
        </IconButton>

        <Typography
          id="apply-now-modal"
          variant="h5"
          component="h2"
          gutterBottom
          sx={{
            fontWeight: "bold",
            textAlign: "center",
            color: "#2E3B55",
            mb: 3,
            letterSpacing: 1.2,
            textTransform: "uppercase", // Adding uppercase for added impact
          }}
        >
          Apply for a Course at {collegeName}
        </Typography>

        <form onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            {/* Row 1: Name and Number */}
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Name"
                name="name"
                margin="normal"
                value={formData.name}
                onChange={handleChange}
                variant="outlined"
                required
                sx={{
                  "& .MuiOutlinedInput-root": {
                    "& fieldset": {
                      borderColor: "#2E3B55",
                    },
                    "&:hover fieldset": {
                      borderColor: "#213567", // Hover border color
                    },
                    "&.Mui-focused fieldset": {
                      borderColor: "#213567", // Focus border color
                    },
                  },
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Number"
                name="number"
                margin="normal"
                value={formData.number}
                onChange={handleChange}
                variant="outlined"
                required
                sx={{
                  "& .MuiOutlinedInput-root": {
                    "& fieldset": {
                      borderColor: "#2E3B55",
                    },
                    "&:hover fieldset": {
                      borderColor: "#213567",
                    },
                    "&.Mui-focused fieldset": {
                      borderColor: "#213567",
                    },
                  },
                }}
              />
            </Grid>

            {/* Row 2: Email and City */}
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Email"
                name="email"
                margin="normal"
                value={formData.email}
                onChange={handleChange}
                variant="outlined"
                type="email"
                required
                sx={{
                  "& .MuiOutlinedInput-root": {
                    "& fieldset": {
                      borderColor: "#2E3B55",
                    },
                    "&:hover fieldset": {
                      borderColor: "#213567",
                    },
                    "&.Mui-focused fieldset": {
                      borderColor: "#213567",
                    },
                  },
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="City"
                name="city"
                margin="normal"
                value={formData.city}
                onChange={handleChange}
                variant="outlined"
                required
                sx={{
                  "& .MuiOutlinedInput-root": {
                    "& fieldset": {
                      borderColor: "#2E3B55",
                    },
                    "&:hover fieldset": {
                      borderColor: "#213567",
                    },
                    "&.Mui-focused fieldset": {
                      borderColor: "#213567",
                    },
                  },
                }}
              />
            </Grid>

            {/* Row 3: Course */}
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Course"
                name="course"
                margin="normal"
                value={formData.course}
                onChange={handleChange}
                variant="outlined"
                required
                sx={{
                  "& .MuiOutlinedInput-root": {
                    "& fieldset": {
                      borderColor: "#2E3B55",
                    },
                    "&:hover fieldset": {
                      borderColor: "#213567",
                    },
                    "&.Mui-focused fieldset": {
                      borderColor: "#213567",
                    },
                  },
                }}
              />
            </Grid>
          </Grid>

          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            sx={{
              mt: 3,
              backgroundColor: "#213567",
              "&:hover": {
                backgroundColor: "#1a2b3c",
              },
              padding: "12px 0", // Adjusted padding for button
              fontWeight: "bold",
            }}
          >
            Submit Application
          </Button>
        </form>
      </Box>
    </Modal>
  );
};

export default ApplyNowModal;
