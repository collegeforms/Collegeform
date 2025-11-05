import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Button,
  Grid,
  Card,
  Paper,
  Chip,
  Fade,
  Slide,
  useTheme,
  alpha
} from '@mui/material';
import {
  ArrowBack,
  EmojiEvents,
  TrendingUp,
  CheckCircle,
  Cancel,
  Assignment,
  BarChart,
  PieChart
} from '@mui/icons-material';
import { Doughnut, Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import Confetti from 'react-confetti';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

const TestResults = ({ result, test, onBackToList }) => {
  const [showConfetti, setShowConfetti] = useState(false);
  const [windowDimensions, setWindowDimensions] = useState({
    width: window.innerWidth,
    height: window.innerHeight
  });
  const isPass = result.percentage >= 50;
  const theme = useTheme();

  useEffect(() => {
    if (isPass) {
      setShowConfetti(true);
      const timer = setTimeout(() => setShowConfetti(false), 5000);
      return () => clearTimeout(timer);
    }
  }, [isPass]);

  useEffect(() => {
    const handleResize = () => {
      setWindowDimensions({
        width: window.innerWidth,
        height: window.innerHeight
      });
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Calculate statistics for charts
  const correctAnswers = result.answers.filter(ans => ans.isCorrect).length;
  const incorrectAnswers = result.answers.length - correctAnswers;
  const unanswered = test.questions.length - result.answers.length;

  // Doughnut Chart Data
  const doughnutData = {
    labels: ['Correct', 'Incorrect', 'Unanswered'],
    datasets: [
      {
        data: [correctAnswers, incorrectAnswers, unanswered],
        backgroundColor: [
          '#4caf50',
          '#f44336',
          '#9e9e9e'
        ],
        borderColor: [
          '#388e3c',
          '#d32f2f',
          '#757575'
        ],
        borderWidth: 2,
      },
    ],
  };

  // Bar Chart Data
  const barData = {
    labels: result.answers.map((_, index) => `Q${index + 1}`),
    datasets: [
      {
        label: 'Score per Question',
        data: result.answers.map((answer, index) => {
          const question = test.questions.find(q => q._id === answer.question);
          return answer.isCorrect ? question.marks : 0;
        }),
        backgroundColor: result.answers.map(answer => 
          answer.isCorrect ? 'rgba(76, 175, 80, 0.8)' : 'rgba(244, 67, 54, 0.8)'
        ),
        borderColor: result.answers.map(answer => 
          answer.isCorrect ? 'rgba(56, 142, 60, 1)' : 'rgba(211, 47, 47, 1)'
        ),
        borderWidth: 1,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
      },
    },
  };

  return (
    <>
      {showConfetti && (
        <Confetti
          width={windowDimensions.width}
          height={windowDimensions.height}
          numberOfPieces={400}
          gravity={0.1}
          colors={['#4caf50', '#2196f3', '#ffeb3b', '#ff9800', '#e91e63']}
        />
      )}
      
      <Box sx={{ 
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
        py: 4
      }}>
        <Container maxWidth="xl">
          {/* Header Section */}
          <Fade in timeout={1000}>
            <Box textAlign="center" sx={{ mb: 6 }}>
              <Box sx={{
                background: isPass ? 
                  'linear-gradient(135deg, #00551cff 0%, #003d32ff 100%)' :
                  'linear-gradient(135deg, #ff6b6b 0%, #ee5a52 100%)',
                width: 140,
                height: 140,
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                mx: 'auto',
                mb: 3,
                boxShadow: '0 20px 40px rgba(0,0,0,0.2)',
                position: 'relative',
              }}>
                {isPass ? (
                  <EmojiEvents sx={{ fontSize: 70, color: 'white' }} />
                ) : (
                  <TrendingUp sx={{ fontSize: 70, color: 'white' }} />
                )}
              </Box>
              
              <Typography variant="h2" gutterBottom sx={{ 
                fontWeight: 'bold',
                background: isPass ? 
                  '#005f20ff' :
                  'linear-gradient(45deg, #ff6b6b 30%, #ee5a52 90%)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                mb: 2
              }}>
                {isPass ? 'Victory!' : 'Next Time!'}
              </Typography>
              
              <Typography variant="h6" color="text.secondary" sx={{ mb: 4, maxWidth: 600, mx: 'auto' }}>
                {isPass ? 
                  'Outstanding performance! You\'ve mastered this challenge.' : 
                  'Every attempt brings you closer to mastery. Review and try again!'
                }
              </Typography>
            </Box>
          </Fade>

          {/* Score Cards */}
          <Grid container spacing={3} sx={{ mb: 6 }}>
            {[
              { 
                value: `${result.score}/${result.totalMarks}`, 
                label: 'Total Score', 
                icon: <EmojiEvents />,
                color: 'primary'
              },
              { 
                value: `${result.percentage}%`, 
                label: 'Accuracy', 
                icon: <TrendingUp />,
                color: isPass ? 'success' : 'error'
              },
              { 
                value: `${correctAnswers}/${test.questions.length}`, 
                label: 'Correct Answers', 
                icon: <CheckCircle />,
                color: 'info'
              },
              { 
                value: `${Math.round((result.score / result.totalMarks) * 100)}%`, 
                label: 'Success Rate', 
                icon: <BarChart />,
                color: 'warning'
              }
            ].map((item, index) => (
              <Grid item xs={12} sm={6} md={3} key={index}>
                <Slide in timeout={800} direction="up" style={{ transitionDelay: `${index * 100}ms` }}>
                  <Card sx={{ 
                    p: 3, 
                    textAlign: 'center',
                    borderRadius: 3,
                    background: `linear-gradient(135deg, ${theme.palette[item.color].light}15 0%, ${theme.palette[item.color].dark}15 100%)`,
                    border: `2px solid ${theme.palette[item.color].light}30`,
                    boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
                  }}>
                    <Box sx={{ 
                      display: 'inline-flex', 
                      p: 2, 
                      background: `linear-gradient(135deg, ${theme.palette[item.color].main} 0%, ${theme.palette[item.color].dark} 100%)`,
                      borderRadius: '50%',
                      mb: 2
                    }}>
                      {React.cloneElement(item.icon, { sx: { fontSize: 24, color: 'white' } })}
                    </Box>
                    <Typography variant="h3" fontWeight="bold" gutterBottom sx={{
                      background: `linear-gradient(45deg, ${theme.palette[item.color].main} 30%, ${theme.palette[item.color].dark} 90%)`,
                      backgroundClip: 'text',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                    }}>
                      {item.value}
                    </Typography>
                    <Typography variant="h6" fontWeight="600">
                      {item.label}
                    </Typography>
                  </Card>
                </Slide>
              </Grid>
            ))}
          </Grid>

          {/* Charts Section */}
          <Grid container spacing={4} sx={{ mb: 6 }}>
            <Grid item xs={12} md={6}>
              <Card sx={{ p: 3, borderRadius: 3, height: '100%' }}>
                <Typography variant="h5" gutterBottom sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                  <PieChart sx={{ mr: 1, color: 'primary.main' }} />
                  Performance Overview
                </Typography>
                <Box sx={{ height: 300 }}>
                  <Doughnut data={doughnutData} options={chartOptions} />
                </Box>
                <Box sx={{ mt: 2, textAlign: 'center' }}>
                  <Chip label={`${correctAnswers} Correct`} color="success" sx={{ mr: 1, mb: 1 }} />
                  <Chip label={`${incorrectAnswers} Incorrect`} color="error" sx={{ mr: 1, mb: 1 }} />
                  <Chip label={`${unanswered} Unanswered`} sx={{ mb: 1 }} />
                </Box>
              </Card>
            </Grid>

            <Grid item xs={12} md={6}>
              <Card sx={{ p: 3, borderRadius: 3, height: '100%' }}>
                <Typography variant="h5" gutterBottom sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                  <BarChart sx={{ mr: 1, color: 'primary.main' }} />
                  Question-wise Score
                </Typography>
                <Box sx={{ height: 300 }}>
                  <Bar data={barData} options={chartOptions} />
                </Box>
              </Card>
            </Grid>
          </Grid>

          {/* Detailed Analysis */}
          <Card sx={{ p: 4, borderRadius: 3, mb: 6 }}>
            <Typography variant="h4" gutterBottom textAlign="center" sx={{ mb: 4 }}>
              📊 Detailed Analysis
            </Typography>

            <Grid container spacing={3}>
              {result.answers.map((answer, index) => {
                const question = test.questions.find(q => q._id === answer.question);
                const isCorrect = answer.isCorrect;
                const selectedOption = question.options[answer.selectedOption];
                const correctOption = question.options.find(opt => opt.isCorrect);
                
                return (
                  <Grid item xs={12} md={6} key={index}>
                    <Fade in timeout={800} style={{ transitionDelay: `${index * 50}ms` }}>
                      <Paper sx={{ 
                        p: 3, 
                        borderRadius: 3,
                        borderLeft: `4px solid ${isCorrect ? '#4caf50' : '#f44336'}`,
                        background: 'white',
                        boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
                      }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                          <Box sx={{ 
                            width: 32, 
                            height: 32, 
                            borderRadius: '50%', 
                            background: isCorrect ? '#4caf50' : '#f44336',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            mr: 2,
                            flexShrink: 0
                          }}>
                            {isCorrect ? (
                              <CheckCircle sx={{ color: 'white', fontSize: 20 }} />
                            ) : (
                              <Cancel sx={{ color: 'white', fontSize: 20 }} />
                            )}
                          </Box>
                          <Typography variant="h6" sx={{ flexGrow: 1 }}>
                            Q{index + 1}: {question.questionText}
                          </Typography>
                        </Box>
                        
                        <Box sx={{ pl: 6 }}>
                          <Typography variant="body2" color="text.secondary" gutterBottom>
                            <strong>Your Answer:</strong> {selectedOption ? selectedOption.text : 'Not attempted'}
                          </Typography>
                          
                          {!isCorrect && (
                            <Typography variant="body2" color="success.main" gutterBottom>
                              <strong>Correct Answer:</strong> {correctOption ? correctOption.text : 'N/A'}
                            </Typography>
                          )}
                          
                          {question.explanation && (
                            <Paper sx={{ 
                              p: 2, 
                              mt: 2, 
                              background: alpha(theme.palette.info.light, 0.1),
                              border: `1px solid ${alpha(theme.palette.info.main, 0.2)}`
                            }}>
                              <Typography variant="body2" color="info.main">
                                <strong>💡 Explanation:</strong> {question.explanation}
                              </Typography>
                            </Paper>
                          )}
                        </Box>
                      </Paper>
                    </Fade>
                  </Grid>
                );
              })}
            </Grid>
          </Card>

          {/* Action Buttons */}
          <Box textAlign="center">
            <Button
              variant="contained"
              onClick={onBackToList}
              startIcon={<ArrowBack />}
              sx={{
                background: 'linear-gradient(135deg, #66b3eaff 0%, #4b92a2ff 100%)',
                borderRadius: 2,
                px: 4,
                py: 1.5,
                fontSize: '1.1rem',
                '&:hover': {
                  transform: 'scale(1.02)'
                }
              }}
            >
              Back to Test List
            </Button>
          </Box>
        </Container>
      </Box>
    </>
  );
};

export default TestResults;