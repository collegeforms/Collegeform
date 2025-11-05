import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Container,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Box,
  Card,
  CardContent,
  Grid,
  FormControlLabel,
  Checkbox,
  Chip,
  Tabs,
  Tab,
  Alert,
  Snackbar
} from '@mui/material';
import { Edit, Delete, Add, Save, Cancel } from '@mui/icons-material';

const AdminTests = () => {
  const [tests, setTests] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingTest, setEditingTest] = useState(null);
  const [selectedTest, setSelectedTest] = useState(null);
  const [tabValue, setTabValue] = useState(0);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  const API_URL = 'http://localhost:5000/api/admin/tests';
  const authHeader = {
    headers: { Authorization: `Bearer ${localStorage.getItem('adminToken')}` }
  };

  useEffect(() => {
    fetchTests();
  }, []);

  const showSnackbar = (message, severity = 'success') => {
    setSnackbar({ open: true, message, severity });
  };

  const fetchTests = async () => {
    try {
      const response = await axios.get(API_URL, authHeader);
      setTests(response.data.tests);
    } catch (error) {
      console.error('Failed to fetch tests:', error);
      showSnackbar('Failed to fetch tests', 'error');
    }
  };

  const handleSubmit = async (formData) => {
    try {
      if (editingTest) {
        await axios.put(`${API_URL}/${editingTest._id}`, formData, authHeader);
        showSnackbar('Test updated successfully');
      } else {
        await axios.post(API_URL, formData, authHeader);
        showSnackbar('Test created successfully');
      }
      setOpenDialog(false);
      setEditingTest(null);
      fetchTests();
    } catch (error) {
      console.error('Failed to save test:', error);
      showSnackbar('Failed to save test', 'error');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this test?')) {
      try {
        await axios.delete(`${API_URL}/${id}`, authHeader);
        showSnackbar('Test deleted successfully');
        fetchTests();
      } catch (error) {
        console.error('Failed to delete test:', error);
        showSnackbar('Failed to delete test', 'error');
      }
    }
  };

  const loadTestDetails = async (testId) => {
    try {
      const response = await axios.get(`${API_URL}/${testId}`, authHeader);
      setSelectedTest(response.data);
      setTabValue(1); // Switch to questions tab
    } catch (error) {
      console.error('Failed to load test details:', error);
      showSnackbar('Failed to load test details', 'error');
    }
  };

  return (
    <Container>
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert severity={snackbar.severity} onClose={() => setSnackbar({ ...snackbar, open: false })}>
          {snackbar.message}
        </Alert>
      </Snackbar>

      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs value={tabValue} onChange={(e, newValue) => setTabValue(newValue)}>
          <Tab label="Test List" />
          <Tab label="Questions" disabled={!selectedTest} />
        </Tabs>
      </Box>

      {tabValue === 0 && (
        <>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
            <Typography variant="h4">Test Series Management</Typography>
            <Button
              variant="contained"
              startIcon={<Add />}
              onClick={() => setOpenDialog(true)}
            >
              Add New Test
            </Button>
          </Box>

          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Title</TableCell>
                  <TableCell>Class</TableCell>
                  <TableCell>Subject</TableCell>
                  <TableCell>Questions</TableCell>
                  <TableCell>Time Limit</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {tests.map((test) => (
                  <TableRow key={test._id}>
                    <TableCell>{test.title}</TableCell>
                    <TableCell>{test.class}</TableCell>
                    <TableCell>{test.subject}</TableCell>
                    <TableCell>{test.questions.length}</TableCell>
                    <TableCell>{test.timeLimit} min</TableCell>
                    <TableCell>
                      <IconButton
                        onClick={() => {
                          setEditingTest(test);
                          setOpenDialog(true);
                        }}
                        title="Edit Test"
                      >
                        <Edit />
                      </IconButton>
                      <IconButton 
                        onClick={() => loadTestDetails(test._id)}
                        title="Manage Questions"
                      >
                        <Add />
                      </IconButton>
                      <IconButton 
                        onClick={() => handleDelete(test._id)}
                        title="Delete Test"
                      >
                        <Delete />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </>
      )}

      {tabValue === 1 && selectedTest && (
        <QuestionManager 
          test={selectedTest} 
          onBack={() => {
            setSelectedTest(null);
            setTabValue(0);
            fetchTests();
          }}
          authHeader={authHeader}
          showSnackbar={showSnackbar}
        />
      )}

      <TestDialog
        open={openDialog}
        onClose={() => {
          setOpenDialog(false);
          setEditingTest(null);
        }}
        onSubmit={handleSubmit}
        test={editingTest}
      />
    </Container>
  );
};

// Question Manager Component
const QuestionManager = ({ test, onBack, authHeader, showSnackbar }) => {
  const [questions, setQuestions] = useState(test.questions || []);
  const [editingQuestion, setEditingQuestion] = useState(null);
  const [newQuestion, setNewQuestion] = useState({
    questionText: '',
    options: [
      { text: '', isCorrect: false },
      { text: '', isCorrect: false },
      { text: '', isCorrect: false },
      { text: '', isCorrect: false }
    ],
    explanation: '',
    marks: 1
  });

  const API_URL = `http://localhost:5000/api/admin/tests/${test._id}`;

  const addQuestion = async () => {
    try {
      // Validate that at least one option is marked as correct
      const hasCorrectOption = newQuestion.options.some(option => option.isCorrect);
      if (!hasCorrectOption) {
        showSnackbar('Please mark at least one option as correct', 'error');
        return;
      }

      // Validate that all options have text
      const hasEmptyOptions = newQuestion.options.some(option => !option.text.trim());
      if (hasEmptyOptions) {
        showSnackbar('Please fill in all options', 'error');
        return;
      }

      const response = await axios.post(`${API_URL}/questions`, newQuestion, authHeader);
      setQuestions(response.data.questions);
      
      // Reset form but keep the 4 options structure
      setNewQuestion({
        questionText: '',
        options: [
          { text: '', isCorrect: false },
          { text: '', isCorrect: false },
          { text: '', isCorrect: false },
          { text: '', isCorrect: false }
        ],
        explanation: '',
        marks: 1
      });
      
      showSnackbar('Question added successfully');
    } catch (error) {
      console.error('Failed to add question:', error);
      showSnackbar('Failed to add question', 'error');
    }
  };

  const updateQuestion = async (questionId, data) => {
    try {
      await axios.put(`${API_URL}/questions/${questionId}`, data, authHeader);
      setEditingQuestion(null);
      // Refresh questions
      const response = await axios.get(API_URL, authHeader);
      setQuestions(response.data.questions);
      showSnackbar('Question updated successfully');
    } catch (error) {
      console.error('Failed to update question:', error);
      showSnackbar('Failed to update question', 'error');
    }
  };

  const deleteQuestion = async (questionId) => {
    try {
      await axios.delete(`${API_URL}/questions/${questionId}`, authHeader);
      // Refresh questions
      const response = await axios.get(API_URL, authHeader);
      setQuestions(response.data.questions);
      showSnackbar('Question deleted successfully');
    } catch (error) {
      console.error('Failed to delete question:', error);
      showSnackbar('Failed to delete question', 'error');
    }
  };

  const updateOption = (index, field, value) => {
    const updatedOptions = [...newQuestion.options];
    updatedOptions[index][field] = value;
    
    // If setting as correct, unset other options
    if (field === 'isCorrect' && value === true) {
      updatedOptions.forEach((opt, i) => {
        if (i !== index) opt.isCorrect = false;
      });
    }
    
    setNewQuestion({ ...newQuestion, options: updatedOptions });
  };

  return (
    <Box>
      <Button onClick={onBack} sx={{ mb: 2 }}>
        ← Back to Tests
      </Button>
      
      <Typography variant="h5" gutterBottom>
        Questions for: {test.title}
      </Typography>

      {/* Add New Question Form */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Add New Question
          </Typography>
          
          <TextField
            fullWidth
            label="Question Text"
            value={newQuestion.questionText}
            onChange={(e) => setNewQuestion({ ...newQuestion, questionText: e.target.value })}
            margin="normal"
            multiline
            rows={2}
          />
          
          <Typography variant="subtitle2" sx={{ mt: 2, mb: 1 }}>
            Options (select the correct one):
          </Typography>
          
          <Grid container spacing={2}>
            {newQuestion.options.map((option, index) => (
              <Grid item xs={12} sm={6} key={index}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={option.isCorrect}
                        onChange={(e) => updateOption(index, 'isCorrect', e.target.checked)}
                      />
                    }
                    label={`Correct`}
                    sx={{ mr: 1 }}
                  />
                  <TextField
                    fullWidth
                    label={`Option ${index + 1}`}
                    value={option.text}
                    onChange={(e) => updateOption(index, 'text', e.target.value)}
                    margin="dense"
                  />
                </Box>
              </Grid>
            ))}
          </Grid>
          
          <TextField
            fullWidth
            label="Explanation (Optional)"
            value={newQuestion.explanation}
            onChange={(e) => setNewQuestion({ ...newQuestion, explanation: e.target.value })}
            margin="normal"
            multiline
            rows={2}
          />
          
          <TextField
            label="Marks"
            type="number"
            value={newQuestion.marks}
            onChange={(e) => setNewQuestion({ ...newQuestion, marks: parseInt(e.target.value) || 1 })}
            margin="normal"
            sx={{ width: 100 }}
            inputProps={{ min: 1 }}
          />
          
          <Box sx={{ mt: 2 }}>
            <Button 
              variant="contained" 
              onClick={addQuestion}
              disabled={!newQuestion.questionText.trim()}
            >
              Add Question
            </Button>
          </Box>
        </CardContent>
      </Card>

      {/* Questions List */}
      <Typography variant="h6" gutterBottom>
        Existing Questions ({questions.length})
      </Typography>
      
      {questions.length === 0 ? (
        <Typography variant="body1" color="text.secondary" sx={{ textAlign: 'center', py: 4 }}>
          No questions added yet. Use the form above to add questions.
        </Typography>
      ) : (
        questions.map((question, index) => (
          <QuestionItem
            key={question._id}
            question={question}
            onUpdate={updateQuestion}
            onDelete={deleteQuestion}
            isEditing={editingQuestion === question._id}
            onEdit={() => setEditingQuestion(question._id)}
            onCancelEdit={() => setEditingQuestion(null)}
          />
        ))
      )}
    </Box>
  );
};

// Question Item Component
const QuestionItem = ({ question, onUpdate, onDelete, isEditing, onEdit, onCancelEdit }) => {
  const [editData, setEditData] = useState(question);

  useEffect(() => {
    setEditData(question);
  }, [question]);

  const handleSave = () => {
    onUpdate(question._id, editData);
  };

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this question?')) {
      onDelete(question._id);
    }
  };

  const updateOption = (index, field, value) => {
    const updatedOptions = [...editData.options];
    updatedOptions[index][field] = value;
    
    // If setting as correct, unset other options
    if (field === 'isCorrect' && value === true) {
      updatedOptions.forEach((opt, i) => {
        if (i !== index) opt.isCorrect = false;
      });
    }
    
    setEditData({ ...editData, options: updatedOptions });
  };

  if (isEditing) {
    return (
      <Card sx={{ mb: 2 }}>
        <CardContent>
          <TextField
            fullWidth
            label="Question Text"
            value={editData.questionText}
            onChange={(e) => setEditData({ ...editData, questionText: e.target.value })}
            margin="normal"
            multiline
            rows={2}
          />
          
          <Typography variant="subtitle2" sx={{ mt: 2, mb: 1 }}>
            Options (select the correct one):
          </Typography>
          
          <Grid container spacing={2}>
            {editData.options.map((option, index) => (
              <Grid item xs={12} sm={6} key={index}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={option.isCorrect}
                        onChange={(e) => updateOption(index, 'isCorrect', e.target.checked)}
                      />
                    }
                    label={`Correct`}
                    sx={{ mr: 1 }}
                  />
                  <TextField
                    fullWidth
                    label={`Option ${index + 1}`}
                    value={option.text}
                    onChange={(e) => updateOption(index, 'text', e.target.value)}
                    margin="dense"
                  />
                </Box>
              </Grid>
            ))}
          </Grid>
          
          <TextField
            fullWidth
            label="Explanation"
            value={editData.explanation}
            onChange={(e) => setEditData({ ...editData, explanation: e.target.value })}
            margin="normal"
            multiline
            rows={2}
          />
          
          <TextField
            label="Marks"
            type="number"
            value={editData.marks}
            onChange={(e) => setEditData({ ...editData, marks: parseInt(e.target.value) || 1 })}
            margin="normal"
            sx={{ width: 100 }}
            inputProps={{ min: 1 }}
          />
          
          <Box sx={{ mt: 2 }}>
            <Button variant="contained" onClick={handleSave} startIcon={<Save />} sx={{ mr: 1 }}>
              Save
            </Button>
            <Button onClick={onCancelEdit} startIcon={<Cancel />}>
              Cancel
            </Button>
          </Box>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card sx={{ mb: 2 }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          {question.questionText}
        </Typography>
        
        <Grid container spacing={1} sx={{ mb: 2 }}>
          {question.options.map((option, index) => (
            <Grid item xs={12} sm={6} key={index}>
              <Chip
                label={`${index + 1}. ${option.text}`}
                color={option.isCorrect ? "success" : "default"}
                variant={option.isCorrect ? "filled" : "outlined"}
                sx={{ mb: 1 }}
              />
            </Grid>
          ))}
        </Grid>
        
        {question.explanation && (
          <Typography variant="body2" color="text.secondary" gutterBottom>
            <strong>Explanation:</strong> {question.explanation}
          </Typography>
        )}
        
        <Typography variant="body2" color="text.secondary">
          Marks: {question.marks}
        </Typography>
        
        <Box sx={{ mt: 2 }}>
          <Button onClick={onEdit} startIcon={<Edit />} sx={{ mr: 1 }}>
            Edit
          </Button>
          <Button onClick={handleDelete} color="error" startIcon={<Delete />}>
            Delete
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
};

// Test Dialog Component
const TestDialog = ({ open, onClose, onSubmit, test }) => {
  const [formData, setFormData] = useState({
    title: '',
    class: '',
    subject: '',
    timeLimit: 30,
    questions: []
  });

  useEffect(() => {
    if (test) {
      setFormData(test);
    } else {
      setFormData({
        title: '',
        class: '',
        subject: '',
        timeLimit: 30,
        questions: []
      });
    }
  }, [test]);

  const handleSubmit = () => {
    onSubmit(formData);
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>{test ? 'Edit Test' : 'Create New Test'}</DialogTitle>
      <DialogContent>
        <TextField
          fullWidth
          label="Title"
          value={formData.title}
          onChange={(e) =>
            setFormData({ ...formData, title: e.target.value })
          }
          margin="normal"
          required
        />
        <TextField
          fullWidth
          label="Class"
          value={formData.class}
          onChange={(e) =>
            setFormData({ ...formData, class: e.target.value })
          }
          margin="normal"
          required
        />
        <TextField
          fullWidth
          label="Subject"
          value={formData.subject}
          onChange={(e) =>
            setFormData({ ...formData, subject: e.target.value })
          }
          margin="normal"
          required
        />
        <TextField
          fullWidth
          label="Time Limit (minutes)"
          type="number"
          value={formData.timeLimit}
          onChange={(e) =>
            setFormData({ ...formData, timeLimit: parseInt(e.target.value) || 30 })
          }
          margin="normal"
          inputProps={{ min: 1 }}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button 
          variant="contained" 
          onClick={handleSubmit}
          disabled={!formData.title || !formData.class || !formData.subject}
        >
          {test ? 'Update' : 'Create'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AdminTests;