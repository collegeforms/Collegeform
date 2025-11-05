import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  TextField, Button, Container, Typography, Box, Paper, Grid,
  IconButton, Snackbar, Alert, Rating, Dialog, DialogTitle,
  DialogContent, DialogActions
} from '@mui/material';
import { Close, Add, Edit, Delete } from '@mui/icons-material';

const AdminReviews = () => {
  const API_URL = "https://collegeform.onrender.com" || "https://collegeform-production.up.railway.app" || "http://localhost:5000";

  
  const [reviews, setReviews] = useState([]);
  const [reviewForm, setReviewForm] = useState({
    name: '',
    course: '',
    review: '',
    rating: 3
  });
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingReview, setEditingReview] = useState(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/reviews`);
      setReviews(response.data);

      console.log(response.data);
      
    } catch (error) {
      console.error('Error fetching reviews', error);
      setSnackbarMessage('Error fetching reviews.');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setReviewForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleRatingChange = (event, newValue) => {
    setReviewForm(prev => ({
      ...prev,
      rating: newValue
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingReview) {
        // Update existing review
        await axios.put(`${API_URL}/api/reviews/${editingReview._id}`, reviewForm);
        setSnackbarMessage('Review updated successfully!');
      } else {
        // Create new review
        await axios.post(`${API_URL}/api/reviews`, reviewForm);
        setSnackbarMessage('Review added successfully!');
      }
      
      setSnackbarSeverity('success');
      resetForm();
      setDialogOpen(false);
      fetchReviews();
    } catch (error) {
      setSnackbarMessage('Error saving review.');
      setSnackbarSeverity('error');
    }
    setSnackbarOpen(true);
  };

  const handleEdit = (review) => {
    setEditingReview(review);
    setReviewForm({
      name: review.name,
      course: review.course,
      review: review.review,
      rating: review.rating
    });
    setDialogOpen(true);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API_URL}/api/reviews/${id}`);
      setReviews(reviews.filter(review => review._id !== id));
      setSnackbarMessage('Review deleted successfully!');
      setSnackbarSeverity('success');
    } catch (error) {
      setSnackbarMessage('Error deleting review.');
      setSnackbarSeverity('error');
    }
    setSnackbarOpen(true);
  };

  const resetForm = () => {
    setReviewForm({
      name: '',
      course: '',
      review: '',
      rating: 3
    });
    setEditingReview(null);
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
    resetForm();
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  return (
    <Container maxWidth="lg"> 
    <br />
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" fontWeight="bold">Testimonials</Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => setDialogOpen(true)}
          sx={{ backgroundColor: '#5B5EFF', color: 'white' }}
        >
          Add Review
        </Button>
      </Box>

      <Grid container spacing={3}>
        {reviews.map(review => (
          <Grid item xs={12} md={6} lg={4} key={review._id}>
            <Paper sx={{ p: 3, boxShadow: 3, borderRadius: 2, height: '100%' }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                <Box>
                  <Typography variant="h6" fontWeight="bold">{review.name}</Typography>
                  <Typography variant="body2" color="textSecondary">{review.course}</Typography>
                  <Typography variant="caption" color="textSecondary">
                    {formatDate(review.createdAt)}
                  </Typography>
                </Box>
                <Box>
                  <IconButton onClick={() => handleEdit(review)} color="primary" size="small">
                    <Edit />
                  </IconButton>
                  <IconButton onClick={() => handleDelete(review._id)} color="error" size="small">
                    <Delete />
                  </IconButton>
                </Box>
              </Box>
              
              <Rating value={review.rating} readOnly sx={{ mb: 2 }} />
              
              <Typography variant="body1" sx={{ fontStyle: 'italic' }}>
                "{review.review}"
              </Typography>
            </Paper>
          </Grid>
        ))}
      </Grid>

      {/* Add/Edit Review Dialog */}
      <Dialog open={dialogOpen} onClose={handleDialogClose} maxWidth="sm" fullWidth>
        <DialogTitle>
          {editingReview ? 'Edit Review' : 'Add New Review'}
        </DialogTitle>
        <form onSubmit={handleSubmit}>
          <DialogContent>
            <TextField
              autoFocus
              margin="dense"
              name="name"
              label="Student Name"
              type="text"
              fullWidth
              variant="outlined"
              value={reviewForm.name}
              onChange={handleInputChange}
              required
              sx={{ mb: 2 }}
            />
            <TextField
              margin="dense"
              name="course"
              label="Course"
              type="text"
              fullWidth
              variant="outlined"
              value={reviewForm.course}
              onChange={handleInputChange}
              required
              sx={{ mb: 2 }}
            />
            <TextField
              margin="dense"
              name="review"
              label="Review"
              type="text"
              fullWidth
              variant="outlined"
              multiline
              rows={4}
              value={reviewForm.review}
              onChange={handleInputChange}
              required
              sx={{ mb: 2 }}
            />
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Typography component="legend" sx={{ mr: 2 }}>Rating:</Typography>
              <Rating
                name="rating"
                value={reviewForm.rating}
                onChange={handleRatingChange}
                precision={0.5}
              />
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleDialogClose}>Cancel</Button>
            <Button type="submit" variant="contained">
              {editingReview ? 'Update' : 'Add'} Review
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      <Snackbar open={snackbarOpen} autoHideDuration={6000} onClose={handleSnackbarClose}>
        <Alert onClose={handleSnackbarClose} severity={snackbarSeverity} sx={{ width: '100%' }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default AdminReviews;