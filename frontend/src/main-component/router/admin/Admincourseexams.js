import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { TextField, Button, Container, Typography, Box, Paper, Grid, IconButton, Snackbar, Alert, Chip, Select, MenuItem, FormControl, InputLabel, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import { Close, Add, Edit } from '@mui/icons-material';

const Admincourseexams = () => {
  const API_URL = "https://www.collegeforms.in";

  
  const [courseName, setCourseName] = useState('');
  const [courses, setCourses] = useState([]);
  const [exams, setExams] = useState([]);
  const [selectedExams, setSelectedExams] = useState([]); // Changed to array for multiple selection
  const [selectedCourseForExam, setSelectedCourseForExam] = useState('');
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');
  
  // Edit functionality states
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState(null);
  const [editCourseName, setEditCourseName] = useState('');

  useEffect(() => {
    fetchCourses();
    fetchExams();
  }, []);

  const fetchCourses = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/managexams`);
      setCourses(response.data);
    } catch (error) {
      console.error('Error fetching courses', error);
    }
  };

  const fetchExams = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/exams`);
      setExams(response.data);
    } catch (error) {
      console.error('Error fetching exams', error);
    }
  };

  // Create new course
  const handleCreateCourse = async () => {
    if (!courseName.trim()) {
      setSnackbarMessage('Please enter a course name!');
      setSnackbarSeverity('warning');
      setSnackbarOpen(true);
      return;
    }

    try {
      const response = await axios.post(`${API_URL}/api/managexams`, {
        name: courseName.trim()
      });
      
      if (response.status === 201) {
        setSnackbarMessage('Course created successfully!');
        setSnackbarSeverity('success');
        setCourseName('');
        fetchCourses();
      }
    } catch (error) {
      if (error.response && error.response.data.error) {
        setSnackbarMessage(error.response.data.error);
      } else {
        setSnackbarMessage('Error creating course.');
      }
      setSnackbarSeverity('error');
    }
    setSnackbarOpen(true);
  };

  const handleAddExamsToCourse = async () => {
    if (!selectedCourseForExam || selectedExams.length === 0) {
      setSnackbarMessage('Please select both course and at least one exam!');
      setSnackbarSeverity('warning');
      setSnackbarOpen(true);
      return;
    }

    try {
      // Add exams one by one
      const addExamPromises = selectedExams.map(examId => 
        axios.put(`${API_URL}/api/managexams/${selectedCourseForExam}/exams`, {
          examId: examId
        })
      );

      const results = await Promise.allSettled(addExamPromises);
      
      const successfulAdds = results.filter(result => result.status === 'fulfilled').length;
      const failedAdds = results.filter(result => result.status === 'rejected').length;

      if (failedAdds === 0) {
        setSnackbarMessage(`Successfully added ${successfulAdds} exam(s) to course!`);
        setSnackbarSeverity('success');
      } else if (successfulAdds > 0) {
        setSnackbarMessage(`Added ${successfulAdds} exam(s), but ${failedAdds} failed (may already exist in course)`);
        setSnackbarSeverity('warning');
      } else {
        setSnackbarMessage('Failed to add exams. They may already exist in the course.');
        setSnackbarSeverity('error');
      }

      // Reset selections and refresh courses
      setSelectedExams([]);
      setSelectedCourseForExam('');
      fetchCourses();
    } catch (error) {
      setSnackbarMessage('Error adding exams to course.');
      setSnackbarSeverity('error');
    }
    setSnackbarOpen(true);
  };

  const handleRemoveExamFromCourse = async (courseId, examId) => {
    try {
      await axios.delete(`${API_URL}/api/managexams/${courseId}/exams/${examId}`);
      setSnackbarMessage('Exam removed from course successfully!');
      setSnackbarSeverity('success');
      fetchCourses();
    } catch (error) {
      setSnackbarMessage('Error removing exam from course.');
      setSnackbarSeverity('error');
    }
    setSnackbarOpen(true);
  };

  const handleDeleteCourse = async (id) => {
    try {
      await axios.delete(`${API_URL}/api/managexams/${id}`);
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

  // Edit functionality handlers
  const handleEditCourse = (course) => {
    setEditingCourse(course);
    setEditCourseName(course.name);
    setEditDialogOpen(true);
  };

  const handleUpdateCourse = async () => {
    if (!editCourseName.trim()) {
      setSnackbarMessage('Course name cannot be empty!');
      setSnackbarSeverity('warning');
      setSnackbarOpen(true);
      return;
    }

    try {
      const response = await axios.put(`${API_URL}/api/managexams/${editingCourse._id}`, {
        name: editCourseName
      });
      
      if (response.status === 200) {
        setSnackbarMessage('Course updated successfully!');
        setSnackbarSeverity('success');
        setEditDialogOpen(false);
        setEditingCourse(null);
        setEditCourseName('');
        fetchCourses();
      }
    } catch (error) {
      if (error.response && error.response.data.error) {
        setSnackbarMessage(error.response.data.error);
      } else {
        setSnackbarMessage('Error updating course.');
      }
      setSnackbarSeverity('error');
    }
    setSnackbarOpen(true);
  };

  const handleCloseEditDialog = () => {
    setEditDialogOpen(false);
    setEditingCourse(null);
    setEditCourseName('');
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  // Get selected exam names for display
  const getSelectedExamNames = () => {
    return selectedExams.map(examId => {
      const exam = exams.find(e => e._id === examId);
      return exam ? exam.name : 'Unknown Exam';
    });
  };

  return (
    <Container maxWidth="lg">
      {/* Create New Course Section */}
      <br/>
      <Paper sx={{ p: 3, boxShadow: 3, borderRadius: 2, mb: 4 }}>
        <Typography variant="h5" fontWeight="bold" gutterBottom>Create New Course</Typography>
        <Grid container spacing={2} alignItems="flex-end">
          <Grid item xs={12} sm={8}>
            <TextField
              fullWidth
              label="Course Name"
              value={courseName}
              onChange={(e) => setCourseName(e.target.value)}
              margin="normal"
              placeholder="Enter course name"
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <Button
              variant="contained"
              onClick={handleCreateCourse}
              sx={{ mt: 2, backgroundColor: '#1976d2', color: 'white' }}
              fullWidth
              startIcon={<Add />}
            >
              Create Course
            </Button>
          </Grid>
        </Grid>
      </Paper>

      {/* Add Exams to Course Section */}
      <Paper sx={{ p: 3, boxShadow: 3, borderRadius: 2, mb: 4 }}>
        <Typography variant="h5" fontWeight="bold" gutterBottom>Add Exams to Course</Typography>
        <Grid container spacing={2} alignItems="flex-start">
          <Grid item xs={12} sm={5}>
            <FormControl fullWidth margin="normal">
              <InputLabel>Select Course</InputLabel>
              <Select
                value={selectedCourseForExam}
                label="Select Course"
                onChange={(e) => setSelectedCourseForExam(e.target.value)}
              >
                {courses.map(course => (
                  <MenuItem key={course._id} value={course._id}>
                    {course.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={5}>
            <FormControl fullWidth margin="normal">
              <InputLabel>Select Exams</InputLabel>
              <Select
                multiple
                value={selectedExams}
                label="Select Exams"
                onChange={(e) => setSelectedExams(e.target.value)}
                renderValue={(selected) => (
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                    {selected.map((value) => {
                      const exam = exams.find(e => e._id === value);
                      return (
                        <Chip 
                          key={value} 
                          label={exam ? exam.name : 'Unknown'} 
                          size="small" 
                        />
                      );
                    })}
                  </Box>
                )}
              >
                {exams.map(exam => (
                  <MenuItem key={exam._id} value={exam._id}>
                    {exam.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={2}>
            <Button
              variant="contained"
              onClick={handleAddExamsToCourse}
              sx={{ mt: 2, backgroundColor: '#5B5EFF', color: 'white' }}
              fullWidth
              startIcon={<Add />}
              disabled={selectedExams.length === 0}
            >
              Add Exams ({selectedExams.length})
            </Button>
          </Grid>
        </Grid>
        
        {/* Show selected exams preview */}
        {selectedExams.length > 0 && (
          <Box sx={{ mt: 2 }}>
            <Typography variant="subtitle2" color="textSecondary" gutterBottom>
              Selected Exams:
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {getSelectedExamNames().map((examName, index) => (
                <Chip 
                  key={selectedExams[index]} 
                  label={examName} 
                  size="small"
                  onDelete={() => {
                    setSelectedExams(selectedExams.filter((_, i) => i !== index));
                  }}
                />
              ))}
            </Box>
          </Box>
        )}
      </Paper>

      {/* Existing Courses Section */}
      <Box sx={{ mt: 4 }}>
        <Typography variant="h5" fontWeight="bold" gutterBottom>Managed Courses with Exams</Typography>
        {courses.length === 0 ? (
          <Paper sx={{ p: 3, textAlign: 'center' }}>
            <Typography variant="body1" color="textSecondary">
              No courses created yet. Create your first course above.
            </Typography>
          </Paper>
        ) : (
          courses.map(courseItem => (
            <Paper key={courseItem._id} sx={{ p: 3, mb: 3, boxShadow: 2 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                <Typography variant="h6" fontWeight="bold">{courseItem.name}</Typography>
                <Box>
                  <IconButton 
                    onClick={() => handleEditCourse(courseItem)} 
                    color="primary"
                    sx={{ mr: 1 }}
                  >
                    <Edit />
                  </IconButton>
                  <IconButton onClick={() => handleDeleteCourse(courseItem._id)} color="error">
                    <Close />
                  </IconButton>
                </Box>
              </Box>
              
              <Typography variant="subtitle1" gutterBottom>Associated Exams:</Typography>
              <Box sx={{ mt: 1 }}>
                {courseItem.exams && courseItem.exams.length > 0 ? (
                  <Grid container spacing={1}>
                    {courseItem.exams.map(exam => (
                      <Grid item key={exam._id}>
                        <Chip
                          label={exam.name}
                          onDelete={() => handleRemoveExamFromCourse(courseItem._id, exam._id)}
                          color="primary"
                          variant="outlined"
                        />
                      </Grid>
                    ))}
                  </Grid>
                ) : (
                  <Typography variant="body2" color="textSecondary" sx={{ fontStyle: 'italic' }}>
                    No exams added to this course yet.
                  </Typography>
                )}
              </Box>
            </Paper>
          ))
        )}
      </Box>

      {/* Edit Course Dialog */}
      <Dialog open={editDialogOpen} onClose={handleCloseEditDialog} maxWidth="sm" fullWidth>
        <DialogTitle>Edit Course</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Course Name"
            type="text"
            fullWidth
            variant="outlined"
            value={editCourseName}
            onChange={(e) => setEditCourseName(e.target.value)}
            sx={{ mt: 2 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseEditDialog}>Cancel</Button>
          <Button onClick={handleUpdateCourse} variant="contained">
            Update Course
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar open={snackbarOpen} autoHideDuration={6000} onClose={handleSnackbarClose}>
        <Alert onClose={handleSnackbarClose} severity={snackbarSeverity} sx={{ width: '100%' }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default Admincourseexams;