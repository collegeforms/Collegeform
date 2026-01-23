import React, { useState, useEffect, useCallback } from "react";
import {
  Box,
  Button,
  IconButton,
  Typography,
  Grid,
  Card,
  CardMedia,
  CardContent,
  CardActions,
  Divider,
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
  Alert,
  Snackbar,
  Badge,
  Tooltip,
  Switch,
  Stack
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
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon,
  PublishedWithChanges,
  Schedule,
  Article,
  Dashboard
} from "@mui/icons-material";
import axios from "axios";
import { useSnackbar } from "notistack";
import { useNavigate } from "react-router-dom";
import TiptapEditor from './TiptapEditor';

const AdminBlogs = () => {
  const API_URL = "https://www.collegeforms.in";
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();

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
  const [autoSaveTimer, setAutoSaveTimer] = useState(null);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [blogStats, setBlogStats] = useState({
    total: 0,
    published: 0,
    drafts: 0,
    featured: 0
  });

  // Form state
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    category: "Technology",
    author: "",
    isFeatured: false,
    status: "draft" // default to draft
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
    if (hasUnsavedChanges && formData.title) {
      const timer = setTimeout(async () => {
        await handleAutoSave();
      }, 5000); // Auto-save every 5 seconds after changes
      
      setAutoSaveTimer(timer);
      return () => clearTimeout(timer);
    }
  }, [formData, faqs, selectedFile, hasUnsavedChanges]);

  const handleAutoSave = async () => {
    try {
      const formDataToSend = new FormData();
      formDataToSend.append("title", formData.title);
      formDataToSend.append("content", formData.content);
      formDataToSend.append("category", formData.category);
      formDataToSend.append("author", formData.author);
      formDataToSend.append("isFeatured", formData.isFeatured.toString());
      formDataToSend.append("status", formData.status);
      formDataToSend.append("faqs", JSON.stringify(faqs));

      if (currentBlog?._id) {
        formDataToSend.append("id", currentBlog._id);
      }

      if (selectedFile) {
        formDataToSend.append("image", selectedFile);
      } else if (previewImage && !previewImage.startsWith('blob:')) {
        // If no new file but existing image, we still need to save the image URL
        formDataToSend.append("existingImage", previewImage);
      }

      await axios.post(`${API_URL}/api/blogs/draft`, formDataToSend, {
        headers: {
          "Content-Type": "multipart/form-data"
        }
      });
      
      setHasUnsavedChanges(false);
      enqueueSnackbar("Draft auto-saved", { variant: "info" });
    } catch (error) {
      console.error("Error auto-saving draft:", error);
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

  // Handle status change
  const handleStatusChange = (e) => {
    const newStatus = e.target.checked ? 'published' : 'draft';
    setFormData(prev => ({
      ...prev,
      status: newStatus
    }));
    setHasUnsavedChanges(true);
  };

  // Handle FAQ input changes
  const handleFaqChange = (e) => {
    const { name, value } = e.target;
    setCurrentFaq(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Add FAQ to the list
  const handleAddFaq = () => {
    if (currentFaq.question.trim() && currentFaq.answer.trim()) {
      setFaqs(prev => [...prev, { ...currentFaq, id: Date.now() }]);
      setCurrentFaq({ question: "", answer: "" });
      setHasUnsavedChanges(true);
      enqueueSnackbar("FAQ added successfully", { variant: "success" });
    } else {
      enqueueSnackbar("Please fill both question and answer", { variant: "warning" });
    }
  };

  // Remove FAQ from the list
  const handleRemoveFaq = (id) => {
    setFaqs(prev => prev.filter(faq => faq.id !== id));
    setHasUnsavedChanges(true);
    enqueueSnackbar("FAQ removed", { variant: "info" });
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
  const handleCloseDialog = () => {
    if (hasUnsavedChanges) {
      if (window.confirm("You have unsaved changes. Do you want to save as draft?")) {
        handleAutoSave().then(() => {
          setOpenDialog(false);
          fetchBlogs();
        });
      } else {
        setOpenDialog(false);
      }
    } else {
      setOpenDialog(false);
    }
  };

  // Manual save as draft
  const handleSaveDraft = async () => {
    try {
      await handleAutoSave();
      enqueueSnackbar("Draft saved successfully", { variant: "success" });
      fetchBlogs();
    } catch (error) {
      enqueueSnackbar("Failed to save draft", { variant: "error" });
    }
  };

  // Publish a blog
  const handlePublishBlog = async (id) => {
    try {
      await axios.put(`${API_URL}/api/blogs/${id}/publish`);
      enqueueSnackbar("Blog published successfully", { variant: "success" });
      fetchBlogs();
    } catch (error) {
      enqueueSnackbar("Failed to publish blog", { variant: "error" });
    }
  };

  // Unpublish a blog (move to drafts)
  const handleUnpublishBlog = async (id) => {
    try {
      await axios.put(`${API_URL}/api/blogs/${id}/unpublish`);
      enqueueSnackbar("Blog moved to drafts", { variant: "info" });
      fetchBlogs();
    } catch (error) {
      enqueueSnackbar("Failed to unpublish blog", { variant: "error" });
    }
  };

  // Submit blog form (create or update)
  const handleSubmit = async (status = formData.status) => {
    try {
      setLoading(true);
      const formDataToSend = new FormData();
      formDataToSend.append("title", formData.title);
      formDataToSend.append("content", formData.content);
      formDataToSend.append("category", formData.category);
      formDataToSend.append("author", formData.author);
      formDataToSend.append("isFeatured", formData.isFeatured.toString());
      formDataToSend.append("faqs", JSON.stringify(faqs));
      formDataToSend.append("status", status);

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
        enqueueSnackbar(`Blog ${status === 'published' ? 'published' : 'updated'} successfully`, { 
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
        enqueueSnackbar(`Blog ${status === 'published' ? 'published' : 'created'} successfully`, { 
          variant: "success" 
        });
      }

      setOpenDialog(false);
      setHasUnsavedChanges(false);
      fetchBlogs();
      setLoading(false);
    } catch (error) {
      console.error("Error submitting blog:", error);
      enqueueSnackbar(`Failed to ${isEditMode ? "update" : "create"} blog`, {
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
    blog.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
    blog.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
    blog.author.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Box sx={{ padding: "20px" }}>
      {/* Header with stats */}
      <Box sx={{ mb: 4 }}>
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
          <Typography variant="h4">Blog Management</Typography>
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={handleOpenCreateDialog}
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
          />
        </Box>
        
        <Tabs 
          value={activeTab} 
          onChange={(e, newValue) => setActiveTab(newValue)}
          sx={{ mt: 2 }}
        >
          <Tab 
            icon={<Article />} 
            label={`All Blogs (${blogs.length})`} 
          />
          <Tab 
            icon={<VisibilityIcon />} 
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
                {filteredBlogs
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((blog) => (
                    <TableRow key={blog._id}>
                      <TableCell>
                        <CardMedia
                          component="img"
                          sx={{ width: 80, height: 60, objectFit: "cover" }}
                          image={blog.image}
                          alt={blog.title}
                        />
                      </TableCell>
                      <TableCell>
                        <Typography variant="subtitle1">{blog.title}</Typography>
                        <Typography variant="caption" color="text.secondary">
                          {blog.status === 'published' 
                            ? new Date(blog.publishedAt).toLocaleDateString()
                            : new Date(blog.updatedAt).toLocaleDateString()
                          }
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Chip label={blog.category} color="primary" size="small" />
                      </TableCell>
                      <TableCell>{blog.author}</TableCell>
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
                            <IconButton onClick={() => handleOpenEditDialog(blog)} size="small">
                              <Edit color="primary" />
                            </IconButton>
                          </Tooltip>
                          {blog.status === 'draft' ? (
                            <Tooltip title="Publish">
                              <IconButton onClick={() => handlePublishBlog(blog._id)} size="small">
                                <VisibilityIcon color="success" />
                              </IconButton>
                            </Tooltip>
                          ) : (
                            <Tooltip title="Move to Drafts">
                              <IconButton onClick={() => handleUnpublishBlog(blog._id)} size="small">
                                <VisibilityOffIcon color="warning" />
                              </IconButton>
                            </Tooltip>
                          )}
                          <Tooltip title="Delete">
                            <IconButton onClick={() => handleDelete(blog._id)} size="small">
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
            </Typography>
            <Stack direction="row" spacing={2} alignItems="center">
              <FormControlLabel
                control={
                  <Switch
                    checked={formData.status === 'published'}
                    onChange={handleStatusChange}
                    color="success"
                  />
                }
                label={formData.status === 'published' ? "Published" : "Draft"}
              />
              <Tooltip title="Save as Draft">
                <Button
                  variant="outlined"
                  startIcon={<SaveIcon />}
                  onClick={handleSaveDraft}
                  disabled={!hasUnsavedChanges}
                >
                  Save
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
              />
              <FormControl fullWidth margin="normal" required>
                <InputLabel>Category</InputLabel>
                <Select
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  label="Category"
                >
                  <MenuItem value="Technology">Technology</MenuItem>
                  <MenuItem value="Education">Education</MenuItem>
                  <MenuItem value="Health">Health</MenuItem>
                  <MenuItem value="Business">Business</MenuItem>
                  <MenuItem value="Entertainment">Entertainment</MenuItem>
                </Select>
              </FormControl>
              <TextField
                fullWidth
                label="Author"
                name="author"
                value={formData.author}
                onChange={handleInputChange}
                margin="normal"
                required
              />
              <FormControlLabel
                control={
                  <Checkbox
                    name="isFeatured"
                    checked={formData.isFeatured}
                    onChange={handleInputChange}
                    color="primary"
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
                />
                <label htmlFor="blog-image-upload">
                  <Button
                    variant="contained"
                    component="span"
                    startIcon={<CloudUpload />}
                  >
                    Upload Cover Image
                  </Button>
                </label>
                {previewImage && (
                  <Box sx={{ mt: 2 }}>
                    <Typography variant="subtitle2">Preview:</Typography>
                    <img
                      src={previewImage}
                      alt="Preview"
                      style={{ maxWidth: "100%", maxHeight: "200px", borderRadius: "8px" }}
                    />
                  </Box>
                )}
              </Box>

              {/* FAQ Section */}
              <Accordion 
                expanded={faqExpanded} 
                onChange={() => setFaqExpanded(!faqExpanded)}
                sx={{ mt: 3 }}
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
                    />
                    <Button
                      variant="outlined"
                      onClick={handleAddFaq}
                      sx={{ mt: 1 }}
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
                          >
                            <RemoveIcon />
                          </IconButton>
                        </ListItemSecondaryAction>
                      </ListItem>
                    ))}
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
          <Button onClick={handleCloseDialog} color="inherit">
            Cancel
          </Button>
          <Button
            onClick={() => handleSubmit('draft')}
            variant="outlined"
            color="secondary"
            disabled={loading || !formData.title || !formData.content}
          >
            Save as Draft
          </Button>
          <Button
            onClick={() => handleSubmit('published')}
            variant="contained"
            color="success"
            disabled={loading || !formData.title || !formData.content}
            startIcon={formData.status === 'published' ? <PublishedWithChanges /> : <VisibilityIcon />}
          >
            {loading ? (
              <CircularProgress size={24} />
            ) : isEditMode ? (
              formData.status === 'published' ? 'Update & Publish' : 'Publish Now'
            ) : (
              'Create & Publish'
            )}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Auto-save notification */}
      <Snackbar 
        open={hasUnsavedChanges} 
        message="Saving draft automatically..." 
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      />
    </Box>
  );
};

export default AdminBlogs;