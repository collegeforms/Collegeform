import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Modal, 
  IconButton, 
  CircularProgress, 
  Alert, 
  Button, 
  useTheme, 
  useMediaQuery 
} from '@mui/material';
import { Close, NavigateBefore, NavigateNext, Refresh } from '@mui/icons-material';

const BannerRow = ({category}) => {

  console.log(category);
  
  const [banners, setBanners] = useState([]);
  const [selectedBanner, setSelectedBanner] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const API_URL = "https://collegeform.onrender.com" || "https://collegeform-production.up.railway.app" || "http://localhost:5000";


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
  }, []);

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

  // Show loading state
  if (loading) {
    return (
      <Box 
        sx={{
          width: '100%',
          height: isMobile ? '450px' : '150px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#f5f5f5'
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  // Show error state
  if (error) {
    return (
      <Box 
        sx={{
          width: '100%',
          height: isMobile ? '450px' : '150px',
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
          height: isMobile ? '450px' : '150px',
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
          height: isMobile ? 'auto' : '150px',
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
              height: isMobile ? '150px' : '100%',
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
            {banner.link && (
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
                  Click to visit website
                </p>
              </Box>
            )}
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
                    color="primary"
                    onClick={() => window.open(selectedBanner.link, '_blank')}
                    sx={{ 
                      mt: 1,
                      minWidth: '140px'
                    }}
                    size="medium"
                  >
                    Visit Website
                  </Button>
                </Box>
              )}
            </Box>
          )}
        </Box>
      </Modal>
    </>
  );
};

export default BannerRow;