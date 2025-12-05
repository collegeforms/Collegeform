import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { MaterialReactTable } from 'material-react-table';
import { CircularProgress, Typography, Box } from '@mui/material';

const Students = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const columns = [
    { accessorKey: 'name', header: 'Name' },
    { accessorKey: 'number', header: 'Number' },
    {
      accessorKey: 'dob',
      header: 'DOB',
      Cell: ({ cell }) => cell.getValue() ? new Date(cell.getValue()).toLocaleDateString() : ''
    },
    { accessorKey: 'gender', header: 'Gender' },
    { accessorKey: 'aadhar', header: 'Aadhar' },
    { accessorKey: 'course', header: 'Course' },
    { accessorKey: 'fatherName', header: 'Father Name' },
    { accessorKey: 'fatherNumber', header: 'Father Number' },
    { accessorKey: 'email', header: 'Email' },
    { accessorKey: 'occupation', header: 'Occupation' },
    { accessorKey: 'motherName', header: 'Mother Name' },
    { accessorKey: 'motherNumber', header: 'Mother Number' },
    { accessorKey: 'schoolName10', header: "10th School" },
    { accessorKey: 'board10', header: "10th Board" },
    { accessorKey: 'passingYear10', header: "10th Passing Year" },
    { accessorKey: 'percentage10', header: "10th Percentage" },
    { accessorKey: 'cgpa10', header: "10th CGPA" },
    { accessorKey: 'schoolName12', header: "12th School" },
    { accessorKey: 'board12', header: "12th Board" },
    { accessorKey: 'passingYear12', header: "12th Passing Year" },
    { accessorKey: 'percentage12', header: "12th Percentage" },
    { accessorKey: 'cgpa12', header: "12th CGPA" },
    { accessorKey: 'graduationUniversity', header: 'Graduation University' },
    { accessorKey: 'graduationCourse', header: 'Graduation Course' },
    { accessorKey: 'passingYearGraduation', header: 'Graduation Passing Year' },
    { accessorKey: 'percentageGraduation', header: 'Graduation Percentage' },
    { accessorKey: 'cgpaGraduation', header: 'Graduation CGPA' },
  ];

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const response = await axios.get('https://www.collegeforms.in/api/students/students');
        const formattedData = response.data.map((student, index) => ({ id: index + 1, ...student }));
        setStudents(formattedData);
      } catch (err) {
        console.error('Error fetching students:', err);
        setError('Failed to fetch student data. Please check the server or API endpoint.');
      } finally {
        setLoading(false);
      }
    };

    fetchStudents();
  }, []);

  if (loading) return <Box display="flex" justifyContent="center" mt={4}><CircularProgress /></Box>;
  if (error) return <Typography color="error" align="center" mt={4}>{error}</Typography>;

  return (
    <Box p={3}>
      <Typography variant="h5" align="center" gutterBottom>Student Records</Typography>
      <MaterialReactTable
        columns={columns}
        data={students}
        enablePagination
        enableColumnResizing
        initialState={{ pagination: { pageSize: 10 } }}
      />
    </Box>
  );
};

export default Students;
