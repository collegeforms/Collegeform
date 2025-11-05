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
  TextField,
  Autocomplete,
  CardContent,
} from "@mui/material";
import { Delete, CloudUpload } from "@mui/icons-material";
import axios from "axios";

const AddLogo = () => {
 const API_URL = "https://collegeforms.in";
  
  const [logos, setLogos] = useState([]);
  const [colleges, setColleges] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [selectedCollege, setSelectedCollege] = useState(null);
  const [discount, setDiscount] = useState("");
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");

  useEffect(() => {
    fetchLogos();
    fetchColleges();
  }, []);

  const fetchLogos = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/logos`);
      setLogos(response.data);
    } catch (error) {
      showSnackbar("Error fetching logos.", "error");
    }
  };

  const fetchColleges = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/colleges`);
      setColleges(response.data);
    } catch (error) {
      showSnackbar("Error fetching colleges.", "error");
    }
  };

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleUpload = async () => {
    if (!selectedFile) return showSnackbar("Please select a file!", "warning");
    if (!selectedCollege) return showSnackbar("Please select a college!", "warning");

    const formData = new FormData();
    formData.append("image", selectedFile);
    formData.append("collegeId", selectedCollege._id);
    formData.append("discount", discount);

    try {
      const response = await axios.post(`${API_URL}/api/logos`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setLogos([...logos, response.data]);
      setSelectedFile(null);
      setSelectedCollege(null);
      setDiscount("");
      showSnackbar("Logo uploaded successfully!", "success");
    } catch (error) {
      showSnackbar("Failed to upload logo. Try again.", "error");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this logo?")) return;

    try {
      await axios.delete(`${API_URL}/api/logos/${id}`);
      setLogos(logos.filter((logo) => logo._id !== id));
      showSnackbar("Logo deleted successfully!", "success");
    } catch (error) {
      showSnackbar("Failed to delete logo.", "error");
    }
  };

  const showSnackbar = (message, severity) => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setSnackbarOpen(true);
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  return (
    <Box sx={{ padding: "20px" }}>
      <Typography variant="h5" sx={{ marginBottom: "10px" }}>
        Manage College Logos
      </Typography>

      {/* Upload Section */}
      <Box sx={{ display: "flex", flexDirection: "column", gap: 2, marginBottom: 2 }}>
        <Autocomplete
          options={colleges}
          getOptionLabel={(option) => option.name}
          value={selectedCollege}
          onChange={(event, newValue) => setSelectedCollege(newValue)}
          renderInput={(params) => (
            <TextField {...params} label="Search College" variant="outlined" />
          )}
        />

        <TextField
          label="Discount Offer"
          value={discount}
          onChange={(e) => setDiscount(e.target.value)}
          variant="outlined"
        />

     

        <Box display="flex" alignItems="center" gap={2}>
          <input type="file" onChange={handleFileChange} accept="image/*" />
          <Button
            variant="contained"
            startIcon={<CloudUpload />}
            onClick={handleUpload}
            disabled={!selectedFile || !selectedCollege}
          >
            Upload Logo
          </Button>
        </Box>
      </Box>

      {/* Display Logos */}
      <Grid container spacing={2}>
        {logos.map((logo) => (
          <Grid item xs={12} sm={6} md={4} key={logo._id}>
            <Card sx={{ boxShadow: 3 }}>
              <CardMedia
                component="img"
                height="200"
                style={{ objectFit: "contain" }}
                image={logo.image}
                alt="Logo"
              />
              <CardContent>
                <Typography variant="h6">{logo.collegeName}</Typography>
                {logo.discount && (
                  <Typography variant="body1">Discount: {logo.discount}</Typography>
                )}
                {logo.link && (
                  <Typography variant="body2">
                    <a href={logo.link} target="_blank" rel="noopener noreferrer">
                      Visit College
                    </a>
                  </Typography>
                )}
              </CardContent>
              <CardActions sx={{ justifyContent: "flex-end" }}>
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