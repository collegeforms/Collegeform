import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Container,
  Typography,
  Button,
  Card,
  CardContent,
  Grid,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Box,
  LinearProgress,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  FormLabel,
  Chip,
  Paper,
  Divider,
  IconButton,
  AppBar,
  Toolbar,
  CircularProgress,
  Alert,
  Fab,
  Avatar,
  Stepper,
  Step,
  StepLabel,
  Badge,
  useTheme,
  alpha,
  Zoom,
  Slide,
  Fade
} from '@mui/material';
import {
  PlayArrow,
  ArrowBack,
  Timer,
  CheckCircle,
  Cancel,
  EmojiEvents,
  TrendingUp,
  Psychology,
  School,
  Assignment,
  Lightbulb,
  Star,
  RocketLaunch,
  NavigateNext,
  NavigateBefore,
  Send
} from '@mui/icons-material';
import Navbar from '../../../components/Navbar/Navbar';

const StudentTests = () => {
  const [tests, setTests] = useState([]);
  const [selectedTest, setSelectedTest] = useState(null);
  const [testDialogOpen, setTestDialogOpen] = useState(false);
  const [testInProgress, setTestInProgress] = useState(false);
  const [currentTest, setCurrentTest] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(0);
  const [testResult, setTestResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [animate, setAnimate] = useState(false);

  const API_URL = 'https://collegeforms.in/api/tests';
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
      setCurrentQuestionIndex(0);
      setAnswers({});
      
      setTimeLeft(testData.timeLimit * 60);
      
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
      
    } catch (error) {
      console.error('Failed to start test:', error);
    }
  };

  const handleAnswerSelect = (questionId, optionIndex) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: optionIndex
    }));
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < currentTest.questions.length - 1) {
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
        `${API_URL}/${currentTest._id}/attempt`,
        {
          answers: answerArray,
          timeSpent: (currentTest.timeLimit * 60) - timeLeft
        },
        authHeader
      );

      setTestResult(response.data);
      setTestInProgress(false);
    } catch (error) {
      console.error('Failed to submit test:', error);
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (loading) {
    return (


      <Container sx={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '80vh',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
      }}>
        <Box textAlign="center">
          <RocketLaunch sx={{ fontSize: 60, color: 'white', mb: 2 }} />
          <Typography variant="h6" color="white">
            Loading awesome tests...
          </Typography>
          <CircularProgress sx={{ color: 'white', mt: 2 }} />
        </Box>
      </Container>
    );
  }

  if (testInProgress && currentTest) {
    return (
      <TestInProgress
        test={currentTest}
        currentQuestionIndex={currentQuestionIndex}
        answers={answers}
        timeLeft={timeLeft}
        onAnswerSelect={handleAnswerSelect}
        onNextQuestion={handleNextQuestion}
        onPrevQuestion={handlePrevQuestion}
        onSubmitTest={handleTestSubmit}
      />
    );
  }

  if (testResult) {
    return (
      <TestResult
        result={testResult}
        test={currentTest}
        onBackToList={() => {
          setTestResult(null);
          setCurrentTest(null);
          fetchTests();
        }}
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
            <School sx={{ fontSize: 60, color: 'primary.main', mb: 2 }} />
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
    </>

  );
};

