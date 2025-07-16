import {
  Box, Paper, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Typography, IconButton, Tabs, Tab, Pagination,
  Snackbar, Alert
} from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import DeleteIcon from '@mui/icons-material/Delete';
import WarningIcon from '@mui/icons-material/Warning';
import { useEffect, useState } from 'react';
import { db } from '../../firebase';
import { collection, getDocs, updateDoc, doc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';

const DriverRequests = () => {
  const [drivers, setDrivers] = useState<any[]>([]);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const navigate = useNavigate();

  const fetchDrivers = async () => {
    const querySnapshot = await getDocs(collection(db, 'users'));
    const filtered = querySnapshot.docs
      .map(doc => ({ id: doc.id, ...(doc.data() as any) }))
      .filter(doc => doc.role === 'driver');
    setDrivers(filtered);
  };

  useEffect(() => {
    fetchDrivers();
  }, []);

  const handleStatusChange = async (id: string, status: number) => {
    try {
      await updateDoc(doc(db, 'users', id), { status });
      setMessage({ type: 'success', text: `Driver status updated.` });
      fetchDrivers();
    } catch {
      setMessage({ type: 'error', text: 'Failed to update status.' });
    }
  };

  return (
    <Box>
      <Typography variant="h5" gutterBottom>Driver Requests</Typography>

      <Box sx={{ display: 'flex', justifyContent: 'space-between', p: 2, bgcolor: '#f9fafe', borderRadius: 2, mb: 2 }}>
        <Tabs value={0}><Tab label="All Requests" /></Tabs>
      </Box>

      {message && (
        <Snackbar open autoHideDuration={3000} onClose={() => setMessage(null)}>
          <Alert severity={message.type}>{message.text}</Alert>
        </Snackbar>
      )}

      <TableContainer component={Paper} elevation={3} sx={{ borderRadius: 2 }}>
        <Table>
          <TableHead sx={{ backgroundColor: '#f5f5f5' }}>
            <TableRow>
              {["#", "Name", "Email", "Phone", "Actions"].map((header, i) => (
                <TableCell key={i} align="center" sx={{ fontWeight: 'bold' }}>{header}</TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {drivers.map((driver, i) => (
              <TableRow key={driver.id} hover>
                <TableCell align="center">{i + 1}</TableCell>
                <TableCell align="center">{driver.fName} {driver.lName}</TableCell>
                <TableCell align="center">{driver.email}</TableCell>
                <TableCell align="center">{driver.phone}</TableCell>
                <TableCell align="center">
                  <IconButton color="primary" onClick={() => navigate(`/dashboard/driver/${driver.id}`)}>
                    <VisibilityIcon />
                  </IconButton>
                  <IconButton color="success" onClick={() => handleStatusChange(driver.id, 1)}>
                    <CheckCircleIcon />
                  </IconButton>
                  <IconButton color="warning" onClick={() => handleStatusChange(driver.id, -2)}>
                    <WarningIcon />
                  </IconButton>
                  <IconButton color="error" onClick={() => handleStatusChange(driver.id, -1)}>
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Box sx={{ mt: 2, display: 'flex', justifyContent: 'space-between' }}>
        <Typography variant="body2">Showing 1 - {drivers.length}</Typography>
        <Pagination count={1} page={1} variant="outlined" shape="rounded" />
      </Box>
    </Box>
  );
};

export default DriverRequests;
