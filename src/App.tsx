
import './App.css'
import LoginForm from './login/LoginForm'
import DashBoard from './Dashboard/DashBoard'
import NotFound from './notFound/NotFound'
import { Route, Routes } from 'react-router-dom'
import ProtectedRoute from './components/ProtectedRoute'
import Drivers from './Drivers/drivers'
import Rescures from './Rescuers/rescures'
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import React from 'react';
import SettingsPage from './Settings/settings'

function App() {
  const [darkMode, setDarkMode] = React.useState(false);
  const toggleDarkMode = () => setDarkMode((prev) => !prev);

  const theme = React.useMemo(() => createTheme({
    palette: {
      mode: darkMode ? 'dark' : 'light',
      primary: { main: '#0F3460' },
      background: {
        default: darkMode ? '#1A1A2E' : '#f2f6fc',
        paper: darkMode ? '#23243a' : '#fff',
      },
    },
  }), [darkMode]);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Routes>
        <Route path="/" element={<LoginForm />} />

        <Route element={<ProtectedRoute />}>

          <Route path="/dashboard" element={<DashBoard />} >

            <Route path="" element={null} />
            <Route path="driver-requests" element={<div>Driver Requests</div>} />
            <Route path="rescuer-requests" element={<div>Rescuer Requests</div>} />
            <Route path="drivers" element={<Drivers toggleDarkMode={toggleDarkMode} />} />
            <Route path="rescuers" element={<Rescures toggleDarkMode={toggleDarkMode} />} />
            <Route path="settings" element={<SettingsPage toggleDarkMode={toggleDarkMode} />} />


          </Route>
        </Route>

        <Route path="*" element={<NotFound />} />
      </Routes>

    </ThemeProvider>
  )
}

export default App
