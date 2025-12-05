import { useState, useEffect } from "react";
import { 
  TextField, 
  Button, 
  Container, 
  Typography, 
  Alert, 
  Paper, 
  Box,
  InputAdornment,
  IconButton,
  LinearProgress,
  Grid
} from "@mui/material";
import { 
  Visibility, 
  VisibilityOff,
  Lock,
  LockOpen,
  CheckCircle
} from "@mui/icons-material";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./ChangePassword.css";

const ChangePassword = () => {
  const API_URL = "https://www.collegeforms.in";  const navigate = useNavigate();

  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState({
    old: false,
    new: false,
    confirm: false
  });
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [requirements, setRequirements] = useState({
    length: false,
    uppercase: false,
    lowercase: false,
    number: false,
    specialChar: false
  });

  useEffect(() => {
    // Calculate password strength
    let strength = 0;
    const newRequirements = {
      length: newPassword.length >= 8,
      uppercase: /[A-Z]/.test(newPassword),
      lowercase: /[a-z]/.test(newPassword),
      number: /[0-9]/.test(newPassword),
      specialChar: /[^A-Za-z0-9]/.test(newPassword)
    };

    Object.values(newRequirements).forEach(met => {
      if (met) strength += 20;
    });

    setPasswordStrength(strength);
    setRequirements(newRequirements);
  }, [newPassword]);

  const handleClickShowPassword = (field) => {
    setShowPassword({ ...showPassword, [field]: !showPassword[field] });
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      setError("New password and confirm password do not match!");
      return;
    }

    if (passwordStrength < 80) {
      setError("Password is not strong enough!");
      return;
    }

    try {
      const token = localStorage.getItem("userToken");
      if (!token) {
        navigate("/user/login");
        return;
      }

      const response = await axios.post(
        `${API_URL}/api/change-password`,
        { oldPassword, newPassword },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setMessage(response.data.message || "Password changed successfully!");
      setError("");
      setOldPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong!");
    }
  };

  return (
    <Container maxWidth="sm" className="password-container">
      <Paper elevation={6} className="password-paper" sx={{ 
        borderRadius: '16px',
        background: 'linear-gradient(145deg, #ffffff, #f0f0f0)'
      }}>
        <Box textAlign="center" mb={3}>
          <Lock color="primary" sx={{ fontSize: 60 }} />
          <Typography variant="h4" component="h1" gutterBottom sx={{ 
            fontWeight: 'bold',
            color: 'primary.main',
            mt: 2
          }}>
            Change Password
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Secure your account with a new password
          </Typography>
        </Box>

        {message && (
          <Alert 
            severity="success" 
            icon={<CheckCircle fontSize="inherit" />}
            sx={{ mb: 3 }}
            onClose={() => setMessage("")}
          >
            {message}
          </Alert>
        )}
        {error && (
          <Alert 
            severity="error" 
            sx={{ mb: 3 }}
            onClose={() => setError("")}
          >
            {error}
          </Alert>
        )}

        <Box 
          component="form" 
          onSubmit={handleChangePassword} 
          sx={{ 
            '& .MuiTextField-root': { mb: 2 },
            '& .MuiButton-root': { py: 1.5, mt: 2 }
          }}
        >
          <TextField
            label="Current Password"
            type={showPassword.old ? "text" : "password"}
            fullWidth
            variant="outlined"
            margin="normal"
            value={oldPassword}
            onChange={(e) => setOldPassword(e.target.value)}
            required
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <LockOpen color="action" />
                </InputAdornment>
              ),
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => handleClickShowPassword("old")}
                    edge="end"
                  >
                    {showPassword.old ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              )
            }}
          />

          <TextField
            label="New Password"
            type={showPassword.new ? "text" : "password"}
            fullWidth
            variant="outlined"
            margin="normal"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Lock color="action" />
                </InputAdornment>
              ),
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => handleClickShowPassword("new")}
                    edge="end"
                  >
                    {showPassword.new ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              )
            }}
          />

          {newPassword && (
            <Box mb={2}>
              <LinearProgress 
                variant="determinate" 
                value={passwordStrength} 
                color={
                  passwordStrength >= 80 ? "success" : 
                  passwordStrength >= 60 ? "warning" : "error"
                }
                sx={{ height: 8, borderRadius: 4, mb: 1 }}
              />
              <Grid container spacing={1}>
                <Grid item xs={6}>
                  <Typography variant="caption" color={requirements.length ? "success.main" : "text.secondary"}>
                    • 8+ characters
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="caption" color={requirements.uppercase ? "success.main" : "text.secondary"}>
                    • Uppercase letter
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="caption" color={requirements.lowercase ? "success.main" : "text.secondary"}>
                    • Lowercase letter
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="caption" color={requirements.number ? "success.main" : "text.secondary"}>
                    • Number
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="caption" color={requirements.specialChar ? "success.main" : "text.secondary"}>
                    • Special character
                  </Typography>
                </Grid>
              </Grid>
            </Box>
          )}

          <TextField
            label="Confirm New Password"
            type={showPassword.confirm ? "text" : "password"}
            fullWidth
            variant="outlined"
            margin="normal"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Lock color="action" />
                </InputAdornment>
              ),
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => handleClickShowPassword("confirm")}
                    edge="end"
                  >
                    {showPassword.confirm ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              )
            }}
          />

          <Button
            type="submit"
            variant="contained"
            fullWidth
            size="large"
            disabled={!oldPassword || !newPassword || !confirmPassword}
            sx={{
              background: 'linear-gradient(45deg, #1976d2 30%, #2196f3 90%)',
              fontWeight: 'bold',
              letterSpacing: 1,
              boxShadow: '0 3px 5px 2px rgba(33, 150, 243, .3)',
              '&:hover': {
                transform: 'translateY(-2px)',
                boxShadow: '0 5px 8px 3px rgba(33, 150, 243, .4)'
              },
              transition: 'all 0.3s ease'
            }}
          >
            Update Password
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default ChangePassword;