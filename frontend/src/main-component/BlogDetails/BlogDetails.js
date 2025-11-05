import React, { useEffect, useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Divider,
  Chip,
  Button,
  Skeleton,
  useTheme,
  styled,
  Paper,
  Grid,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  List,
  ListItem,
  ListItemText
} from '@mui/material';
import { CalendarMonth, ArrowBack, Share, Bookmark, ExpandMore, QuestionAnswer } from '@mui/icons-material';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import parse from 'html-react-parser';
import moment from 'moment';
import Navbar from '../../components/Navbar/Navbar';
import Footer from '../../components/footer/Footer';
import { Helmet } from 'react-helmet';

const BlogHeader = styled(Box)(({ theme }) => ({
  textAlign: 'center',
  marginBottom: theme.spacing(4),
  '& h1': {
    position: 'relative',
    display: 'inline-block',
    marginBottom: theme.spacing(2),
    '&:after': {
      content: '""',
      position: 'absolute',
      bottom: -12,
      left: '50%',
      transform: 'translateX(-50%)',
      width: 60,
      height: 3,
      backgroundColor: theme.palette.primary.main,
      borderRadius: 2
    }
  }
}));

const BlogImage = styled('img')(({ theme }) => ({
  width: '100%',
  maxHeight: '500px',
  objectFit: 'cover',
  borderRadius: '12px',
  margin: theme.spacing(4, 0),
  boxShadow: '0 8px 24px rgba(0, 0, 0, 0.12)',
  transition: 'transform 0.3s ease',
  '&:hover': {
    transform: 'scale(1.01)'
  }
}));

const FAQSection = styled(Box)(({ theme }) => ({
  marginTop: theme.spacing(6),
  padding: theme.spacing(4),
  backgroundColor: theme.palette.mode === 'dark' ? 
    'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.02)',
  borderRadius: '12px',
  border: `1px solid ${theme.palette.divider}`
}));

const FAQAccordion = styled(Accordion)(({ theme }) => ({
  marginBottom: theme.spacing(2),
  borderRadius: '8px !important',
  boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
  '&:before': {
    display: 'none'
  },
  '&.Mui-expanded': {
    marginBottom: theme.spacing(2)
  }
}));

