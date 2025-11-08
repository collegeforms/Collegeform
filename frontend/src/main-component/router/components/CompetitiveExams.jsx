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
  alpha
} from '@mui/material';
import { Search, School, Assignment, TrendingUp } from '@mui/icons-material';
import Navbar from '../../../components/Navbar/Navbar';
import Footer from '../../../components/footer/Footer';

const CompetitiveExams = () => {
    const API_URL = "https://collegeforms.in";
  
  const [courses, setCourses] = useState([]);
  const [filteredCourses, setFilteredCourses] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

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

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="50vh">
          <CircularProgress sx={{ color: '#002244' }} />
        </Box>
      </Container>
    );
  }

  return (
   <>
   
   <Navbar/>

    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Header Section */}
      <Paper
        sx={{
          p: 6,
          mb: 6,
          textAlign: 'center',
          background: 'linear-gradient(135deg, #002244 0%, #004488 100%)',
          color: 'white',
          borderRadius: 4,
          boxShadow: '0 8px 32px rgba(0, 34, 68, 0.3)',
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        <Box
          sx={{
            position: 'absolute',
            top: -50,
            right: -50,
            width: 200,
            height: 200,
            background: 'rgba(255, 255, 255, 0.1)',
            borderRadius: '50%'
          }}
        />
        <Box
          sx={{
            position: 'absolute',
            bottom: -30,
            left: -30,
            width: 150,
            height: 150,
            background: 'rgba(255, 255, 255, 0.05)',
            borderRadius: '50%'
          }}
        />
        
        <School sx={{ fontSize: 64, mb: 3, color: 'white' }} />
        <Typography variant="h4" className='text-light' fontWeight="800" gutterBottom sx={{ letterSpacing: '-0.5px' }}>
          Competitive Exams
        </Typography>
        <Typography variant="h6" className='text-light' sx={{ opacity: 0.9, maxWidth: 600, margin: '0 auto', fontWeight: 300 }}>
          Discover comprehensive exam information for various courses and career paths
        </Typography>
      </Paper>

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

      {/* Statistics Cards */}
 

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
                            sx={{
                              fontWeight: '600',
                              borderRadius: 2,
                              background: getExamColor(index),
                              color: 'white',
                              fontSize: '0.8rem',
                              height: 32,
                              transition: 'all 0.2s ease',
                              '&:hover': {
                                transform: 'scale(1.05)',
                                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)'
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

    <Footer/>
   </>
  );
};

export default CompetitiveExams;