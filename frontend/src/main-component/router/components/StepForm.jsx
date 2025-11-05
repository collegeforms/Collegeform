import React, { useState, useEffect } from 'react';
import {
  Button, TextField, MenuItem, Grid, FormControl, InputLabel, Select,
  Typography, Box, Stepper, Step, StepLabel, Container, Radio,
  RadioGroup, FormControlLabel, Alert, Paper, Card, CardContent,
  Chip, Checkbox, ListItemText, OutlinedInput, Modal, CircularProgress
} from '@mui/material';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { Link } from 'react-router-dom';

// Create a custom theme
const theme = createTheme({
  palette: {
    primary: {
      main: '#1565C0',
    },
    secondary: {
      main: '#1565C0',
    },
  },
});

// ThankYou Component
const ThankYou = () => {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
        width: '100vw',
        textAlign: 'center',
        backgroundColor: '#f9f9f9',
        position: 'fixed',
        top: 0,
        left: 0,
        zIndex: 9999,
      }}
    >
      <Box sx={{ mb: 2 }}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="100"
          height="100"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#4CAF50"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="12" cy="12" r="10" />
          <path d="M9 12l2 2 4-4" />
        </svg>
      </Box>
      <Typography variant="h4" fontWeight={700} color="#4CAF50" gutterBottom>
        Thank you!
      </Typography>
      <Typography variant="h6" color="text.secondary">
        Your submission has been sent successfully.
      </Typography>
    </Box>
  );
};

