import React, { useEffect, useState } from 'react';
import {
  Box,
  Grid,
  Card,
  CardMedia,
  CardContent,
  Typography,
  Button,
  Chip,
  Container,
  Skeleton,
  useTheme,
  styled
} from '@mui/material';
import { CalendarMonth, ArrowRightAlt } from '@mui/icons-material';
import axios from 'axios';
import parse from 'html-react-parser';
import { Link } from 'react-router';
const StyledCard = styled(Card)(({ theme }) => ({
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  borderRadius: '12px',
  overflow: 'hidden',
  boxShadow: '0 4px 20px rgba(0, 33, 71, 0.1)',
  transition: 'transform 0.3s ease, box-shadow 0.3s ease',
  '&:hover': {
    transform: 'translateY(-5px)',
    boxShadow: '0 8px 30px rgba(0, 33, 71, 0.15)'
  }
}));

const BlogTitle = styled(Typography)({
  fontSize: '1.25rem',
  fontWeight: 600,
  lineHeight: 1.4,
  marginBottom: '12px',
  display: '-webkit-box',
  WebkitLineClamp: 2,
  WebkitBoxOrient: 'vertical',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  color: '#002147',
  '&:hover': {
    color: '#0056b3'
  }
});

const BlogExcerpt = styled(Box)({
  fontSize: '0.95rem',
  lineHeight: 1.6,
  color: '#4a5568',
  marginBottom: '16px',
  '& h1, & h2, & h3, & h4, & h5, & h6': {
    display: 'none' // Hide headers in excerpt
  },
  '& p': {
    margin: '0 0 12px 0',
    display: '-webkit-box',
    WebkitLineClamp: 3,
    WebkitBoxOrient: 'vertical',
    overflow: 'hidden',
    textOverflow: 'ellipsis'
  }
});

const ReadMoreButton = styled(Button)({
  fontWeight: 500,
  textTransform: 'none',
  color: '#002147',
  padding: '6px 0',
  minWidth: 0,
  '&:hover': {
    backgroundColor: 'transparent',
    color: '#0056b3',
    '& .MuiSvgIcon-root': {
      transform: 'translateX(3px)'
    }
  },
  '& .MuiSvgIcon-root': {
    transition: 'transform 0.2s ease',
    fontSize: '1.25rem'
  }
});

const HomeBlogs = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const API_URL = "https://collegeform.onrender.com" || "https://collegeform-production.up.railway.app" || "http://localhost:5000";


  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        // Replace with your actual API endpoint
        const response = await axios.get(`${API_URL}/api/blogs`);
        console.log(response.data);
        
        setBlogs(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching blogs:', error);
        setLoading(false);
      }
    };

    fetchBlogs();
  }, []);

  const renderExcerpt = (content) => {
    // Remove HTML tags from excerpt for cleaner display
    const plainText = content.replace(/<[^>]*>/g, '');
    return plainText.length > 150 
      ? `${plainText.substring(0, 150)}...` 
      : plainText;
  };

  

  if (loading) {
    return (
      <Container maxWidth="md" sx={{ py: 0 }}>
        <Grid container spacing={0}>
          {[...Array(3)].map((_, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <StyledCard>
                <Skeleton 
                  variant="rectangular" 
                  height={200} 
                  sx={{ bgcolor: 'rgba(0, 33, 71, 0.1)' }} 
                />
                <CardContent sx={{ flexGrow: 1 }}>
                  <Skeleton width="40%" height={24} sx={{ mb: 2, bgcolor: 'rgba(0, 33, 71, 0.1)' }} />
                  <Skeleton width="90%" height={28} sx={{ mb: 1, bgcolor: 'rgba(0, 33, 71, 0.1)' }} />
                  <Skeleton width="100%" height={72} sx={{ bgcolor: 'rgba(0, 33, 71, 0.1)' }} />
                </CardContent>
              </StyledCard>
            </Grid>
          ))}
        </Grid>
      </Container>
    );
  }

  return (
    <Box sx={{ py: 7, backgroundColor: '#f8fafc' }}>
      <Container maxWidth="lg">
       <Typography 
  variant="h3" 
  component="h3" 
  sx={{ 
    textAlign: 'left',
    fontWeight: 700,
    mb: 1,
    color: '#002147',
    position: 'relative',
  }}
>
  Latest Articles
</Typography>

<Typography 
  variant="body1" 
  component="p" 
  sx={{ 
    textAlign: 'left',
    mb: 2,
    color: '#002147',
    position: 'relative',
  }}
>
  Our latest articles cover everything from practical tips to in-depth analysis — curated just for you.
</Typography>

        <Grid container spacing={4}>
          {blogs.slice(0, 3).map((blog) => (
            <Grid item xs={12} sm={6} md={4} key={blog._id}>
              <StyledCard>
                <CardMedia
                  component="img"
                  height="220"
                  image={blog.image || 'https://via.placeholder.com/400x220?text=Blog+Image'}
                  alt={blog.title}
                  sx={{
                    objectFit: 'cover',
                    backgroundColor: 'rgba(0, 33, 71, 0.05)'
                  }}
                />
                <CardContent sx={{ flexGrow: 1 }}>
                  <Chip 
                    label={blog.category || 'Uncategorized'} 
                    size="small" 
                    sx={{ 
                      mb: 2,
                      backgroundColor: 'rgba(0, 33, 71, 0.1)',
                      color: '#002147',
                      fontWeight: 500
                    }}
                  />
                  
                  <BlogTitle>
                    {blog.title || 'Untitled Blog Post'}
                  </BlogTitle>
                  
                  <BlogExcerpt>
                    {renderExcerpt(blog.content)}
                  </BlogExcerpt>
                  
                  <Box sx={{ display: 'flex', alignItems: 'center', mt: 'auto' }}>
                    <Typography 
                      variant="caption" 
                      sx={{ 
                        display: 'flex', 
                        alignItems: 'center',
                        color: '#64748b',
                        mr: 2
                      }}
                    >
                      <CalendarMonth fontSize="small" sx={{ mr: 0.5 }} />
                      {new Date(blog.createdAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                      })}
                    </Typography>
                    
                 <Link to={`/blogs/${blog?.slug}`} style={{ textDecoration: 'none' }}>
  <ReadMoreButton endIcon={<ArrowRightAlt />}>
    Read More
  </ReadMoreButton>
</Link>

                  </Box>
                </CardContent>
              </StyledCard>
            </Grid>
          ))}
        </Grid>
        
        {blogs.length > 3 && (
          <Box sx={{ textAlign: 'center', mt: 6 }}>
            <Button 
              variant="outlined" 
              size="large"
              sx={{
                px: 4,
                fontWeight: 600,
                textTransform: 'none',
                color: '#ffffffff',
                borderColor: '#002147',
                  backgroundColor: '#003B77',

                '&:hover': {
                  borderColor: '#0056b3'
                }
              }}
            >
              <Link className='text-light' to={'/blogs'}>
              View All Articles
              
              </Link>
            </Button>
          </Box>
        )}
      </Container>
    </Box>
  );
};

export default HomeBlogs;