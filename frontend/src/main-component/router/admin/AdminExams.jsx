import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { TextField, Button, Container, Typography, Box, Paper, Grid, IconButton, Snackbar, Alert } from '@mui/material';
import { Close } from '@mui/icons-material';

const AdminExams = () => {
 const API_URL = "https://collegeforms.in";
  
  const [exam, setExam] = useState('');
  const [exams, setExams] = useState([]);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');

  useEffect(() => {
    fetchExams();
  }, []);

  const fetchExams = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/exams`);
      setExams(response.data);
    } catch (error) {
      console.error('Error fetching exams', error);
    }
  };

  const handleExamSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${API_URL}/api/exams`, { name: exam });
      if (response.status === 201) {
        setSnackbarMessage('Exam added successfully!');
        setSnackbarSeverity('success');
        setExam('');
        fetchExams();
      }
    } catch (error) {
      setSnackbarMessage('Error adding exam.');
      setSnackbarSeverity('error');
    }
    setSnackbarOpen(true);
  };

  const handleDeleteExam = async (id) => {
    try {
      await axios.delete(`${API_URL}/api/exams/${id}`);
      setExams(exams.filter(exam => exam._id !== id));
      setSnackbarMessage('Exam deleted successfully!');
      setSnackbarSeverity('success');
      setSnackbarOpen(true);
    } catch (error) {
      setSnackbarMessage('Error deleting exam.');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
    }
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  return (
    <Container maxWidth="md">
      <Paper sx={{ p: 3, boxShadow: 3, borderRadius: 2 }}>
        <Typography variant="h4" fontWeight="bold" gutterBottom>Exams</Typography>
        <form onSubmit={handleExamSubmit}>
          <TextField
            label="Exam Name"
            fullWidth
            margin="normal"
            value={exam}
            onChange={(e) => setExam(e.target.value)}
            required
            placeholder="e.g., JEE, NEET, CAT, etc."
          />
          <Button
            type="submit"
            variant="contained"
            sx={{ mt: 2, backgroundColor: '#5B5EFF', color: 'white' }}
            fullWidth
          >
            Add Exam
          </Button>
        </form>
      </Paper>

      <Box sx={{ mt: 4 }}>
        <Typography variant="h5" fontWeight="bold" gutterBottom>Existing Exams</Typography>
        {exams.map(exam => (
          <Paper key={exam._id} sx={{ p: 2, mb: 2, display: 'flex', justifyContent: 'space-between' }}>
            <Typography>{exam.name}</Typography>
            <IconButton onClick={() => handleDeleteExam(exam._id)} color="error"><Close /></IconButton>
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

export default AdminExams;