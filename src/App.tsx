import './App.css';
import { Route, Routes } from 'react-router-dom';
import LoginForm from './login/LoginForm';
import DashBoard from './Dashboard/DashBoard';
import NotFound from './notFound/NotFound';
import DriverRequests from './pages/DriverRequests/DriverRequests';
import RescuerRequests from './pages/RescuerRequests/RescuerRequests';
import ProtectedRoute from './components/ProtectedRoute';
import DashboardView from './pages/view/view';
import DriverDetail from './pages/DriverDetail/DriverDetail';
import RescuerDetail from './pages/RescuerDetail/RescuerDetail';
import Drivers from './Drivers/drivers';
import Rescures from './Rescuers/rescures';
import SettingsPage from './Settings/settings';
import { ThemeProvider } from '@emotion/react';
import { createTheme, CssBaseline } from '@mui/material';
import React from 'react';
import DashboardLayout from './components/layout/DashboardLayout';
import { ThemeToggleContext } from './ThemeToggleContext';
import Reports from './pages/Reports/Reports';
import AllRequestsPage from './Requests/Requests';

function App() {
  const [darkMode, setDarkMode] = React.useState(() => {
    const storedTheme = localStorage.getItem("theme");
    return storedTheme === "dark";
  });

  const toggleDarkMode = () => {
    setDarkMode((prev) => {
      const newMode = !prev;
      localStorage.setItem("theme", newMode ? "dark" : "light");
      return newMode;
    });
  };

  const theme = React.useMemo(
    () =>
      createTheme({
        palette: {
          mode: darkMode ? "dark" : "light",
          primary: { main: "#0F3460" },
          background: {
            default: darkMode ? "#1A1A2E" : "#f2f6fc",
            paper: darkMode ? "#23243a" : "#fff",
          },
        },
      }), [darkMode]);


  return (
    <ThemeToggleContext.Provider value={{ darkMode, toggleDarkMode }}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Routes>
          <Route path="/" element={<LoginForm />} />
          <Route element={<ProtectedRoute />}>
            <Route path="/dashboard" element={<DashBoard />}>
              <Route element={<DashboardLayout />}>
                <Route index element={<DashboardView />} />
                <Route path="driver-requests" element={<DriverRequests />} />
                <Route path="driver/:id" element={<DriverDetail />} />
                <Route path="rescuer-requests" element={<RescuerRequests />} />
                <Route path="rescuer/:id" element={<RescuerDetail />} />
                <Route path="drivers" element={<Drivers />} />
                <Route path="rescuers" element={<Rescures />} />
                <Route path="settings" element={<SettingsPage />} />
                <Route path="reports" element={<Reports />} />
                <Route path="allrequests" element={<AllRequestsPage />} />

              </Route>
            </Route>
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </ThemeProvider>
    </ThemeToggleContext.Provider>
  );
}

export default App;
