import React, { useState } from 'react';
import { Box } from '@mui/material';
import NavBar from '../components/navBar';
import Sidebar from '../components/sideBar';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';


const DashBoard: React.FC = () => {
  const [drawerOpen, setDrawerOpen] = useState<boolean>(false);
  const toggleDrawer = () => setDrawerOpen(prev => !prev);
  const navigate = useNavigate();
  const location = useLocation();

  const handleNavigate = (path: string) => navigate(path);
  const handleClose = () => setDrawerOpen(false);

  return (
    <Box sx={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <NavBar onMenuToggle={toggleDrawer} />
      <Sidebar
        open={drawerOpen}
        onClose={handleClose}
        onNavigate={handleNavigate}
        currentPath={location.pathname}
      />
      <Outlet />
    </Box>
  );
};

export default DashBoard;
