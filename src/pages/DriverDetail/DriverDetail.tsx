import { useParams, useNavigate } from 'react-router-dom';
import { doc, getDoc, deleteDoc, updateDoc } from 'firebase/firestore';
import { db } from '../../firebase';
import { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  CardMedia,
  IconButton,
  Grid,
  Alert
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import DeleteIcon from '@mui/icons-material/Delete';

const DriverDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [driver, setDriver] = useState<any>(null);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

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
        setMessage({ type: 'error', text: 'Error fetching driver data.' });
        console.error(error);
      }
    };
    fetchDriver();
  }, [id]);

  const handleDelete = async () => {
    if (!id) return;
    try {
      await deleteDoc(doc(db, 'users', id));
      setMessage({ type: 'success', text: 'Driver successfully deleted.' });
      setTimeout(() => navigate('/dashboard/driver-requests'), 1500);
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to delete driver.' });
      console.error(error);
    }
  };

  const handleAccept = async () => {
    if (!id) return;
    try {
      await updateDoc(doc(db, 'users', id), { status: 'approved' });
      setMessage({ type: 'success', text: 'Driver accepted and marked as approved.' });
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to approve driver.' });
      console.error(error);
    }
  };

  if (!driver) return <Typography>Loading...</Typography>;

  return (
    <Box>
      <Typography variant="h4" gutterBottom>Driver Details</Typography>

      {message && (
        <Card sx={{ backgroundColor: message.type === 'success' ? 'success.light' : 'error.light', mb: 2 }}>
          <CardContent>
            <Typography sx={{ color: message.type === 'success' ? 'success.main' : 'error.main' }}>
              {message.text}
            </Typography>
          </CardContent>
        </Card>
      )}

      <Card sx={{ p: 3, mb: 4 }}>
        <CardContent>
          <Typography variant="h6">Name: {driver.fName} {driver.lName}</Typography>
          <Typography variant="body1">Email: {driver.email}</Typography>
          <Typography variant="body1">Phone: {driver.phone}</Typography>
        </CardContent>

        <Box sx={{ display: 'flex', justifyContent: 'flex-end', pr: 2, pb: 2 }}>
          <IconButton color="success" onClick={handleAccept}>
            <CheckCircleIcon />
          </IconButton>
          <IconButton color="error" onClick={handleDelete}>
            <DeleteIcon />
          </IconButton>
        </Box>
      </Card>

      <Typography variant="h6" gutterBottom>Driver Documents</Typography>
      <Grid container spacing={2}>
        {[
          { label: 'Driver Licence (Front)', url: driver.driverLicenceFrontUrl },
          { label: 'Driver Licence (Back)', url: driver.driverLicenceBackUrl },
          { label: 'Vehicle Licence (Front)', url: driver.vehicleLicenceFrontUrl },
          { label: 'Vehicle Licence (Back)', url: driver.vehicleLicenceBackUrl }
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
