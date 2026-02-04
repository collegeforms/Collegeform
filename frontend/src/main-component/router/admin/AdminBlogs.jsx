import React, { useState, useEffect, useCallback } from "react";
import {
  Box,
  Button,
  IconButton,
  Typography,
  Grid,
  CardMedia,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Checkbox,
  FormControlLabel,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
  Chip,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Tabs,
  Tab,
  Badge,
  Tooltip,
  Stack,
  LinearProgress
} from "@mui/material";
import { 
  Delete, 
  Edit, 
  CloudUpload, 
  Add, 
  Search, 
  ExpandMore,
  Add as AddIcon,
  Remove as RemoveIcon,
  Save as SaveIcon,
  Publish as PublishIcon,
  Schedule,
  Article,
  AutoAwesome,
  ArrowBack
} from "@mui/icons-material";
import axios from "axios";
import { useSnackbar } from "notistack";
import TiptapEditor from './TiptapEditor';
import { useNavigate } from "react-router-dom";

const AdminBlogs = () => {
  const API_URL = "https://www.collegeforms.in";
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();

  const [blogs, setBlogs] = useState([]);
  const [drafts, setDrafts] = useState([]);
  const [publishedBlogs, setPublishedBlogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewImage, setPreviewImage] = useState("");
  const [openDialog, setOpenDialog] = useState(false);
  const [currentBlog, setCurrentBlog] = useState(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [activeTab, setActiveTab] = useState(0);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [blogStats, setBlogStats] = useState({
    total: 0,
    published: 0,
    drafts: 0,
    featured: 0
  });
  const [isSaving, setIsSaving] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    category: "General",
    author: "Admin",
    isFeatured: false,
    status: "draft" // Default for new blogs
  });

  // FAQ state
  const [faqs, setFaqs] = useState([]);
  const [currentFaq, setCurrentFaq] = useState({ question: "", answer: "" });
  const [faqExpanded, setFaqExpanded] = useState(false);

  // Fetch all blogs and stats
  useEffect(() => {
    fetchBlogs();
    fetchBlogStats();
  }, [activeTab]);

  const fetchBlogs = async () => {
    try {
      setLoading(true);
      const [allBlogsRes, draftBlogsRes, publishedBlogsRes] = await Promise.all([
        axios.get(`${API_URL}/api/blogs`),
        axios.get(`${API_URL}/api/blogs/drafts`),
        axios.get(`${API_URL}/api/blogs/published`)
      ]);
      
      setBlogs(allBlogsRes.data.blogs || []);
      setDrafts(draftBlogsRes.data.blogs || []);
      setPublishedBlogs(publishedBlogsRes.data.blogs || []);
    } catch (error) {
      console.error("Error fetching blogs:", error);
      enqueueSnackbar("Failed to fetch blogs", { variant: "error" });
    } finally {
      setLoading(false);
    }
  };

  const fetchBlogStats = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/blogs/stats`);
      if (response.data.success) {
        setBlogStats(response.data);
      }
    } catch (error) {
      console.error("Error fetching blog stats:", error);
    }
  };

  // Handle image upload for Tiptap editor
  const handleImageUpload = async (file) => {
    try {
      const formData = new FormData();
      formData.append('image', file);
      
      const response = await axios.post(`${API_URL}/api/upload`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      return response.data.imageUrl;
    } catch (error) {
      console.error('Error uploading image:', error);
      throw new Error('Failed to upload image');
    }
  };

  // Handle file selection for blog cover image
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedFile(file);
      setPreviewImage(URL.createObjectURL(file));
      setHasUnsavedChanges(true);
    }
  };

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value
    });
    setHasUnsavedChanges(true);
  };

  // Handle FAQ input changes
  const handleFaqChange = (e) => {
    const { name, value } = e.target;
    setCurrentFaq(prev => ({
      ...prev,
      [name]: value
    }));
    setHasUnsavedChanges(true);
  };

  // Add FAQ to the list
  const handleAddFaq = () => {
    if (currentFaq.question.trim() && currentFaq.answer.trim()) {
      setFaqs(prev => [...prev, { ...currentFaq, id: Date.now() }]);
      setCurrentFaq({ question: "", answer: "" });
      setHasUnsavedChanges(true);
    }
  };

  // Remove FAQ from the list
  const handleRemoveFaq = (id) => {
    setFaqs(prev => prev.filter(faq => faq.id !== id));
    setHasUnsavedChanges(true);
  };

  // Handle content change from RichTextEditor
  const handleContentChange = useCallback((content) => {
    setFormData(prev => ({
      ...prev,
      content: content
    }));
    setHasUnsavedChanges(true);
  }, []);

  // Open dialog for creating new blog
  const handleOpenCreateDialog = () => {
    setCurrentBlog(null);
    setIsEditMode(false);
    setFormData({
      title: "",
      content: "",
      category: "General",
      author: "Admin",
      isFeatured: false,
      status: "draft"
    });
    setSelectedFile(null);
    setPreviewImage("");
    setFaqs([]);
    setCurrentFaq({ question: "", answer: "" });
    setFaqExpanded(false);
    setHasUnsavedChanges(false);
    setOpenDialog(true);
  };

  // Open dialog for editing blog
  const handleOpenEditDialog = (blog) => {
    setCurrentBlog(blog);
    setIsEditMode(true);
    setFormData({
      title: blog.title,
      content: blog.content,
      category: blog.category,
      author: blog.author,
      isFeatured: blog.isFeatured,
      status: blog.status // Preserve original status when editing
    });
    setPreviewImage(blog.image || "");
    setFaqs(blog.faqs || []);
    setSelectedFile(null);
    setHasUnsavedChanges(false);
    setOpenDialog(true);
  };

  // Close dialog with confirmation if unsaved changes
  const handleCloseDialog = () => {
    if (hasUnsavedChanges) {
      const shouldSave = window.confirm(
        "You have unsaved changes. Do you want to save before closing?"
      );
      if (shouldSave) {
        if (isEditMode) {
          handleSubmit(); // Save as update for edit mode
        } else {
          handleSaveDraft(); // Save as draft for new blog
        }
        return;
      }
    }
    setOpenDialog(false);
  };

  // Save as draft (for new blogs only)
  const handleSaveDraft = async () => {
    try {
      // Frontend validation
      if (!formData.title.trim()) {
        enqueueSnackbar("Title is required", { variant: "error" });
        return;
      }
      
      if (formData.title.trim().length < 5) {
        enqueueSnackbar("Title must be at least 5 characters", { variant: "error" });
        return;
      }
      
      setIsSaving(true);
      const formDataToSend = new FormData();
      
      formDataToSend.append("title", formData.title);
      formDataToSend.append("content", formData.content || "");
      formDataToSend.append("category", formData.category);
      formDataToSend.append("author", formData.author || "Admin");
      formDataToSend.append("isFeatured", formData.isFeatured.toString());
      formDataToSend.append("status", "draft");
      
      // Add FAQs if any
      if (faqs.length > 0) {
        formDataToSend.append("faqs", JSON.stringify(faqs));
      }
      
      if (selectedFile) {
        formDataToSend.append("image", selectedFile);
      }

      // Always use POST for new blogs
      const response = await axios.post(
        `${API_URL}/api/blogs`,
        formDataToSend,
        {
          headers: {
            "Content-Type": "multipart/form-data"
          }
        }
      );
      
      if (response.data.success) {
        setHasUnsavedChanges(false);
        enqueueSnackbar("Blog saved to drafts successfully", { variant: "success" });
        
        // Close dialog and redirect immediately
        setOpenDialog(false);
        navigate('/admin/addBlogs');
        
        fetchBlogs();
      }
    } catch (error) {
      console.error("Error saving blog:", error);
      let errorMessage = "Failed to save blog";
      let errors = [];
      
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      }
      
      if (error.response?.data?.errors) {
        errors = Array.isArray(error.response.data.errors) 
          ? error.response.data.errors
          : [String(error.response.data.errors)];
      }
      
      // Show all validation errors
      if (errors.length > 0) {
        errors.forEach(err => {
          enqueueSnackbar(err, { variant: "error" });
        });
      } else {
        enqueueSnackbar(errorMessage, { variant: "error" });
      }
    } finally {
      setIsSaving(false);
    }
  };

  // Publish a blog from draft
  const handlePublishBlog = async (id) => {
    try {
      setLoading(true);
      const response = await axios.put(`${API_URL}/api/blogs/${id}/publish`);
      if (response.data.success) {
        enqueueSnackbar("Blog published successfully", { variant: "success" });
        fetchBlogs();
      }
    } catch (error) {
      console.error("Error publishing blog:", error);
      enqueueSnackbar(error.response?.data?.message || "Failed to publish blog", { 
        variant: "error" 
      });
    } finally {
      setLoading(false);
    }
  };

  // Unpublish a blog (move to drafts)
  const handleUnpublishBlog = async (id) => {
    try {
      setLoading(true);
      const response = await axios.put(`${API_URL}/api/blogs/${id}/unpublish`);
      if (response.data.success) {
        enqueueSnackbar("Blog moved to drafts", { variant: "info" });
        fetchBlogs();
      }
    } catch (error) {
      console.error("Error unpublishing blog:", error);
      enqueueSnackbar(error.response?.data?.message || "Failed to unpublish blog", { 
        variant: "error" 
      });
    } finally {
      setLoading(false);
    }
  };

  // Clean slug (remove -ml suffix)
  const handleCleanSlug = async (id) => {
    try {
      setLoading(true);
      const response = await axios.put(`${API_URL}/api/blogs/${id}/clean-slug`);
      if (response.data.success) {
        enqueueSnackbar("URL cleaned successfully", { variant: "success" });
        fetchBlogs();
      }
    } catch (error) {
      console.error("Error cleaning slug:", error);
      enqueueSnackbar(error.response?.data?.message || "Failed to clean URL", { 
        variant: "error" 
      });
    } finally {
      setLoading(false);
    }
  };

  // Submit blog form (publish immediately for new, update for edit)
  const handleSubmit = async () => {
    try {
      // Frontend validation
      if (!formData.title.trim()) {
        enqueueSnackbar("Title is required", { variant: "error" });
        return;
      }
      
      if (formData.title.trim().length < 5) {
        enqueueSnackbar("Title must be at least 5 characters", { variant: "error" });
        return;
      }
      
      if (!formData.content.trim()) {
        enqueueSnackbar("Content is required", { variant: "error" });
        return;
      }
      
      setIsSaving(true);
      const formDataToSend = new FormData();
      formDataToSend.append("title", formData.title);
      formDataToSend.append("content", formData.content);
      formDataToSend.append("category", formData.category);
      formDataToSend.append("author", formData.author);
      formDataToSend.append("isFeatured", formData.isFeatured.toString());

      // Add FAQs if any
      if (faqs.length > 0) {
        formDataToSend.append("faqs", JSON.stringify(faqs));
      }

      if (selectedFile) {
        formDataToSend.append("image", selectedFile);
      }

      let response;
      if (isEditMode && currentBlog?._id) {
        // Update existing blog using PUT
        response = await axios.put(
          `${API_URL}/api/blogs/${currentBlog._id}`,
          formDataToSend,
          {
            headers: {
              "Content-Type": "multipart/form-data"
            }
          }
        );
      } else {
        // Create new blog with published status
        formDataToSend.append("status", "published");
        response = await axios.post(
          `${API_URL}/api/blogs`,
          formDataToSend,
          {
            headers: {
              "Content-Type": "multipart/form-data"
            }
          }
        );
      }

      if (response.data.success) {
        const message = isEditMode 
          ? "Blog updated successfully" 
          : "Blog published successfully";
        
        enqueueSnackbar(message, { variant: "success" });
        setOpenDialog(false);
        setHasUnsavedChanges(false);
        
        // Redirect to dashboard
        navigate('/admin/addBlogs');
        
        fetchBlogs();
      }
    } catch (error) {
      console.error("Error submitting blog:", error);
      let errorMessage = "Failed to save blog";
      let errors = [];
      
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      }
      
      if (error.response?.data?.errors) {
        errors = Array.isArray(error.response.data.errors) 
          ? error.response.data.errors
          : [String(error.response.data.errors)];
      }
      
      // Show all validation errors
      if (errors.length > 0) {
        errors.forEach(err => {
          enqueueSnackbar(err, { variant: "error" });
        });
      } else {
        enqueueSnackbar(errorMessage, { variant: "error" });
      }
    } finally {
      setIsSaving(false);
    }
  };

  // Delete a blog
  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this blog?")) {
      try {
        setLoading(true);
        const response = await axios.delete(`${API_URL}/api/blogs/${id}`);
        if (response.data.success) {
          enqueueSnackbar("Blog deleted successfully", { variant: "success" });
          fetchBlogs();
        }
      } catch (error) {
        console.error("Error deleting blog:", error);
        enqueueSnackbar(error.response?.data?.message || "Failed to delete blog", { 
          variant: "error" 
        });
      } finally {
        setLoading(false);
      }
    }
  };

  // Handle page change
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  // Handle rows per page change
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Filter blogs based on active tab
  const getCurrentBlogs = () => {
    switch (activeTab) {
      case 0: // All
        return blogs;
      case 1: // Published
        return publishedBlogs;
      case 2: // Drafts
        return drafts;
      default:
        return [];
    }
  };

  const currentBlogs = getCurrentBlogs();

  // Filter blogs based on search term
  const filteredBlogs = currentBlogs.filter(blog =>
    blog?.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (blog?.content && blog.content.toLowerCase().includes(searchTerm.toLowerCase())) ||
    blog?.category?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    blog?.author?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Box sx={{ padding: "20px" }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
          <Typography variant="h4">Blog Management</Typography>
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={handleOpenCreateDialog}
            disabled={loading}
          >
            New Blog
          </Button>
        </Box>
        
        {/* Back to Dashboard Button */}
        <Button
          variant="outlined"
          startIcon={<ArrowBack />}
          onClick={() => navigate('/admin/addBlogs')}
          sx={{ mb: 2 }}
        >
          Back to Dashboard
        </Button>
      </Box>

      {/* Search and Tabs */}
      <Paper sx={{ mb: 3, p: 2 }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <TextField
            fullWidth
            variant="outlined"
            placeholder="Search blogs..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              startAdornment: <Search sx={{ mr: 1 }} />
            }}
            disabled={loading}
          />
        </Box>
        
        <Tabs 
          value={activeTab} 
          onChange={(e, newValue) => {
            setActiveTab(newValue);
            setPage(0);
          }}
          sx={{ mt: 2 }}
          disabled={loading}
        >
          <Tab 
            icon={<Article />} 
            label={`All Blogs (${blogs.length})`} 
          />
          <Tab 
            icon={<AutoAwesome />} 
            label={
              <Badge badgeContent={blogStats.published} color="success">
                Published
              </Badge>
            } 
          />
          <Tab 
            icon={<Schedule />} 
            label={
              <Badge badgeContent={blogStats.drafts} color="warning">
                Drafts
              </Badge>
            } 
          />
        </Tabs>
      </Paper>

      {/* Loading indicator */}
      {loading && (
        <LinearProgress sx={{ mb: 2 }} />
      )}

      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
          <CircularProgress />
        </Box>
      ) : (
        <>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Image</TableCell>
                  <TableCell>Title</TableCell>
                  <TableCell>Category</TableCell>
                  <TableCell>Author</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Featured</TableCell>
                  <TableCell>FAQs</TableCell>
                  <TableCell>Last Updated</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredBlogs.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={9} align="center">
                      <Typography color="text.secondary" sx={{ py: 3 }}>
                        No blogs found
                      </Typography>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredBlogs
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((blog) => (
                      <TableRow key={blog._id}>
                        <TableCell>
                          {blog.image ? (
                            <CardMedia
                              component="img"
                              sx={{ width: 80, height: 60, objectFit: "cover", borderRadius: 1 }}
                              image={blog.image}
                              alt={blog.title}
                            />
                          ) : (
                            <Box sx={{ 
                              width: 80, 
                              height: 60, 
                              bgcolor: 'grey.100',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              borderRadius: 1
                            }}>
                              <Typography variant="caption" color="text.secondary">
                                No image
                              </Typography>
                            </Box>
                          )}
                        </TableCell>
                        <TableCell>
                          <Typography variant="subtitle1">
                            {blog.title || "Untitled Draft"}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {blog.slug && blog.status === 'published' ? (
                              <Box component="span" sx={{ display: 'block', fontFamily: 'monospace', fontSize: '0.7rem' }}>
                                /blogs/{blog.slug}
                              </Box>
                            ) : blog.slug && blog.status === 'draft' ? (
                              <Box component="span" sx={{ display: 'block', fontFamily: 'monospace', fontSize: '0.7rem', color: 'warning.main' }}>
                                Draft Slug: {blog.slug}
                              </Box>
                            ) : null}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Chip label={blog.category} color="primary" size="small" />
                        </TableCell>
                        <TableCell>{blog.author || "Admin"}</TableCell>
                        <TableCell>
                          <Chip 
                            label={blog.status === 'published' ? 'Published' : 'Draft'} 
                            color={blog.status === 'published' ? 'success' : 'warning'} 
                            size="small" 
                          />
                        </TableCell>
                        <TableCell>
                          {blog.isFeatured ? (
                            <Chip label="Featured" color="success" size="small" />
                          ) : null}
                        </TableCell>
                        <TableCell>
                          <Chip 
                            label={`${blog.faqs?.length || 0} FAQs`} 
                            variant="outlined" 
                            size="small" 
                          />
                        </TableCell>
                        <TableCell>
                          {new Date(blog.updatedAt).toLocaleDateString()}
                        </TableCell>
                        <TableCell>
                          <Stack direction="row" spacing={1}>
                            <Tooltip title="Edit">
                              <IconButton 
                                onClick={() => handleOpenEditDialog(blog)} 
                                size="small"
                                disabled={loading}
                              >
                                <Edit color="primary" />
                              </IconButton>
                            </Tooltip>
                            {blog.status === 'draft' ? (
                              <Tooltip title="Publish">
                                <IconButton 
                                  onClick={() => handlePublishBlog(blog._id)} 
                                  size="small"
                                  disabled={loading}
                                >
                                  <PublishIcon color="success" />
                                </IconButton>
                              </Tooltip>
                            ) : (
                              <>
                                <Tooltip title="Clean URL (remove -ml suffix)">
                                  <IconButton 
                                    onClick={() => handleCleanSlug(blog._id)} 
                                    size="small"
                                    disabled={loading || !blog.slug?.includes('-ml')}
                                  >
                                    <AutoAwesome color="info" />
                                  </IconButton>
                                </Tooltip>
                                <Tooltip title="Move to Drafts">
                                  <IconButton 
                                    onClick={() => handleUnpublishBlog(blog._id)} 
                                    size="small"
                                    disabled={loading}
                                  >
                                    <Schedule color="warning" />
                                  </IconButton>
                                </Tooltip>
                              </>
                            )}
                            <Tooltip title="Delete">
                              <IconButton 
                                onClick={() => handleDelete(blog._id)} 
                                size="small"
                                disabled={loading}
                              >
                                <Delete color="error" />
                              </IconButton>
                            </Tooltip>
                          </Stack>
                        </TableCell>
                      </TableRow>
                    ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={filteredBlogs.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            disabled={loading}
          />
        </>
      )}

      {/* Blog Form Dialog */}
      <Dialog 
        open={openDialog} 
        onClose={handleCloseDialog} 
        fullWidth 
        maxWidth="xl"
        fullScreen={window.innerWidth < 1900}
      >
        <DialogTitle>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h6">
              {isEditMode ? "Edit Blog" : "Create New Blog"}
              {hasUnsavedChanges && (
                <Chip 
                  label="Unsaved changes" 
                  color="warning" 
                  size="small" 
                  sx={{ ml: 2 }}
                />
              )}
            </Typography>
          </Box>
        </DialogTitle>
        <DialogContent dividers>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Title"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                margin="normal"
                required
                placeholder="Enter blog title (minimum 5 characters)"
                disabled={isSaving}
                error={!formData.title.trim() || formData.title.trim().length < 5}
                helperText={
                  !formData.title.trim() 
                    ? "Title is required" 
                    : formData.title.trim().length < 5 
                      ? "Title must be at least 5 characters" 
                      : ""
                }
              />
              <FormControl fullWidth margin="normal" required>
                <InputLabel>Category</InputLabel>
                <Select
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  label="Category"
                  disabled={isSaving}
                >
                  <MenuItem value="Technology">Technology</MenuItem>
                  <MenuItem value="Education">Education</MenuItem>
                  <MenuItem value="Health">Health</MenuItem>
                  <MenuItem value="Business">Business</MenuItem>
                  <MenuItem value="Entertainment">Entertainment</MenuItem>
                  <MenuItem value="Lifestyle">Lifestyle</MenuItem>
                  <MenuItem value="Sports">Sports</MenuItem>
                  <MenuItem value="Science">Science</MenuItem>
                  <MenuItem value="Travel">Travel</MenuItem>
                  <MenuItem value="General">General</MenuItem>
                </Select>
              </FormControl>
              <TextField
                fullWidth
                label="Author"
                name="author"
                value={formData.author}
                onChange={handleInputChange}
                margin="normal"
                placeholder="Enter author name"
                disabled={isSaving}
              />
              <FormControlLabel
                control={
                  <Checkbox
                    name="isFeatured"
                    checked={formData.isFeatured}
                    onChange={handleInputChange}
                    color="primary"
                    disabled={isSaving}
                  />
                }
                label="Featured Blog"
              />
              <Box sx={{ mt: 2 }}>
                <input
                  accept="image/*"
                  style={{ display: "none" }}
                  id="blog-image-upload"
                  type="file"
                  onChange={handleFileChange}
                  disabled={isSaving}
                />
                <label htmlFor="blog-image-upload">
                  <Button
                    variant="outlined"
                    component="span"
                    startIcon={<CloudUpload />}
                    disabled={isSaving}
                  >
                    {previewImage ? "Change Cover Image" : "Upload Cover Image"}
                  </Button>
                </label>
                {previewImage && (
                  <Box sx={{ mt: 2 }}>
                    <Typography variant="subtitle2">Preview:</Typography>
                    <img
                      src={previewImage}
                      alt="Preview"
                      style={{ 
                        maxWidth: "100%", 
                        maxHeight: "200px", 
                        borderRadius: "8px",
                        objectFit: 'cover' 
                      }}
                    />
                  </Box>
                )}
              </Box>

              {/* FAQ Section */}
              <Accordion 
                expanded={faqExpanded} 
                onChange={() => setFaqExpanded(!faqExpanded)}
                sx={{ mt: 3 }}
                disabled={isSaving}
              >
                <AccordionSummary expandIcon={<ExpandMore />}>
                  <Typography variant="h6">Blog FAQs ({faqs.length})</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Box sx={{ mb: 2 }}>
                    <TextField
                      fullWidth
                      label="Question"
                      name="question"
                      value={currentFaq.question}
                      onChange={handleFaqChange}
                      margin="normal"
                      placeholder="Enter a question"
                      disabled={isSaving}
                    />
                    <TextField
                      fullWidth
                      label="Answer"
                      name="answer"
                      value={currentFaq.answer}
                      onChange={handleFaqChange}
                      margin="normal"
                      multiline
                      rows={2}
                      placeholder="Enter the answer"
                      disabled={isSaving}
                    />
                    <Button
                      variant="outlined"
                      onClick={handleAddFaq}
                      sx={{ mt: 1 }}
                      startIcon={<AddIcon />}
                      disabled={isSaving || !currentFaq.question.trim() || !currentFaq.answer.trim()}
                    >
                      Add FAQ
                    </Button>
                  </Box>

                  <List>
                    {faqs.map((faq, index) => (
                      <ListItem key={faq.id} divider>
                        <ListItemText
                          primary={`${index + 1}. ${faq.question}`}
                          secondary={faq.answer}
                        />
                        <ListItemSecondaryAction>
                          <IconButton 
                            edge="end" 
                            onClick={() => handleRemoveFaq(faq.id)}
                            color="error"
                            disabled={isSaving}
                          >
                            <RemoveIcon />
                          </IconButton>
                        </ListItemSecondaryAction>
                      </ListItem>
                    ))}
                    {faqs.length === 0 && (
                      <ListItem>
                        <ListItemText
                          primary="No FAQs added yet"
                          secondary="Add questions and answers that readers might have about this blog"
                        />
                      </ListItem>
                    )}
                  </List>
                </AccordionDetails>
              </Accordion>
            </Grid>

            <Grid item xs={12} md={6}>
              <Typography variant="subtitle1" gutterBottom>
                Content
              </Typography>
              <TiptapEditor 
                content={formData.content} 
                onUpdate={handleContentChange}
                onImageUpload={handleImageUpload}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button 
            onClick={handleCloseDialog} 
            color="inherit"
            disabled={isSaving}
          >
            Cancel
          </Button>
          {/* Show Save as Draft button only for new blogs */}
          {!isEditMode && (
            <Button
              onClick={handleSaveDraft}
              variant="outlined"
              color="secondary"
              disabled={isSaving || !formData.title.trim() || formData.title.trim().length < 5}
              startIcon={<SaveIcon />}
            >
              {isSaving ? <CircularProgress size={20} /> : 'Save as Draft'}
            </Button>
          )}
          <Button
            onClick={handleSubmit}
            variant="contained"
            color="success"
            disabled={isSaving || !formData.title.trim() || formData.title.trim().length < 5 || !formData.content.trim()}
            startIcon={<PublishIcon />}
          >
            {isSaving ? (
              <CircularProgress size={24} color="inherit" />
            ) : isEditMode ? (
              'Update Blog'
            ) : (
              'Publish Now'
            )}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AdminBlogs;