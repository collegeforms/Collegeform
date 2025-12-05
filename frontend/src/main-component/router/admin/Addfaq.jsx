import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  TextField,
  Button,
  Card,
  CardContent,
  Typography,
  Alert,
  Switch,
  FormControlLabel,
  CircularProgress,
  Snackbar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Chip,
  Grid,
  Paper
} from '@mui/material';
import { Send, Clear, Delete, Edit, Visibility, VisibilityOff } from '@mui/icons-material';
import axios from 'axios';
import './Addfaq.css';

const Addfaq = () => {
  const [formData, setFormData] = useState({
    question: '',
    answer: '',
    isActive: true
  });
  const [faqs, setFaqs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [faqToDelete, setFaqToDelete] = useState(null);
  const API_URL = "https://www.collegeforms.in";  

  useEffect(() => {
    fetchFAQs();
  }, []);

  const getAuthHeaders = () => {
    const adminToken = localStorage.getItem('adminToken');
    if (!adminToken) {
      setError('Admin authentication required. Please log in.');
      return null;
    }
    return {
      'Authorization': `Bearer ${adminToken}`,
      'Content-Type': 'application/json'
    };
  };

  const fetchFAQs = async () => {
    try {
      setFetchLoading(true);
      const response = await axios.get(`${API_URL}/api/faqs`);
      setFaqs(response.data);
      setError('');
    } catch (err) {
      setError('Failed to load FAQs. Please try again.');
      console.error('Error fetching FAQs:', err);
    } finally {
      setFetchLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    setError('');

    const headers = getAuthHeaders();
    if (!headers) {
      setLoading(false);
      return;
    }

    try {
      await axios.post(`${API_URL}/api/faqs`, formData, { headers });
      setMessage('FAQ added successfully!');
      setSnackbarOpen(true);
      setFormData({
        question: '',
        answer: '',
        isActive: true
      });
      // Refresh the FAQ list
      fetchFAQs();
    } catch (err) {
      if (err.response?.status === 401) {
        setError('Unauthorized. Please check your admin credentials.');
      } else if (err.response?.status === 403) {
        setError('Access denied. Admin privileges required.');
      } else {
        setError('Failed to add FAQ. Please try again.');
      }
      console.error('Error adding FAQ:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteClick = (faq) => {
    setFaqToDelete(faq);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!faqToDelete) return;

    const headers = getAuthHeaders();
    if (!headers) return;

    try {
      await axios.delete(`${API_URL}/api/faqs/${faqToDelete._id}`, { headers });
      setMessage('FAQ deleted successfully!');
      setSnackbarOpen(true);
      setFaqs(faqs.filter(faq => faq._id !== faqToDelete._id));
    } catch (err) {
      setError('Failed to delete FAQ. Please try again.');
      console.error('Error deleting FAQ:', err);
    } finally {
      setDeleteDialogOpen(false);
      setFaqToDelete(null);
    }
  };

  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false);
    setFaqToDelete(null);
  };

  const handleClear = () => {
    setFormData({
      question: '',
      answer: '',
      isActive: true
    });
    setMessage('');
    setError('');
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  const checkAdminAuth = () => {
    const adminToken = localStorage.getItem('adminToken');
    if (!adminToken) {
      return (
        <Container maxWidth="md" sx={{ py: 8 }}>
          <Card className="auth-error-card">
            <CardContent sx={{ p: 4, textAlign: 'center' }}>
              <Typography variant="h5" color="error" gutterBottom>
                Authentication Required
              </Typography>
              <Typography variant="body1" sx={{ mb: 3 }}>
                Please log in as admin to manage FAQs.
              </Typography>
              <Button 
                variant="contained" 
                color="primary"
                onClick={() => window.location.href = '/admin-login'}
              >
                Go to Admin Login
              </Button>
            </CardContent>
          </Card>
        </Container>
      );
    }
    return null;
  };

  const authError = checkAdminAuth();
  if (authError) return authError;

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Add FAQ Form */}
      <Card className="add-faq-card" sx={{ mb: 4 }}>
        <CardContent sx={{ p: 4 }}>
          <Typography 
            variant="h4" 
            component="h1" 
            gutterBottom 
            className="add-faq-title"
          >
            Add New FAQ
          </Typography>

          {error && (
            <Alert 
              severity="error" 
              sx={{ mb: 3 }}
              onClose={() => setError('')}
            >
              {error}
            </Alert>
          )}

          <form onSubmit={handleSubmit}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              <TextField
                label="Question *"
                name="question"
                value={formData.question}
                onChange={handleChange}
                required
                fullWidth
                multiline
                rows={2}
                variant="outlined"
                className="form-field"
                placeholder="Enter the question that users frequently ask"
              />

              <TextField
                label="Answer *"
                name="answer"
                value={formData.answer}
                onChange={handleChange}
                required
                fullWidth
                multiline
                rows={4}
                variant="outlined"
                className="form-field"
                placeholder="Provide a clear and helpful answer"
              />

              <FormControlLabel
                control={
                  <Switch
                    name="isActive"
                    checked={formData.isActive}
                    onChange={handleChange}
                    color="primary"
                    className="active-switch"
                  />
                }
                label={
                  <Typography variant="body1" className="switch-label">
                    Active (visible to users)
                  </Typography>
                }
                sx={{ alignSelf: 'flex-start', mt: 1 }}
              />

              <Box className="action-buttons">
                <Button
                  type="submit"
                  variant="contained"
                  size="large"
                  disabled={loading}
                  startIcon={loading ? <CircularProgress size={20} /> : <Send />}
                  className="submit-button me-4 mb-2"
                >
                  {loading ? 'Adding FAQ...' : 'Add FAQ'}
                </Button>
                
                <Button
                  type="button"
                  variant="outlined"
                  size="large"
                  onClick={handleClear}
                  startIcon={<Clear />}
                  className="clear-button mb-2"
                >
                  Clear Form
                </Button>
              </Box>
            </Box>
          </form>
        </CardContent>
      </Card>

      {/* FAQ List */}
      <Card className="faq-list-card">
        <CardContent sx={{ p: 4 }}>
          <Typography 
            variant="h5" 
            component="h2" 
            gutterBottom 
            className="faq-list-title"
            sx={{ mb: 3 }}
          >
            Manage FAQs ({faqs.length})
          </Typography>

          {fetchLoading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
              <CircularProgress />
            </Box>
          ) : faqs.length === 0 ? (
            <Paper sx={{ p: 4, textAlign: 'center' }}>
              <Typography variant="h6" color="text.secondary">
                No FAQs found. Add your first FAQ above.
              </Typography>
            </Paper>
          ) : (
            <Grid container spacing={3}>
              {faqs.map((faq, index) => (
                <Grid item xs={12} key={faq._id}>
                  <Paper className="faq-item" sx={{ p: 3, position: 'relative' }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 2 }}>
                      <Box sx={{ flex: 1 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
                          <Chip
                            label={`#${index + 1}`}
                            size="small"
                            color="primary"
                            variant="outlined"
                          />
                          <Chip
                            icon={faq.isActive ? <Visibility /> : <VisibilityOff />}
                            label={faq.isActive ? 'Active' : 'Inactive'}
                            color={faq.isActive ? 'success' : 'default'}
                            size="small"
                          />
                        </Box>
                        <Typography variant="h6" className="faq-question" sx={{ mb: 1 }}>
                          {faq.question}
                        </Typography>
                        <Typography variant="body1" className="faq-answer" color="text.secondary">
                          {faq.answer}
                        </Typography>
                        <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                          Created: {new Date(faq.createdAt).toLocaleDateString()}
                        </Typography>
                      </Box>
                      <Box className="faq-actions">
                        <IconButton
                          onClick={() => handleDeleteClick(faq)}
                          color="error"
                          className="delete-button"
                          size="large"
                        >
                          <Delete />
                        </IconButton>
                      </Box>
                    </Box>
                  </Paper>
                </Grid>
              ))}
            </Grid>
          )}
        </CardContent>
      </Card>

      {/* Success Snackbar */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={handleSnackbarClose} severity="success" sx={{ width: '100%' }}>
          {message}
        </Alert>
      </Snackbar>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={handleDeleteCancel}
        className="delete-dialog"
      >
        <DialogTitle className="delete-dialog-title">
          Confirm Delete
        </DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete this FAQ? This action cannot be undone.
          </Typography>
          {faqToDelete && (
            <Paper sx={{ p: 2, mt: 2, bgcolor: 'grey.50' }}>
              <Typography variant="subtitle2" color="text.secondary">
                Question:
              </Typography>
              <Typography variant="body2" sx={{ fontStyle: 'italic' }}>
                "{faqToDelete.question}"
              </Typography>
            </Paper>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteCancel} className="cancel-button">
            Cancel
          </Button>
          <Button 
            onClick={handleDeleteConfirm} 
            color="error" 
            variant="contained"
            className="confirm-delete-button"
            startIcon={<Delete />}
          >
            Delete FAQ
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Addfaq;