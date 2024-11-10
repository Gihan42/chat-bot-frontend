import React, { useState, useEffect } from 'react';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import TextField from '@mui/material/TextField';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import EmailIcon from '@mui/icons-material/Email';
import LockPersonIcon from '@mui/icons-material/LockPerson';
import Box from '@mui/material/Box';
import LockOpenIcon from '@mui/icons-material/LockOpen';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import FingerprintIcon from '@mui/icons-material/Fingerprint';
import { useNavigate } from 'react-router-dom';
import {  message, Popconfirm, Switch } from 'antd';

export default function LoginComponent() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [openConfirm, setOpenConfirm] = useState(false);
  const navigate = useNavigate();

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const confirm = () => {
    setOpenConfirm(false);
    message.success('logging success.');
};

  const handleLogin = async () => {
    const loginRequest = {
      email: email,
      password: password,
    };

    try {
      const response = await fetch('http://localhost:8000/token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(loginRequest),
      });

      if (response.ok) {
        const data = await response.json();
        localStorage.setItem('access_token', data.access_token); 
        localStorage.setItem('userName',data.user.name)
        localStorage.setItem('userEmail',data.user.email)
        confirm()
        navigate('/main');
      } else {
        console.error('Invalid email or password');
      }
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  // Check if the token is present when the component mounts
  useEffect(() => {
    const token = localStorage.getItem('access_token');
    if (token) {
      navigate('/main'); // Navigate to main page if token exists
    }
    
  }, [navigate]);

  return (
    <div className="bg-gray-200 w-96 p-12 flex items-center justify-center bg-cover">
      <Box
        component="form"
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          flexDirection: 'column',
          '& .MuiTextField-root': { m: 2, width: '320px' },
        }}
        noValidate
        autoComplete="off"
      >
        <div className="bg-gray-200 w-96 flex items-center justify-center">
          <style>
            {`
            @keyframes pulse {
              0%, 100% {
                transform: scale(1);
                opacity: 1;
              }
              50% {
                transform: scale(1.1);
                opacity: 0.8;
              }
            }
          `}
          </style>
          <div
            className="bg-blue-900 w-12 h-12 flex items-center justify-center rounded-full"
            style={{
              animation: 'pulse 2s infinite',
            }}
          >
            <LockOpenIcon className="text-indigo-50" />
          </div>
        </div>

        <h2>Login</h2>
        <label className="pb-4">
          Welcome, please login to continue
        </label>

        {/* Email Field */}
        <TextField
          id="outlined-email"
          label="Email"
          placeholder="example@domain.com"
          variant="outlined"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <EmailIcon />
              </InputAdornment>
            ),
          }}
        />

        {/* Password Field */}
        <TextField
          id="outlined-adornment-password"
          type={showPassword ? 'text' : 'password'}
          label="Password"
          placeholder="#$13?24%^@6"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <LockPersonIcon />
              </InputAdornment>
            ),
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  aria-label={showPassword ? 'hide password' : 'show password'}
                  onClick={handleClickShowPassword}
                  onMouseDown={handleMouseDownPassword}
                  edge="end"
                >
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            ),
          }}
        />

        <Stack spacing={2} direction="row">
          <Button variant="contained" onClick={handleLogin} startIcon={<FingerprintIcon />} className="w-80 bg-cyan-500">
            Login
          </Button>
        </Stack>
      </Box>
    </div>
  );
}
