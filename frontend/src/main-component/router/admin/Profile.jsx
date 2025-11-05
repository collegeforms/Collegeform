// src/components/Profile.js
import React from 'react';
import { Box, Container, Typography, Paper } from '@mui/material';

const Profile = () => {
  const API_URL =  "https://collegeform.onrender.com" || "https://collegeform-production.up.railway.app" || "http://localhost:5000";

  return (
    <Box sx={{ display: 'flex' }}>
      <Container sx={{ flexGrow: 1, marginLeft: '240px', paddingTop: '80px' }}>
        <Typography variant="h4" gutterBottom>
          Admin Profile
        </Typography>
        <Paper sx={{ padding: 3 }}>
          <Typography variant="h6">Name: John Doe</Typography>
          <Typography variant="h6">Email: johndoe@example.com</Typography>
        </Paper>
      </Container>
    </Box>
  );
};

export default Profile;
