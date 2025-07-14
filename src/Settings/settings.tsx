import React, { useState, useEffect } from 'react';
import { Box, Typography, Paper, Switch, FormControlLabel, Divider, Avatar } from '@mui/material';
import { useTheme, ThemeProvider, createTheme } from '@mui/material/styles';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../firebase';

const lightTheme = createTheme({
  palette: {
    mode: 'light',
    primary: { main: '#0F3460' },
    background: { default: '#fafafa', paper: '#fff' },
  },
});

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: { main: '#0F3460' },
    background: { default: '#1A1A2E', paper: '#23243a' },
  },
});

const SettingsPage: React.FC = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [userEmail, setUserEmail] = useState('Loading...');

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserEmail(user.email || 'No Email');
      } else {
        setUserEmail('Unknown');
      }
    });
    return () => unsubscribe();
  }, []);

  const handleThemeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setDarkMode(event.target.checked);
  };

  return (
    <ThemeProvider theme={darkMode ? darkTheme : lightTheme}>
      <Box sx={{ maxWidth: 600, mx: 'auto', mt: 8, p: 3 }}>
        <Paper sx={{ p: 4, borderRadius: 3, boxShadow: 2 }}>
          <Typography variant="h4" sx={{ mb: 2, color: 'primary.main' }}>
            Settings
          </Typography>
          <Divider sx={{ mb: 3 }} />

          <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
            <Avatar sx={{ bgcolor: 'primary.main', mr: 2 }}>
              {userEmail && userEmail[0] ? userEmail[0].toUpperCase() : '?'}
            </Avatar>
            <Box>
              <Typography variant="subtitle1">{userEmail}</Typography>
              <Typography variant="body2" color="text.secondary">
                Admin
              </Typography>
            </Box>
          </Box>

          <Divider sx={{ mb: 3 }} />

          <FormControlLabel
            control={<Switch checked={darkMode} onChange={handleThemeChange} color="primary" />}
            label="Dark Mode"
          />
        </Paper>
      </Box>
    </ThemeProvider>
  );
};

export default SettingsPage;
