import React, { useState } from 'react';
import type { SyntheticEvent } from 'react';
import {
  AppBar,
  Box,
  Button,
  CssBaseline,
  Drawer,
  IconButton,
  MenuItem,
  Modal,
  Select,
  Snackbar,
  Tab,
  Tabs,
  TextField,
  Toolbar,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from '@mui/material';
import type { SelectChangeEvent } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';

interface Toast {
  title: string;
  message: string;
}

const DashBoard: React.FC = () => {
  const [tabIndex, setTabIndex] = useState<number>(0);
  const [drawerOpen, setDrawerOpen] = useState<boolean>(false);
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [deleteOpen, setDeleteOpen] = useState<boolean>(false);
  const [toast, setToast] = useState<Toast | null>(null);
  const [category, setCategory] = useState<string>('');

  const handleTabChange = (_event: SyntheticEvent, newValue: number) => {
    setTabIndex(newValue);
  };

  const handleCategoryChange = (event: SelectChangeEvent) => {
    setCategory(event.target.value);
  };

  return (
    <>
      <CssBaseline />
      <AppBar
        position="fixed"
        sx={{
          zIndex: 1201,
          bgcolor: '#1A1A2E',
          color: '#FFFFFF',
        }}
      >
        <Toolbar sx={{ justifyContent: 'space-between' }}>
          <Box display="flex" alignItems="center">
            <IconButton color="inherit" onClick={() => setDrawerOpen(true)}>
              <MenuIcon />
            </IconButton>
            <Typography variant="h6" ml={1}>RushRescue</Typography>
          </Box>
          <Box display="flex" alignItems="center" gap={2}>
            <Typography>Admin</Typography>
            <Button variant="outlined" sx={{ color: '#FFFFFF', borderColor: '#FFFFFF' }}>
              Logout
            </Button>
          </Box>
        </Toolbar>
      </AppBar>

      <Drawer anchor="left" open={drawerOpen} onClose={() => setDrawerOpen(false)}>
        <Box sx={{ width: 250, p: 2 }}>
          <Typography variant="h6" mb={2}>Menu</Typography>
          <Button fullWidth onClick={() => setTabIndex(0)}>Dashboard</Button>
        </Box>
      </Drawer>

      <Box sx={{ mt: 10, px: 3, width: '100%' }}>
        <Typography variant="h4" gutterBottom>Admin Dashboard</Typography>
        <Typography variant="body1" color="text.secondary" gutterBottom>
          Manage Requests and more
        </Typography>

        <Tabs
          value={tabIndex}
          onChange={handleTabChange}
          sx={{
            mb: 3,
            '& .MuiTab-root': { color: '#0F3460' },
            '& .Mui-selected': { fontWeight: 'bold' },
            '& .MuiTabs-indicator': { backgroundColor: '#0F3460' }
          }}
        >
          <Tab label="Driver" />
          <Tab label="Rescuer" />
        </Tabs>

        {tabIndex === 0 && (
          <>
            <Typography variant="h5" gutterBottom>Driver Requests</Typography>
            <TableContainer component={Paper} elevation={3} sx={{ borderRadius: 2 }}>
              <Table>
                <TableHead sx={{ backgroundColor: '#f5f5f5' }}>
                  <TableRow>
                    {['Name', 'Email', 'Phone', 'Driver_Id', 'Actions'].map((text, i) => (
                      <TableCell key={i} align="center" sx={{ fontWeight: 'bold' }}>{text}</TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {[
                    ['Ahmed Mohamed', 'Ahmed@gmail.com', '+20100888764', '2563789687654'],
                    ['Mohamed Ahmed', 'Mohamed@gmail.com', '+20100888764', '2563789687654'],
                    ['Mohamed Ahmed', 'Mohamed@gmail.com', '+20100888764', '2563789687654'],
                  ].map(([name, email, phone, id], i) => (
                    <TableRow key={i} hover>
                      <TableCell align="center">{name}</TableCell>
                      <TableCell align="center">{email}</TableCell>
                      <TableCell align="center">{phone}</TableCell>
                      <TableCell align="center">{id}</TableCell>
                      <TableCell align="center">
                        <Button variant="contained" color="success" size="small" sx={{ mr: 1 }}>Accept</Button>
                        <Button variant="contained" color="error" size="small">Reject</Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </>
        )}

        {tabIndex === 1 && (
          <>
            <Typography variant="h5" gutterBottom>Rescuer Requests</Typography>
            <TableContainer component={Paper} elevation={3} sx={{ borderRadius: 2 }}>
              <Table>
                <TableHead sx={{ backgroundColor: '#f5f5f5' }}>
                  <TableRow>
                    {['Name', 'Email', 'Phone', 'Rescuer_Id', 'Actions'].map((text, i) => (
                      <TableCell key={i} align="center" sx={{ fontWeight: 'bold' }}>{text}</TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {Array(3).fill(null).map((_, i) => (
                    <TableRow key={i} hover>
                      <TableCell align="center">Joliy Emam</TableCell>
                      <TableCell align="center">Joliy@gmail.com</TableCell>
                      <TableCell align="center">+987654321</TableCell>
                      <TableCell align="center">2563789687654</TableCell>
                      <TableCell align="center">
                        <Button variant="contained" color="success" size="small" sx={{ mr: 1 }}>Accept</Button>
                        <Button variant="contained" color="error" size="small">Reject</Button>
                      </TableCell>
                    </TableRow>
                    
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </>
        )}
      </Box>
    </>
  );
};

export default DashBoard;
