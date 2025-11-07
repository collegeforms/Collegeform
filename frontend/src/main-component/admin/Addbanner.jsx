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
} from "@mui/material";
import { Delete, CloudUpload } from "@mui/icons-material";
import axios from "axios";

const AddBanner = () => {
  const [banners, setBanners] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);

  useEffect(() => {
    fetchBanners();
  }, []);

  // Fetch banners from API
  const fetchBanners = async () => {
    try {
      const response = await axios.get("https://collegeforms.in/api/banners");
      console.log(response.data); // Log response to check the structure
      setBanners(response.data); // Assuming the response is an array of banner objects
    } catch (error) {
      console.error("Error fetching banners:", error);
    }
  };

  // Handle file selection
  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  // Upload banner
  const handleUpload = async () => {
    if (!selectedFile) return alert("Please select a file!");

    const formData = new FormData();
    formData.append("image", selectedFile);

    try {
      const response = await axios.post("https://collegeforms.in/api/banners", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setBanners([...banners, response.data]); // Add new banner to the state
      setSelectedFile(null); // Reset file input
      alert("Banner uploaded successfully!");
    } catch (error) {
      console.error("Error uploading banner:", error);
      alert("Failed to upload banner. Try again.");
    }
  };

  // Delete banner
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this banner?")) return;

    try {
      await axios.delete(`https://collegeforms.in/api/banners/${id}`);
      setBanners(banners.filter((banner) => banner._id !== id)); // Remove deleted banner from UI
      alert("Banner deleted successfully!");
    } catch (error) {
      console.error("Error deleting banner:", error);
      alert("Failed to delete banner.");
    }
  };

  return (
    <Box sx={{ padding: "20px" }}>
      <Typography variant="h5" sx={{ marginBottom: "10px" }}>
        Manage Banners
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
          Upload Banner
        </Button>
      </Box>

      {/* Display Banners */}
      <Grid container spacing={2}>
        {banners.map((banner) => (
          <Grid item xs={12} sm={6} md={4} key={banner._id}>
            <Card sx={{ position: "relative", boxShadow: 3 }}>
              <CardMedia
                component="img"
                height="250"
                style={{ objectFit: "contain" }}
                image={`https://collegeforms.in${banner.image}`} // Adjust API path
                alt="Banner"
              />
              <CardActions sx={{ position: "absolute", top: 5, right: 5 }}>
                <IconButton color="error" onClick={() => handleDelete(banner._id)}>
                  <Delete />
                </IconButton>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default AddBanner;
