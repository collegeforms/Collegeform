import React, { useState, useEffect } from 'react';
import {
  Box, Typography, Paper, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, Chip, Button,
  Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, FormControl, InputLabel, Select, MenuItem,
  Card, CardContent, Grid, Alert, CircularProgress,
  IconButton, Tooltip, Tab, Tabs, AppBar, Toolbar
} from '@mui/material';
import {
  Visibility as ViewIcon,
  Edit as EditIcon,
  CheckCircle as ApprovedIcon,
  Cancel as RejectedIcon,
  Pending as PendingIcon,
  FilterList as FilterIcon
} from '@mui/icons-material';
import axios from 'axios';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs';

const AdminApplications = () => {
  const API_URL = "https://collegeforms.in";

  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [statusDialogOpen, setStatusDialogOpen] = useState(false);
  const [selectedCollege, setSelectedCollege] = useState(null);
  const [statusUpdate, setStatusUpdate] = useState({
    status: 'pending',
    remarks: ''
  });
  const [filters, setFilters] = useState({
    college: 'all',
    course: 'all',
    status: 'all',
    search: ''
  });
  const [tabValue, setTabValue] = useState(0);

  // Get admin token
  const getAdminToken = () => {
    return localStorage.getItem('adminToken') || localStorage.getItem('userToken');
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      const adminToken = getAdminToken();
      const response = await axios.get(`${API_URL}/api/students/students`, {
        headers: {
          'Authorization': `Bearer ${adminToken}`
        }
      });
      setApplications(response.data);
    } catch (err) {
      console.error('Error fetching applications:', err);
      setError('Failed to fetch applications data');
    } finally {
      setLoading(false);
    }
  };

  // Handle status update
  const handleStatusUpdate = async () => {
    try {
      const adminToken = getAdminToken();
      await axios.put(`${API_URL}/api/students/update-college-status`, {
        studentId: selectedApplication._id,
        collegeId: selectedCollege.collegeId || selectedCollege.college,
        status: statusUpdate.status,
        remarks: statusUpdate.remarks
      }, {
        headers: {
          'Authorization': `Bearer ${adminToken}`
        }
      });

      // Update local state
      const updatedApplications = applications.map(app => {
        if (app._id === selectedApplication._id) {
          const updatedCollegeStatuses = app.collegeStatuses.map(status => {
            if (status.college._id === (selectedCollege.collegeId || selectedCollege.college)) {
              return {
                ...status,
                status: statusUpdate.status,
                remarks: statusUpdate.remarks,
                updatedAt: new Date()
              };
            }
            return status;
          });
          return { ...app, collegeStatuses: updatedCollegeStatuses };
        }
        return app;
      });

      setApplications(updatedApplications);
      setStatusDialogOpen(false);
      setStatusUpdate({ status: 'pending', remarks: '' });
    } catch (err) {
      console.error('Error updating status:', err);
      setError('Failed to update status');
    }
  };

  // Open status update dialog
  const openStatusDialog = (application, college) => {
    setSelectedApplication(application);
    setSelectedCollege(college);
    const collegeStatus = application.collegeStatuses.find(
      status => status.college._id === (college.collegeId || college.college)
    );
    setStatusUpdate({
      status: collegeStatus?.status || 'pending',
      remarks: collegeStatus?.remarks || ''
    });
    setStatusDialogOpen(true);
  };

  // Open view details dialog
  const openViewDialog = (application) => {
    setSelectedApplication(application);
    setViewDialogOpen(true);
  };

  // Get status color and icon
  const getStatusProps = (status) => {
    switch (status) {
      case 'approved':
        return { color: 'success', icon: <ApprovedIcon />, label: 'Approved' };
      case 'rejected':
        return { color: 'error', icon: <RejectedIcon />, label: 'Rejected' };
      default:
        return { color: 'warning', icon: <PendingIcon />, label: 'Pending' };
    }
  };

  // Filter applications based on current filters and tab
  const getFilteredApplications = () => {
    let filtered = applications;

    // Apply tab filter
    if (tabValue === 1) {
      filtered = filtered.filter(app => 
        app.collegeStatuses.some(status => status.status === 'pending')
      );
    } else if (tabValue === 2) {
      filtered = filtered.filter(app => 
        app.collegeStatuses.some(status => status.status === 'approved')
      );
    } else if (tabValue === 3) {
      filtered = filtered.filter(app => 
        app.collegeStatuses.some(status => status.status === 'rejected')
      );
    }

    // Apply other filters
    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      filtered = filtered.filter(app =>
        app.name?.toLowerCase().includes(searchTerm) ||
        app.email?.toLowerCase().includes(searchTerm) ||
        app.applicationId?.toLowerCase().includes(searchTerm) ||
        app.course?.toLowerCase().includes(searchTerm)
      );
    }

    if (filters.college !== 'all') {
      filtered = filtered.filter(app =>
        app.selectedColleges.some(college => 
          college.collegeName === filters.college
        )
      );
    }

    if (filters.course !== 'all') {
      filtered = filtered.filter(app => app.course === filters.course);
    }

    if (filters.status !== 'all') {
      filtered = filtered.filter(app =>
        app.collegeStatuses.some(status => status.status === filters.status)
      );
    }

    return filtered;
  };

  // Get unique values for filters
  const colleges = [...new Set(applications.flatMap(app => 
    app.selectedColleges.map(college => college.collegeName)
  ))];
  
  const courses = [...new Set(applications.map(app => app.course))];

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return dayjs(dateString).format('DD MMM YYYY');
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box p={3}>
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  const filteredApplications = getFilteredApplications();

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Box p={3}>
        <AppBar position="static" color="default" elevation={1} sx={{ mb: 3 }}>
          <Toolbar>
            <Typography variant="h6" sx={{ flexGrow: 1 }}>
              Applications Management
            </Typography>
            <Typography variant="body2" color="textSecondary">
              Total: {applications.length} applications
            </Typography>
          </Toolbar>
        </AppBar>

        {/* Tabs */}
        <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
          <Tabs value={tabValue} onChange={(e, newValue) => setTabValue(newValue)}>
            <Tab label={`All (${applications.length})`} />
            <Tab label={`Pending (${applications.filter(app => app.collegeStatuses.some(s => s.status === 'pending')).length})`} />
            <Tab label={`Approved (${applications.filter(app => app.collegeStatuses.some(s => s.status === 'approved')).length})`} />
            <Tab label={`Rejected (${applications.filter(app => app.collegeStatuses.some(s => s.status === 'rejected')).length})`} />
          </Tabs>
        </Box>

        {/* Filters */}
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Grid container spacing={2}>
              <Grid item xs={12} md={3}>
                <TextField
                  fullWidth
                  label="Search by name, email, or application ID"
                  value={filters.search}
                  onChange={(e) => setFilters({...filters, search: e.target.value})}
                  size="small"
                />
              </Grid>
              <Grid item xs={12} md={2}>
                <FormControl fullWidth size="small">
                  <InputLabel>College</InputLabel>
                  <Select
                    value={filters.college}
                    label="College"
                    onChange={(e) => setFilters({...filters, college: e.target.value})}
                  >
                    <MenuItem value="all">All Colleges</MenuItem>
                    {colleges.map(college => (
                      <MenuItem key={college} value={college}>{college}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={2}>
                <FormControl fullWidth size="small">
                  <InputLabel>Course</InputLabel>
                  <Select
                    value={filters.course}
                    label="Course"
                    onChange={(e) => setFilters({...filters, course: e.target.value})}
                  >
                    <MenuItem value="all">All Courses</MenuItem>
                    {courses.map(course => (
                      <MenuItem key={course} value={course}>{course}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={2}>
                <FormControl fullWidth size="small">
                  <InputLabel>Status</InputLabel>
                  <Select
                    value={filters.status}
                    label="Status"
                    onChange={(e) => setFilters({...filters, status: e.target.value})}
                  >
                    <MenuItem value="all">All Status</MenuItem>
                    <MenuItem value="pending">Pending</MenuItem>
                    <MenuItem value="approved">Approved</MenuItem>
                    <MenuItem value="rejected">Rejected</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={3}>
                <Button
                  fullWidth
                  variant="outlined"
                  onClick={() => setFilters({
                    college: 'all',
                    course: 'all',
                    status: 'all',
                    search: ''
                  })}
                  size="small"
                >
                  Clear Filters
                </Button>
              </Grid>
            </Grid>
          </CardContent>
        </Card>

        {/* Applications Table */}
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Application ID</TableCell>
                <TableCell>Student Name</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Course</TableCell>
                <TableCell>Colleges</TableCell>
                <TableCell>Applied Date</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredApplications.map((application) => (
                <TableRow key={application._id}>
                  <TableCell>
                    <Typography variant="body2" fontWeight="bold">
                      {application.applicationId}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Box>
                      <Typography variant="body2" fontWeight="medium">
                        {application.name}
                      </Typography>
                      <Typography variant="caption" color="textSecondary">
                        {application.number}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>{application.email}</TableCell>
                  <TableCell>
                    <Chip label={application.course} size="small" variant="outlined" />
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                      {application.selectedColleges.map((college, index) => {
                        const collegeStatus = application.collegeStatuses[index];
                        const statusProps = getStatusProps(collegeStatus?.status);
                        return (
                          <Box key={college.collegeId || index} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Typography variant="body2" sx={{ flex: 1 }}>
                              {college.collegeName}
                            </Typography>
                            <Chip
                              icon={statusProps.icon}
                              label={statusProps.label}
                              color={statusProps.color}
                              size="small"
                              variant="outlined"
                            />
                          </Box>
                        );
                      })}
                    </Box>
                  </TableCell>
                  <TableCell>{formatDate(application.createdAt)}</TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <Tooltip title="View Details">
                        <IconButton
                          color="primary"
                          size="small"
                          onClick={() => openViewDialog(application)}
                        >
                          <ViewIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Update Status">
                        <IconButton
                          color="secondary"
                          size="small"
                          onClick={() => openStatusDialog(application, application.selectedColleges[0])}
                        >
                          <EditIcon />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        {filteredApplications.length === 0 && (
          <Box textAlign="center" py={4}>
            <Typography variant="h6" color="textSecondary">
              No applications found
            </Typography>
          </Box>
        )}

        {/* View Application Details Dialog */}
        <Dialog
          open={viewDialogOpen}
          onClose={() => setViewDialogOpen(false)}
          maxWidth="md"
          fullWidth
        >
          <DialogTitle>
            Application Details - {selectedApplication?.applicationId}
          </DialogTitle>
          <DialogContent>
            {selectedApplication && (
              <Box sx={{ mt: 2 }}>
                <Grid container spacing={3}>
                  {/* Personal Information */}
                  <Grid item xs={12}>
                    <Typography variant="h6" gutterBottom color="primary">
                      Personal Information
                    </Typography>
                    <Grid container spacing={2}>
                      <Grid item xs={12} md={6}>
                        <Typography><strong>Name:</strong> {selectedApplication.name}</Typography>
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <Typography><strong>Email:</strong> {selectedApplication.email}</Typography>
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <Typography><strong>Phone:</strong> {selectedApplication.number}</Typography>
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <Typography><strong>Date of Birth:</strong> {formatDate(selectedApplication.dob)}</Typography>
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <Typography><strong>Gender:</strong> {selectedApplication.gender}</Typography>
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <Typography><strong>Aadhar:</strong> {selectedApplication.aadhar}</Typography>
                      </Grid>
                    </Grid>
                  </Grid>

                  {/* Course and Colleges */}
                  <Grid item xs={12}>
                    <Typography variant="h6" gutterBottom color="primary">
                      Course & Colleges
                    </Typography>
                    <Typography><strong>Course:</strong> {selectedApplication.course}</Typography>
                    <Box sx={{ mt: 1 }}>
                      <Typography><strong>Selected Colleges:</strong></Typography>
                      {selectedApplication.selectedColleges.map((college, index) => {
                        const collegeStatus = selectedApplication.collegeStatuses[index];
                        const statusProps = getStatusProps(collegeStatus?.status);
                        return (
                          <Card key={college.collegeId} variant="outlined" sx={{ mt: 1, p: 1 }}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                              <Box>
                                <Typography variant="body2" fontWeight="medium">
                                  {college.collegeName}
                                </Typography>
                                <Typography variant="caption" color="textSecondary">
                                  {college.collegeSlug}
                                </Typography>
                              </Box>
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <Chip
                                  icon={statusProps.icon}
                                  label={statusProps.label}
                                  color={statusProps.color}
                                  size="small"
                                />
                                <Button
                                  size="small"
                                  onClick={() => openStatusDialog(selectedApplication, college)}
                                >
                                  Update
                                </Button>
                              </Box>
                            </Box>
                            {collegeStatus?.remarks && (
                              <Typography variant="caption" color="textSecondary" sx={{ mt: 1, display: 'block' }}>
                                <strong>Remarks:</strong> {collegeStatus.remarks}
                              </Typography>
                            )}
                          </Card>
                        );
                      })}
                    </Box>
                  </Grid>

                  {/* Parent Information */}
                  <Grid item xs={12}>
                    <Typography variant="h6" gutterBottom color="primary">
                      Parent Information
                    </Typography>
                    <Grid container spacing={2}>
                      <Grid item xs={12} md={6}>
                        <Typography><strong>Father's Name:</strong> {selectedApplication.fatherName}</Typography>
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <Typography><strong>Father's Number:</strong> {selectedApplication.fatherNumber}</Typography>
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <Typography><strong>Mother's Name:</strong> {selectedApplication.motherName}</Typography>
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <Typography><strong>Mother's Number:</strong> {selectedApplication.motherNumber}</Typography>
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <Typography><strong>Occupation:</strong> {selectedApplication.occupation}</Typography>
                      </Grid>
                    </Grid>
                  </Grid>

                  {/* Educational Background */}
                  <Grid item xs={12}>
                    <Typography variant="h6" gutterBottom color="primary">
                      Educational Background
                    </Typography>
                    
                    <Typography variant="subtitle1" gutterBottom>10th Grade</Typography>
                    <Grid container spacing={2} sx={{ mb: 2 }}>
                      <Grid item xs={12} md={6}>
                        <Typography><strong>School:</strong> {selectedApplication.schoolName10}</Typography>
                      </Grid>
                      <Grid item xs={12} md={3}>
                        <Typography><strong>Board:</strong> {selectedApplication.board10}</Typography>
                      </Grid>
                      <Grid item xs={12} md={3}>
                        <Typography><strong>Year:</strong> {selectedApplication.passingYear10}</Typography>
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <Typography><strong>Percentage/CGPA:</strong> {selectedApplication.percentage10 || selectedApplication.cgpa10}</Typography>
                      </Grid>
                    </Grid>

                    <Typography variant="subtitle1" gutterBottom>12th Grade</Typography>
                    <Grid container spacing={2} sx={{ mb: 2 }}>
                      <Grid item xs={12} md={6}>
                        <Typography><strong>School:</strong> {selectedApplication.schoolName12}</Typography>
                      </Grid>
                      <Grid item xs={12} md={3}>
                        <Typography><strong>Board:</strong> {selectedApplication.board12}</Typography>
                      </Grid>
                      <Grid item xs={12} md={3}>
                        <Typography><strong>Year:</strong> {selectedApplication.passingYear12}</Typography>
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <Typography><strong>Percentage/CGPA:</strong> {selectedApplication.percentage12 || selectedApplication.cgpa12}</Typography>
                      </Grid>
                    </Grid>

                    {selectedApplication.isGraduation && (
                      <>
                        <Typography variant="subtitle1" gutterBottom>Graduation</Typography>
                        <Grid container spacing={2}>
                          <Grid item xs={12} md={6}>
                            <Typography><strong>University:</strong> {selectedApplication.graduationUniversity}</Typography>
                          </Grid>
                          <Grid item xs={12} md={6}>
                            <Typography><strong>Course:</strong> {selectedApplication.graduationCourse}</Typography>
                          </Grid>
                          <Grid item xs={12} md={6}>
                            <Typography><strong>Year:</strong> {selectedApplication.passingYearGraduation}</Typography>
                          </Grid>
                          <Grid item xs={12} md={6}>
                            <Typography><strong>Percentage/CGPA:</strong> {selectedApplication.percentageGraduation || selectedApplication.cgpaGraduation}</Typography>
                          </Grid>
                        </Grid>
                      </>
                    )}
                  </Grid>
                </Grid>
              </Box>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setViewDialogOpen(false)}>Close</Button>
          </DialogActions>
        </Dialog>

        {/* Update Status Dialog */}
        <Dialog
          open={statusDialogOpen}
          onClose={() => setStatusDialogOpen(false)}
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle>
            Update College Status
          </DialogTitle>
          <DialogContent>
            <Box sx={{ mt: 2 }}>
              <Typography variant="body1" gutterBottom>
                <strong>Student:</strong> {selectedApplication?.name}
              </Typography>
              <Typography variant="body1" gutterBottom>
                <strong>College:</strong> {selectedCollege?.collegeName}
              </Typography>
              
              <FormControl fullWidth sx={{ mt: 2 }}>
                <InputLabel>Status</InputLabel>
                <Select
                  value={statusUpdate.status}
                  label="Status"
                  onChange={(e) => setStatusUpdate({...statusUpdate, status: e.target.value})}
                >
                  <MenuItem value="pending">Pending</MenuItem>
                  <MenuItem value="approved">Approved</MenuItem>
                  <MenuItem value="rejected">Rejected</MenuItem>
                </Select>
              </FormControl>

              <TextField
                fullWidth
                multiline
                rows={3}
                label="Remarks"
                value={statusUpdate.remarks}
                onChange={(e) => setStatusUpdate({...statusUpdate, remarks: e.target.value})}
                sx={{ mt: 2 }}
                placeholder="Add any remarks or comments..."
              />
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setStatusDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleStatusUpdate} variant="contained" color="primary">
              Update Status
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </LocalizationProvider>
  );
};

export default AdminApplications;