const StepForm = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const college = location.state?.college;
  
  const genderOptions = ['Male', 'Female', 'Other'];
  const boardOptions = ['CBSE', 'ICSE', 'State Board'];
  const steps = ['Personal Information', "Family Information", 'Education', 'Course & College'];

  // State for tracking progress and form data
  const [activeStep, setActiveStep] = useState(0);
  const [formData, setFormData] = useState({
    name: '',
    number: '',
    dob: '',
    gender: '',
    aadhar: '',
    course: '',
    selectedColleges: college ? [{
      id: college._id,
      name: college.name,
      slug: college.slug || college.name.toLowerCase().replace(/\s+/g, '-')
    }] : [],
    fatherName: '',
    fatherNumber: '',
    email: '',
    occupation: '',
    motherName: '',
    motherNumber: '',
    schoolName10: '',
    board10: '',
    passingYear10: '',
    percentage10: '',
    cgpa10: '',
    schoolName12: '',
    board12: '',
    passingYear12: '',
    percentage12: '',
    cgpa12: '',
    graduationUniversity: '',
    graduationCourse: '',
    passingYearGraduation: '',
    percentageGraduation: '',
    isGraduation: false,
    cgpaGraduation: '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [saving, setSaving] = useState(false);
  const [availableColleges, setAvailableColleges] = useState([]);
  const [courseOptions, setCourseOptions] = useState([]);
  const [allCourses, setAllCourses] = useState([]);
  const [filteredColleges, setFilteredColleges] = useState([]);
  const [showThankYou, setShowThankYou] = useState(false);
 const API_URL = "https://collegeforms.in";
    

  const userToken = localStorage.getItem("userToken");

  // Fetch all courses and colleges on component mount
  useEffect(() => {
    const fetchCoursesAndColleges = async () => {
      try {
        // Fetch all courses
        const coursesResponse = await axios.get(`${API_URL}/api/courses`);
        setAllCourses(coursesResponse.data);
        
        // If a college is pre-selected, show only its courses
        if (college) {
          setCourseOptions(college.courses || []);
          // Auto-select the first course if available
          if (college.courses && college.courses.length > 0 && !formData.course) {
            setFormData(prev => ({
              ...prev,
              course: college.courses[0]
            }));
          }
        } else {
          // If no college is pre-selected, show all courses
          setCourseOptions(coursesResponse.data);
        }
        
        // Fetch all colleges
        const collegesResponse = await axios.get(`${API_URL}/api/colleges`);
        setAvailableColleges(collegesResponse.data);
        setFilteredColleges(collegesResponse.data);
      } catch (error) {
        console.error("Error fetching courses or colleges:", error);
      }
    };

    fetchCoursesAndColleges();
  }, [API_URL, college]);

  // Update filtered colleges when course changes
  useEffect(() => {
    if (formData.course) {
      const collegesForCourse = availableColleges.filter(college => 
        college.courses && college.courses.includes(formData.course)
      );
      setFilteredColleges(collegesForCourse);
      
      // If a default college is available and it offers the selected course, keep it selected
      // Otherwise, clear the selection
      if (college) {
        if (college.courses && college.courses.includes(formData.course)) {
          // Keep the default college selected if it offers the course
          setFormData(prev => ({
            ...prev,
            selectedColleges: [{
              id: college._id,
              name: college.name,
              slug: college.slug || college.name.toLowerCase().replace(/\s+/g, '-')
            }]
          }));
        } else {
          // Clear selection if default college doesn't offer the course
          setFormData(prev => ({
            ...prev,
            selectedColleges: []
          }));
        }
      } else {
        // Clear selection when no default college and course changes
        setFormData(prev => ({
          ...prev,
          selectedColleges: []
        }));
      }
    } else {
      // Show all colleges when no course is selected
      setFilteredColleges(availableColleges);
    }
  }, [formData.course, availableColleges, college]);

  // Load saved data when component mounts
  useEffect(() => {
    if (!userToken) {
      setError("You need to be logged in to access this form.");
      return;
    }

    const fetchSavedData = async () => {
      try {
        const config = {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${userToken}`,
          }
        };
        
        const response = await axios.get(`${API_URL}/api/students/progress`, config);
        
        if (response.data && response.data.formData) {
          setFormData(response.data.formData);
          setActiveStep(response.data.activeStep+1 || 0);
        }
      } catch (error) {
        if (error.response?.status === 401) {
          setError("Your session has expired. Please log in again.");
          localStorage.removeItem("userToken");
          setTimeout(() => navigate('/user/login'), 2000);
        } else if (error.response?.status === 404) {
          // No saved data exists, which is fine
          console.log("No saved progress found");
        } else {
          console.error("Error fetching saved data:", error);
        }
      }
    };

    fetchSavedData();
  }, [userToken, API_URL, navigate]);

  // Handle course selection
  const handleCourseChange = (e) => {
    const { value } = e.target;
    
    setFormData({
      ...formData,
      course: value
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleCollegeChange = (event) => {
    const {
      target: { value },
    } = event;
    
    // Convert selected college IDs to objects with id, name, and slug
    const selectedCollegeObjects = value.map(collegeId => {
      const college = filteredColleges.find(c => c._id === collegeId);
      return {
        id: college._id,
        name: college.name,
        slug: college.slug || college.name.toLowerCase().replace(/\s+/g, '-')
      };
    });
    
    setFormData({
      ...formData,
      selectedColleges: selectedCollegeObjects,
    });
  };

  // Save progress to backend
  const saveProgress = async () => {
    setSaving(true);
    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userToken}`,
        },
      };
      
      await axios.post(`${API_URL}/api/students/save-progress`, {
        formData,
        activeStep
      }, config);
    } catch (error) {
      console.error("Error saving progress:", error);
    } finally {
      setSaving(false);
    }
  };

  const handleNext = async () => {
    // Validate current step
    if (activeStep === 0) {
      if (!formData.name || !formData.number || !formData.dob || !formData.gender || 
          !formData.aadhar || !formData.email) {
        setError("Please fill all required fields");
        return;
      }
    } else if (activeStep === 1) {
      if (!formData.fatherName || !formData.fatherNumber || !formData.occupation || !formData.motherName) {
        setError("Please fill all required fields");
        return;
      }
    } else if (activeStep === 2) {
      if (    !formData.schoolName10 || !formData.board10 || !formData.passingYear10 || 
          (!formData.percentage10 && !formData.cgpa10)) {
        setError("Please fill all required fields");
        return;
      }
    }
    
    setError('');
    // Save progress before moving to next step
    await saveProgress();
    setActiveStep(prevStep => prevStep + 1);
  };

  const handleBack = async () => {
    setError('');
    // Save progress before moving back
    await saveProgress();
    setActiveStep(prevStep => prevStep - 1);
  };

  const handleSubmit = async () => {
    try {
      // Validate final step
      if (!formData.schoolName12 || !formData.board12 || !formData.passingYear12 || 
          (!formData.percentage12 && !formData.cgpa12)) {
        setError("Please fill all required fields");
        return;
      }
      
      if (formData.isGraduation && (!formData.graduationUniversity || !formData.graduationCourse || 
          !formData.passingYearGraduation || (!formData.percentageGraduation && !formData.cgpaGraduation))) {
        setError("Please fill all graduation details");
        return;
      }

      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userToken}`,
        },
      };
  
      // Send all selected colleges with their details
      const response = await axios.post(`${API_URL}/api/students/submit`, {
        ...formData,
        selectedColleges: formData.selectedColleges
      }, config);
  
      // Clear saved progress after successful submission
      await axios.delete(`${API_URL}/api/students/clear-progress`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userToken}`,
        }
      });
  
      // Show thank you message
      setShowThankYou(true);
      
      // Wait for 2 seconds then redirect
      setTimeout(() => {
        setShowThankYou(false);
        navigate('/myaccount');
      }, 2000);
      
      // Reset form
      setFormData({
        name: "",
        number: "",
        dob: "",
        gender: "",
        aadhar: "",
        course: "",
        selectedColleges: [],
        fatherName: "",
        fatherNumber: "",
        email: "",
        occupation: "",
        motherName: "",
        motherNumber: "",
        schoolName10: "",
        board10: "",
        passingYear10: "",
        percentage10: "",
        cgpa10: "",
        schoolName12: "",
        board12: "",
        passingYear12: "",
        percentage12: "",
        cgpa12: "",
        isGraduation: false,
        graduationUniversity: "",
        graduationCourse: "",
        passingYearGraduation: "",
        percentageGraduation: "",
        cgpaGraduation: "",
      });
      setActiveStep(0);
    } catch (error) {
      console.error("Error submitting form:", error);
      setError(error.response?.data?.message || "There was an error submitting the form. Please try again.");
      setSuccess('');
    }
  };

  if (!userToken) {
    return (
      <Container maxWidth="md" sx={{ mt: 5 }}>
        <Alert severity="error">
          You need to be logged in to access this form.
        </Alert>

        <Button variant="contained" sx={{ mt: 2 }} onClick={() => navigate('/user/login')}>
         <Link className='text-light' to={'/user/login'}>
          Go to Login
         </Link>
       
        </Button>
      </Container>
    );
  }

  return (
    <>
      {showThankYou && <ThankYou />}
      
      <ThemeProvider theme={theme}>
        <Container maxWidth="lg" sx={{ mt: 0, mb: 4 }}>
          <Paper elevation={3} sx={{ p: 0, borderRadius: 2 }} style={{boxShadow:"none"}}>
            <Box sx={{ textAlign: 'center', mb: 3 }}>
              <Typography variant="h6" component="h1" gutterBottom color="secondary">
                {college ? `${college.name} Application Form` : 'Common Application Form'}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                {college ? 'Apply to this college' : 'Apply to multiple colleges with a single form'}
              </Typography>
            </Box>
            
            {error && <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>{error}</Alert>}
            {success && <Alert severity="success" sx={{ mb: 2 }} onClose={() => setSuccess('')}>{success}</Alert>}
            {saving && <Alert severity="info" sx={{ mb: 2 }}>Saving your progress...</Alert>}
            
            <Stepper
              activeStep={activeStep}
              alternativeLabel
              sx={{ mb: 4 }}
            >
              {steps.map((label, index) => (
                <Step key={index}>
                  <StepLabel>{label}</StepLabel>
                </Step>
              ))}
            </Stepper>

            <Box sx={{ mt: 3 }}>
              <form>
                {activeStep === 0 && (
                  <Card variant="outlined" sx={{ p: 0 }}>
                    <CardContent>
                    
                      <Grid container spacing={3}>
                        <Grid item xs={12} md={4}>
                          <TextField
                            label="Name *"
                            fullWidth
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                          />
                        </Grid>
                        <Grid item xs={12} md={4}>
                          <TextField
                            label="Phone Number *"
                            fullWidth
                            name="number"
                            value={formData.number}
                            onChange={handleChange}
                            required
                          />
                        </Grid>
                           <Grid item xs={12 }  md={4}>
                          <TextField
                            label="Email ID *"
                            fullWidth
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                          />
                        </Grid>
                        <Grid item xs={12} md={6}>
                          <TextField
                            label="Date of Birth *"
                            type="date"
                            fullWidth
                            name="dob"
                            value={formData.dob}
                            onChange={handleChange}
                            InputLabelProps={{
                              shrink: true,
                            }}
                            required
                          />
                        </Grid>
                        <Grid item xs={12} md={6}>
                          <FormControl fullWidth required>
                            <InputLabel>Gender *</InputLabel>
                            <Select
                              label="Gender *"
                              name="gender"
                              value={formData.gender}
                              onChange={handleChange}
                            >
                              {genderOptions.map((gender, idx) => (
                                <MenuItem key={idx} value={gender}>
                                  {gender}
                                </MenuItem>
                              ))}
                            </Select>
                          </FormControl>
                        </Grid>
                        <Grid item xs={12} md={12}>
                          <TextField
                            label="Aadhar Card Number *"
                            fullWidth
                            name="aadhar"
                            value={formData.aadhar}
                            onChange={handleChange}
                            required
                          />
                        </Grid>
                      
                      </Grid>
                    </CardContent>
                  </Card>
                )}

                {activeStep === 1 && (
                  <Card variant="outlined" sx={{ p: 0 }}>
                    <CardContent>
                  
                      <Grid container spacing={3}>
                        <Grid item xs={12} md={6}>
                          <TextField
                            label="Father's Name *"
                            fullWidth
                            name="fatherName"
                            value={formData.fatherName}
                            onChange={handleChange}
                            required
                          />
                        </Grid>
                        <Grid item xs={12} md={6}>
                          <TextField
                            label="Father's Number *"
                            fullWidth
                            name="fatherNumber"
                            value={formData.fatherNumber}
                            onChange={handleChange}
                            required
                          />
                        </Grid>
                        <Grid item xs={12} md={12}>
                          <TextField
                            label="Occupation *"
                            fullWidth
                            name="occupation"
                            value={formData.occupation}
                            onChange={handleChange}
                            required
                          />
                        </Grid>
                        <Grid item xs={12} md={6}>
                          <TextField
                            label="Mother's Name *"
                            fullWidth
                            name="motherName"
                            value={formData.motherName}
                            onChange={handleChange}
                            required
                          />
                        </Grid>
                        <Grid item xs={12} md={6}>
                          <TextField
                            label="Mother's Number"
                            fullWidth
                            name="motherNumber"
                            value={formData.motherNumber}
                            onChange={handleChange}
                          />
                        </Grid>
                      </Grid>
                    </CardContent>
                  </Card>
                )}

                {activeStep === 2 && (
                  <Card variant="outlined" sx={{ p: 0 }}>
                    <CardContent>
                  
                      <Grid container spacing={3}>
                        <Grid item xs={12} md={12}>
                          <TextField
                            label="10th School Name *"
                            fullWidth
                            name="schoolName10"
                            value={formData.schoolName10}
                            onChange={handleChange}
                            required
                          />
                        </Grid>
                        <Grid item xs={12} md={4}>
                          <FormControl fullWidth required>
                            <InputLabel>10th Board *</InputLabel>
                            <Select
                              label="10th Board *"
                              name="board10"
                              value={formData.board10}
                              onChange={handleChange}
                            >
                              {boardOptions.map((board, idx) => (
                                <MenuItem key={idx} value={board}>
                                  {board}
                                </MenuItem>
                              ))}
                            </Select>
                          </FormControl>
                        </Grid>
                        <Grid item xs={12} md={4}>
                          <TextField
                            label="10th Passing Year *"
                            fullWidth
                            name="passingYear10"
                            value={formData.passingYear10}
                            onChange={handleChange}
                            required
                          />
                        </Grid>
                        <Grid item xs={12} md={4}>
                          <TextField
                            label="10th Percentage/CGPA *"
                            fullWidth
                            name="percentage10"
                            value={formData.percentage10}
                            onChange={handleChange}
                            required
                          />
                        </Grid>



                        <Grid item xs={12} md={12}>
                          <TextField
                            label="12th School Name *"
                            fullWidth
                            name="schoolName12"
                            value={formData.schoolName12}
                            onChange={handleChange}
                            required
                          />
                        </Grid>
                        <Grid item xs={12} md={4}>
                          <FormControl fullWidth required>
                            <InputLabel>12th Board *</InputLabel>
                            <Select
                              label="12th Board *"
                              name="board12"
                              value={formData.board12}
                              onChange={handleChange}
                            >
                              {boardOptions.map((board, idx) => (
                                <MenuItem key={idx} value={board}>
                                  {board}
                                </MenuItem>
                              ))}
                            </Select>
                          </FormControl>
                        </Grid>
                        <Grid item xs={12} md={4}>
                          <TextField
                            label="12th Passing Year *"
                            fullWidth
                            name="passingYear12"
                            value={formData.passingYear12}
                            onChange={handleChange}
                            required
                          />
                        </Grid>
                        <Grid item xs={12} md={4}>
                          <TextField
                            label="12th Percentage/CGPA *"
                            fullWidth
                            name="percentage12"
                            value={formData.percentage12}
                            onChange={handleChange}
                            required
                          />
                        </Grid>


    <Grid item xs={12}>
                          <Box sx={{ p: 2, border: '1px solid #ddd', borderRadius: 1 }}>
                            <Typography variant="body1" gutterBottom>
                              Do you have graduation details to provide?
                            </Typography>
                            <RadioGroup
                            className=' m-auto justify-content-center text-center'
                              row
                              name="isGraduation"
                              value={formData.isGraduation ? "yes" : "no"}
                              onChange={(e) =>
                                setFormData({
                                  ...formData,
                                  isGraduation: e.target.value === "yes",
                                })
                              }
                            >
                              <FormControlLabel  value="yes" control={<Radio />} label="Yes" />
                              <FormControlLabel value="no" control={<Radio />} label="No" />
                            </RadioGroup>
                          </Box>
                        </Grid>

                        {formData.isGraduation && (
                          <>
                            <Grid item xs={12}>
                              <Typography variant="h6" gutterBottom color="secondary">
                                Graduation Details
                              </Typography>
                            </Grid>
                            <Grid item xs={12} md={12}>
                              <TextField
                                label="Graduation University *"
                                fullWidth
                                name="graduationUniversity"
                                value={formData.graduationUniversity}
                                onChange={handleChange}
                                required
                              />
                            </Grid>
                            <Grid item xs={12} md={4}>
                              <TextField
                                label="Graduation Course *"
                                fullWidth
                                name="graduationCourse"
                                value={formData.graduationCourse}
                                onChange={handleChange}
                                required
                              />
                            </Grid>
                            <Grid item xs={12} md={4}>
                              <TextField
                                label="Graduation Passing Year *"
                                fullWidth
                                name="passingYearGraduation"
                                value={formData.passingYearGraduation}
                                onChange={handleChange}
                                required
                              />
                            </Grid>
                            <Grid item xs={12} md={4}>
                              <TextField
                                label="Graduation Percentage/CGPA *"
                                fullWidth
                                name="percentageGraduation"
                                value={formData.percentageGraduation}
                                onChange={handleChange}
                                required
                              />
                            </Grid>
                          </>
                        )}


                      </Grid>
                    </CardContent>
                  </Card>
                )}

                {activeStep === 3 && (
                  <Card variant="outlined" sx={{ p: 0 }}>
                    <CardContent>
                  
                      <Grid container spacing={3}>
                          <Grid item xs={12} md={6}>
                          <FormControl fullWidth required>
                            <InputLabel>Course *</InputLabel>
                            <Select
                              label="Course *"
                              name="course"
                              value={formData.course}
                              onChange={handleCourseChange}
                            >
                              {college 
                                ? courseOptions.map((course, idx) => (
                                    <MenuItem key={idx} value={course}>
                                      {course}
                                    </MenuItem>
                                  ))
                                : allCourses.map((course, idx) => (
                                    <MenuItem key={idx} value={course.name}>
                                      {course.name}
                                    </MenuItem>
                                  ))
                              }
                            </Select>
                          </FormControl>
                          {college && (
                            <Typography variant="caption" color="textSecondary">
                              Showing courses available at {college.name}
                            </Typography>
                          )}
                          {!college && (
                            <Typography variant="caption" color="textSecondary">
                              Showing all available courses
                            </Typography>
                          )}
                        </Grid>
                     
                        <Grid item xs={12}>
                          <FormControl fullWidth required>
                            <InputLabel>Select Colleges *</InputLabel>
                            <Select
                              multiple
                              name="selectedColleges"
                              value={formData.selectedColleges.map(college => college.id)}
                              onChange={handleCollegeChange}
                              input={<OutlinedInput label="Select Colleges *" />}
                              renderValue={(selected) => (
                                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                  {selected.map((value) => {
                                    const college = formData.selectedColleges.find(c => c.id === value);
                                    return (
                                      <Chip 
                                        key={value} 
                                        label={college ? college.name : value} 
                                      />
                                    );
                                  })}
                                </Box>
                              )}
                              disabled={!formData.course}
                            >
                              {!formData.course ? (
                                <MenuItem disabled>
                                  Please select a course first
                                </MenuItem>
                              ) : filteredColleges.length === 0 ? (
                                <MenuItem disabled>
                                  No colleges found for this course
                                </MenuItem>
                              ) : (
                                filteredColleges.map((collegeItem) => (
                                  <MenuItem 
                                    key={collegeItem._id} 
                                    value={collegeItem._id}
                                  >
                                    <Checkbox checked={formData.selectedColleges.some(c => c.id === collegeItem._id)} />
                                    <ListItemText 
                                      primary={collegeItem.name} 
                                    />
                                  </MenuItem>
                                ))
                              )}
                            </Select>
                          </FormControl>
                          {!formData.course && (
                            <Typography variant="caption" color="textSecondary">
                              Select a course to see available colleges
                            </Typography>
                          )}
                          {college && formData.course && (
                            <Typography variant="caption" color="textSecondary">
                              {college.courses.includes(formData.course) 
                                ? `${college.name} is pre-selected. You can add more colleges that offer ${formData.course}.`
                                : `${college.name} doesn't offer ${formData.course}. Please select a different course.`}
                            </Typography>
                          )}
                          {!college && formData.course && (
                            <Typography variant="caption" color="textSecondary">
                              Showing all colleges that offer {formData.course}
                            </Typography>
                          )}
                        </Grid>
                    
                      </Grid>
                    </CardContent>
                  </Card>
                )}

                <Box sx={{ display: "flex", justifyContent: "space-between", mt: 4 }}>
                  <Button
                    disabled={activeStep === 0}
                    onClick={handleBack}
                    variant="outlined"
                    color="secondary"
                  >
                    Back
                  </Button>
                  {activeStep === steps.length - 1 ? (
                    <Button
                      onClick={handleSubmit}
                      variant="contained"
                      color="secondary"
                    >
                      Submit Application
                    </Button>
                  ) : (
                    <Button
                      onClick={handleNext}
                      variant="contained"
                      color="secondary"
                    >
                      Save & Next
                    </Button>
                  )}
                </Box>
              </form>
            </Box>
          </Paper>
        </Container>
      </ThemeProvider>
    </>
  );
};

export default StepForm;