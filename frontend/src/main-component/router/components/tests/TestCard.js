import React from 'react';
import { Card, CardContent, Typography, Box, Button, Chip, LinearProgress } from '@mui/material';
import { PlayArrow, Lightbulb, Timer, Star } from '@mui/icons-material';

const TestCard = ({ test, onStartTest, index }) => {
  const colors = [
    'linear-gradient(135deg, #f8f9fbff 0%, #f9f9faff 100%)',
    'linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%)',
    'linear-gradient(135deg, #f3e5f5 0%, #e1bee7 100%)',
    'linear-gradient(135deg, #e8f5e8 0%, #c8e6c9 100%)',
    'linear-gradient(135deg, #fff3e0 0%, #ffe0b2 100%)'
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
        <Box sx={{ mb: 2 }}>
          <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
            {test.title}
          </Typography>
          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
            <Chip 
              label={test.class} 
              size="small" 
              sx={{ 
                background: 'rgba(84, 125, 189, 0.1)',
                color: '#547DBD',
                fontWeight: '500'
              }} 
            />
            <Chip 
              label={test.subject} 
              size="small" 
              sx={{ 
                background: 'rgba(84, 125, 189, 0.2)',
                color: '#547DBD',
                fontWeight: '500'
              }} 
            />
          </Box>
        </Box>

        <Box sx={{ 
          background: 'rgba(84, 125, 189, 0.05)',
          borderRadius: 2,
          p: 2,
          mb: 2,
        }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
            <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center' }}>
              <Lightbulb sx={{ fontSize: 16, mr: 0.5, color: '#547DBD' }} />
              {test.questions.length} Questions
            </Typography>
            <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center' }}>
              <Timer sx={{ fontSize: 16, mr: 0.5, color: '#547DBD' }} />
              {test.timeLimit} min
            </Typography>
          </Box>
          <LinearProgress 
            variant="determinate" 
            value={75} 
            sx={{ 
              height: 6, 
              borderRadius: 3,
              background: 'rgba(84, 125, 189, 0.2)',
              '& .MuiLinearProgress-bar': {
                background: '#547DBD',
                borderRadius: 3
              }
            }} 
          />
        </Box>

        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Star sx={{ fontSize: 16, color: '#FFD700', mr: 0.5 }} />
            <Typography variant="body2">
              {test.totalMarks} Points
            </Typography>
          </Box>
          <Button
            variant="contained"
            endIcon={<PlayArrow />}
            onClick={() => onStartTest(test)}
            sx={{
              background: '#547DBD',
              color: 'white',
              fontWeight: 'bold',
              borderRadius: 2,
              px: 2,
              '&:hover': {
                background: '#4669A8',
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

export default TestCard;