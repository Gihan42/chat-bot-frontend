import React, { useState } from 'react';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import TextField from '@mui/material/TextField';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import EmailIcon from '@mui/icons-material/Email';
import Box from '@mui/material/Box';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import LockPersonIcon from '@mui/icons-material/LockPerson';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import FingerprintIcon from '@mui/icons-material/Fingerprint';
import PersonIcon from '@mui/icons-material/Person';
import { useNavigate } from 'react-router-dom';
import Alert from '@mui/material/Alert';
import CheckIcon from '@mui/icons-material/Check';

export default function SignInComponent() {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [alertMessage, setAlertMessage] = useState(null); // State for message
  const [alertSeverity, setAlertSeverity] = useState(''); // State for alert severity
  const navigate = useNavigate();

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const handleSignIn = async () => {
    const user = {
      email: email,
      name: name,
      password: password,
    };

    try {
      const response = await fetch('http://localhost:8000/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(user),
      });

      if (response.ok) {
        const data = await response.json();

        localStorage.setItem('access_token', data.access_token); 
        localStorage.setItem('userName',user.name)
        localStorage.setItem('userEmail',user.email)
        setAlertMessage('Sign-up successful!');
        setAlertSeverity('success');
        navigate('/main');
      } else {
        setAlertMessage('Please try again.');
        setAlertSeverity('error');
      }
    } catch (error) {
      console.error("Error sending message:", error);
      setAlertMessage('Something went wrong, please try again.');
      setAlertSeverity('error');
    }
  };

  return (
    <div className="bg-gray-200 w-96 p-8 flex items-center justify-center bg-cover">
      <Box
        component="form"
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          flexDirection: 'column',
          '& .MuiTextField-root': { m: 1, width: '320px' },
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
            <AccountCircleIcon className="text-indigo-50" />
          </div>
        </div>

        <h2>Sign Up</h2>
        <label className="pb-2">Welcome, please sign up to continue</label>

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

        {/* Username Field */}
        <TextField
          id="outlined-username"
          label="Username"
          placeholder="John Andrew"
          variant="outlined"
          value={name}
          onChange={(e) => setName(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <PersonIcon />
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

        {/* Sign-in Button */}
        <Stack spacing={2} direction="row">
          <Button variant="contained" onClick={handleSignIn} startIcon={<FingerprintIcon />} className="w-80 bg-cyan-500">
            Sign In
          </Button>
        </Stack>

        {/* Alert Rendering */}
        {alertMessage && (
          <Stack sx={{ width: '100%' }} spacing={2}>
            <Alert severity={alertSeverity} icon={<CheckIcon fontSize="inherit" />}>
              {alertMessage}
            </Alert>
          </Stack>
        )}
      </Box>
    </div>
  );
}
