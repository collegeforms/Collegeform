import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  TextField, Button, Container, Typography, Box, 
  Card, CardContent, Grid, IconButton, Paper, 
  Snackbar, Alert, MenuItem, Select, InputLabel, 
  FormControl, Dialog, DialogTitle, DialogContent, 
  DialogActions, Chip, Autocomplete
} from '@mui/material';
import { Close, Edit } from '@mui/icons-material';

const AdminUpload = () => {
  const API_URL = "https://collegeform.onrender.com" || "https://collegeform-production.up.railway.app" || "http://localhost:5000";


  // State for courses
  const [name, setName] = useState('');
  const [courseType, setCourseType] = useState('UG');
  const [selectedSpecializations, setSelectedSpecializations] = useState([]);
  const [courses, setCourses] = useState([]);
  const [editCourseId, setEditCourseId] = useState(null);
  const [editCourseName, setEditCourseName] = useState('');
  const [editCourseType, setEditCourseType] = useState('UG');
  const [editCourseSpecializations, setEditCourseSpecializations] = useState([]);
  const [openCourseDialog, setOpenCourseDialog] = useState(false);

  // State for specializations
  const [specializations, setSpecializations] = useState([]);

  // State for locations
  const [location, setLocation] = useState('');
  const [locations, setLocations] = useState([]);
  const [editLocationId, setEditLocationId] = useState(null);
  const [editLocationName, setEditLocationName] = useState('');
  const [openLocationDialog, setOpenLocationDialog] = useState(false);

  // Snackbar state
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');

  useEffect(() => {
    fetchCourses();
    fetchLocations();
    fetchSpecializations();
  }, []);

  // Fetch functions
  const fetchCourses = async () => {
    try {
      const response = await axios.get(`${API_URL}/courses`);
      setCourses(response.data);
    } catch (error) {
      console.error('Error fetching courses', error);
      showSnackbar('Error fetching courses', 'error');
    }
  };

  const fetchSpecializations = async () => {
    try {
      const response = await axios.get(`${API_URL}/specializations`);
      setSpecializations(response.data);
    } catch (error) {
      console.error('Error fetching specializations', error);
      showSnackbar('Error fetching specializations', 'error');
    }
  };

  const fetchLocations = async () => {
    try {
      const response = await axios.get(`${API_URL}/locations`);
      setLocations(response.data);
    } catch (error) {
      console.error('Error fetching locations', error);
      showSnackbar('Error fetching locations', 'error');
    }
  };

  // Course functions
  const handleSubmitCourse = async (e) => {
    e.preventDefault();
    const courseData = { 
      name, 
      type: courseType,
      specializations: selectedSpecializations.map(spec => spec._id)
    };
    
    try {
      const response = await axios.post(`${API_URL}/courses`, courseData);
      if (response.status === 201) {
        showSnackbar('Course uploaded successfully!', 'success');
        setName('');
        setCourseType('UG');
        setSelectedSpecializations([]);
        fetchCourses();
      }
    } catch (error) {
      showSnackbar('Error uploading course.', 'error');
    }
  };

  const handleEditCourse = (course) => {
    setEditCourseId(course._id);
    setEditCourseName(course.name);
    setEditCourseType(course.type);
    setEditCourseSpecializations(course.specializations || []);
    setOpenCourseDialog(true);
  };

  const handleUpdateCourse = async () => {
    try {
      const response = await axios.put(`${API_URL}/courses/${editCourseId}`, {
        name: editCourseName,
        type: editCourseType,
        specializations: editCourseSpecializations.map(spec => spec._id || spec)
      });
      if (response.status === 200) {
        showSnackbar('Course updated successfully!', 'success');
        fetchCourses();
        setOpenCourseDialog(false);
      }
    } catch (error) {
      showSnackbar('Error updating course.', 'error');
    }
  };

  const handleDeleteCourse = async (id) => {
    try {
      await axios.delete(`${API_URL}/courses/${id}`);
      showSnackbar('Course deleted successfully!', 'success');
      fetchCourses();
    } catch (error) {
      showSnackbar('Error deleting course.', 'error');
    }
  };

  // Location functions (unchanged from your original code)
  const handleSubmitLocation = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${API_URL}/locations`, { name: location });
      if (response.status === 201) {
        showSnackbar('Location uploaded successfully!', 'success');
        setLocation('');
        fetchLocations();
      }
    } catch (error) {
      showSnackbar('Error uploading location.', 'error');
    }
  };

  const handleEditLocation = (loc) => {
    setEditLocationId(loc._id);
    setEditLocationName(loc.name);
    setOpenLocationDialog(true);
  };

  const handleUpdateLocation = async () => {
    try {
      const response = await axios.put(`${API_URL}/locations/${editLocationId}`, {
        name: editLocationName
      });
      if (response.status === 200) {
        showSnackbar('Location updated successfully!', 'success');
        fetchLocations();
        setOpenLocationDialog(false);
      }
    } catch (error) {
      showSnackbar('Error updating location.', 'error');
    }
  };

  const handleDeleteLocation = async (id) => {
    try {
      await axios.delete(`${API_URL}/locations/${id}`);
      showSnackbar('Location deleted successfully!', 'success');
      fetchLocations();
    } catch (error) {
      showSnackbar('Error deleting location.', 'error');
    }
  };

  // Common functions
  const showSnackbar = (message, severity) => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setSnackbarOpen(true);
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
              <Box sx={{ display: 'flex', gap: 2 }}>
                <TextField 
                  label="Course Name" 
                  fullWidth 
                  margin="normal" 
                  value={name} 
                  onChange={(e) => setName(e.target.value)} 
                  required 
                />
                <FormControl fullWidth margin="normal" required>
                  <InputLabel>Course Type</InputLabel>
                  <Select
                    value={courseType}
                    label="Course Type"
                    onChange={(e) => setCourseType(e.target.value)}
                  >
                    <MenuItem value="UG">Undergraduate (UG)</MenuItem>
                    <MenuItem value="PG">Postgraduate (PG)</MenuItem>
                    <MenuItem value="Certification/Diploma">Certification/Diploma</MenuItem>

                  </Select>
                </FormControl>
              </Box>
              
              <FormControl fullWidth margin="normal">
                <Autocomplete
                  multiple
                  options={specializations}
                  getOptionLabel={(option) => option.name}
                  value={selectedSpecializations}
                  onChange={(event, newValue) => {
                    setSelectedSpecializations(newValue);
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Specializations"
                      placeholder="Select specializations"
                    />
                  )}
                  renderTags={(value, getTagProps) =>
                    value.map((option, index) => (
                      <Chip
                        label={option.name}
                        {...getTagProps({ index })}
                        key={option._id}
                      />
                    ))
                  }
                />
              </FormControl>
              
              <Button type="submit" variant="contained" sx={{ mt: 2 }} color="primary" fullWidth>
                Upload Course
              </Button>
            </form>
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, boxShadow: 3, borderRadius: 2 }}>
            <Typography variant="h5" gutterBottom>Upload Location</Typography>
            <form onSubmit={handleSubmitLocation}>
              <TextField 
                label="Location Name" 
                fullWidth 
                margin="normal" 
                value={location} 
                onChange={(e) => setLocation(e.target.value)} 
                required 
              />
              <Button type="submit" sx={{ mt: 2 }} variant="contained" color="secondary" fullWidth>
                Upload Location
              </Button>
            </form>
          </Paper>
        </Grid>
      </Grid>

      <Box sx={{ mt: 4 }}>
        <Grid container spacing={3} justifyContent="center">
          <Grid item xs={12}>
            <Typography variant="h5" align="start" fontWeight="bold" gutterBottom>
              Courses
            </Typography>
            <Grid container spacing={2}>
              {courses.map((course) => (
                <Grid item xs={6} sm={4} md={3} lg={2} key={course._id}>
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
                    <Box sx={{ position: 'absolute', top: 8, right: 8 }}>
                      <IconButton
                        onClick={() => handleEditCourse(course)}
                        sx={{ color: 'primary.main' }}
                      >
                        <Edit fontSize="small" />
                      </IconButton>
                      <IconButton
                        onClick={() => handleDeleteCourse(course._id)}
                        sx={{ color: 'error.main' }}
                      >
                        <Close fontSize="small" />
                      </IconButton>
                    </Box>
                    <CardContent sx={{ flex: 1 }}>
                      <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                        {course.name}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {course.type}
                      </Typography>
                      <Box sx={{ mt: 1 }}>
                        {course.specializations?.map((spec) => (
                          <Chip
                            key={spec._id || spec}
                            label={spec.name}
                            size="small"
                            sx={{ mr: 0.5, mb: 0.5 }}
                          />
                        ))}
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Grid>

          <Grid item xs={12}>
            <Typography variant="h5" fontWeight="bold" align="start" sx={{ mt: 5 }} gutterBottom>
              Locations
            </Typography>
            <Grid container spacing={2}>
              {locations.map((loc) => (
                <Grid item xs={6} sm={4} md={3} lg={2} key={loc._id}>
                  <Card sx={{
                    position: 'relative',
                    boxShadow: 2,
                    borderRadius: 3,
                    p: 0,
                    backgroundColor: '#f9f9f9',
                    display: 'flex',
                    flexDirection: 'column',
                  }}>
                    <Box sx={{ position: 'absolute', top: 8, right: 8 }}>
                      <IconButton
                        onClick={() => handleEditLocation(loc)}
                        sx={{ color: 'primary.main' }}
                      >
                        <Edit fontSize="small" />
                      </IconButton>
                      <IconButton
                        onClick={() => handleDeleteLocation(loc._id)}
                        sx={{ color: 'error.main' }}
                      >
                        <Close fontSize="small" />
                      </IconButton>
                    </Box>
                    <CardContent sx={{ flex: 1 }}>
                      <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                        {loc.name}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Grid>
        </Grid>
      </Box>

      {/* Edit Course Dialog */}
      <Dialog open={openCourseDialog} onClose={() => setOpenCourseDialog(false)}>
        <DialogTitle>Edit Course</DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2, minWidth: 400 }}>
            <TextField
              label="Course Name"
              fullWidth
              margin="normal"
              value={editCourseName}
              onChange={(e) => setEditCourseName(e.target.value)}
              required
            />
            <FormControl fullWidth margin="normal" required>
              <InputLabel>Course Type</InputLabel>
              <Select
                value={editCourseType}
                label="Course Type"
                onChange={(e) => setEditCourseType(e.target.value)}
              >
                <MenuItem value="UG">Undergraduate (UG)</MenuItem>
                <MenuItem value="PG">Postgraduate (PG)</MenuItem>
              </Select>
            </FormControl>
            
            <FormControl fullWidth margin="normal">
              <Autocomplete
                multiple
                options={specializations}
                getOptionLabel={(option) => option.name}
                value={editCourseSpecializations}
                onChange={(event, newValue) => {
                  setEditCourseSpecializations(newValue);
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Specializations"
                    placeholder="Select specializations"
                  />
                )}
                renderTags={(value, getTagProps) =>
                  value.map((option, index) => (
                    <Chip
                      label={option.name}
                      {...getTagProps({ index })}
                      key={option._id || option}
                    />
                  ))
                }
              />
            </FormControl>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenCourseDialog(false)}>Cancel</Button>
          <Button onClick={handleUpdateCourse} variant="contained" color="primary">
            Update
          </Button>
        </DialogActions>
      </Dialog>

      {/* Edit Location Dialog */}
      <Dialog open={openLocationDialog} onClose={() => setOpenLocationDialog(false)}>
        <DialogTitle>Edit Location</DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2, minWidth: 400 }}>
            <TextField
              label="Location Name"
              fullWidth
              margin="normal"
              value={editLocationName}
              onChange={(e) => setEditLocationName(e.target.value)}
              required
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenLocationDialog(false)}>Cancel</Button>
          <Button onClick={handleUpdateLocation} variant="contained" color="primary">
            Update
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert onClose={handleSnackbarClose} severity={snackbarSeverity} sx={{ width: '100%' }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default AdminUpload;