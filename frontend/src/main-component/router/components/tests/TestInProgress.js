import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Box,
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Button,
  LinearProgress,
  Container,
  Paper,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  Chip
} from '@mui/material';
import { ArrowBack, Timer, Send, NavigateBefore, NavigateNext } from '@mui/icons-material';
import { useTheme, alpha } from '@mui/material/styles';

const TestInProgress = ({ test, onTestComplete, authHeader }) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(test.timeLimit * 60);
  const theme = useTheme();

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          handleTestSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleAnswerSelect = (questionId, optionIndex) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: optionIndex
    }));
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < test.questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    }
  };

  const handlePrevQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    }
  };

  const handleTestSubmit = async () => {
    try {
      const answerArray = Object.entries(answers).map(([questionId, selectedOption]) => ({
        questionId,
        selectedOption
      }));

      const response = await axios.post(
        `http://localhost:5000/api/tests/${test._id}/attempt`,
        {
          answers: answerArray,
          timeSpent: (test.timeLimit * 60) - timeLeft
        },
        authHeader
      );

      onTestComplete(response.data);
    } catch (error) {
      console.error('Failed to submit test:', error);
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const currentQuestion = test.questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / test.questions.length) * 100;

  return (
    <Box sx={{ 
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)'
    }}>
      <AppBar 
        position="sticky" 
        sx={{ 
          background: 'rgba(255,255,255,0.95)', 
          backdropFilter: 'blur(10px)',
          boxShadow: '0 2px 20px rgba(0,0,0,0.1)'
        }}
      >
        <Toolbar>
          <IconButton 
            onClick={() => window.confirm('Are you sure you want to leave? Your progress will be lost.') && handleTestSubmit()}
            sx={{ color: '#547DBD' }}
          >
            <ArrowBack />
          </IconButton>
          
          <Box sx={{ flexGrow: 1, ml: 3 }}>
            <Typography variant="h6" color="#547DBD" fontWeight="bold">
              {test.title}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Question {currentQuestionIndex + 1} of {test.questions.length}
            </Typography>
          </Box>
          
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            mr: 3,
            px: 2,
            py: 1,
            borderRadius: 3,
          }}>
            <Timer sx={{ 
              mr: 1, 
              color: timeLeft < 300 ? '#f44336' : '#4caf50' 
            }} />
            <Typography variant="h6" fontWeight="bold" color={timeLeft < 300 ? '#f44336' : '#4caf50'}>
              {formatTime(timeLeft)}
            </Typography>
          </Box>
          
          <Button 
            variant="contained" 
            onClick={handleTestSubmit}
            endIcon={<Send />}
            sx={{
              background: '#547DBD',
              borderRadius: 2,
              px: 3,
              '&:hover': {
                background: '#4669A8',
                transform: 'scale(1.02)'
              }
            }}
          >
            Submit
          </Button>
        </Toolbar>
        
        <LinearProgress 
          variant="determinate" 
          value={progress} 
          sx={{ 
            height: 3,
            '& .MuiLinearProgress-bar': {
              background: '#547DBD',
              borderRadius: 3
            }
          }} 
        />
      </AppBar>

      <Container maxWidth="md" sx={{ py: 4 }}>
        <Paper sx={{ 
          p: 4, 
          borderRadius: 3,
          boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
          background: 'white'
        }}>
          <Box sx={{ mb: 4 }}>
            <Box sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              mb: 3,
              p: 2,
              color: 'white',
              borderRadius: 2
            }}>
              <Typography variant="h6" sx={{ fontWeight: 'bold', mr: 2 }}>
                Q{currentQuestionIndex + 1}.
              </Typography>
              {currentQuestion.marks > 1 && (
                <Chip 
                  label={`${currentQuestion.marks} marks`} 
                  size="small" 
                  sx={{ 
                    background: 'rgba(255,255,255,0.2)', 
                    color: 'white', 
                    fontWeight: 'bold'
                  }} 
                />
              )}
              <Typography variant="h6" sx={{ ml: 2, flex: 1 }}>
                {currentQuestion.questionText}
              </Typography>
            </Box>
            
            <FormControl component="fieldset" fullWidth>
              <FormLabel component="legend" sx={{ mb: 2, fontWeight: 'bold', color: '#2c3e50' }}>
                Select your answer:
              </FormLabel>
              
              <RadioGroup
                value={answers[currentQuestion._id] !== undefined ? answers[currentQuestion._id] : ''}
                onChange={(e) => handleAnswerSelect(currentQuestion._id, parseInt(e.target.value))}
              >
                {currentQuestion.options.map((option, index) => (
                  <Paper
                    key={index}
                    sx={{
                      p: 1,
                      mb: 2,
                      boxShadow:"none",
                      border: '1px solid',
                      borderColor: answers[currentQuestion._id] === index ? 
                        '#547DBD' : '#e0e0e0',
                      background: answers[currentQuestion._id] === index ? 
                        alpha('#547DBD', 0.05) : '#fafafa',
                      borderRadius: 2,
                      transition: 'all 0.2s ease',
                      cursor: 'pointer',
                      '&:hover': {
                        borderColor: '#547DBD',
                        background: alpha('#547DBD', 0.08)
                      }
                    }}
                    onClick={() => handleAnswerSelect(currentQuestion._id, index)}
                  >
                    <FormControlLabel
                      value={index}
                      control={
                        <Radio sx={{ 
                          color: answers[currentQuestion._id] === index ? 
                            '#547DBD' : '#bdbdbd',
                          '&.Mui-checked': {
                            color: '#547DBD'
                          }
                        }} />
                      }
                      label={
                        <Typography variant="body1">
                          {option.text}
                        </Typography>
                      }
                      sx={{ m: 0, width: '100%' }}
                    />
                  </Paper>
                ))}
              </RadioGroup>
            </FormControl>
          </Box>

          <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 2 }}>
            <Button
              variant="outlined"
              onClick={handlePrevQuestion}
              disabled={currentQuestionIndex === 0}
              startIcon={<NavigateBefore />}
              sx={{
                borderRadius: 2,
                px: 3,
                py: 1,
                borderColor: '#547DBD',
                color: '#547DBD',
                '&:hover': {
                  borderColor: '#4669A8',
                  background: alpha('#547DBD', 0.1)
                }
              }}
            >
              Previous
            </Button>
            
            {currentQuestionIndex === test.questions.length - 1 ? (
              <Button 
                variant="contained" 
                onClick={handleTestSubmit}
                endIcon={<Send />}
                sx={{
                  background: '#4caf50',
                  borderRadius: 2,
                  px: 4,
                  py: 1,
                  '&:hover': {
                    background: '#43a047',
                    transform: 'scale(1.02)'
                  }
                }}
              >
                Submit Test
              </Button>
            ) : (
              <Button 
                variant="contained" 
                onClick={handleNextQuestion}
                endIcon={<NavigateNext />}
                sx={{
                  background: '#547DBD',
                  borderRadius: 2,
                  px: 4,
                  py: 1,
                  '&:hover': {
                    background: '#4669A8',
                    transform: 'scale(1.02)'
                  }
                }}
              >
                Next
              </Button>
            )}
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};

export default TestInProgress;