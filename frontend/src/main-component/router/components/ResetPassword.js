// components/ResetPassword.js
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
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

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [email, setEmail] = useState('');
  const [tokenValid, setTokenValid] = useState(false);
  const [tokenChecked, setTokenChecked] = useState(false);
  const { verifyResetToken, resetPassword, loading, error, clearError } = useAuth();

  useEffect(() => {
    const verifyToken = async () => {
      if (token) {
        const result = await verifyResetToken(token);
        if (result.success) {
          setTokenValid(true);
          setEmail(result.email);
        }
        setTokenChecked(true);
      }
    };
    verifyToken();
  }, [token, verifyResetToken]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    clearError();

    if (password !== confirmPassword) {
      alert("Passwords don't match");
      return;
    }

    if (password.length < 6) {
      alert("Password must be at least 6 characters long");
      return;
    }

    const result = await resetPassword(token, password);
    if (result.success) {
      alert('Password reset successfully! You can now login with your new password.');
      navigate('/user/login');
    }
  };

  if (!tokenChecked) {
    return (
      <Container maxWidth="sm" sx={{ mt: 4, textAlign: 'center' }}>
        <CircularProgress />
        <Typography variant="body1" sx={{ mt: 2 }}>
          Verifying reset link...
        </Typography>
      </Container>
    );
  }

  if (!tokenValid) {
    return (
      <Container maxWidth="sm" sx={{ mt: 4 }}>
        <Paper elevation={3} sx={{ p: 4, textAlign: 'center' }}>
          <Typography variant="h5" color="error" gutterBottom>
            Invalid or Expired Link
          </Typography>
          <Typography variant="body1" sx={{ mb: 3 }}>
            This password reset link is invalid or has expired. 
            Please request a new reset link.
          </Typography>
          <Button 
            variant="contained" 
            onClick={() => navigate('/forgot-password')}
          >
            Request New Link
          </Button>
        </Paper>
      </Container>
    );
  }

  return (
    <Container maxWidth="sm" sx={{ mt: 4 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h4" gutterBottom align="center">
          Set New Password
        </Typography>
        <Typography variant="body1" sx={{ mb: 3 }} align="center">
          Reset password for: <strong>{email}</strong>
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }} onClose={clearError}>
            {error}
          </Alert>
        )}

        <Box component="form" onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="New Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            margin="normal"
            variant="outlined"
            helperText="Password must be at least 6 characters long"
            autoComplete="new-password"
          />
          <TextField
            fullWidth
            label="Confirm New Password"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            margin="normal"
            variant="outlined"
            autoComplete="new-password"
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            size="large"
            disabled={loading}
            sx={{ mt: 3 }}
          >
            {loading ? <CircularProgress size={24} /> : 'Reset Password'}
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default ResetPassword;