// Enhanced Test Card Component
const TestCard = ({ test, onStartTest, index }) => {
  const theme = useTheme();
  const colors = [
    'linear-gradient(135deg, #f8f9fbff 0%, #f9f9faff 100%)',
    'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
    'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
    'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
    'linear-gradient(135deg, #fa709a 0%, #fee140 100%)'
  ];

  return (
    <Card sx={{ 
      height: '100%', 
      display: 'flex', 
      flexDirection: 'column',
      transition: 'transform 0.3s ease, box-shadow 0.3s ease',
      borderRadius: 3,
      overflow: 'hidden',
      background: colors[index % colors.length],
      color: 'black',
      '&:hover': {
        transform: 'translateY(-8px)',
      }
    }}>
      <CardContent sx={{ flexGrow: 1, p: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
      
          <Box>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
              {test.title}
            </Typography>
            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
              <Chip 
                label={test.class} 
                size="small" 
                sx={{ 
                  background: 'rgba(255,255,255,0.2)',
                  color: 'black',
                  backdropFilter: 'blur(10px)'
                }} 
              />
              <Chip 
                label={test.subject} 
                size="small" 
                sx={{ 
                  background: 'rgba(28, 14, 95, 0.15)',
                  color: 'black',
                  backdropFilter: 'blur(10px)'
                }} 
              />
            </Box>
          </Box>
        </Box>

        <Box sx={{ 
          background: 'rgba(18, 0, 134, 0.04)',
          borderRadius: 2,
          p: 2,
          mb: 2,
          backdropFilter: 'blur(10px)'
        }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
            <Typography variant="body2">
              <Lightbulb sx={{ fontSize: 16, verticalAlign: 'text-bottom', mr: 0.5 }} />
              {test.questions.length} Questions
            </Typography>
            <Typography variant="body2">
              <Timer sx={{ fontSize: 16, verticalAlign: 'text-bottom', mr: 0.5 }} />
              {test.timeLimit} min
            </Typography>
          </Box>
          <LinearProgress 
            variant="determinate" 
            value={75} 
            sx={{ 
              height: 6, 
              borderRadius: 3,
              background: 'rgba(30, 27, 27, 0.2)',
              '& .MuiLinearProgress-bar': {
                background: '#567DBD',
                borderRadius: 3
              }
            }} 
          />
        </Box>

        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box>
            <Star sx={{ fontSize: 16, color: 'gold', verticalAlign: 'text-bottom' }} />
            <Typography variant="body2" display="inline" sx={{ ml: 0.5 }}>
              {test.totalMarks} Points
            </Typography>
          </Box>
          <Button
            variant="contained"
            endIcon={<PlayArrow />}
            onClick={() => onStartTest(test)}
            sx={{
              background: 'rgba(255,255,255,0.9)',
              color: 'primary.main',
              fontWeight: 'bold',
              borderRadius: 2,
              px: 2,
              '&:hover': {
                background: 'white',
                transform: 'scale(1.05)'
              }
            }}
          >
            Start
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
};

// Enhanced Test Description Dialog
const TestDescriptionDialog = ({ open, test, onClose, onStart }) => {
  if (!test) return null;

  return (
    <Dialog 
      open={open} 
      onClose={onClose} 
      maxWidth="sm" 
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 3,
          background: 'linear-gradient(135deg, #ffffffff 0%, #ffffffff 100%)',
          color: 'white'
        }
      }}
    >
      <DialogTitle sx={{ textAlign: 'left' }}>
        <Typography variant="h4"className='pb-2' >
          {test.title}
        </Typography>
        <Box sx={{ display: 'flex', justifyContent: 'left', gap: 1 }}>
          <Chip label={test.class} sx={{ background: '#547DBD', color: 'white' }} />
          <Chip label={test.subject} sx={{ background: '#547DBD', color: 'white' }} />
        </Box>
      </DialogTitle>
      
      <DialogContent>
        <Box sx={{ mb: 2 }}>
          <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
            <Psychology sx={{ mr: 1 }} />
            Challenge Instructions
          </Typography>
          
          {[
            `This test contains ${test.questions.length} carefully crafted questions`,
            `You have ${test.timeLimit} minutes to complete the challenge`,
            `Each question carries different marks based on difficulty`,
            `The timer starts immediately and cannot be paused`,
          ].map((item, index) => (
            <Box key={index} sx={{ display: 'flex', alignItems: 'flex-start', mb: 1.5 }}>
              <CheckCircle sx={{ color: '#43e97b', fontSize: 20, mr: 1.5, mt: 0.2 }} />
              <Typography variant="body1">{item}</Typography>
            </Box>
          ))}
        </Box>
    
        
      </DialogContent>
      
      <DialogActions sx={{ p: 3, gap: 2 }}>
        <Button 
          onClick={onClose}
          sx={{
            color: 'black',
            borderColor: 'rgba(0, 0, 0, 0.3)',
            '&:hover': {
              borderColor: 'white',
              background: 'rgba(0, 0, 0, 0.1)'
            }
          }}
          variant="outlined"
        >
          Not Ready
        </Button>
        <Button 
          variant="contained" 
          onClick={onStart}
          endIcon={<RocketLaunch />}
          sx={{
            background: '#547DBD',
            color: 'white',
            fontWeight: 'bold',
            px: 3,
            '&:hover': {
              background: '#000000ff',
              transform: 'scale(1.02)'
            }
          }}
        >
          Start Test
        </Button>
      </DialogActions>
    </Dialog>
  );
};

// Enhanced Test In Progress Component
const TestInProgress = ({ test, currentQuestionIndex, answers, timeLeft, onAnswerSelect, onNextQuestion, onPrevQuestion, onSubmitTest }) => {
  const currentQuestion = test.questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / test.questions.length) * 100;
  const theme = useTheme();

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
            onClick={() => window.confirm('Are you sure you want to leave? Your progress will be lost.') && onSubmitTest()}
            sx={{ color: 'primary.main' }}
          >
            <ArrowBack />
          </IconButton>
          
          <Box sx={{ flexGrow: 1, ml: 3 }}>
            <Typography variant="h6" color="primary" fontWeight="bold">
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
            onClick={onSubmitTest}
            endIcon={<Send />}
            sx={{
              background: 'rgb(84, 125, 189)',
              borderRadius: 2,
              px: 3,
              '&:hover': {
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
              background: '#2A80D5',
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
       

          {/* Question Content */}
          <Box sx={{ mb: 4 }}>
            <Box sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              mb: 3,
              p: 2,
              color: 'white',
              borderRadius: 2
            }}>
              <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                Q{currentQuestionIndex + 1}.
              </Typography>
              {currentQuestion.marks > 1 && (
                <Chip 
                  label={`${currentQuestion.marks} marks`} 
                  size="small" 
                  sx={{ 
                    background: 'rgba(255,255,255,0.2)', 
                    color: 'white', 
                    ml: 2,
                    fontWeight: 'bold'
                  }} 
                />
              )}

                 <Typography variant="h6" className='ps-2' sx={{ ms: 3, lineHeight: 1.6 }}>
            
              {currentQuestion.questionText}
            
            </Typography>

            </Box>
            
         
            
            <FormControl component="fieldset" fullWidth>
              <RadioGroup
                value={answers[currentQuestion._id] !== undefined ? answers[currentQuestion._id] : ''}
                onChange={(e) => onAnswerSelect(currentQuestion._id, parseInt(e.target.value))}
              >
                {currentQuestion.options.map((option, index) => (
                  <Paper
                    key={index}
                    sx={{
                      p: 1,
                      mb: 2,
                      border: '2px solid',
                      boxShadow:"none",
                      borderColor: answers[currentQuestion._id] === index ? 
                        'primary.main' : '#D3DCEA',
                      background: answers[currentQuestion._id] === index ? 
                        alpha(theme.palette.primary.main, 0.05) : 'grey.50',
                      borderRadius: 2,
                      transition: 'all 0.2s ease',
                      cursor: 'pointer',
                      '&:hover': {
                        borderColor: 'primary.light',
                        background: alpha(theme.palette.primary.main, 0.08)
                      }
                    }}
                    onClick={() => onAnswerSelect(currentQuestion._id, index)}
                  >
                    <FormControlLabel
                      value={index}
                      control={
                        <Radio sx={{ 
                          color: answers[currentQuestion._id] === index ? 
                            'primary.main' : 'grey.400',
                          '&.Mui-checked': {
                            color: 'primary.main'
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

          {/* Navigation Buttons */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 2 }}>
            <Button
              variant="outlined"
              onClick={onPrevQuestion}
              disabled={currentQuestionIndex === 0}
              startIcon={<NavigateBefore />}
              sx={{
                borderRadius: 2,
                px: 3,
                py: 1
              }}
            >
              Previous
            </Button>
            
            {currentQuestionIndex === test.questions.length - 1 ? (
              <Button 
                variant="contained" 
                onClick={onSubmitTest}
                endIcon={<Send />}
                sx={{
                  background: '#54A569',
                  borderRadius: 2,
                  px: 4,
                  py: 1,
                  '&:hover': {
                    transform: 'scale(1.02)'
                  }
                }}
              >
                Submit Test
              </Button>
            ) : (
              <Button 
                variant="contained" 
                onClick={onNextQuestion}
                endIcon={<NavigateNext />}
                sx={{
                  background: '#547DBD',
                  borderRadius: 2,
                  px: 4,
                  py: 1,
                  '&:hover': {
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

// Enhanced Test Result Component
const TestResult = ({ result, test, onBackToList }) => {
  const isPass = result.percentage >= 50;
  const theme = useTheme();

  return (
    <Box sx={{ 
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
      py: 4
    }}>
      <Container maxWidth="lg">
        <Fade in timeout={1000}>
          <Box textAlign="center" sx={{ mb: 6 }}>
            <Box sx={{
              background: isPass ? 
                'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)' :
                'linear-gradient(135deg, #ff6b6b 0%, #ee5a52 100%)',
              width: 120,
              height: 120,
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              mx: 'auto',
              mb: 3,
              boxShadow: '0 8px 32px rgba(0,0,0,0.2)'
            }}>
              {isPass ? (
                <EmojiEvents sx={{ fontSize: 60, color: 'white' }} />
              ) : (
                <Psychology sx={{ fontSize: 60, color: 'white' }} />
              )}
            </Box>
            
            <Typography variant="h3" gutterBottom sx={{ fontWeight: 'bold' }}>
              {isPass ? 'Congratulations!' : 'Keep Learning!'}
            </Typography>
            
            <Typography variant="h6" color="text.secondary" sx={{ mb: 4 }}>
              {isPass ? 
                'You have successfully completed the challenge!' : 
                'Every attempt is a step toward mastery. Try again!'
              }
            </Typography>
          </Box>
        </Fade>

        {/* Score Cards */}
        <Grid container spacing={3} sx={{ mb: 6 }}>
          {[
            { 
              value: `${result.score}/${result.totalMarks}`, 
              label: 'Score', 
              icon: <TrendingUp />,
              color: 'primary' 
            },
            { 
              value: `${result.percentage}%`, 
              label: 'Percentage', 
              icon: <Assignment />,
              color: isPass ? 'success' : 'error'
            },
            { 
              value: isPass ? 'PASS' : 'FAIL', 
              label: 'Result', 
              icon: <EmojiEvents />,
              color: isPass ? 'success' : 'error'
            }
          ].map((item, index) => (
            <Grid item xs={12} md={4} key={index}>
              <Slide in timeout={800} direction="up" style={{ transitionDelay: `${index * 200}ms` }}>
                <Paper sx={{ 
                  p: 4, 
                  textAlign: 'center',
                  borderRadius: 3,
                  background: `linear-gradient(135deg, ${theme.palette[item.color].light} 0%, ${theme.palette[item.color].dark} 100%)`,
                  color: 'white',
                  boxShadow: '0 8px 32px rgba(0,0,0,0.15)'
                }}>
                  <Box sx={{ 
                    display: 'inline-flex', 
                    p: 2, 
                    background: 'rgba(255,255,255,0.2)',
                    borderRadius: '50%',
                    mb: 2
                  }}>
                    {React.cloneElement(item.icon, { sx: { fontSize: 30 } })}
                  </Box>
                  <Typography variant="h3" fontWeight="bold" gutterBottom>
                    {item.value}
                  </Typography>
                  <Typography variant="h6">
                    {item.label}
                  </Typography>
                </Paper>
              </Slide>
            </Grid>
          ))}
        </Grid>

        {/* Question-wise Analysis */}
        <Typography variant="h4" gutterBottom textAlign="center" sx={{ mb: 4 }}>
          Detailed Analysis
        </Typography>

        <Grid container spacing={3}>
          {result.answers.map((answer, index) => {
            const question = test.questions.find(q => q._id === answer.question);
            const isCorrect = answer.isCorrect;
            
            return (
              <Grid item xs={12} key={index}>
                <Fade in timeout={800} style={{ transitionDelay: `${index * 100}ms` }}>
                  <Paper sx={{ 
                    p: 3, 
                    borderRadius: 3,
                    borderLeft: `4px solid ${isCorrect ? '#4caf50' : '#f44336'}`,
                    background: 'white',
                    boxShadow: '0 4px 20px rgba(0,0,0,0.08)'
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
                        <strong>Your Answer:</strong> {question.options[answer.selectedOption]?.text || 'Not attempted'}
                      </Typography>
                      
                      {!isCorrect && (
                        <Typography variant="body2" color="success.main" gutterBottom>
                          <strong>Correct Answer:</strong> {question.options.find(opt => opt.isCorrect)?.text}
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

        <Box textAlign="center" sx={{ mt: 6 }}>
          <Button 
            variant="contained" 
            onClick={onBackToList}
            startIcon={<ArrowBack />}
            size="large"
            sx={{
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
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
  );
};

// Helper function to format time
const formatTime = (seconds) => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, '0')}`;
};

export default StudentTests;