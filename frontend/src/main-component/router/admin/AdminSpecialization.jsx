import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { TextField, Button, Container, Typography, Box, Paper, Grid, IconButton, Snackbar, Alert } from '@mui/material';
import { Close } from '@mui/icons-material';

const AdminSpecialization = () => {
  const API_URL =  "https://collegeform.onrender.com" || "https://collegeform-production.up.railway.app" || "http://localhost:5000";
  
  const [specialization, setSpecialization] = useState('');
  const [priceRange, setPriceRange] = useState({ min: '', max: '' });
  const [specializations, setSpecializations] = useState([]);
  const [priceRanges, setPriceRanges] = useState([]);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');

  useEffect(() => {
    fetchSpecializations();
    fetchPriceRanges();
  }, []);

  const fetchSpecializations = async () => {
    try {
      const response = await axios.get(`${API_URL}/specializations`);
      setSpecializations(response.data);
    } catch (error) {
      console.error('Error fetching specializations', error);
    }
  };

  const fetchPriceRanges = async () => {
    try {
      const response = await axios.get(`${API_URL}/priceRanges`);
      setPriceRanges(response.data);
    } catch (error) {
      console.error('Error fetching price ranges', error);
    }
  };

  const formatPrice = (price) => {
    // Ensure that we remove decimals if the number is a whole number
    const formattedPrice = new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(price);
    return formattedPrice.replace(/\.00$/, '');  // Remove ".00" at the end if it exists
  };

  const handleSpecializationSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${API_URL}/specializations`, { name: specialization });
      if (response.status === 201) {
        setSnackbarMessage('Specialization added successfully!');
        setSnackbarSeverity('success');
        setSpecialization('');
        fetchSpecializations();
      }
    } catch (error) {
      setSnackbarMessage('Error adding specialization.');
      setSnackbarSeverity('error');
    }
    setSnackbarOpen(true);
  };

  const handlePriceRangeSubmit = async (e) => {
    e.preventDefault();
    
    const min = parseInt(priceRange.min);
    const max = parseInt(priceRange.max);

    // Check if min and max are within the range
    if (min < 1 || max > 2 || min >= max) {
      setSnackbarMessage('Price range must be between ₹1,00,000 and ₹20,00,000, and min should be less than max.');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
      return;
    }

    try {
      const response = await axios.post(`${API_URL}/priceRanges`, priceRange);
      if (response.status === 201) {
        setSnackbarMessage('Price range added successfully!');
        setSnackbarSeverity('success');
        setPriceRange({ min: '', max: '' });
        fetchPriceRanges();
      }
    } catch (error) {
      setSnackbarMessage('Error adding price range.');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
    }
  };

  const handleDeleteSpecialization = async (id) => {
    try {
      await axios.delete(`${API_URL}/specializations/${id}`);
      setSpecializations(specializations.filter(spec => spec._id !== id));
      setSnackbarMessage('Specialization deleted successfully!');
      setSnackbarSeverity('success');
      setSnackbarOpen(true);
    } catch (error) {
      setSnackbarMessage('Error deleting specialization.');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
    }
  };

  const handleDeletePriceRange = async (id) => {
    try {
      await axios.delete(`${API_URL}/priceRanges/${id}`);
      setPriceRanges(priceRanges.filter(range => range._id !== id));
      setSnackbarMessage('Price range deleted successfully!');
      setSnackbarSeverity('success');
      setSnackbarOpen(true);
    } catch (error) {
      setSnackbarMessage('Error deleting price range.');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
    }
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  return (
    <Container maxWidth="lg">
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, boxShadow: 3, borderRadius: 2, height: '100%', display: 'flex', flexDirection: 'column' }}>
            <Typography variant="h4" fontWeight="bold" gutterBottom>Specializations</Typography>
            <form onSubmit={handleSpecializationSubmit} style={{ display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
              <TextField
                label="Specialization Name"
                fullWidth
                margin="normal"
                value={specialization}
                onChange={(e) => setSpecialization(e.target.value)}
                required
              />
              <Box sx={{ flexGrow: 1 }} />  {/* Pushes the button to the bottom */}
              <Button
                type="submit"
                variant="contained"
                sx={{ mt: 2, backgroundColor: '#5B5EFF', color: 'white' }}
                fullWidth
              >
                Add Specialization
              </Button>
            </form>
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, boxShadow: 3, borderRadius: 2, height: '100%' }}>
            <Typography variant="h4" fontWeight="bold" gutterBottom>Price Ranges</Typography>
            <form onSubmit={handlePriceRangeSubmit}>
              <TextField
                label="Min Price"
                type="number"
                fullWidth
                margin="normal"
                value={priceRange.min}
                onChange={(e) => setPriceRange({ ...priceRange, min: e.target.value })}
                required
                inputProps={{ min: 1, max: 2000000 }}
              />
              <TextField
                label="Max Price"
                type="number"
                fullWidth
                margin="normal"
                value={priceRange.max}
                onChange={(e) => setPriceRange({ ...priceRange, max: e.target.value })}
                required
                inputProps={{ min: 1, max: 2000000 }}
              />
              <Button
                type="submit"
                variant="contained"
                sx={{ mt: 2, backgroundColor: '#5B5EFF', color: 'white' }}
                fullWidth
              >
                Add Price Range
              </Button>
            </form>
          </Paper>
        </Grid>
      </Grid>

      <Box sx={{ mt: 4 }}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Typography variant="h5" fontWeight="bold" gutterBottom>Existing Specializations</Typography>
            {specializations.map(spec => (
              <Paper key={spec._id} sx={{ p: 2, mb: 2, display: 'flex', justifyContent: 'space-between' }}>
                <Typography>{spec.name}</Typography>
                <IconButton onClick={() => handleDeleteSpecialization(spec._id)} color="error"><Close /></IconButton>
              </Paper>
            ))}
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography variant="h5" fontWeight="bold" gutterBottom>Existing Price Ranges</Typography>
            {priceRanges.map(range => (
              <Paper key={range._id} sx={{ p: 2, mb: 2, display: 'flex', justifyContent: 'space-between' }}>
                <Typography>{`${formatPrice(range.min)} - ${formatPrice(range.max)}`}</Typography>
                <IconButton onClick={() => handleDeletePriceRange(range._id)} color="error"><Close /></IconButton>
              </Paper>
            ))}
          </Grid>
        </Grid>
      </Box>

      <Snackbar open={snackbarOpen} autoHideDuration={6000} onClose={handleSnackbarClose}>
        <Alert onClose={handleSnackbarClose} severity={snackbarSeverity} sx={{ width: '100%' }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default AdminSpecialization;