const BlogDetails = () => {
  const { slug } = useParams();
  console.log(slug);
  
  const navigate = useNavigate();
  const theme = useTheme();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [relatedBlogs, setRelatedBlogs] = useState([]);
  const [expandedFAQ, setExpandedFAQ] = useState(false);
  const API_URL = "https://collegeforms.in";
  // Function to generate meta description from content
  const generateMetaDescription = (content, maxLength = 160) => {
    if (!content) return '';
    
    // Remove HTML tags and get plain text
    const plainText = content.replace(/<[^>]*>/g, '');
    
    // Trim to max length without cutting words
    if (plainText.length <= maxLength) return plainText;
    
    return plainText.substring(0, maxLength).replace(/\s+\S*$/, '') + '...';
  };

  // Function to generate meta title
  const generateMetaTitle = (title, siteName = 'CollegeForm') => {
    return `${title} | ${siteName}`;
  };

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${API_URL}/api/blogs/${slug}`);
        setBlog(response.data);
        console.log(response.data);
        
        const relatedResponse = await axios.get(
          `${API_URL}/api/blogs?category=${response.data.category}&limit=3`
        );
        setRelatedBlogs(relatedResponse.data.filter(b => b.slug !== response.data.slug));
        
        setLoading(false);
      } catch (error) {
        console.error('Error fetching blog:', error);
        setLoading(false);
      }
    };

    fetchBlog();
  }, [slug]);

  // Handle FAQ accordion expansion
  const handleFAQChange = (panel) => (event, isExpanded) => {
    setExpandedFAQ(isExpanded ? panel : false);
  };

  // Dynamic meta tags based on blog data
  const metaTitle = blog ? generateMetaTitle(blog.title) : 'Blog | CollegeForm';
  const metaDescription = blog ? generateMetaDescription(blog.content) : 'Read our latest blog posts and articles about education, colleges, and career guidance.';
  const metaImage = blog?.image || '/default-blog-image.jpg';
  const canonicalUrl = window.location.href;

  if (loading) {
    return (
      <>
        <Helmet>
          <title>Loading... | CollegeForm</title>
          <meta name="description" content="Loading blog content..." />
        </Helmet>
        <Navbar hclass={'wpo-header-style-4'}/>
        <Container maxWidth="md" sx={{ py: 6 }}>
          <Skeleton variant="rectangular" width="60%" height={48} sx={{ mb: 4, mx: 'auto' }} />
          <Skeleton variant="rectangular" width="40%" height={24} sx={{ mb: 6, mx: 'auto' }} />
          <Skeleton variant="rectangular" height={400} sx={{ mb: 4, borderRadius: '12px' }} />
          
          {[...Array(5)].map((_, i) => (
            <Skeleton key={i} width="100%" height={24} sx={{ mb: 2, borderRadius: '4px' }} />
          ))}
        </Container>
        <Footer/>
      </>
    );
  }

  if (!blog) {
    return (
      <>
        <Helmet>
          <title>Blog Not Found | CollegeForm</title>
          <meta name="description" content="The requested blog post was not found." />
          <meta name="robots" content="noindex" />
        </Helmet>
        <Navbar hclass={'wpo-header-style-4'}/>
        <Container maxWidth="md" sx={{ py: 6, textAlign: 'center' }}>
          <Typography variant="h4" gutterBottom sx={{ fontWeight: 600 }}>
            Blog Not Found
          </Typography>
          <Typography color="text.secondary" sx={{ mb: 4 }}>
            The blog you're looking for doesn't exist or may have been removed.
          </Typography>
          <Button 
            variant="contained" 
            startIcon={<ArrowBack />}
            onClick={() => navigate(-1)}
            sx={{ px: 4, py: 1.5, borderRadius: '8px' }}
          >
            Go Back
          </Button>
        </Container>
        <Footer/>
      </>
    );
  }

  return (
    <>
      <Helmet>
        {/* Primary Meta Tags */}
        <title>{metaTitle}</title>
        <meta name="title" content={metaTitle} />
        <meta name="description" content={metaDescription} />
        <meta name="keywords" content={`${blog.category}, education, college, career, ${blog.tags ? blog.tags.join(', ') : ''}`} />
        
        {/* Open Graph / Facebook */}
        <meta property="og:type" content="article" />
        <meta property="og:url" content={canonicalUrl} />
        <meta property="og:title" content={metaTitle} />
        <meta property="og:description" content={metaDescription} />
        <meta property="og:image" content={metaImage} />
        <meta property="og:site_name" content="CollegeForm" />
        <meta property="article:published_time" content={blog.createdAt} />
        <meta property="article:modified_time" content={blog.updatedAt || blog.createdAt} />
        <meta property="article:author" content={blog.author || 'CollegeForm'} />
        <meta property="article:section" content={blog.category} />
        
        {/* Twitter */}
        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:url" content={canonicalUrl} />
        <meta property="twitter:title" content={metaTitle} />
        <meta property="twitter:description" content={metaDescription} />
        <meta property="twitter:image" content={metaImage} />
        
        {/* Additional Meta Tags */}
        <link rel="canonical" href={canonicalUrl} />
        <meta name="author" content={blog.author || 'CollegeForm'} />
        <meta name="publish_date" property="og:publish_date" content={blog.createdAt} />
        <meta name="robots" content="index, follow" />
        
        {/* Structured Data */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BlogPosting",
            "headline": blog.title,
            "description": metaDescription,
            "image": metaImage,
            "datePublished": blog.createdAt,
            "dateModified": blog.updatedAt || blog.createdAt,
            "author": {
              "@type": "Organization",
              "name": blog.author || "CollegeForm"
            },
            "publisher": {
              "@type": "Organization",
              "name": "CollegeForm",
              "logo": {
                "@type": "ImageObject",
                "url": "https://collegeform.com/logo.png"
              }
            },
            "mainEntityOfPage": {
              "@type": "WebPage",
              "@id": canonicalUrl
            }
          })}
        </script>
      </Helmet>

      <Navbar hclass={'wpo-header-style-4'}/>
      
      <Container maxWidth="md" sx={{ py: 6 }}>
        <BlogHeader>
          <Typography 
            variant="h2" 
            component="h1" 
            gutterBottom
            sx={{ 
              fontWeight: 700,
              fontSize: { xs: '2rem', md: '2.5rem' },
              lineHeight: 1.3
            }}
          >
            {blog.title}
          </Typography>
          <Typography 
            variant="subtitle1" 
            color="text.secondary"
            sx={{ 
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 1
            }}
          >
            <CalendarMonth fontSize="small" />
            {moment(blog.createdAt).format('MMMM D, YYYY')}
            {blog.author && (
              <>
                <span>•</span>
                <span>By {blog.author}</span>
              </>
            )}
          </Typography>
        </BlogHeader>

        {blog.image && (
          <BlogImage 
            src={blog.image} 
            alt={blog.title} 
          />
        )}

        <Box sx={{ 
          display: 'flex', 
          gap: 2, 
          mb: 4,
          justifyContent: 'center'
        }}>
          <Button 
            variant="outlined" 
            startIcon={<Share />}
            onClick={() => {
              navigator.clipboard.writeText(window.location.href);
              alert('Link copied to clipboard!');
            }}
            sx={{
              px: 3,
              py: 1,
              borderRadius: '8px',
              textTransform: 'none',
              fontWeight: 500,
              borderWidth: '1.5px',
              '&:hover': {
                borderWidth: '1.5px'
              }
            }}
          >
            Share
          </Button>
          <Button 
            variant="outlined" 
            startIcon={<Bookmark />}
            sx={{
              px: 3,
              py: 1,
              borderRadius: '8px',
              textTransform: 'none',
              fontWeight: 500,
              borderWidth: '1.5px',
              '&:hover': {
                borderWidth: '1.5px'
              }
            }}
          >
            Save
          </Button>
        </Box>

        {/* Blog Content Section */}
        <Box sx={{ 
          '& h2': {
            mt: 6,
            mb: 3,
            color: theme.palette.text.primary,
            fontSize: '1.8rem',
            fontWeight: 600,
            lineHeight: 1.3
          },
          '& h3': {
            mt: 5,
            mb: 2,
            color: theme.palette.text.primary,
            fontSize: '1.5rem',
            fontWeight: 600,
            lineHeight: 1.3
          },
          '& p': {
            mb: 3,
            lineHeight: 1.8,
            fontSize: '1.1rem',
            color: theme.palette.text.secondary
          },
          '& img': {
            maxWidth: '100%',
            height: 'auto',
            my: 4,
            borderRadius: '12px',
            boxShadow: '0 8px 24px rgba(0, 0, 0, 0.08)'
          },
          '& blockquote': {
            borderLeft: `3px solid ${theme.palette.primary.main}`,
            pl: 3,
            py: 1,
            my: 4,
            fontStyle: 'italic',
            backgroundColor: theme.palette.mode === 'dark' ? 
              'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)',
            borderRadius: '0 8px 8px 0',
            '& p': {
              mb: 0,
              color: theme.palette.text.primary
            }
          },
          '& ul, & ol': {
            pl: 3,
            mb: 3,
            '& li': {
              mb: 1.5,
              lineHeight: 1.8,
              '&::marker': {
                color: theme.palette.primary.main
              }
            }
          },
          '& a': {
            color: theme.palette.primary.main,
            textDecoration: 'none',
            '&:hover': {
              textDecoration: 'underline'
            }
          }
        }}>
          {parse(blog.content)}
        </Box>

        {/* FAQ Section */}
        {blog.faqs && blog.faqs.length > 0 && (
          <FAQSection>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
              <QuestionAnswer 
                sx={{ 
                  mr: 2, 
                  color: theme.palette.primary.main,
                  fontSize: '2rem'
                }} 
              />
              <Typography 
                variant="h4" 
                component="h2"
                sx={{ 
                  fontWeight: 700,
                  color: theme.palette.text.primary
                }}
              >
                Frequently Asked Questions
              </Typography>
            </Box>
            <Typography 
              variant="body1" 
              color="text.secondary" 
              sx={{ mb: 4 }}
            >
              Find answers to common questions about this topic.
            </Typography>
            
            {blog.faqs.map((faq, index) => (
              <FAQAccordion
                key={faq._id || index}
                expanded={expandedFAQ === `faq-${index}`}
                onChange={handleFAQChange(`faq-${index}`)}
              >
                <AccordionSummary
                  expandIcon={<ExpandMore />}
                  sx={{
                    py: 2,
                    px: 3,
                    '& .MuiAccordionSummary-content': {
                      my: 1
                    }
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                    <Chip 
                      label={(index + 1).toString().padStart(2, '0')}
                      color="primary"
                      variant="outlined"
                      size="small"
                      sx={{ minWidth: '40px' }}
                    />
                    <Typography 
                      variant="h6" 
                      sx={{ 
                        fontWeight: 600,
                        fontSize: '1.1rem'
                      }}
                    >
                      {faq.question}
                    </Typography>
                  </Box>
                </AccordionSummary>
                <AccordionDetails sx={{ py: 3, px: 3 }}>
                  <Box sx={{ pl: 7 }}>
                    <Typography 
                      variant="body1" 
                      sx={{ 
                        lineHeight: 1.7,
                        color: theme.palette.text.secondary,
                        fontSize: '1rem'
                      }}
                    >
                      {faq.answer}
                    </Typography>
                  </Box>
                </AccordionDetails>
              </FAQAccordion>
            ))}
          </FAQSection>
        )}

        {/* Related Blogs Section */}
        {relatedBlogs.length > 0 && (
          <>
            <Divider sx={{ 
              my: 6,
              '&:before, &:after': {
                borderColor: theme.palette.divider
              }
            }} />
            <Typography 
              variant="h4" 
              component="h2" 
              gutterBottom 
              sx={{ 
                fontWeight: 700,
                mb: 4,
                textAlign: 'center'
              }}
            >
              More Like This
            </Typography>
            <Grid container spacing={4}>
              {relatedBlogs.map((relatedBlog) => (
                <Grid item xs={12} sm={6} md={4} key={relatedBlog._id}>
                  <Paper 
                    elevation={0} 
                    sx={{ 
                      height: '100%',
                      cursor: 'pointer',
                      p: 2,
                      borderRadius: '12px',
                      transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                      '&:hover': {
                        transform: 'translateY(-4px)',
                        boxShadow: '0 8px 24px rgba(0, 0, 0, 0.1)',
                        '& img': {
                          transform: 'scale(1.03)'
                        },
                        '& h3': {
                          color: theme.palette.primary.main
                        }
                      }
                    }}
                    onClick={() => navigate(`/blogs/${relatedBlog.slug}`)}
                  >
                    <Box sx={{ 
                      overflow: 'hidden',
                      borderRadius: '8px',
                      mb: 2
                    }}>
                      <img
                        src={relatedBlog.image}
                        alt={relatedBlog.title}
                        style={{
                          width: '100%',
                          height: '180px',
                          objectFit: 'cover',
                          transition: 'transform 0.3s ease'
                        }}
                      />
                    </Box>
                    <Typography 
                      variant="subtitle2" 
                      color="primary" 
                      gutterBottom 
                      sx={{ 
                        fontWeight: 600,
                        fontSize: '0.75rem',
                        letterSpacing: '0.5px'
                      }}
                    >
                      {relatedBlog.category}
                    </Typography>
                    <Typography 
                      variant="h6" 
                      component="h3" 
                      gutterBottom
                      sx={{ 
                        fontWeight: 600,
                        fontSize: '1.1rem',
                        lineHeight: 1.4,
                        mb: 1
                      }}
                    >
                      {relatedBlog.title}
                    </Typography>
                    <Typography 
                      variant="body2" 
                      color="text.secondary"
                      sx={{ 
                        fontSize: '0.85rem',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 0.5
                      }}
                    >
                      <CalendarMonth fontSize="inherit" />
                      {moment(relatedBlog.createdAt).format('MMM D, YYYY')}
                    </Typography>
                  </Paper>
                </Grid>
              ))}
            </Grid>
          </>
        )}
      </Container>
      <Footer/>
    </>
  );
};

export default BlogDetails;