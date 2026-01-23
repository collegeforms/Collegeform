import React, { useState, useEffect, useCallback, useRef } from "react";
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
  Snackbar,
  Alert
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
  WarningAmber
} from "@mui/icons-material";
import axios from "axios";
import { useSnackbar } from "notistack";
import TiptapEditor from './TiptapEditor';

const AdminBlogs = () => {
  const API_URL = "https://www.collegeforms.in";
  const { enqueueSnackbar } = useSnackbar();

  const [blogs, setBlogs] = useState([]);
  const [drafts, setDrafts] = useState([]);
  const [publishedBlogs, setPublishedBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
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
  const [isAutoSaving, setIsAutoSaving] = useState(false);
  const autoSaveTimerRef = useRef(null);

  // Form state
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    category: "Technology",
    author: "",
    isFeatured: false,
    status: "draft"
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
      const [allBlogs, draftBlogs, publishedBlogs] = await Promise.all([
        axios.get(`${API_URL}/api/blogs`),
        axios.get(`${API_URL}/api/blogs/drafts`),
        axios.get(`${API_URL}/api/blogs/published`)
      ]);
      
      setBlogs(allBlogs.data);
      setDrafts(draftBlogs.data);
      setPublishedBlogs(publishedBlogs.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching blogs:", error);
      enqueueSnackbar("Failed to fetch blogs", { variant: "error" });
      setLoading(false);
    }
  };

  const fetchBlogStats = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/blogs/stats`);
      setBlogStats(response.data);
    } catch (error) {
      console.error("Error fetching blog stats:", error);
    }
  };

  // Auto-save functionality
  useEffect(() => {
    if (hasUnsavedChanges && formData.title && openDialog) {
      // Clear any existing timer
      if (autoSaveTimerRef.current) {
        clearTimeout(autoSaveTimerRef.current);
      }
      
      // Set new timer for 3 seconds
      autoSaveTimerRef.current = setTimeout(async () => {
        await handleAutoSave();
      }, 3000);
      
      return () => {
        if (autoSaveTimerRef.current) {
          clearTimeout(autoSaveTimerRef.current);
        }
      };
    }
  }, [formData, faqs, selectedFile, hasUnsavedChanges, openDialog]);

  const handleAutoSave = async () => {
    if (!formData.title.trim()) {
      return; // Don't auto-save empty drafts
    }
    
    try {
      setIsAutoSaving(true);
      const formDataToSend = new FormData();
      
      // Only send necessary data
      formDataToSend.append("title", formData.title || "Untitled Draft");
      formDataToSend.append("content", formData.content || "");
      formDataToSend.append("category", formData.category);
      formDataToSend.append("author", formData.author || "");
      formDataToSend.append("isFeatured", formData.isFeatured.toString());
      formDataToSend.append("faqs", JSON.stringify(faqs));
      
      // If editing existing draft, send the ID
      if (isEditMode && currentBlog?._id && currentBlog.status === 'draft') {
        formDataToSend.append("id", currentBlog._id);
      }
      
      // If there's a new file, append it
      if (selectedFile) {
        formDataToSend.append("image", selectedFile);
      }

      const response = await axios.post(`${API_URL}/api/blogs/draft`, formDataToSend, {
        headers: {
          "Content-Type": "multipart/form-data"
        }
      });
      
      if (response.data.success) {
        setHasUnsavedChanges(false);
        
        // Update current blog if editing
        if (isEditMode && currentBlog) {
          setCurrentBlog(response.data.blog);
        }
        
        // Show snackbar only if not already saving
        if (!isAutoSaving) {
          enqueueSnackbar("Draft auto-saved", { variant: "info", autoHideDuration: 2000 });
        }
        
        // Refresh the drafts list
        fetchBlogs();
      }
    } catch (error) {
      console.error("Error auto-saving draft:", error);
      enqueueSnackbar("Failed to auto-save draft", { variant: "error" });
    } finally {
      setIsAutoSaving(false);
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
      category: "Technology",
      author: "",
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
      status: blog.status
    });
    setPreviewImage(blog.image);
    setFaqs(blog.faqs || []);
    setHasUnsavedChanges(false);
    setOpenDialog(true);
  };

  // Close dialog with confirmation if unsaved changes
  const handleCloseDialog = async () => {
    if (hasUnsavedChanges && formData.title.trim()) {
      const shouldSave = window.confirm(
        "You have unsaved changes. Do you want to save as draft before closing?"
      );
      if (shouldSave) {
        await handleSaveDraft();
      }
    }
    setOpenDialog(false);
  };

  // Manual save as draft
  const handleSaveDraft = async () => {
    try {
      setLoading(true);
      const formDataToSend = new FormData();
      
      formDataToSend.append("title", formData.title || "Untitled Draft");
      formDataToSend.append("content", formData.content || "");
      formDataToSend.append("category", formData.category);
      formDataToSend.append("author", formData.author || "");
      formDataToSend.append("isFeatured", formData.isFeatured.toString());
      formDataToSend.append("faqs", JSON.stringify(faqs));
      
      // If editing existing draft, send the ID
      if (isEditMode && currentBlog?._id && currentBlog.status === 'draft') {
        formDataToSend.append("id", currentBlog._id);
      }
      
      if (selectedFile) {
        formDataToSend.append("image", selectedFile);
      }

      const response = await axios.post(`${API_URL}/api/blogs/draft`, formDataToSend, {
        headers: {
          "Content-Type": "multipart/form-data"
        }
      });
      
      if (response.data.success) {
        setHasUnsavedChanges(false);
        enqueueSnackbar("Draft saved successfully", { variant: "success" });
        
        // Update current blog if editing
        if (isEditMode && currentBlog) {
          setCurrentBlog(response.data.blog);
        }
        
        fetchBlogs();
      }
    } catch (error) {
      console.error("Error saving draft:", error);
      enqueueSnackbar("Failed to save draft", { variant: "error" });
    } finally {
      setLoading(false);
    }
  };

  // Publish a draft
  const handlePublishBlog = async (id) => {
    try {
      setLoading(true);
      await axios.put(`${API_URL}/api/blogs/${id}/publish`);
      enqueueSnackbar("Blog published successfully", { variant: "success" });
      fetchBlogs();
    } catch (error) {
      console.error("Error publishing blog:", error);
      enqueueSnackbar("Failed to publish blog", { variant: "error" });
    } finally {
      setLoading(false);
    }
  };

  // Unpublish a blog (move to drafts)
  const handleUnpublishBlog = async (id) => {
    try {
      setLoading(true);
      await axios.put(`${API_URL}/api/blogs/${id}/unpublish`);
      enqueueSnackbar("Blog moved to drafts", { variant: "info" });
      fetchBlogs();
    } catch (error) {
      console.error("Error unpublishing blog:", error);
      enqueueSnackbar("Failed to unpublish blog", { variant: "error" });
    } finally {
      setLoading(false);
    }
  };

  // Submit blog form (create or update)
  const handleSubmit = async () => {
    try {
      setLoading(true);
      const formDataToSend = new FormData();
      formDataToSend.append("title", formData.title);
      formDataToSend.append("content", formData.content);
      formDataToSend.append("category", formData.category);
      formDataToSend.append("author", formData.author);
      formDataToSend.append("isFeatured", formData.isFeatured.toString());
      formDataToSend.append("faqs", JSON.stringify(faqs));
      formDataToSend.append("status", "published");

      if (selectedFile) {
        formDataToSend.append("image", selectedFile);
      }

      let response;
      if (isEditMode) {
        response = await axios.put(
          `${API_URL}/api/blogs/${currentBlog._id}`,
          formDataToSend,
          {
            headers: {
              "Content-Type": "multipart/form-data"
            }
          }
        );
        enqueueSnackbar("Blog published successfully", { 
          variant: "success" 
        });
      } else {
        response = await axios.post(
          `${API_URL}/api/blogs`,
          formDataToSend,
          {
            headers: {
              "Content-Type": "multipart/form-data"
            }
          }
        );
        enqueueSnackbar("Blog published successfully", { 
          variant: "success" 
        });
      }

      setOpenDialog(false);
      setHasUnsavedChanges(false);
      fetchBlogs();
      setLoading(false);
    } catch (error) {
      console.error("Error submitting blog:", error);
      enqueueSnackbar(error.response?.data?.message || "Failed to publish blog", {
        variant: "error"
      });
      setLoading(false);
    }
  };

  // Delete a blog
  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this blog?")) {
      try {
        setLoading(true);
        await axios.delete(`${API_URL}/api/blogs/${id}`);
        enqueueSnackbar("Blog deleted successfully", { variant: "success" });
        fetchBlogs();
        setLoading(false);
      } catch (error) {
        console.error("Error deleting blog:", error);
        enqueueSnackbar("Failed to delete blog", { variant: "error" });
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
    blog.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (blog.content && blog.content.toLowerCase().includes(searchTerm.toLowerCase())) ||
    blog.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
    blog.author.toLowerCase().includes(searchTerm.toLowerCase())
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

      {loading && !isAutoSaving ? (
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
                {filteredBlogs
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
                          {blog.status === 'published' 
                            ? new Date(blog.publishedAt || blog.createdAt).toLocaleDateString()
                            : new Date(blog.updatedAt).toLocaleDateString()
                          }
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Chip label={blog.category} color="primary" size="small" />
                      </TableCell>
                      <TableCell>{blog.author || "Not set"}</TableCell>
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
                            <Tooltip title="Move to Drafts">
                              <IconButton 
                                onClick={() => handleUnpublishBlog(blog._id)} 
                                size="small"
                                disabled={loading}
                              >
                                <Schedule color="warning" />
                              </IconButton>
                            </Tooltip>
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
                  ))}
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
        maxWidth="lg"
        fullScreen={window.innerWidth < 900}
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
              {isAutoSaving && (
                <Chip 
                  label="Auto-saving..." 
                  color="info" 
                  size="small" 
                  sx={{ ml: 1 }}
                />
              )}
            </Typography>
            <Stack direction="row" spacing={2} alignItems="center">
              <Tooltip title="Save as Draft">
                <Button
                  variant="outlined"
                  startIcon={<SaveIcon />}
                  onClick={handleSaveDraft}
                  disabled={!hasUnsavedChanges || loading || isAutoSaving}
                  size="small"
                >
                  Save Draft
                </Button>
              </Tooltip>
            </Stack>
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
                placeholder="Enter blog title"
                disabled={loading}
                error={!formData.title.trim()}
                helperText={!formData.title.trim() ? "Title is required" : ""}
              />
              <FormControl fullWidth margin="normal" required>
                <InputLabel>Category</InputLabel>
                <Select
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  label="Category"
                  disabled={loading}
                >
                  <MenuItem value="Technology">Technology</MenuItem>
                  <MenuItem value="Education">Education</MenuItem>
                  <MenuItem value="Health">Health</MenuItem>
                  <MenuItem value="Business">Business</MenuItem>
                  <MenuItem value="Entertainment">Entertainment</MenuItem>
                  <MenuItem value="Lifestyle">Lifestyle</MenuItem>
                  <MenuItem value="Sports">Sports</MenuItem>
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
                disabled={loading}
              />
              <FormControlLabel
                control={
                  <Checkbox
                    name="isFeatured"
                    checked={formData.isFeatured}
                    onChange={handleInputChange}
                    color="primary"
                    disabled={loading}
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
                  disabled={loading}
                />
                <label htmlFor="blog-image-upload">
                  <Button
                    variant="contained"
                    component="span"
                    startIcon={<CloudUpload />}
                    disabled={loading}
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
                disabled={loading}
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
                      disabled={loading}
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
                      disabled={loading}
                    />
                    <Button
                      variant="outlined"
                      onClick={handleAddFaq}
                      sx={{ mt: 1 }}
                      startIcon={<AddIcon />}
                      disabled={loading || !currentFaq.question.trim() || !currentFaq.answer.trim()}
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
                            disabled={loading}
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
            disabled={loading || isAutoSaving}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSaveDraft}
            variant="outlined"
            color="secondary"
            disabled={loading || !formData.title.trim() || isAutoSaving}
            startIcon={<SaveIcon />}
          >
            Save as Draft
          </Button>
          <Button
            onClick={handleSubmit}
            variant="contained"
            color="success"
            disabled={loading || !formData.title.trim() || !formData.content.trim() || isAutoSaving}
            startIcon={<PublishIcon />}
          >
            {loading ? (
              <CircularProgress size={24} />
            ) : isEditMode ? (
              'Update & Publish'
            ) : (
              'Create & Publish'
            )}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Auto-save notifications */}
      <Snackbar 
        open={isAutoSaving}
        autoHideDuration={2000}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
      >
        <Alert severity="info" icon={<SaveIcon fontSize="small" />}>
          Auto-saving draft...
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default AdminBlogs;