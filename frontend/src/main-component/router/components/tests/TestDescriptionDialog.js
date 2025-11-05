import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Box,
  Button,
  Chip
} from '@mui/material';
import { Psychology, CheckCircle, RocketLaunch } from '@mui/icons-material';

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
          background: 'white',
        }
      }}
    >
      <DialogTitle sx={{ textAlign: 'left' }}>
        <Typography variant="h4" className='pb-2' sx={{ color: '#2c3e50', fontWeight: 'bold' }}>
          {test.title}
        </Typography>
        <Box sx={{ display: 'flex', justifyContent: 'left', gap: 1 }}>
          <Chip label={test.class} sx={{ background: '#547DBD', color: 'white', fontWeight: '500' }} />
          <Chip label={test.subject} sx={{ background: '#547DBD', color: 'white', fontWeight: '500' }} />
        </Box>
      </DialogTitle>
      
      <DialogContent>
        <Box sx={{ mb: 2 }}>
          <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', color: '#2c3e50' }}>
            <Psychology sx={{ mr: 1, color: '#547DBD' }} />
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
              <Typography variant="body1" sx={{ color: '#555' }}>{item}</Typography>
            </Box>
          ))}
        </Box>
      </DialogContent>
      
      <DialogActions sx={{ p: 3, gap: 2 }}>
        <Button 
          onClick={onClose}
          sx={{
            color: '#547DBD',
            borderColor: '#547DBD',
            fontWeight: '500',
            '&:hover': {
              borderColor: '#4669A8',
              background: 'rgba(84, 125, 189, 0.1)'
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
              background: '#4669A8',
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

export default TestDescriptionDialog;