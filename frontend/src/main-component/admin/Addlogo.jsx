import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  IconButton,
  Typography,
  Grid,
  Card,
  CardMedia,
  CardActions,
  Snackbar,
  Alert,
} from "@mui/material";
import { Delete, CloudUpload } from "@mui/icons-material";
import axios from "axios";

const AddLogo = () => {
  const [logos, setLogos] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");

  useEffect(() => {
    fetchLogos();
  }, []);

  // Fetch logos from the API
  const fetchLogos = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/logos");
      setLogos(response.data); // Assuming the response is an array of logo objects
    } catch (error) {
      showSnackbar("Error fetching logos.", "error");
    }
  };

  // Handle file selection
  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  // Upload logo
  const handleUpload = async () => {
    if (!selectedFile) return showSnackbar("Please select a file!", "warning");

    const formData = new FormData();
    formData.append("image", selectedFile);

    try {
      const response = await axios.post("http://localhost:5000/api/logos", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setLogos([...logos, response.data]); // Add new logo to the state
      setSelectedFile(null); // Reset file input
      showSnackbar("Logo uploaded successfully!", "success");
    } catch (error) {
      showSnackbar("Failed to upload logo. Try again.", "error");
    }
  };

  // Delete logo
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this logo?")) return;

    try {
      await axios.delete(`http://localhost:5000/api/logos/${id}`);
      setLogos(logos.filter((logo) => logo._id !== id)); // Remove deleted logo from UI
      showSnackbar("Logo deleted successfully!", "success");
    } catch (error) {
      showSnackbar("Failed to delete logo.", "error");
    }
  };

  // Function to show Snackbar
  const showSnackbar = (message, severity) => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setSnackbarOpen(true);
  };

  // Close Snackbar
  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  return (
    <Box sx={{ padding: "20px" }}>
      <Typography variant="h5" sx={{ marginBottom: "10px" }}>
        Manage Logos
      </Typography>

      {/* Upload Section */}
      <Box display="flex" alignItems="center" gap={2} marginBottom={2}>
        <input type="file" onChange={handleFileChange} accept="image/*" />
        <Button
          variant="contained"
          startIcon={<CloudUpload />}
          onClick={handleUpload}
          disabled={!selectedFile}
        >
          Upload Logo
        </Button>
      </Box>

      {/* Display Logos */}
      <Grid container spacing={2}>
        {logos.map((logo) => (
          <Grid item xs={12} sm={6} md={3} key={logo._id}>
            <Card sx={{ position: "relative", boxShadow: 3 }}>
              <CardMedia
                component="img"
                height="150"
                style={{ objectFit: "contain" }}
                image={`http://localhost:5000${logo.image}`} // Adjust API path
                alt="Logo"
              />
              <CardActions sx={{ position: "absolute", top: 5, right: 5 }}>
                <IconButton color="error" onClick={() => handleDelete(logo._id)}>
                  <Delete />
                </IconButton>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Snackbar for Alerts */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
      >
        <Alert onClose={handleSnackbarClose} severity={snackbarSeverity} sx={{ width: "100%" }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default AddLogo;
