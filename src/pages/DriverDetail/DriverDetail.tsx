import { useParams, useNavigate } from 'react-router-dom';
import { doc, getDoc, deleteDoc, updateDoc } from 'firebase/firestore';
import { db } from '../../firebase';
import { useEffect, useState } from 'react';
import {
  Box, Typography, Card, CardContent, CardMedia, IconButton,
  Grid, Alert, Button, Stack
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';

const DriverDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [driver, setDriver] = useState<any>(null);
  const [message, setMessage] = useState<{ type: 'success' | 'error' | 'info'; text: string } | null>(null);

  useEffect(() => {
    const fetchDriver = async () => {
      if (!id) return;
      try {
        const docRef = doc(db, 'users', id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setDriver(docSnap.data());
        } else {
          setMessage({ type: 'error', text: 'Driver not found.' });
        }
      } catch (error) {
        console.error('Error fetching driver:', error);
        setMessage({ type: 'error', text: 'Error fetching driver data.' });
      }
    };
    fetchDriver();
  }, [id]);

  const handleStatusChange = async (status: number) => {
    if (!id) return;
    try {
      await updateDoc(doc(db, 'users', id), { status });
      setMessage({ type: 'success', text: 'Status updated successfully.' });
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to update status.' });
    }
  };

  const handleDelete = async () => {
    if (!id) return;
    try {
      await deleteDoc(doc(db, 'users', id));
      setMessage({ type: 'success', text: 'Driver deleted successfully.' });
      setTimeout(() => navigate('/dashboard/driver-requests'), 1500);
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to delete driver.' });
    }
  };

  if (!driver) return <Typography>Loading...</Typography>;

  return (
    <Box>
      <Typography variant="h4" gutterBottom>Driver Details</Typography>

      {message && <Alert severity={message.type} sx={{ mb: 2 }}>{message.text}</Alert>}

      <Card sx={{ p: 3, mb: 4 }}>
        <CardContent>
          <Typography variant="h6">Name: {driver.fName} {driver.lName}</Typography>
          <Typography>Email: {driver.email}</Typography>
          <Typography>Phone: {driver.phone}</Typography>
        </CardContent>

        <Stack direction="row" spacing={1} justifyContent="flex-end" sx={{ pr: 2, pb: 2 }}>
          <Button variant="contained" color="success" onClick={() => handleStatusChange(1)}>Accept</Button>
          <Button variant="contained" color="warning" onClick={() => handleStatusChange(-2)}>Incomplete</Button>
          <Button variant="contained" color="error" onClick={() => handleStatusChange(-1)}>Reject</Button>
          <IconButton color="error" onClick={handleDelete}>
            <DeleteIcon />
          </IconButton>
        </Stack>
      </Card>

      <Typography variant="h6" gutterBottom>Driver Documents</Typography>
      <Grid container spacing={2}>
        {[
          { label: 'Driving Licence (Front)', url: driver.drivingLicenceFrontUrl },
          { label: 'Driving Licence (Back)', url: driver.drivingLicenceBackUrl },
          { label: 'Car Licence (Front)', url: driver.carLicenceFrontUrl },
          { label: 'Car Licence (Back)', url: driver.carLicenceBackUrl }
        ].map(({ label, url }, i) => (
          <Grid item xs={12} sm={6} md={3} key={i}>
            <Card>
              <Typography variant="subtitle2" align="center" sx={{ mt: 1 }}>{label}</Typography>
              {url ? (
                <CardMedia component="img" height="140" image={url} alt={label} />
              ) : (
                <Typography align="center" sx={{ p: 2 }}>Image not available</Typography>
              )}
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default DriverDetail;
