import React, { useState } from 'react';
import {
  Box,
  CssBaseline,
} from '@mui/material';
import NavBar from '../components/navBar';
import Sidebar from '../components/sideBar';
import { useLocation, useNavigate, Outlet } from 'react-router-dom';

const DashBoard: React.FC = () => {
  const [drawerOpen, setDrawerOpen] = useState<boolean>(false);
  const toggleDrawer = () => setDrawerOpen(prev => !prev);
  const navigate = useNavigate();

  const handleNavigate = (path: string) => navigate(path);

  return (
    <>
      <CssBaseline />
      <NavBar onMenuToggle={toggleDrawer} />
      <Sidebar open={drawerOpen} onClose={() => setDrawerOpen(false)} onNavigate={handleNavigate} />

      <Box sx={{ pt: 8, px: 3, width: '100%' }}>
        
        <Outlet />
      </Box>
    </>
  );
};

export default DashBoard;
