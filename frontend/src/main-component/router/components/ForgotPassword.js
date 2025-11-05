// components/ForgotPassword.js
import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { 
  Container, 
  Paper, 
  TextField, 
  Button, 
  Typography, 
  Box,
  Alert,
  CircularProgress
} from '@mui/material';
import { Link } from 'react-router-dom';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const { forgotPassword, loading, error, clearError } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    clearError();
    
    const result = await forgotPassword(email);
    if (result.success) {
      setSubmitted(true);
    }
  };

  if (submitted) {
    return (
      <Container maxWidth="sm" sx={{ mt: 4 }}>
        <Paper elevation={3} sx={{ p: 4, textAlign: 'center' }}>
          <Typography variant="h5" gutterBottom color="primary">
            Check Your Email
          </Typography>
          <Typography variant="body1" sx={{ mb: 3 }}>
            We've sent a password reset link to <strong>{email}</strong>. 
            Please check your inbox and follow the instructions.
          </Typography>
          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
            <Button 
              variant="outlined" 
              onClick={() => setSubmitted(false)}
            >
              Try Another Email
            </Button>
            <Button 
              component={Link}
              to="/user/login"
              variant="contained"
            >
              Back to Login
            </Button>
          </Box>
        </Paper>
      </Container>
    );
  }

  return (
    <Container maxWidth="sm" sx={{ mt: 4 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h4" gutterBottom align="center">
          Reset Password
        </Typography>
        <Typography variant="body1" sx={{ mb: 3 }} align="center">
          Enter your email address and we'll send you a link to reset your password.
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }} onClose={clearError}>
            {error}
          </Alert>
        )}

        <Box component="form" onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="Email Address"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            margin="normal"
            variant="outlined"
            autoComplete="email"
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            size="large"
            disabled={loading}
            sx={{ mt: 3, mb: 2 }}
          >
            {loading ? <CircularProgress size={24} /> : 'Send Reset Link'}
          </Button>
          <Box sx={{ textAlign: 'center' }}>
            <Button component={Link} to="/user/login" variant="text">
              Back to Login
            </Button>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
};

export default ForgotPassword;