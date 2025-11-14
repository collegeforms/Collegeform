import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  Grid,
  Chip,
  Paper,
  TextField,
  InputAdornment,
  CircularProgress,
  Alert,
  alpha,
  Modal,
  Button,
  IconButton,
  Fade,
  FormControlLabel,
  Checkbox
} from '@mui/material';
import { Search, School, Assignment, TrendingUp, Close, Person, Phone, Description, Category } from '@mui/icons-material';
import Navbar from '../../../components/Navbar/Navbar';
import Footer from '../../../components/footer/Footer';
import BannerRow from './SimpleBannerRow';

const CompetitiveExams = () => {
  const API_URL = "https://collegeforms.in";
  
  const [courses, setCourses] = useState([]);
  const [filteredCourses, setFilteredCourses] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [enquiryOpen, setEnquiryOpen] = useState(false);
  const [selectedExam, setSelectedExam] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    number: '',
    inquiry: '',
    category: 'Competitive Exams',
    agreeToContact: false
  });
  const [submitting, setSubmitting] = useState(false);
  const [showThankYou, setShowThankYou] = useState(false);

  // Primary color
  const primaryColor = '#002244';
  const lightColor = '#334d66';
  const gradient = `linear-gradient(45deg, ${primaryColor} 30%, ${lightColor} 90%)`;
  const hoverGradient = `linear-gradient(45deg, #001933 30%, #2d4466 90%)`;

  useEffect(() => {
    fetchCourses();
  }, []);

  useEffect(() => {
    filterCourses();
  }, [searchTerm, courses]);

  const fetchCourses = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}/api/managexams`);
      setCourses(response.data);
      setError('');
    } catch (error) {
      console.error('Error fetching courses', error);
      setError('Failed to load courses. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const filterCourses = () => {
    if (!searchTerm.trim()) {
      setFilteredCourses(courses);
      return;
    }

    const filtered = courses.filter(course =>
      course.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (course.exams && course.exams.some(exam => 
        exam.name.toLowerCase().includes(searchTerm.toLowerCase())
      ))
    );
    setFilteredCourses(filtered);
  };

  const getExamColor = (index) => {
    const colors = [
      '#002244', '#004488', '#0066CC', '#0088FF', 
      '#3366CC', '#6644AA', '#884488', '#AA4466'
    ];
    return colors[index % colors.length];
  };

  const handleExamClick = (exam, course) => {
    setSelectedExam({ ...exam, courseName: course.name });
    setEnquiryOpen(true);
    setShowThankYou(false);
    // Pre-fill the inquiry field with exam information
    setFormData(prev => ({
      ...prev,
      inquiry: `I'm interested in ${exam.name} under ${course.name}`
    }));
  };

  const handleEnquiryClose = () => {
    setEnquiryOpen(false);
    setSelectedExam(null);
    setFormData({
      name: '',
      number: '',
      inquiry: '',
      category: 'Competitive Exams',
      agreeToContact: false
    });
    setShowThankYou(false);
    setSubmitting(false);
  };

  const handleFormChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmitEnquiry = async (e) => {
    e.preventDefault();
    
    if (!formData.agreeToContact) {
      alert('Please agree to be contacted regarding your inquiry');
      return;
    }

    setSubmitting(true);
    
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      console.log('Enquiry submitted:', {
        ...formData,
        exam: selectedExam?.name,
        course: selectedExam?.courseName
      });
      
      // Show thank you message
      setShowThankYou(true);
      
      // Close modal after 3 seconds
      setTimeout(() => {
        handleEnquiryClose();
      }, 3000);
      
    } catch (error) {
      console.error('Error submitting enquiry:', error);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <>
        <Navbar/>
        <BannerRow category={'CompetitiveExams'} />    
        <Container maxWidth="lg" sx={{ py: 4 }}>
          <Box display="flex" justifyContent="center" alignItems="center" minHeight="50vh">
            <CircularProgress sx={{ color: '#002244' }} />
          </Box>
        </Container>
        <Footer/>
      </>
    );
  }

  return (
    <>
      <Navbar/>
      <BannerRow category={'CompetitiveExams'} />    

      <Container maxWidth="lg" sx={{ py: 4 }}>
        {/* Header Section */}
        <br />

        {/* Search Section */}
        <Box sx={{ mb: 6, px: 2 }}>
          <TextField
            fullWidth
            variant="outlined"
            placeholder="Search courses or exams like JEE, NEET, CAT, UPSC..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search sx={{ color: '#002244' }} />
                </InputAdornment>
              ),
              sx: {
                borderRadius: 3,
                backgroundColor: 'white',
                fontSize: '16px',
                '&:hover': {
                  backgroundColor: '#f8f9fa'
                }
              }
            }}
            sx={{
              '& .MuiOutlinedInput-root': {
                '&.Mui-focused fieldset': {
                  borderColor: '#002244',
                  borderWidth: '2px'
                }
              }
            }}
          />
        </Box>

        {/* Error Message */}
        {error && (
          <Alert 
            severity="error" 
            sx={{ 
              mb: 4, 
              borderRadius: 3,
              border: '1px solid',
              borderColor: 'error.light'
            }}
          >
            {error}
          </Alert>
        )}

        {/* Courses Grid */}
        {filteredCourses.length === 0 ? (
          <Paper 
            sx={{ 
              p: 8, 
              textAlign: 'center',
              borderRadius: 4,
              background: 'white',
              boxShadow: '0 4px 20px rgba(0, 34, 68, 0.1)'
            }}
          >
            <Search sx={{ fontSize: 64, color: 'grey.400', mb: 3 }} />
            <Typography variant="h5" color="textSecondary" gutterBottom fontWeight="500">
              {searchTerm ? 'No matching courses or exams found' : 'No courses available yet'}
            </Typography>
            <Typography variant="body1" color="text.secondary">
              {searchTerm ? 'Try searching with different keywords' : 'Check back later for updated content'}
            </Typography>
          </Paper>
        ) : (
          <Grid container spacing={4} sx={{ px: 2 }}>
            {filteredCourses.map((course) => (
              <Grid item xs={12} md={6} lg={4} key={course._id}>
                <Card
                  sx={{
                    height: '100%',
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    background: 'white',
                    borderRadius: 4,
                    border: '1px solid',
                    borderColor: 'grey.100',
                    boxShadow: '0 4px 20px rgba(0, 34, 68, 0.08)',
                    '&:hover': {
                      transform: 'translateY(-8px)',
                      boxShadow: '0 12px 40px rgba(0, 34, 68, 0.15)',
                      borderColor: '#002244'
                    }
                  }}
                >
                  <CardContent sx={{ p: 4, height: '100%', display: 'flex', flexDirection: 'column' }}>
                    {/* Course Header */}
                    <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 3 }}>
                      <Box
                        sx={{
                          p: 1.5,
                          borderRadius: 3,
                          background: 'linear-gradient(135deg, #002244 0%, #004488 100%)',
                          mr: 2,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}
                      >
                        <Assignment sx={{ fontSize: 24, color: 'white' }} />
                      </Box>
                      <Box sx={{ flex: 1 }}>
                        <Typography 
                          variant="h6" 
                          fontWeight="700" 
                          color="#002244"
                          sx={{ 
                            lineHeight: 1.3,
                            mb: 0.5
                          }}
                        >
                          {course.name}
                        </Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <Chip
                            label={`${course.exams?.length || 0} exams`}
                            size="small"
                            sx={{
                              background: alpha('#002244', 0.1),
                              color: '#002244',
                              fontWeight: '600',
                              fontSize: '0.75rem'
                            }}
                          />
                        </Box>
                      </Box>
                    </Box>

                    {/* Exams Section */}
                    <Box sx={{ flex: 1 }}>
                      <Typography 
                        variant="subtitle2" 
                        fontWeight="600" 
                        color="text.secondary"
                        gutterBottom
                        sx={{ mb: 2 }}
                      >
                        AVAILABLE EXAMS
                      </Typography>
                      
                      {course.exams && course.exams.length > 0 ? (
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1.5 }}>
                          {course.exams.map((exam, index) => (
                            <Chip
                              key={exam._id}
                              label={exam.name}
                              onClick={() => handleExamClick(exam, course)}
                              sx={{
                                fontWeight: '600',
                                borderRadius: 2,
                                background: getExamColor(index),
                                color: 'white',
                                fontSize: '0.8rem',
                                height: 32,
                                cursor: 'pointer',
                                transition: 'all 0.2s ease',
                                '&:hover': {
                                  transform: 'scale(1.05)',
                                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
                                  opacity: 0.9
                                }
                              }}
                            />
                          ))}
                        </Box>
                      ) : (
                        <Typography 
                          variant="body2" 
                          color="text.secondary" 
                          sx={{ 
                            fontStyle: 'italic',
                            textAlign: 'center',
                            py: 2
                          }}
                        >
                          No exams available for this course
                        </Typography>
                      )}
                    </Box>

                    {/* Footer */}
                    <Box sx={{ mt: 3, pt: 3, borderTop: 1, borderColor: 'grey.100' }}>
                      <Typography variant="caption" color="text.secondary" sx={{ fontWeight: '500' }}>
                        Updated {new Date(course.updatedAt).toLocaleDateString('en-US', { 
                          year: 'numeric', 
                          month: 'short', 
                          day: 'numeric' 
                        })}
                      </Typography>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
      </Container>

      {/* Enquiry Form Modal */}
      <Modal
        open={enquiryOpen}
        onClose={handleEnquiryClose}
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          p: 2
        }}
      >
        <Fade in={enquiryOpen}>
          <Paper
            sx={{
              maxWidth: 500,
              width: '100%',
              p: 4,
              borderRadius: 3,
              boxShadow: '0 20px 40px rgba(0,0,0,0.2)',
              background: 'linear-gradient(145deg, #ffffff 0%, #f8f9fa 100%)',
              position: 'relative',
              overflow: 'hidden',
              '&::before': {
                content: '""',
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                height: '4px',
                background: gradient
              }
            }}
          >
            <IconButton
              onClick={handleEnquiryClose}
              sx={{
                position: 'absolute',
                top: 12,
                right: 12,
                color: '#666'
              }}
            >
              <Close />
            </IconButton>

            {showThankYou ? (
              <Box sx={{ textAlign: 'center', py: 4 }}>
                <Box
                  sx={{
                    p: 2,
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, #4CAF50 0%, #45a049 100%)',
                    display: 'inline-flex',
                    mb: 2
                  }}
                >
                  <CheckCircle sx={{ fontSize: 48, color: 'white' }} />
                </Box>
                <Typography 
                  variant="h4" 
                  component="h2" 
                  sx={{ 
                    fontWeight: 600,
                    color: primaryColor,
                    mb: 2
                  }}
                >
                  Thank You!
                </Typography>
                <Typography 
                  variant="h6" 
                  sx={{ 
                    color: 'text.secondary',
                    mb: 1
                  }}
                >
                  Your enquiry has been submitted successfully.
                </Typography>
                <Typography 
                  variant="body1" 
                  sx={{ 
                    color: 'text.secondary'
                  }}
                >
                  We will contact you soon regarding {selectedExam?.name}.
                </Typography>
                <Typography 
                  variant="caption" 
                  sx={{ 
                    color: 'text.secondary',
                    display: 'block',
                    mt: 2
                  }}
                >
                  Closing automatically...
                </Typography>
              </Box>
            ) : (
              <>
                <Box sx={{ textAlign: 'center', mb: 3 }}>
                  <Typography 
                    variant="h5" 
                    component="h2" 
                    sx={{ 
                      fontWeight: 600,
                      color: primaryColor,
                      mb: 1
                    }}
                  >
                    Enquiry Form
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Interested in {selectedExam?.name} - {selectedExam?.courseName}
                  </Typography>
                </Box>

                <Box component="form" onSubmit={handleSubmitEnquiry} sx={{ mt: 2 }}>
                  <TextField
                    fullWidth
                    label="Full Name"
                    value={formData.name}
                    onChange={(e) => handleFormChange('name', e.target.value)}
                    required
                    margin="normal"
                    variant="outlined"
                    InputProps={{
                      startAdornment: <Person sx={{ color: 'action.active', mr: 1 }} />
                    }}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 2,
                        '&:hover fieldset': {
                          borderColor: primaryColor,
                        },
                        '&.Mui-focused fieldset': {
                          borderColor: primaryColor,
                        }
                      },
                      '& .MuiInputLabel-root.Mui-focused': {
                        color: primaryColor,
                      }
                    }}
                  />

                  <TextField
                    fullWidth
                    label="Phone Number"
                    type="tel"
                    value={formData.number}
                    onChange={(e) => handleFormChange('number', e.target.value)}
                    required
                    margin="normal"
                    variant="outlined"
                    InputProps={{
                      startAdornment: <Phone sx={{ color: 'action.active', mr: 1 }} />
                    }}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 2,
                        '&:hover fieldset': {
                          borderColor: primaryColor,
                        },
                        '&.Mui-focused fieldset': {
                          borderColor: primaryColor,
                        }
                      },
                      '& .MuiInputLabel-root.Mui-focused': {
                        color: primaryColor,
                      }
                    }}
                  />

                  <TextField
                    fullWidth
                    label="Your Inquiry"
                    multiline
                    rows={3}
                    value={formData.inquiry}
                    onChange={(e) => handleFormChange('inquiry', e.target.value)}
                    required
                    margin="normal"
                    variant="outlined"
                    placeholder="Tell us more about your requirements..."
                    InputProps={{
                      startAdornment: <Description sx={{ color: 'action.active', mr: 1, mt: 1, alignSelf: 'flex-start' }} />
                    }}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 2,
                        '&:hover fieldset': {
                          borderColor: primaryColor,
                        },
                        '&.Mui-focused fieldset': {
                          borderColor: primaryColor,
                        }
                      },
                      '& .MuiInputLabel-root.Mui-focused': {
                        color: primaryColor,
                      }
                    }}
                  />

                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={formData.agreeToContact}
                        onChange={(e) => handleFormChange('agreeToContact', e.target.checked)}
                        sx={{
                          color: primaryColor,
                          '&.Mui-checked': {
                            color: primaryColor,
                          },
                        }}
                      />
                    }
                    label="I agree to be contacted regarding my enquiry"
                    sx={{ mt: 2 }}
                  />

                  <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    disabled={submitting}
                    sx={{
                      mt: 3,
                      mb: 2,
                      py: 1.5,
                      borderRadius: 2,
                      fontSize: '1rem',
                      fontWeight: 600,
                      background: submitting ? '#ccc' : gradient,
                      boxShadow: submitting ? 'none' : `0 3px 5px 2px ${lightColor}50`,
                      '&:hover': {
                        background: submitting ? '#ccc' : hoverGradient,
                        boxShadow: submitting ? 'none' : `0 5px 10px 2px ${lightColor}70`,
                        transform: submitting ? 'none' : 'translateY(-1px)'
                      },
                      transition: 'all 0.3s ease'
                    }}
                  >
                    {submitting ? (
                      <>
                        <CircularProgress size={20} sx={{ color: 'white', mr: 1 }} />
                        Submitting...
                      </>
                    ) : (
                      'Submit Enquiry'
                    )}
                  </Button>
                </Box>
              </>
            )}
          </Paper>
        </Fade>
      </Modal>

      <Footer/>
    </>
  );
};

export default CompetitiveExams;