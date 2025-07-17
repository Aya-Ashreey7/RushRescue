import { useParams, useNavigate } from 'react-router-dom';
import { doc, getDoc, deleteDoc, updateDoc } from 'firebase/firestore';
import { db } from '../../firebase';
import { useEffect, useState } from 'react';
import {
  Box, Typography, Card, CardContent, CardMedia, IconButton,
  Grid, Alert, Button, Stack, TextField
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';

const RescuerDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [rescuer, setRescuer] = useState<any>(null);
  const [message, setMessage] = useState<{ type: 'success' | 'error' | 'info'; text: string } | null>(null);
  const [showRejectionInput, setShowRejectionInput] = useState(false);
  const [rejectionFeedback, setRejectionFeedback] = useState('');
  const [imageRejection, setImageRejection] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    const fetchRescuer = async () => {
      if (!id) return;
      try {
        const docRef = doc(db, 'users', id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setRescuer(docSnap.data());
        } else {
          setMessage({ type: 'error', text: 'Rescuer not found.' });
        }
      } catch (error) {
        console.error('Error fetching rescuer:', error);
        setMessage({ type: 'error', text: 'Error fetching rescuer data.' });
      }
    };
    fetchRescuer();
  }, [id]);

  const handleStatusChange = async (status: number) => {
    if (!id) return;
    try {
      const updateData: any = { status };
      if (status === -1 && rejectionFeedback.trim()) {
        updateData.rejectedReason = rejectionFeedback.trim();
      }
      await updateDoc(doc(db, 'users', id), updateData);
      setMessage({ type: 'success', text: 'Status updated successfully.' });
      setShowRejectionInput(false);
      setRejectionFeedback('');
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to update status.' });
    }
  };

  const handleDelete = async () => {
    if (!id) return;
    try {
      await deleteDoc(doc(db, 'users', id));
      setMessage({ type: 'success', text: 'Rescuer deleted successfully.' });
      setTimeout(() => navigate('/dashboard/rescuer-requests'), 1500);
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to delete rescuer.' });
    }
  };

  const handleImageRejection = async (key: string) => {
    if (!id || !imageRejection[key]) return;
    try {
      await updateDoc(doc(db, 'users', id), {
        [`rejectedImages.${key}`]: imageRejection[key]
      });
      setMessage({ type: 'success', text: `Rejected ${key} image.` });
    } catch (error) {
      setMessage({ type: 'error', text: `Failed to reject image.` });
    }
  };

  if (!rescuer) return <Typography>Loading...</Typography>;

  const docFields = [
   { label: 'Driving Licence (Front)', url: rescuer.driverLicenceFrontUrl, key: 'driverLicenceFrontUrl' },
  { label: 'Driving Licence (Back)', url: rescuer.driverLicenceBackUrl, key: 'driverLicenceBackUrl' },
  { label: 'Vehicle Licence (Front)', url: rescuer.vehicleLicenceFrontUrl, key: 'vehicleLicenceFrontUrl' },
  { label: 'Vehicle Licence (Back)', url: rescuer.vehicleLicenceBackUrl, key: 'vehicleLicenceBackUrl' }
  ];

  return (
    <Box>
      <Typography variant="h4" gutterBottom>Rescuer Details</Typography>

      {message && <Alert severity={message.type} sx={{ mb: 2 }}>{message.text}</Alert>}

      <Card sx={{ p: 3, mb: 4 }}>
        <CardContent>
          <Typography variant="h6">Name: {rescuer.fName} {rescuer.lName}</Typography>
          <Typography>Email: {rescuer.email}</Typography>
          <Typography>Phone: {rescuer.phone}</Typography>
        </CardContent>

        <Stack direction="row" spacing={1} justifyContent="flex-end" sx={{ pr: 2, pb: 2 }}>
          <Button variant="contained" color="success" onClick={() => handleStatusChange(1)}>Accept</Button>
          <Button variant="contained" color="warning" onClick={() => handleStatusChange(-2)}>Incomplete</Button>
          <Button variant="contained" color="error" onClick={() => setShowRejectionInput(true)}>Reject</Button>
          <IconButton color="error" onClick={handleDelete}>
            <DeleteIcon />
          </IconButton>
        </Stack>

        {showRejectionInput && (
          <Box sx={{ mt: 2 }}>
            <TextField
              fullWidth
              multiline
              rows={3}
              label="Rejection Feedback"
              variant="outlined"
              value={rejectionFeedback}
              onChange={(e) => setRejectionFeedback(e.target.value)}
              sx={{ mb: 2 }}
            />
            <Button
              variant="contained"
              color="error"
              onClick={() => handleStatusChange(-1)}
              disabled={!rejectionFeedback.trim()}
            >
              Submit Rejection
            </Button>
          </Box>
        )}
      </Card>

      <Typography variant="h6" gutterBottom>Vehicle Documents</Typography>
      <Grid container spacing={2}>
        {docFields.map(({ label, url, key }, i) => (
          <Grid item xs={12} sm={6} md={3} key={i}>
            <Card sx={{ p: 1 }}>
              <Typography variant="subtitle2" align="center" sx={{ mt: 1 }}>{label}</Typography>
              {url ? (
                <CardMedia component="img" height="140" image={url} alt={label} />
              ) : (
                <Typography align="center" sx={{ p: 2 }}>Image not available</Typography>
              )}
              {url && (
                <Box sx={{ mt: 1 }}>
                  <TextField
                    fullWidth
                    size="small"
                    label="Reject reason"
                    value={imageRejection[key] || ''}
                    onChange={(e) => setImageRejection({ ...imageRejection, [key]: e.target.value })}
                  />
                  <Button
                    fullWidth
                    variant="outlined"
                    color="error"
                    sx={{ mt: 1 }}
                    onClick={() => handleImageRejection(key)}
                    disabled={!imageRejection[key]}
                  >
                    Reject Image
                  </Button>
                </Box>
              )}
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default RescuerDetail;
