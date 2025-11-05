import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { TextField, Button, Container, Typography, Box, Card, CardContent, Grid, IconButton, Paper, Snackbar, Alert } from '@mui/material';
import { Delete } from '@mui/icons-material';
import { Close } from '@mui/icons-material';


const AdminUpload = () => {
  const [name, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [location, setLocation] = useState('');
  const [courses, setCourses] = useState([]);
  const [locations, setLocations] = useState([]);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success'); // 'success' or 'error'

  useEffect(() => {
    fetchCourses();
    fetchLocations();
  }, []);

  const fetchCourses = async () => {
    try {
      const response = await axios.get('http://localhost:5000/courses');
      setCourses(response.data);
    } catch (error) {
      console.error('Error fetching courses', error);
    }
  };

  const fetchLocations = async () => {
    try {
      const response = await axios.get('http://localhost:5000/locations');
      setLocations(response.data);
    } catch (error) {
      console.error('Error fetching locations', error);
    }
  };

  const handleSubmitCourse = async (e) => {
    e.preventDefault();
    const courseData = { name, description, price: parseFloat(price) };
    try {
      const response = await axios.post('http://localhost:5000/courses', courseData);
      if (response.status === 201) {
        setSnackbarMessage('Course uploaded successfully!');
        setSnackbarSeverity('success');
        setTitle('');
        setDescription('');
        setPrice('');
        fetchCourses();
      }
    } catch (error) {
      setSnackbarMessage('Error uploading course.');
      setSnackbarSeverity('error');
    }
    setSnackbarOpen(true);
  };

  const handleSubmitLocation = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/locations', { name: location });
      if (response.status === 201) {
        setSnackbarMessage('Location uploaded successfully!');
        setSnackbarSeverity('success');
        setLocation('');
        fetchLocations();
      }
    } catch (error) {
      setSnackbarMessage('Error uploading location.');
      setSnackbarSeverity('error');
    }
    setSnackbarOpen(true);
  };

  const handleDeleteCourse = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/courses/${id}`);
      setCourses(courses.filter(course => course._id !== id));
      setSnackbarMessage('Course deleted successfully!');
      setSnackbarSeverity('success');
      setSnackbarOpen(true);
    } catch (error) {
      setSnackbarMessage('Error deleting course.');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
    }
  };

  const handleDeleteLocation = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/locations/${id}`);
      setLocations(locations.filter(loc => loc._id !== id));
      setSnackbarMessage('Location deleted successfully!');
      setSnackbarSeverity('success');
      setSnackbarOpen(true);
    } catch (error) {
      setSnackbarMessage('Error deleting location.');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
    }
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  return (
    <Container maxWidth="lg">
      <br />
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, boxShadow: 3, borderRadius: 2 }}>
            <Typography variant="h5" gutterBottom>Upload Course</Typography>
            <form onSubmit={handleSubmitCourse}>
              <TextField label="Title" fullWidth margin="normal" value={name} onChange={(e) => setTitle(e.target.value)} required />
              <Button type="submit" variant="contained" sx={{ mt: 2 }} color="primary" fullWidth>Upload Course</Button>
            </form>
          </Paper>
        </Grid>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, boxShadow: 3, borderRadius: 2 }}>
            <Typography variant="h5" gutterBottom>Upload Location</Typography>
            <form onSubmit={handleSubmitLocation}>
              <TextField label="Location Name" fullWidth margin="normal" value={location} onChange={(e) => setLocation(e.target.value)} required />
              <Button type="submit" sx={{ mt: 2 }} variant="contained" color="secondary" fullWidth>Upload Location</Button>
            </form>
          </Paper>
        </Grid>
      </Grid>

      <Box sx={{ mt: 4 }}>
        <Grid spacing={3} justifyContent="center">
        <Grid item xs={12} md={5}>
  <Typography variant="h5" align="start" fontWeight="bold" gutterBottom>
    Courses
  </Typography>
  <Grid container spacing={2}>
    {courses.map((course) => (
      <Grid item xs={6} sm={6} md={2} key={course._id}>
        <Card
          sx={{
            position: 'relative',
            boxShadow: 2,
            borderRadius: 3,
            p: 0,
            backgroundColor: '#f9f9f9',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <IconButton
            onClick={() => handleDeleteCourse(course._id)}
            sx={{
              position: 'absolute',
              top: 8,
              right: 10,
              color: 'error.main',
              '&:hover': {
                backgroundColor: 'transparent',
                color: 'error.dark',
              },
            }}
          >
            <Close />
          </IconButton>
          <CardContent sx={{ flex: 1 }}>
            {/* Title for the course */}
            <Typography variant="body2" sx={{ fontWeight: 'normal', mb: 0 }}>
              {course.name} {/* Assuming course.name contains the name */}
            </Typography>
            {/* Course name */}
            <Typography variant="body2" sx={{ fontWeight: 'normal' }}>
              {course.name}
            </Typography>
          </CardContent>
        </Card>
      </Grid>
    ))}
  </Grid>
</Grid>

          <Grid item xs={12} md={5}>
            <Typography variant="h5" fontWeight="bold" align="start" sx={{mt:5}} gutterBottom>Locations</Typography>
            <Grid container spacing={2}>
              {locations.map((loc) => (
                <Grid item xs={6} sm={6} md={2} key={loc._id}>
                  <Card sx={{
                    position: 'relative',
                    boxShadow: 2,
                    borderRadius: 3,
                    transition: 'transform 0.3s, box-shadow 0.3s',
                 
                    p: 0,
                    backgroundColor: '#f9f9f9',
                    display: 'flex',
                    flexDirection: 'column',
                  }}>
                    <IconButton
                      onClick={() => handleDeleteLocation(loc._id)}
                      sx={{
                        position: 'absolute',
                        top: 8,
                        right: 10,
                        color: 'error.main',
                        '&:hover': {
                          backgroundColor: 'transparent',
                          color: 'error.dark',
                        },
                      }}
                    >
                      <Close />
                    </IconButton>
                    <CardContent sx={{ flex: 1 }}>
                      <Typography variant="p" sx={{ fontWeight: 'normal' }}>{loc.name}</Typography>
                    </CardContent>
            
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Grid>
        </Grid>
      </Box>

      {/* Snackbar for showing messages */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }} // Positioned to the right-bottom
      >
        <Alert onClose={handleSnackbarClose} severity={snackbarSeverity} sx={{ width: '100%' }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default AdminUpload;
