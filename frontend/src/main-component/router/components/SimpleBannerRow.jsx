import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Modal, 
  IconButton, 
  CircularProgress, 
  Alert, 
  Button, 
  useTheme, 
  useMediaQuery,
  TextField,
  Typography,
  Paper,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Fade,
  Checkbox,
  FormControlLabel
} from '@mui/material';
import { Close, NavigateBefore, NavigateNext, Refresh, Person, Phone, Description, Category, CheckCircle } from '@mui/icons-material';

const BannerRow = ({ category }) => {
  console.log(category);
  
  const [banners, setBanners] = useState([]);
  const [selectedBanner, setSelectedBanner] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [inquiryOpen, setInquiryOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    inquiry: '',
    category: category || '',
    email: '' // Added email field
  });
  const [submitting, setSubmitting] = useState(false);
  const [showThankYou, setShowThankYou] = useState(false);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const API_URL = "https://www.collegeforms.in";

  // Primary color from props
  const primaryColor = '#002244';
  const lightColor = '#334d66';
  const gradient = `linear-gradient(45deg, ${primaryColor} 30%, ${lightColor} 90%)`;
  const hoverGradient = `linear-gradient(45deg, #001933 30%, #2d4466 90%)`;

  // Fetch banners from API
  const fetchBanners = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch(`${API_URL}/api/banners/category/${category}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('Banners API Response:', data);

      // Handle different response formats
      if (Array.isArray(data)) {
        setBanners(data);
      } else if (data.banners && Array.isArray(data.banners)) {
        setBanners(data.banners);
      } else if (data.success && Array.isArray(data.banners)) {
        setBanners(data.banners);
      } else {
        throw new Error('Invalid response format from API');
      }
    } catch (err) {
      console.error('Error fetching banners:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBanners();
  }, [category]);

  const handleBannerClick = (banner, index) => {
    setSelectedBanner(banner);
    setCurrentIndex(index);
  };

  const handleClose = () => {
    setSelectedBanner(null);
  };

  const navigateBanners = (direction) => {
    if (banners.length === 0) return;

    let newIndex;
    if (direction === 'next') {
      newIndex = (currentIndex + 1) % banners.length;
    } else {
      newIndex = (currentIndex - 1 + banners.length) % banners.length;
    }
    setCurrentIndex(newIndex);
    setSelectedBanner(banners[newIndex]);
  };

  const handleVisitWebsite = () => {
    setInquiryOpen(true);
    setShowThankYou(false);
  };

  const handleInquiryClose = () => {
    setInquiryOpen(false);
    setFormData({
      name: '',
      phone: '',
      inquiry: '',
      category: category || '',
      email: ''
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

  const handleSubmitInquiry = async (e) => {
    e.preventDefault();
    
    setSubmitting(true);
    
    try {
      // Real API call to save enquiry
      const response = await fetch(`${API_URL}/api/banner-enquiries`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name || null,
          phone: formData.phone || null,
          email: formData.email || null,
          inquiry: formData.inquiry || null,
          category: formData.category || null
        })
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Failed to submit enquiry');
      }

      console.log('Enquiry submitted successfully:', result);
      
      // Show thank you message
      setShowThankYou(true);
      
      // Close modal after 3 seconds
      setTimeout(() => {
        handleInquiryClose();
      }, 3000);
      
    } catch (error) {
      console.error('Error submitting enquiry:', error);
      alert('Failed to submit enquiry. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  // Show loading state
  if (loading) {
    return (
      <Box 
        sx={{
          width: '100%',
          height: isMobile ? '450px' : 'auto',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#f5f5f5'
        }}
      >
        <CircularProgress sx={{ color: primaryColor }} />
      </Box>
    );
  }

  // Show error state
  if (error) {
    return (
      <Box 
        sx={{
          width: '100%',
          height: isMobile ? '450px' : 'auto',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#f5f5f5',
          gap: 2
        }}
      >
        <Alert severity="error" sx={{ width: '80%', maxWidth: '400px' }}>
          Failed to load banners: {error}
        </Alert>
        <Button 
          startIcon={<Refresh />} 
          onClick={fetchBanners}
          variant="outlined"
          size="small"
          sx={{ color: primaryColor, borderColor: primaryColor }}
        >
          Retry
        </Button>
      </Box>
    );
  }

  // Show empty state
  if (banners.length === 0) {
    return (
      <Box 
        sx={{
          width: '100%',
          height: isMobile ? '450px' : 'auto',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#f5f5f5',
          color: '#666',
          fontSize: '16px',
          textAlign: 'center',
          padding: 2
        }}
      >
        No banners available at the moment
      </Box>
    );
  }

  return (
    <>
      {/* Banner Row - Responsive Layout */}
      <Box 
        sx={{
          width: '100%',
          height: isMobile ? 'auto' : 'auto',
          display: 'flex',
          flexDirection: isMobile ? 'column' : 'row',
          overflow: 'hidden',
          backgroundColor: '#f5f5f5'
        }}
      >
        {banners.slice(0, 3).map((banner, index) => (
          <Box
            key={banner._id || banner.id || index}
            onClick={() => handleBannerClick(banner, index)}
            sx={{
              flex: isMobile ? '1 1 auto' : '1 1 33.333%',
              height: isMobile ? 'auto' : '100%',
              position: 'relative',
              overflow: 'hidden',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              borderBottom: isMobile ? '2px solid #e0e0e0' : 'none',
              '&:last-child': {
                borderBottom: 'none'
              },
              '&:hover': {
                transform: isMobile ? 'scale(1.01)' : 'scale(1.02)',
                zIndex: 1
              },
              '&::before': {
                content: '""',
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: 'linear-gradient(45deg, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0) 100%)',
                zIndex: 1,
                opacity: 0,
                transition: 'opacity 0.3s ease'
              },
              '&:hover::before': {
                opacity: 1
              }
            }}
          >
            <img
              src={banner.image}
              alt={banner.alt || `Banner ${index + 1}`}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                display: 'block'
              }}
              onError={(e) => {
                e.target.src = 'https://via.placeholder.com/800x150/DDD/666666?text=Banner+Image+Not+Found';
              }}
            />
            
            {/* Overlay Text - Only show if banner has link */}
              <Box
                sx={{
                  position: 'absolute',
                  bottom: 0,
                  left: 0,
                  right: 0,
                  background: 'linear-gradient(transparent, rgba(0,0,0,0.7))',
                  color: 'white',
                  padding: isMobile ? '8px' : '10px',
                  transform: 'translateY(100%)',
                  transition: 'transform 0.3s ease',
                  zIndex: 2
                }}
                className="banner-overlay"
              >
                <p style={{ 
                  margin: 0, 
                  fontSize: isMobile ? '11px' : '12px', 
                  opacity: 0.9,
                  textAlign: 'center',
                  fontWeight: 500
                }}>
                  Click to explore offers
                </p>
              </Box>
          </Box>
        ))}
      </Box>

      {/* Modal for enlarged view */}
      <Modal
        open={!!selectedBanner}
        onClose={handleClose}
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          p: 2
        }}
      >
        <Box
          sx={{
            position: 'relative',
            maxWidth: '90vw',
            maxHeight: '90vh',
            outline: 'none',
            backgroundColor: 'white',
            borderRadius: '8px',
            overflow: 'hidden',
            boxShadow: '0 10px 30px rgba(0,0,0,0.3)'
          }}
        >
          <IconButton
            onClick={handleClose}
            sx={{
              position: 'absolute',
              top: 8,
              right: 8,
              backgroundColor: 'rgba(0,0,0,0.5)',
              color: 'white',
              zIndex: 10,
              '&:hover': {
                backgroundColor: 'rgba(0,0,0,0.7)'
              }
            }}
            size="small"
          >
            <Close />
          </IconButton>

          {banners.length > 1 && (
            <>
              <IconButton
                onClick={() => navigateBanners('prev')}
                sx={{
                  position: 'absolute',
                  top: '50%',
                  left: 8,
                  backgroundColor: 'rgba(0,0,0,0.5)',
                  color: 'white',
                  zIndex: 10,
                  transform: 'translateY(-50%)',
                  '&:hover': {
                    backgroundColor: 'rgba(0,0,0,0.7)'
                  }
                }}
                size="small"
              >
                <NavigateBefore />
              </IconButton>

              <IconButton
                onClick={() => navigateBanners('next')}
                sx={{
                  position: 'absolute',
                  top: '50%',
                  right: 8,
                  backgroundColor: 'rgba(0,0,0,0.5)',
                  color: 'white',
                  zIndex: 10,
                  transform: 'translateY(-50%)',
                  '&:hover': {
                    backgroundColor: 'rgba(0,0,0,0.7)'
                  }
                }}
                size="small"
              >
                <NavigateNext />
              </IconButton>
            </>
          )}

          {selectedBanner && (
            <Box>
              <img
                src={selectedBanner.image}
                alt={selectedBanner.alt || 'Banner'}
                style={{
                  width: '100%',
                  height: 'auto',
                  maxHeight: '70vh',
                  objectFit: 'contain',
                  display: 'block'
                }}
              />
              
              {/* Visit Link Button */}
              {selectedBanner.link && (
                <Box sx={{ 
                  p: 2, 
                  textAlign: 'center',
                  borderTop: '1px solid #e0e0e0'
                }}>
                  <Button 
                    variant="contained" 
                    onClick={handleVisitWebsite}
                    sx={{ 
                      mt: 1,
                      minWidth: '140px',
                      background: gradient,
                      boxShadow: `0 3px 5px 2px ${lightColor}50`,
                      '&:hover': {
                        background: hoverGradient,
                        boxShadow: `0 5px 10px 2px ${lightColor}70`,
                      }
                    }}
                    size="medium"
                  >
                    Explore offers
                  </Button>
                </Box>
              )}
            </Box>
          )}
        </Box>
      </Modal>

      {/* Inquiry Form Modal */}
      <Modal
        open={inquiryOpen}
        onClose={handleInquiryClose}
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          p: 2
        }}
      >
        <Fade in={inquiryOpen}>
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
              onClick={handleInquiryClose}
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
                <CheckCircle 
                  sx={{ 
                    fontSize: 64, 
                    color: '#4CAF50',
                    mb: 2
                  }} 
                />
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
                  We will contact you soon.
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
                    Get More Information
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Please share your details and we'll help you get started
                  </Typography>
                </Box>

                <Box component="form" onSubmit={handleSubmitInquiry} sx={{ mt: 2 }}>
                  <TextField
                    fullWidth
                    label="Full Name"
                    value={formData.name}
                    onChange={(e) => handleFormChange('name', e.target.value)}
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
                    value={formData.phone}
                    onChange={(e) => handleFormChange('phone', e.target.value)}
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
                    label="Email Address"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleFormChange('email', e.target.value)}
                    margin="normal"
                    variant="outlined"
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

                  <FormControl fullWidth margin="normal" variant="outlined">
                    <InputLabel>Category</InputLabel>
                    <Select
                      value={formData.category}
                      onChange={(e) => handleFormChange('category', e.target.value)}
                      label="Category"
                      startAdornment={<Category sx={{ color: 'action.active', mr: 1 }} />}
                      sx={{
                        borderRadius: 2,
                        '&:hover .MuiOutlinedInput-notchedOutline': {
                          borderColor: primaryColor,
                        },
                        '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                          borderColor: primaryColor,
                        }
                      }}
                    >
                      <MenuItem value={category}>{category}</MenuItem>
                      <MenuItem value="Online Education">Online Education</MenuItem>
                      <MenuItem value="Study Abroad">Study Abroad</MenuItem>
                      <MenuItem value="Vocational Institutes">Vocational Institutes</MenuItem>
                      <MenuItem value="Scholarship Based Education">Scholarship Based Education</MenuItem>
                      <MenuItem value="Government Colleges">Government Colleges</MenuItem>
                      <MenuItem value="Top B Schools">Top B Schools</MenuItem>
                      <MenuItem value="Education Loan">Education Loan</MenuItem>
                      <MenuItem value="Accommodation">Accommodation</MenuItem>
                      <MenuItem value="Competitive Exams">Competitive Exams</MenuItem>
                      <MenuItem value="other">Other</MenuItem>
                    </Select>
                  </FormControl>

                  <TextField
                    fullWidth
                    label="Your Inquiry"
                    multiline
                    rows={3}
                    value={formData.inquiry}
                    onChange={(e) => handleFormChange('inquiry', e.target.value)}
                    margin="normal"
                    variant="outlined"
                    placeholder="Please describe what information you're looking for..."
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
    </>
  );
};

export default BannerRow;