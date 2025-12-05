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
  TextField,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Paper,
  Stack,
  Tooltip,
  CircularProgress
} from "@mui/material";
import { Delete, CloudUpload, Edit, Link as LinkIcon } from "@mui/icons-material";
import axios from "axios";

const AddBanner = () => {
  const API_URL = "https://www.collegeforms.in";

  const [banners, setBanners] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [link, setLink] = useState("");
  const [category, setCategory] = useState("Default");
  const [activeTab, setActiveTab] = useState("All");
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  
  // Edit modal states
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editingBanner, setEditingBanner] = useState(null);
  const [editLink, setEditLink] = useState("");
  const [editCategory, setEditCategory] = useState("Default");
  const [editImageFile, setEditImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [editLoading, setEditLoading] = useState(false);

  const categoryLabels = {
    "Default": "Default",
    "OnlineEducation": "Online Education",
    "StudyAbroad": "Study Abroad",
    "vocational-institutes": "Vocational Institutes",
    "ScholarshipBasedEducation": "Scholarship Based Education",
    "government-colleges": "Government Colleges",
    "Top-B-Schools": "Top B Schools",
    "education-loan": "Education Loan",
    "accommodation": "Accommodation",
    "home-page": "Home page",
    "CompetitiveExams": "Competitive Exams"
};

  useEffect(() => {
    fetchBanners();
    fetchCategories();
  }, []);

  useEffect(() => {
    fetchBanners();
  }, [activeTab]);

  const fetchBanners = async () => {
    try {
      setLoading(true);
      const url = activeTab === "All" 
        ? `${API_URL}/api/banners`
        : `${API_URL}/api/banners/category/${activeTab}`;
      
      const response = await axios.get(url);
      setBanners(response.data);
    } catch (error) {
      console.error("Error fetching banners:", error);
      alert("Failed to fetch banners.");
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/banners/categories/all`);
      setCategories(response.data);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleEditImageChange = (event) => {
    const file = event.target.files[0];
    setEditImageFile(file);
    
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) return alert("Please select a file!");

    const formData = new FormData();
    formData.append("image", selectedFile);
    formData.append("link", link);
    formData.append("category", category);

    try {
      setLoading(true);
      const response = await axios.post(`${API_URL}/api/banners`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      // Refresh the banners list instead of manual state update
      await fetchBanners();
      await fetchCategories();
      
      setSelectedFile(null);
      setLink("");
      setCategory("Default");
      // Reset file input
      const fileInput = document.getElementById('banner-upload');
      if (fileInput) fileInput.value = '';
      
      alert("Banner uploaded successfully!");
    } catch (error) {
      console.error("Error uploading banner:", error);
      alert("Failed to upload banner. Try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this banner?")) return;

    try {
      setLoading(true);
      await axios.delete(`${API_URL}/api/banners/${id}`);
      // Refresh data instead of manual state update
      await fetchBanners();
      await fetchCategories();
      alert("Banner deleted successfully!");
    } catch (error) {
      console.error("Error deleting banner:", error);
      alert("Failed to delete banner.");
    } finally {
      setLoading(false);
    }
  };

  // Edit functionality
  const handleEdit = (banner) => {
    setEditingBanner(banner);
    setEditLink(banner.link || "");
    setEditCategory(banner.category);
    setImagePreview(banner.image);
    setEditImageFile(null);
    setEditModalOpen(true);
  };

  const handleEditSubmit = async () => {
    if (!editingBanner) return;

    try {
      setEditLoading(true);
      
      let updatedBanner = { ...editingBanner };

      // Update link and category if changed
      if (editLink !== editingBanner.link || editCategory !== editingBanner.category) {
        const updateResponse = await axios.put(`${API_URL}/api/banners/${editingBanner._id}`, {
          link: editLink,
          category: editCategory
        });
        updatedBanner = { ...updatedBanner, ...updateResponse.data.banner };
      }

      // Update image if a new one was selected
      if (editImageFile) {
        const formData = new FormData();
        formData.append("image", editImageFile);

        const imageResponse = await axios.put(
          `${API_URL}/api/banners/${editingBanner._id}/image`, 
          formData,
          {
            headers: { "Content-Type": "multipart/form-data" },
          }
        );
        updatedBanner = { ...updatedBanner, ...imageResponse.data.banner };
      }

      // Refresh all data to ensure consistency
      await fetchBanners();
      await fetchCategories();

      setEditModalOpen(false);
      setEditingBanner(null);
      alert("Banner updated successfully!");
    } catch (error) {
      console.error("Error updating banner:", error);
      alert("Failed to update banner. Try again.");
    } finally {
      setEditLoading(false);
    }
  };

  const filteredBanners = activeTab === "All" 
    ? banners 
    : banners.filter(banner => banner.category === activeTab);

  const allTabs = [
    { value: "All", label: "All Banners", count: banners.length },
    ...categories.map(cat => ({
      value: cat.name,
      label: categoryLabels[cat.name] || cat.name,
      count: cat.count
    }))
  ];

  return (
    <Box sx={{ padding: { xs: "10px", sm: "20px" }, maxWidth: "100%", overflow: "hidden" }}>
      <Typography variant="h4" sx={{ marginBottom: "20px", fontSize: { xs: "1.5rem", sm: "2rem" } }}>
        Banner Management
      </Typography>

      {/* Upload Section */}
      <Paper elevation={2} sx={{ padding: { xs: "15px", sm: "20px" }, marginBottom: "30px" }}>
        <Typography variant="h6" sx={{ marginBottom: "20px" }}>
          Upload New Banner
        </Typography>
        
        <Stack spacing={2}>
          {/* File Upload */}
          <Box sx={{ display: "flex", flexDirection: { xs: "column", sm: "row" }, gap: 2, alignItems: { xs: "stretch", sm: "center" } }}>
            <Button
              variant="outlined"
              component="label"
              startIcon={<CloudUpload />}
              sx={{ 
                minWidth: { xs: "100%", sm: "200px" },
                textAlign: "center"
              }}
            >
              Choose File
              <input
                type="file"
                hidden
                onChange={handleFileChange}
                accept="image/*"
                id="banner-upload"
              />
            </Button>
            
            <Button
              variant="contained"
              onClick={handleUpload}
              disabled={!selectedFile || loading}
              sx={{ 
                minWidth: { xs: "100%", sm: "200px" }
              }}
            >
              {loading ? <CircularProgress size={24} /> : "Upload Banner"}
            </Button>
          </Box>

          {selectedFile && (
            <Typography variant="body2" color="primary" sx={{ fontStyle: "italic" }}>
              Selected: {selectedFile.name}
            </Typography>
          )}

          {/* Link and Category */}
          <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
            <TextField
              label="Link (optional)"
              variant="outlined"
              value={link}
              onChange={(e) => setLink(e.target.value)}
              placeholder="https://example.com"
              size="small"
              fullWidth
              InputProps={{
                startAdornment: <LinkIcon sx={{ mr: 1, color: "text.secondary" }} />
              }}
            />

            <FormControl sx={{ minWidth: { xs: "100%", sm: "200px" } }} size="small">
              <InputLabel>Category</InputLabel>
              <Select
                value={category}
                label="Category"
                onChange={(e) => setCategory(e.target.value)}
              >
                {Object.entries(categoryLabels).map(([value, label]) => (
                  <MenuItem key={value} value={value}>
                    {label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Stack>
        </Stack>
      </Paper>

      {/* Multi-line Tabs Section */}
      <Paper elevation={1} sx={{ padding: "16px", marginBottom: "20px" }}>
        <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 600 }}>
          Filter by Category:
        </Typography>
        
        <Box sx={{ 
          display: 'flex',
          flexWrap: 'wrap',
          gap: 1,
          maxHeight: 'none',
          overflow: 'visible'
        }}>
          {allTabs.map((tab) => (
            <Chip
              key={tab.value}
              label={
                <Box display="flex" alignItems="center" gap={0.5}>
                  <span>{tab.label}</span>
                  <Box
                    sx={{
                      minWidth: '20px',
                      height: '20px',
                      borderRadius: '10px',
                      backgroundColor: activeTab === tab.value ? 'white' : 'grey.300',
                      color: activeTab === tab.value ? 'primary.main' : 'grey.700',
                      fontSize: '0.7rem',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      padding: '0 6px',
                      fontWeight: 600
                    }}
                  >
                    {tab.count}
                  </Box>
                </Box>
              }
              onClick={() => setActiveTab(tab.value)}
              variant={activeTab === tab.value ? "filled" : "outlined"}
              color={activeTab === tab.value ? "primary" : "default"}
              sx={{
                flexShrink: 0,
                padding: '6px 12px',
                fontWeight: activeTab === tab.value ? 600 : 400,
                backgroundColor: activeTab === tab.value ? 'primary.main' : 'transparent',
                color: activeTab === tab.value ? 'white' : 'text.primary',
                borderColor: activeTab === tab.value ? 'primary.main' : 'grey.300',
                '&:hover': {
                  backgroundColor: activeTab === tab.value ? 'primary.dark' : 'grey.100',
                },
                marginBottom: '4px'
              }}
            />
          ))}
        </Box>
      </Paper>

      {/* Banners Grid */}
      <Box sx={{ marginBottom: "20px" }}>
        <Typography variant="h6" sx={{ marginBottom: "20px" }}>
          {activeTab === "All" ? "All Banners" : `${categoryLabels[activeTab] || activeTab} Banners`} 
          <Chip 
            label={filteredBanners.length} 
            size="small" 
            color="primary"
            sx={{ ml: 1 }}
          />
        </Typography>

        {loading ? (
          <Box display="flex" justifyContent="center" alignItems="center" sx={{ height: '200px' }}>
            <CircularProgress />
          </Box>
        ) : filteredBanners.length === 0 ? (
          <Paper 
            sx={{ 
              textAlign: 'center', 
              padding: '40px', 
              border: '2px dashed #ccc',
              borderRadius: '8px'
            }}
          >
            <Typography variant="h6" color="text.secondary">
              No banners found for this category
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              Upload a banner to get started
            </Typography>
          </Paper>
        ) : (
          <Grid container spacing={2}>
            {filteredBanners.map((banner) => (
              <Grid item xs={12} sm={6} md={4} lg={6} key={banner._id}>
                <Card 
                  sx={{ 
                    position: "relative", 
                    boxShadow: 3,
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: 6
                    }
                  }}
                >
                  <CardMedia
                    component="img"
                    height="200"
                    sx={{ objectFit: "contain", p: 1 }}
                    image={banner.image}
                    alt="Banner"
                  />
                  
                  <CardActions 
                    sx={{ 
                      position: "absolute", 
                      top: 5, 
                      right: 5, 
                      display: 'flex', 
                      gap: 0.5,
                      padding: 0
                    }}
                  >
                    <Tooltip title="Edit">
                      <IconButton 
                        color="primary" 
                        onClick={() => handleEdit(banner)}
                        sx={{ 
                          backgroundColor: 'rgba(255,255,255,0.95)',
                          '&:hover': { 
                            backgroundColor: 'rgba(255,255,255,1)',
                            transform: 'scale(1.1)'
                          },
                          transition: 'all 0.2s ease'
                        }}
                        size="small"
                      >
                        <Edit fontSize="small" />
                      </IconButton>
                    </Tooltip>
                    
                    <Tooltip title="Delete">
                      <IconButton 
                        color="error" 
                        onClick={() => handleDelete(banner._id)}
                        sx={{ 
                          backgroundColor: 'rgba(255,255,255,0.95)',
                          '&:hover': { 
                            backgroundColor: 'rgba(255,255,255,1)',
                            transform: 'scale(1.1)'
                          },
                          transition: 'all 0.2s ease'
                        }}
                        size="small"
                      >
                        <Delete fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </CardActions>
                  
                  <Box sx={{ p: 2, mt: 'auto' }}>
                    <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                      <Chip 
                        label={categoryLabels[banner.category] || banner.category} 
                        size="small" 
                        color="primary"
                        variant="outlined"
                      />
                    </Box>
                    
                    {banner.link && (
                      <Tooltip title={banner.link}>
                        <Typography 
                          variant="body2" 
                          color="text.secondary" 
                          sx={{ 
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                            display: 'flex',
                            alignItems: 'center',
                            gap: 0.5
                          }}
                        >
                          <LinkIcon fontSize="small" />
                          <a 
                            href={banner.link} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            style={{ 
                              color: 'inherit',
                              textDecoration: 'none'
                            }}
                            onMouseEnter={(e) => e.target.style.textDecoration = 'underline'}
                            onMouseLeave={(e) => e.target.style.textDecoration = 'none'}
                          >
                            {banner.link.replace(/^https?:\/\//, '').split('/')[0]}
                          </a>
                        </Typography>
                      </Tooltip>
                    )}
                    
                    <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                      Added: {new Date(banner.createdAt).toLocaleDateString()}
                    </Typography>
                  </Box>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
      </Box>

      {/* Edit Banner Dialog */}
      <Dialog 
        open={editModalOpen} 
        onClose={() => !editLoading && setEditModalOpen(false)}
        maxWidth="sm"
        fullWidth
        scroll="paper"
      >
        <DialogTitle sx={{ pb: 1 }}>
          <Typography variant="h6">Edit Banner</Typography>
        </DialogTitle>
        
        <DialogContent dividers>
          {editingBanner && (
            <Stack spacing={3}>
              {/* Image Preview and Upload */}
              <Box>
                <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 600 }}>
                  Banner Image
                </Typography>
                
                <Stack direction={{ xs: "column", sm: "row" }} spacing={2} alignItems="flex-start">
                  <Box sx={{ flex: 1 }}>
                    <Typography variant="body2" sx={{ mb: 1, fontWeight: 500 }}>Current Image:</Typography>
                    <Box
                      sx={{
                        width: '100%',
                        maxWidth: '200px',
                        height: '150px',
                        border: '1px solid #ddd',
                        borderRadius: '8px',
                        overflow: 'hidden',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}
                    >
                      <img 
                        src={imagePreview} 
                        alt="Banner preview" 
                        style={{ 
                          width: '100%',
                          height: '100%',
                          objectFit: 'contain'
                        }}
                      />
                    </Box>
                  </Box>
                  
                  <Box sx={{ flex: 1 }}>
                    <Typography variant="body2" sx={{ mb: 1, fontWeight: 500 }}>Change Image:</Typography>
                    <Button
                      variant="outlined"
                      component="label"
                      fullWidth
                      sx={{ mb: 1 }}
                      disabled={editLoading}
                    >
                      Choose New File
                      <input
                        type="file"
                        hidden
                        onChange={handleEditImageChange}
                        accept="image/*"
                      />
                    </Button>
                    
                    {editImageFile && (
                      <Typography variant="caption" color="primary" sx={{ display: 'block' }}>
                        Selected: {editImageFile.name}
                      </Typography>
                    )}
                  </Box>
                </Stack>
              </Box>

              {/* Link Field */}
              <TextField
                fullWidth
                label="Link (optional)"
                variant="outlined"
                value={editLink}
                onChange={(e) => setEditLink(e.target.value)}
                placeholder="https://example.com"
                InputProps={{
                  startAdornment: <LinkIcon sx={{ mr: 1, color: "text.secondary" }} />
                }}
                disabled={editLoading}
              />

              {/* Category Field */}
              <FormControl fullWidth disabled={editLoading}>
                <InputLabel>Category</InputLabel>
                <Select
                  value={editCategory}
                  label="Category"
                  onChange={(e) => setEditCategory(e.target.value)}
                >
                  {Object.entries(categoryLabels).map(([value, label]) => (
                    <MenuItem key={value} value={value}>
                      {label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              {/* Banner Info */}
              <Paper variant="outlined" sx={{ p: 2, backgroundColor: 'grey.50' }}>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                  <strong>Banner ID:</strong> {editingBanner._id}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  <strong>Created:</strong> {new Date(editingBanner.createdAt).toLocaleString()}
                </Typography>
              </Paper>
            </Stack>
          )}
        </DialogContent>
        
        <DialogActions sx={{ p: 2 }}>
          <Button 
            onClick={() => setEditModalOpen(false)}
            color="inherit"
            disabled={editLoading}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleEditSubmit}
            variant="contained"
            disabled={!editingBanner || editLoading}
          >
            {editLoading ? <CircularProgress size={24} /> : "Update Banner"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AddBanner;