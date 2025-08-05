// src/components/LoginForm.js

import React, { useState } from 'react';
import {
  Box,
  TextField,
  Button,
  Typography,
} from '@mui/material';

export default function LoginForm({ onLoginSuccess }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);

  const handleLogin = () => {
    if (email === 'user@example.com' && password === 'password123') {
      onLoginSuccess(email);
      setError(null);
    } else {
      setError('Invalid email or password');
    }
  };

  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h6" gutterBottom>
        Login
      </Typography>
      <Typography>user@example.com, password123 for dev</Typography>
      <TextField
        label="Email"
        variant="outlined"
        fullWidth
        margin="normal"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <TextField
        label="Password"
        type="password"
        variant="outlined"
        fullWidth
        margin="normal"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      {error && (
        <Typography color="error" variant="body2">
          {error}
        </Typography>
      )}
      <Button
        variant="contained"
        color="primary"
        fullWidth
        onClick={handleLogin}
        sx={{ mt: 2 }}
      >
        Log In
      </Button>
    </Box>
  );
}
