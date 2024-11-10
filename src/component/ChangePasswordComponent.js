import React, { useState } from 'react';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import TextField from '@mui/material/TextField';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import LockPersonIcon from '@mui/icons-material/LockPerson';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import LockResetIcon from '@mui/icons-material/LockReset';
import SafetyCheckIcon from '@mui/icons-material/SafetyCheck';
import Box from '@mui/material/Box';
import { useNavigate } from 'react-router-dom';
import { message } from 'antd';

export default function ChangePasswordComponent() {
  const [showPassword, setShowPassword] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [matchError, setMatchError] = useState('');
  const navigate = useNavigate();

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const handleConfirmPasswordChange = (e) => {
    setConfirmPassword(e.target.value);
    if (newPassword !== e.target.value) {
      setMatchError('Passwords do not match');
    } else {
      setMatchError('');
    }
  };

  const confirm = () => {
    message.success('Update done.');
    // Clear all text fields
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
  };

  const handleUpdatePassword = async () => {
    if (!matchError && newPassword && confirmPassword) {
      const updatePasswordRequest = {
        email: localStorage.getItem('userEmail'),
        current_password: currentPassword,
        new_password: newPassword,
      };

      try {
        const response = await fetch('http://localhost:8000/update-password', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(updatePasswordRequest),
        });

        if (response.ok) {
          const data = await response.json();
          confirm();
        } else {
          console.error('Invalid email or password');
        }
      } catch (error) {
        console.error('Error sending message:', error);
      }
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
          <div
            className="bg-blue-900 w-12 h-12 flex items-center justify-center rounded-full"
            style={{ animation: 'pulse 2s infinite' }}
          >
            <SafetyCheckIcon className="text-indigo-50" />
          </div>
        </div>

        <h2>Change Password</h2>

        {/* Current Password Field */}
        <TextField
          id="current-password"
          type={showPassword ? 'text' : 'password'}
          label="Current Password"
          placeholder="#$13?24%^@6"
          value={currentPassword}
          onChange={(e) => setCurrentPassword(e.target.value)}
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
                  style={{ cursor: 'pointer' }}
                >
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            ),
          }}
        />

        {/* New Password Field */}
        <TextField
          id="new-password"
          type={showPassword ? 'text' : 'password'}
          label="New Password"
          placeholder="#$13?24%^@6"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
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

        {/* Confirm Password Field */}
        <TextField
          id="confirm-password"
          type={showPassword ? 'text' : 'password'}
          label="Confirm Password"
          placeholder="#$13?24%^@6"
          value={confirmPassword}
          onChange={(e) => handleConfirmPasswordChange(e)}
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
          error={!!matchError}
          helperText={matchError}
        />

        <Stack spacing={2} direction="row">
          <Button
            variant="contained"
            onClick={handleUpdatePassword}
            startIcon={<LockResetIcon />}
            className="w-80 bg-cyan-500"
          >
            Update
          </Button>
        </Stack>
      </Box>
    </div>
  );
}
