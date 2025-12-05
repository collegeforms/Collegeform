import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  Box, Typography, CircularProgress, Button, Paper, Divider,
  Switch, Dialog, DialogActions, DialogContent, DialogTitle, TextField, Grid
} from '@mui/material';
import * as XLSX from 'xlsx';
import dayjs from 'dayjs';

const Singlestudent = () => {
  const API_URL = "https://www.collegeforms.in";
  const { id } = useParams();
  const navigate = useNavigate();
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [open, setOpen] = useState(false);
  const [newRemarks, setNewRemarks] = useState('');

  useEffect(() => {
    const fetchStudent = async () => {
      try {
        const response = await axios.get(`${API_URL}/api/students/${id}`);
        setStudent(response.data);
      } catch (err) {
        console.error('Error fetching student details:', err);
        setError('Failed to load student details.');
      } finally {
        setLoading(false);
      }
    };
    fetchStudent();
  }, [id]);

  const handleStatusChange = async () => {
    try {
      const updatedStatus = !student.status;
      await axios.put(`${API_URL}/api/students/update/${id}`, { status: updatedStatus });
      setStudent((prev) => ({ ...prev, status: updatedStatus }));
    } catch (err) {
      console.error('Error updating status:', err);
    }
  };

  const handleRemarksSubmit = async () => {
    try {
      await axios.put(`${API_URL}/api/students/remarks/${id}`, { remarks: newRemarks });
      setStudent((prev) => ({ ...prev, remarks: newRemarks }));
      setOpen(false);
    } catch (err) {
      console.error('Error updating remarks:', err);
    }
  };

  const handleDownloadExcel = () => {
    if (!student) return;

    const studentData = [{
      Name: student.name,
      Email: student.email,
      Number: student.number,
      Course: student.course,
      Status: student.status ? 'Active' : 'Inactive',
      Remarks: student.remarks || 'No remarks',
      Aadhar: student.aadhar,
      FatherName: student.fatherName,
      FatherNumber: student.fatherNumber,
      Occupation: student.occupation,
      MotherName: student.motherName,
      MotherNumber: student.motherNumber,
      '10th School': student.schoolName10,
      '10th Board': student.board10,
      '10th Year': student.passingYear10,
      '10th %': student.percentage10,
      '12th School': student.schoolName12,
      '12th Board': student.board12,
      '12th Year': student.passingYear12,
      '12th %': student.percentage12,
      'Graduation University': student.graduationUniversity,
      'Graduation Course': student.graduationCourse,
      'Graduation Year': student.passingYearGraduation,
      'Graduation %': student.percentageGraduation,
      'Graduation CGPA': student.cgpaGraduation,
      'Date of Birth': student.dob ? dayjs(student.dob).format('DD/MM/YYYY') : 'N/A',
    }];

    const worksheet = XLSX.utils.json_to_sheet(studentData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Student_Details');

    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const blob = new Blob([excelBuffer], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `student_${student.name || 'details'}.xlsx`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  if (loading) return <Box display="flex" justifyContent="center" mt={4}><CircularProgress /></Box>;
  if (error) return <Typography color="error" align="center" mt={4}>{error}</Typography>;

  return (
    <Box p={4} maxWidth="900px" mx="auto" component={Paper} elevation={4} borderRadius={3}>
      <Typography variant="h5" align="center" gutterBottom fontWeight="bold" color="#5659FF">
        Student Details
      </Typography>
      <Divider sx={{ mb: 3 }} />

      <Grid container spacing={3}>
        {[
          { label: 'Name', value: student.name },
          { label: 'Email', value: student.email },
          { label: 'Number', value: student.number },
          { label: 'Date of Birth', value: dayjs(student.dob).format('DD/MM/YYYY') },
          { label: 'Gender', value: student.gender },
          { label: 'Aadhar', value: student.aadhar },
          { label: 'Course', value: student.course },
          { label: 'Father Name', value: student.fatherName },
          { label: 'Father Number', value: student.fatherNumber },
          { label: 'Occupation', value: student.occupation },
          { label: 'Mother Name', value: student.motherName },
          { label: 'Mother Number', value: student.motherNumber },
          { label: '10th School', value: student.schoolName10 },
          { label: '10th Board', value: student.board10 },
          { label: '10th Year', value: student.passingYear10 },
          { label: '10th %', value: student.percentage10 },
          { label: '12th School', value: student.schoolName12 },
          { label: '12th Board', value: student.board12 },
          { label: '12th Year', value: student.passingYear12 },
          { label: '12th %', value: student.percentage12 },
          { label: 'Graduation University', value: student.graduationUniversity },
          { label: 'Graduation Course', value: student.graduationCourse },
          { label: 'Graduation Year', value: student.passingYearGraduation },
          { label: 'Graduation %', value: student.percentageGraduation },
          { label: 'Graduation CGPA', value: student.cgpaGraduation },
          { label: 'Remarks', value: student.remarks || 'No remarks added' },
        ].map(({ label, value }) => (
          <Grid item xs={12} sm={6} key={label}>
            <Typography variant="body1" fontWeight="500">
              <strong>{label}:</strong> {value}
            </Typography>
          </Grid>
        ))}
      </Grid>

      <Box display="flex" alignItems="center" mt={3} justifyContent="space-between" px={1}>
        <Typography variant="body1" fontWeight="500">Status:</Typography>
        <Switch checked={student.status} onChange={handleStatusChange} color="primary" />
        <Typography variant="body2" fontWeight="500">{student.status ? 'Active' : 'Inactive'}</Typography>
      </Box>

      <Box mt={4} display="flex" justifyContent="space-between" gap={2}>
        <Button variant="contained" onClick={() => setOpen(true)} sx={{ backgroundColor: '#5659FF' }}>
          Add Remarks
        </Button>
        <Button variant="contained" onClick={handleDownloadExcel} sx={{ backgroundColor: '#5659FF' }}>
          Download Excel
        </Button>
      </Box>

      <Button variant="contained" fullWidth sx={{ mt: 3, backgroundColor: '#5659FF' }} onClick={() => navigate(-1)}>
        Back to Students
      </Button>

      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>Add Remarks</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            multiline
            rows={3}
            value={newRemarks}
            onChange={(e) => setNewRemarks(e.target.value)}
            label="Enter remarks"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button onClick={handleRemarksSubmit} variant="contained" sx={{ backgroundColor: '#5659FF' }}>
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Singlestudent;