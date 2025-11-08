import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { TextField, Button, Container, Typography, Box, Paper, Grid, IconButton, Snackbar, Alert, Chip, Select, MenuItem, FormControl, InputLabel } from '@mui/material';
import { Close, Add } from '@mui/icons-material';

const Admincourseexams = () => {
    const API_URL = "https://collegeforms.in";
  
  const [course, setCourse] = useState('');
  const [courses, setCourses] = useState([]);
  const [exams, setExams] = useState([]);
  const [selectedExam, setSelectedExam] = useState('');
  const [selectedCourseForExam, setSelectedCourseForExam] = useState('');
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');

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

  const handleCourseSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${API_URL}/api/managexams`, { 
        name: course,
        exams: []
      });
      if (response.status === 201) {
        setSnackbarMessage('Course added successfully!');
        setSnackbarSeverity('success');
        setCourse('');
        fetchCourses();
      }
    } catch (error) {
      setSnackbarMessage('Error adding course.');
      setSnackbarSeverity('error');
    }
    setSnackbarOpen(true);
  };

  const handleAddExamToCourse = async () => {
    if (!selectedCourseForExam || !selectedExam) {
      setSnackbarMessage('Please select both course and exam!');
      setSnackbarSeverity('warning');
      setSnackbarOpen(true);
      return;
    }

    try {
      const response = await axios.put(`${API_URL}/api/managexams/${selectedCourseForExam}/exams`, {
        examId: selectedExam
      });
      if (response.status === 200) {
        setSnackbarMessage('Exam added to course successfully!');
        setSnackbarSeverity('success');
        setSelectedExam('');
        setSelectedCourseForExam('');
        fetchCourses();
      }
    } catch (error) {
      setSnackbarMessage('Error adding exam to course.');
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
      await axios.delete(`${API_URL}/api/managexam/${id}`);
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

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  return (
    <Container maxWidth="lg">
      {/* Add Course Section */}
      <Paper sx={{ p: 3, boxShadow: 3, borderRadius: 2, mb: 4 }}>
        <Typography variant="h4" fontWeight="bold" gutterBottom>Courses Management</Typography>
        <form onSubmit={handleCourseSubmit}>
          <TextField
            label="Course Name"
            fullWidth
            margin="normal"
            value={course}
            onChange={(e) => setCourse(e.target.value)}
            required
            placeholder="e.g., Engineering, Medical, Management, etc."
          />
          <Button
            type="submit"
            variant="contained"
            sx={{ mt: 2, backgroundColor: '#5B5EFF', color: 'white' }}
            fullWidth
          >
            Add Course
          </Button>
        </form>
      </Paper>

      {/* Add Exam to Course Section */}
      <Paper sx={{ p: 3, boxShadow: 3, borderRadius: 2, mb: 4 }}>
        <Typography variant="h5" fontWeight="bold" gutterBottom>Add Exam to Course</Typography>
        <Grid container spacing={2} alignItems="flex-end">
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
              <InputLabel>Select Exam</InputLabel>
              <Select
                value={selectedExam}
                label="Select Exam"
                onChange={(e) => setSelectedExam(e.target.value)}
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
              onClick={handleAddExamToCourse}
              sx={{ mt: 2, backgroundColor: '#5B5EFF', color: 'white' }}
              fullWidth
              startIcon={<Add />}
            >
              Add
            </Button>
          </Grid>
        </Grid>
      </Paper>

      {/* Existing Courses Section */}
      <Box sx={{ mt: 4 }}>
        <Typography variant="h5" fontWeight="bold" gutterBottom>Existing Courses</Typography>
        {courses.map(courseItem => (
          <Paper key={courseItem._id} sx={{ p: 3, mb: 3, boxShadow: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
              <Typography variant="h6" fontWeight="bold">{courseItem.name}</Typography>
              <IconButton onClick={() => handleDeleteCourse(courseItem._id)} color="error">
                <Close />
              </IconButton>
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
        ))}
      </Box>

      <Snackbar open={snackbarOpen} autoHideDuration={6000} onClose={handleSnackbarClose}>
        <Alert onClose={handleSnackbarClose} severity={snackbarSeverity} sx={{ width: '100%' }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default Admincourseexams;