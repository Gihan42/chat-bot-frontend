import React, { useState, useEffect } from 'react';
import Avatar from '@mui/material/Avatar';
import Stack from '@mui/material/Stack';
import { cyan } from '@mui/material/colors';
import LoginPage from '../LoginPage/LoginPage';
import './LoadingPage.css';

export default function LoadingPage() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-indigo-950">
      {isLoading ? (
        <>
          <Stack direction="row" spacing={2} className="mb-4">
            {['C', 'H', 'A', 'T', 'B', 'O', 'T'].map((letter, index) => (
              <Avatar
                key={letter}
                sx={{ bgcolor: cyan[500] }}
                className={`avatar-bounce avatar-${index}`}
                alt={letter}
                src={`/static/images/avatar/${(index % 3) + 1}.jpg`}
              />
            ))}
          </Stack>
          
        </>
      ) : (
        <LoginPage />
      )}
    </div>
  );
}
