// src/components/Settings.js
import React from 'react';
import { Box, Container, Typography, Paper } from '@mui/material';

const Settings = () => {
  return (
    <Box sx={{ display: 'flex' }}>
      <Container sx={{ flexGrow: 1, paddingTop: '80px' }}>
        <Typography variant="h4" gutterBottom>
          Settings
        </Typography>
        <Paper sx={{ padding: 3 }}>
          <Typography variant="h6">Change Password</Typography>
          <form>
            <input
              type="password"
              placeholder="New Password"
              style={{ padding: '10px', margin: '10px 0', width: '100%' }}
            />
            <button type="submit" style={{ padding: '10px 20px' }}>
              Save Changes
            </button>
          </form>
        </Paper>
      </Container>
    </Box>
  );
};

export default Settings;
