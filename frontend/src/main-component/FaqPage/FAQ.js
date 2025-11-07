import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Button,
  CircularProgress,
  Alert,
  Paper
} from '@mui/material';
import { ExpandMore, Add } from '@mui/icons-material';
import axios from 'axios';
import Navbar from '../../components/Navbar/Navbar';
import Footer from '../../components/footer/Footer';
import './FAQ.css';

const FAQ = () => {
  const [faqs, setFaqs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [expanded, setExpanded] = useState(false);
  const API_URL = "https://collegeforms.in";  
  const location = useLocation();
  const isFAQPage = location.pathname === '/faq';

  useEffect(() => {
    fetchFAQs();
  }, []);

  const fetchFAQs = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}/api/faqs`);
      // Filter only active FAQs
      const activeFaqs = response.data.filter(faq => faq.isActive);
      setFaqs(activeFaqs);
      setError('');
    } catch (err) {
      setError('Failed to load FAQs. Please try again later.');
      console.error('Error fetching FAQs:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

  if (loading) {
    return (
      <>
        {isFAQPage && <Navbar />}
        <Box className="faq-loading">
          <CircularProgress size={60} />
          <Typography variant="h6" sx={{ mt: 2 }}>
            Loading FAQs...
          </Typography>
        </Box>
        {isFAQPage && <Footer />}
      </>
    );
  }

  return (
    <>

      {isFAQPage && <Navbar />}
    <div className='main-div-faq' >
    
      <Container maxWidth="lg" sx={{ py: 5 , pb:0 }}>
        {/* Header - Only show on FAQ page */}
          <Box className="faq-header" sx={{ textAlign: 'center', mb: 6 }}>
            <Typography 
              variant="h3" 
              className="faq-title"
              sx={{ 
                fontWeight: 'bold',
                mb: 2
              }}
            >
              Frequently Asked Questions
            </Typography>
            <Typography 
              variant="h6" 
              className="faq-subtitle"
              sx={{ 
                color: 'text.secondary',
                maxWidth: '600px',
                mx: 'auto'
              }}
            >
              Find answers to common questions about our college forms platform
            </Typography>
          </Box>
        {/* Error Alert */}
        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        {/* FAQ Accordions */}
        <Box className="faq-grid">
          {faqs.length === 0 ? (
            <Paper sx={{ p: 4, textAlign: 'center' }}>
              <Typography variant="h6" color="text.secondary">
                No FAQs available at the moment.
              </Typography>
            </Paper>
          ) : (
            faqs.map((faq, index) => (
              <Accordion
                key={faq._id}
                expanded={expanded === `panel${index}`}
                onChange={handleChange(`panel${index}`)}
                className="faq-accordion"
                sx={{
                  mb: 2,
                  borderRadius: '12px !important',
                  boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                  '&:before': { display: 'none' },
                  overflow: 'hidden'
                }}
              >
                <AccordionSummary
                  expandIcon={<ExpandMore sx={{ fontSize: '1.8rem' }} />}
                  className="faq-summary"
                  sx={{
                    py: 3,
                    px: 4,
                    minHeight: '80px !important',
                    '& .MuiAccordionSummary-content': {
                      my: 1
                    }
                  }}
                >
                  <Box className="question-content" sx={{ display: 'flex', alignItems: 'flex-start', gap: 3 }}>
                    <Typography 
                      className="question-number"
                      sx={{ 
                        fontWeight: 'bold',
                        color: 'primary.main',
                        minWidth: '40px'
                      }}
                    >
                      {(index + 1).toString().padStart(2, '0')}
                    </Typography>
                    <Typography 
                      variant="h6" 
                      className="question-text"
                      sx={{ 
                        fontWeight: '600',
                        textAlign: 'left'
                      }}
                    >
                      {faq.question}
                    </Typography>
                  </Box>
                </AccordionSummary>
                <AccordionDetails 
                  className="faq-details"
                  sx={{ 
                    py: 3, 
                    px: 4,
                    borderTop: '1px solid',
                    borderColor: 'divider'
                  }}
                >
                  <Box className="answer-content" sx={{ pl: 7 }}>
                    <Typography 
                      variant="body1" 
                      sx={{ 
                        color: 'text.secondary',
                        lineHeight: 1.7,
                        fontSize: '1.1rem'
                      }}
                    >
                      {faq.answer}
                    </Typography>
                  </Box>
                </AccordionDetails>
              </Accordion>
            ))
          )}
        </Box>

        {/* Footer - Only show on FAQ page */}
        {isFAQPage && (
          <Box className="faq-footer" sx={{ textAlign: 'center', mt: 6 }}>
            <Typography variant="body1" sx={{ color: 'text.secondary' }}>
              Still have questions?{' '}
              <Button 
                href="/contact" 
                variant="text" 
                sx={{ 
                  fontWeight: 'bold',
                  textTransform: 'none',
                  fontSize: 'inherit'
                }}
              >
                Contact our support team
              </Button>
            </Typography>
          </Box>
        )}
      </Container>
      </div>
      {isFAQPage && <Footer />}
    </>
  );
};

export default FAQ;