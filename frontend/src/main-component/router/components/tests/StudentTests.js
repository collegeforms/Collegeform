import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Typography, Box, Grid, Paper, CircularProgress, Fade, Slide, Chip } from '@mui/material';
import { RocketLaunch, EmojiEvents, TrendingUp, Psychology } from '@mui/icons-material';
import TestCard from './TestCard';
import TestDescriptionDialog from './TestDescriptionDialog';
import TestInProgress from './TestInProgress';
import TestResults from './TestResults';
import Navbar from '../../../../components/Navbar/Navbar';
import Footer from '../../../../components/footer/Footer';

const StudentTests = () => {
  const [tests, setTests] = useState([]);
  const [selectedTest, setSelectedTest] = useState(null);
  const [testDialogOpen, setTestDialogOpen] = useState(false);
  const [testInProgress, setTestInProgress] = useState(false);
  const [currentTest, setCurrentTest] = useState(null);
  const [testResult, setTestResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [animate, setAnimate] = useState(false);

  const API_URL = 'http://localhost:5000/api/tests';
  const authHeader = {
    headers: { Authorization: `Bearer ${localStorage.getItem('userToken')}` }
  };

  useEffect(() => {
    fetchTests();
    setAnimate(true);
  }, []);

  const fetchTests = async () => {
    try {
      setLoading(true);
      const response = await axios.get(API_URL, authHeader);
      setTests(response.data.tests);
    } catch (error) {
      console.error('Failed to fetch tests:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleTestStart = (test) => {
    setSelectedTest(test);
    setTestDialogOpen(true);
  };

  const startTest = async () => {
    try {
      const response = await axios.get(`${API_URL}/${selectedTest._id}`, authHeader);
      const testData = response.data;
      
      setCurrentTest(testData);
      setTestDialogOpen(false);
      setTestInProgress(true);
    } catch (error) {
      console.error('Failed to start test:', error);
    }
  };

  const handleTestComplete = (result) => {
    setTestResult(result);
    setTestInProgress(false);
  };

  const handleBackToList = () => {
    setTestResult(null);
    setCurrentTest(null);
    fetchTests();
  };

  if (loading) {
    return (
      <Container sx={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        background: 'linear-gradient(135deg, #ffffffff 0%rgba(255, 255, 255, 1)a2 100%)'
      }}>
        <Box textAlign="center">
          <RocketLaunch sx={{ fontSize: 60, color: 'black', mb: 2 }} />
          <Typography variant="h6" color="black">
            Loading  tests...
          </Typography>
          <CircularProgress sx={{ color: 'black', mt: 2 }} />
        </Box>
      </Container>
    );
  }

  if (testInProgress && currentTest) {
    return (
      <TestInProgress
        test={currentTest}
        onTestComplete={handleTestComplete}
        authHeader={authHeader}
      />
    );
  }

  if (testResult) {
    return (
      <TestResults
        result={testResult}
        test={currentTest}
        onBackToList={handleBackToList}
      />
    );
  }

  return (
    <>
    <Navbar/>
      <Box sx={{ 
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
        py: 4
      }}>
        <Container>
          <Fade in={animate} timeout={800}>
            <Box textAlign="center" sx={{ mb: 6 }}>
              <Typography 
                variant="h3" 
                gutterBottom 
                sx={{ 
                  fontWeight: 'bold',
                  background: 'linear-gradient(45deg, #667eea 30%, #547CBC 90%)',
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  mb: 1
                }}
              >
                Challenge Yourself
              </Typography>
              <Typography variant="h6" color="text.secondary" sx={{ mb: 3 }}>
                Master your skills with our interactive tests
              </Typography>
              <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mb: 3 }}>
                <Chip icon={<EmojiEvents />} label="Earn Badges" variant="outlined" />
                <Chip icon={<TrendingUp />} label="Track Progress" variant="outlined" />
                <Chip icon={<Psychology />} label="Smart Learning" variant="outlined" />
              </Box>
            </Box>
          </Fade>

          <Grid container spacing={4}>
            {tests.map((test, index) => (
              <Grid item xs={12} md={6} lg={4} key={test._id}>
                <Slide in={animate} timeout={800} direction="up" style={{ transitionDelay: `${index * 100}ms` }}>
                  <div>
                    <TestCard test={test} onStartTest={handleTestStart} index={index} />
                  </div>
                </Slide>
              </Grid>
            ))}
          </Grid>

          {tests.length === 0 && !loading && (
            <Paper sx={{ 
              p: 6, 
              textAlign: 'center', 
              mt: 4,
              background: 'linear-gradient(145deg, #ffffff 0%, #f8f9fa 100%)',
              borderRadius: 4,
              boxShadow: '0 8px 32px rgba(0,0,0,0.1)'
            }}>
              <Typography variant="h5" gutterBottom color="text.primary">
                No tests available yet
              </Typography>
              <Typography variant="body1" color="text.secondary">
                New challenges are coming soon! Stay tuned for exciting tests.
              </Typography>
            </Paper>
          )}

          <TestDescriptionDialog
            open={testDialogOpen}
            test={selectedTest}
            onClose={() => setTestDialogOpen(false)}
            onStart={startTest}
          />
        </Container>
      </Box>
      <Footer/>
    </>
  );
};

export default StudentTests;