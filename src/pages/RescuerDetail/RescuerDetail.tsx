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
  Alert,
  Button,
  Stack,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Avatar,
  Divider,
  Chip,
  Paper,
  alpha,
  useTheme
} from '@mui/material';
import {
  Delete as DeleteIcon,
  Check as ApproveIcon,
  Close as RejectIcon,
  Warning as IncompleteIcon,
  Image as ImageIcon,
  ArrowBack as BackIcon,
  Expand as ExpandIcon,
  CheckCircle as CheckCircleIcon
} from '@mui/icons-material';

const RescuerDetail = () => {
  const theme = useTheme();
  const { id } = useParams();
  const navigate = useNavigate();
  const [rescuer, setRescuer] = useState<any>(null);
  const [message, setMessage] = useState<{ type: 'success' | 'error' | 'info'; text: string } | null>(null);
  const [rejectionDialogOpen, setRejectionDialogOpen] = useState(false);
  const [rejectionFeedback, setRejectionFeedback] = useState('');
  const [imageRejection, setImageRejection] = useState<{ [key: string]: { reason: string; dialogOpen: boolean } }>({});
  const [expandedImage, setExpandedImage] = useState<{ url: string; label: string } | null>(null);
  const [approvedImages, setApprovedImages] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const fetchRescuer = async () => {
      if (!id) return;
      try {
        const docRef = doc(db, 'users', id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          setRescuer(data);
          setApprovedImages(data.approvedImages || {});
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
      setRejectionDialogOpen(false);
      setRejectionFeedback('');
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to update status.' });
    }
  };

  const handleImageApproval = async (key: string) => {
    if (!id) return;
    try {
      await updateDoc(doc(db, 'users', id), {
        [`approvedImages.${key}`]: true
      });
      setApprovedImages(prev => ({ ...prev, [key]: true }));
      setMessage({ type: 'success', text: `Approved ${key} image.` });
    } catch (error) {
      setMessage({ type: 'error', text: `Failed to approve image.` });
    }
  };

  const handleImageRejection = async (key: string) => {
    if (!id || !imageRejection[key]?.reason) return;
    try {
      await updateDoc(doc(db, 'users', id), {
        [`rejectedImages.${key}`]: imageRejection[key].reason,
        [`approvedImages.${key}`]: false
      });
      setApprovedImages(prev => ({ ...prev, [key]: false }));
      setMessage({ type: 'success', text: `Rejected ${key} image.` });
      setImageRejection(prev => ({ ...prev, [key]: { ...prev[key], dialogOpen: false } }));
    } catch (error) {
      setMessage({ type: 'error', text: `Failed to reject image.` });
    }
  };

  if (!rescuer) return (
    <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
      <Typography variant="h6">Loading rescuer details...</Typography>
    </Box>
  );

  const docFields = [
    { label: 'Driving Licence (Front)', url: rescuer.driverLicenceFrontUrl, key: 'driverLicenceFrontUrl' },
    { label: 'Driving Licence (Back)', url: rescuer.driverLicenceBackUrl, key: 'driverLicenceBackUrl' },
    { label: 'Vehicle Licence (Front)', url: rescuer.vehicleLicenceFrontUrl, key: 'vehicleLicenceFrontUrl' },
    { label: 'Vehicle Licence (Back)', url: rescuer.vehicleLicenceBackUrl, key: 'vehicleLicenceBackUrl' }
  ];

function handleDelete(event: React.MouseEvent<HTMLButtonElement>, rescuerId: string): void {
  event.stopPropagation(); // prevent propagation if used inside a card or list

  const confirmDelete = window.confirm('Are you sure you want to delete this rescuer?');

  if (!confirmDelete) return;

  deleteDoc(doc(db, 'users', rescuerId))
    .then(() => {
      alert('Rescuer deleted successfully.');
      // Optionally refresh or remove from UI here
    })
    .catch((error) => {
      console.error('Error deleting rescuer:', error);
      alert('Failed to delete rescuer.');
    });
}

  return (
    <Box sx={{ p: 3, maxWidth: '1400px', mx: 'auto' }}>
      <Button
        startIcon={<BackIcon />}
        onClick={() => navigate(-1)}
        sx={{ 
          mb: 3,
          borderRadius: '12px',
          px: 3,
          textTransform: 'none',
          fontWeight: 600
        }}
      >
        Back to Rescuers
      </Button>

      {message && (
        <Alert 
          severity={message.type} 
          sx={{ 
            mb: 3,
            borderRadius: '12px',
            boxShadow: theme.shadows[1]
          }}
        >
          {message.text}
        </Alert>
      )}

      {/* Rescuer Profile Section */}
      <Paper elevation={0} sx={{ 
        p: 4, 
        mb: 4, 
        borderRadius: '16px',
        background: theme.palette.background.paper,
        boxShadow: theme.shadows[2]
      }}>
        <Box display="flex" alignItems="center" mb={4}>
          <Avatar sx={{ 
            width: 80, 
            height: 80, 
            mr: 3,
            fontSize: '2rem',
            bgcolor: theme.palette.primary.main
          }}>
            {rescuer.fName?.charAt(0)}{rescuer.lName?.charAt(0)}
          </Avatar>
          <Box>
            <Typography variant="h4" component="h1" fontWeight="700">
              {rescuer.fName} {rescuer.lName}
            </Typography>
            <Typography variant="subtitle1" color="text.secondary">
              Rescuer Profile
            </Typography>
          </Box>
        </Box>

        <Grid container spacing={3} mb={3}>
          <Grid item xs={12} md={6}>
            <Card variant="outlined" sx={{ 
              p: 3,
              borderRadius: '12px',
              borderColor: alpha(theme.palette.divider, 0.2)
            }}>
              <Typography variant="subtitle2" color="text.secondary" gutterBottom sx={{ fontWeight: 600 }}>
                Contact Information
              </Typography>
              <Stack spacing={1.5}>
                <Box>
                  <Typography variant="caption" color="text.secondary">Email</Typography>
                  <Typography sx={{ fontWeight: 500 }}>{rescuer.email}</Typography>
                </Box>
                <Box>
                  <Typography variant="caption" color="text.secondary">Phone</Typography>
                  <Typography sx={{ fontWeight: 500 }}>{rescuer.phone}</Typography>
                </Box>
              </Stack>
            </Card>
          </Grid>
          <Grid item xs={12} md={6}>
            <Card variant="outlined" sx={{ 
              p: 3,
              borderRadius: '12px',
              borderColor: alpha(theme.palette.divider, 0.2)
            }}>
              <Typography variant="subtitle2" color="text.secondary" gutterBottom sx={{ fontWeight: 600 }}>
                Application Status
              </Typography>
              <Chip
                label={rescuer.status === 1 ? 'Approved' : rescuer.status === -1 ? 'Rejected' : 'Pending'}
                color={
                  rescuer.status === 1 ? 'success' : 
                  rescuer.status === -1 ? 'error' : 'warning'
                }
                sx={{ fontWeight: 600 }}
              />
            </Card>
          </Grid>
        </Grid>

        <Divider sx={{ my: 3, borderColor: alpha(theme.palette.divider, 0.1) }} />

        {/* Action Buttons */}
        <Stack direction="row" spacing={2} justifyContent="flex-end">
          <Button
            variant="contained"
            color="success"
            startIcon={<ApproveIcon />}
            onClick={() => handleStatusChange(1)}
            sx={{
              borderRadius: '12px',
              px: 3,
              textTransform: 'none',
              fontWeight: 600
            }}
          >
            Approve
          </Button>
          <Button
            variant="contained"
            color="warning"
            startIcon={<IncompleteIcon />}
            onClick={() => handleStatusChange(-2)}
            sx={{
              borderRadius: '12px',
              px: 3,
              textTransform: 'none',
              fontWeight: 600
            }}
          >
         Incomplete
          </Button>
          <Button
            variant="contained"
            color="error"
            startIcon={<RejectIcon />}
            onClick={() => setRejectionDialogOpen(true)}
            sx={{
              borderRadius: '12px',
              px: 3,
              textTransform: 'none',
              fontWeight: 600
            }}
          >
            Reject 
          </Button>
          <IconButton 
            onClick={handleDelete}
            sx={{
              backgroundColor: alpha(theme.palette.error.main, 0.1),
              '&:hover': {
                backgroundColor: alpha(theme.palette.error.main, 0.2)
              }
            }}
          >
            <DeleteIcon color="error" />
          </IconButton>
        </Stack>
      </Paper>

      {/* Documents Section */}
      <Typography variant="h5" gutterBottom sx={{ 
        mb: 3,
        fontWeight: 700
      }}>
        Vehicle Documents
      </Typography>

      <Grid container spacing={3}>
        {docFields.map(({ label, url, key }) => (
          <Grid item xs={12} sm={6} md={3} key={key}>
            <Card 
              elevation={0}
              sx={{ 
                height: '100%', 
                display: 'flex', 
                flexDirection: 'column',
                borderRadius: '16px',
                border: approvedImages[key] 
                  ? `2px solid ${theme.palette.success.main}`
                  : `1px solid ${alpha(theme.palette.divider, 0.2)}`,
                overflow: 'hidden',
                position: 'relative'
              }}
            >
              {approvedImages[key] && (
                <Box
                  sx={{
                    position: 'absolute',
                    top: 8,
                    right: 8,
                    zIndex: 1,
                    bgcolor: theme.palette.success.main,
                    color: theme.palette.success.contrastText,
                    borderRadius: '50%',
                    p: 0.5
                  }}
                >
                  <CheckCircleIcon fontSize="small" />
                </Box>
              )}
              
              <Box sx={{ p: 2, flexGrow: 1 }}>
                <Typography 
                  variant="subtitle1" 
                  align="center" 
                  sx={{ 
                    mb: 2,
                    fontWeight: 600
                  }}
                >
                  {label}
                </Typography>
                {url ? (
                  <CardMedia
                    component="img"
                    sx={{ 
                      height: 180,
                      cursor: 'pointer',
                      borderRadius: '8px',
                      objectFit: 'cover',
                      transition: 'transform 0.3s ease',
                      '&:hover': {
                        transform: 'scale(1.03)'
                      }
                    }}
                    image={url}
                    alt={label}
                    onClick={() => setExpandedImage({ url, label })}
                  />
                ) : (
                  <Box
                    sx={{
                      height: 180,
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      bgcolor: alpha(theme.palette.grey[100], 0.5),
                      borderRadius: '8px',
                      border: `1px dashed ${theme.palette.divider}`
                    }}
                  >
                    <ImageIcon sx={{ fontSize: 48, color: 'grey.400', mb: 1 }} />
                    <Typography color="text.secondary">Image not available</Typography>
                  </Box>
                )}
              </Box>
              
              {url && !approvedImages[key] && (
                <Box sx={{ 
                  p: 2, 
                  borderTop: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                  bgcolor: alpha(theme.palette.background.default, 0.6)
                }}>
                  <Stack direction="row" spacing={1.5} justifyContent="space-between">
                    <Button
                      size="small"
                      variant="contained"
                      color="success"
                      startIcon={<ApproveIcon />}
                      onClick={() => handleImageApproval(key)}
                      sx={{
                        borderRadius: '8px',
                        flex: 1,
                        textTransform: 'none',
                        fontWeight: 500
                      }}
                    >
                      Approve
                    </Button>
                    <Button
                      size="small"
                      variant="outlined"
                      color="error"
                      startIcon={<RejectIcon />}
                      onClick={() => setImageRejection(prev => ({
                        ...prev,
                        [key]: { ...prev[key], dialogOpen: true }
                      }))}
                      sx={{
                        borderRadius: '8px',
                        flex: 1,
                        textTransform: 'none',
                        fontWeight: 500
                      }}
                    >
                      Reject
                    </Button>
                  </Stack>
                </Box>
              )}
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Dialogs remain the same */}
      {/* ... */}
    </Box>
  );
};

export default RescuerDetail;