import { useParams, useNavigate } from 'react-router-dom';
import { doc, getDoc, deleteDoc, updateDoc } from 'firebase/firestore';
import { db } from '../../firebase';
import { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Card,
  CardMedia,
  Grid,
  Alert,
  Button,
  Stack,
  TextField,
  Avatar,
  Divider,
  Chip,
  Paper,
  alpha,
  useTheme,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  useMediaQuery,
  IconButton
} from '@mui/material';
import {
  Check as ApproveIcon,
  Close as RejectIcon,
  Warning as IncompleteIcon,
  Image as ImageIcon,
  ArrowBack as BackIcon,
  CheckCircle as CheckCircleIcon,
  MoreVert as MoreIcon
} from '@mui/icons-material';

const RescuerDetail = () => {
  const theme = useTheme();
  const { id } = useParams();
  const navigate = useNavigate();
  const [rescuer, setRescuer] = useState<any>(null);
  const [message, setMessage] = useState<{ type: 'success' | 'error' | 'info'; text: string } | null>(null);
  const [rejectionDialogOpen, setRejectionDialogOpen] = useState(false);
  const [rejectionFeedback, setRejectionFeedback] = useState('');
  const isDark = theme.palette.mode === "dark";
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));
  const isMediumScreen = useMediaQuery(theme.breakpoints.down('md'));

  const [imageRejection, setImageRejection] = useState<{ [key: string]: { reason: string; dialogOpen: boolean } }>({});
  const [expandedImage, setExpandedImage] = useState<{ url: string; label: string } | null>(null);
  const [approvedImages, setApprovedImages] = useState<Record<string, boolean>>({});
  const [mobileActionsOpen, setMobileActionsOpen] = useState(false);

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
      setMobileActionsOpen(false);
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

  return (
    <Box sx={{ 
      p: isSmallScreen ? 2 : 3, 
      maxWidth: '1400px', 
      mx: 'auto',
      pb: isSmallScreen ? 7 : 3
    }}>
      <Button
        startIcon={<BackIcon />}
        onClick={() => navigate(-1)}
        sx={{ 
          mb: 3,
          borderRadius: '12px',
          px: 3,
          textTransform: 'none',
          fontWeight: 600,
          backgroundColor: isDark ? "#e5e7eb" : "#f3f4f6",
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
        p: isSmallScreen ? 2 : 4, 
        mb: 4, 
        borderRadius: '16px',
        background: theme.palette.background.paper,
        boxShadow: theme.shadows[2]
      }}>
        <Box display="flex" alignItems="center" mb={4} flexDirection={isSmallScreen ? 'column' : 'row'} textAlign={isSmallScreen ? 'center' : 'left'}>
          <Avatar sx={{ 
            width: isSmallScreen ? 64 : 80, 
            height: isSmallScreen ? 64 : 80, 
            mr: isSmallScreen ? 0 : 3,
            mb: isSmallScreen ? 2 : 0,
            fontSize: isSmallScreen ? '1.5rem' : '2rem',
            bgcolor: theme.palette.primary.main
          }}>
            {rescuer.fName?.charAt(0)}{rescuer.lName?.charAt(0)}
          </Avatar>
          <Box>
            <Typography variant={isSmallScreen ? "h5" : "h4"} component="h1" fontWeight="700">
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
              p: isSmallScreen ? 2 : 3,
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
              p: isSmallScreen ? 2 : 3,
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

        {/* Action Buttons - Desktop */}
        {!isSmallScreen && (
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
          </Stack>
        )}

        {/* Action Buttons - Mobile */}
        {isSmallScreen && (
          <Box sx={{ position: 'relative' }}>
            <IconButton
              sx={{
                position: 'fixed',
                bottom: 80,
                right: 20,
                zIndex: 1000,
                bgcolor: theme.palette.primary.main,
                color: theme.palette.primary.contrastText,
                '&:hover': {
                  bgcolor: theme.palette.primary.dark
                }
              }}
              onClick={() => setMobileActionsOpen(!mobileActionsOpen)}
            >
              <MoreIcon />
            </IconButton>

            {mobileActionsOpen && (
              <Paper
                sx={{
                  position: 'fixed',
                  bottom: 130,
                  right: 20,
                  zIndex: 1000,
                  p: 2,
                  borderRadius: '12px',
                  boxShadow: theme.shadows[6],
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 1,
                  minWidth: 200
                }}
              >
                <Button
                  variant="contained"
                  color="success"
                  startIcon={<ApproveIcon />}
                  onClick={() => handleStatusChange(1)}
                  size="small"
                  sx={{
                    borderRadius: '8px',
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
                  size="small"
                  sx={{
                    borderRadius: '8px',
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
                  size="small"
                  sx={{
                    borderRadius: '8px',
                    textTransform: 'none',
                    fontWeight: 600
                  }}
                >
                  Reject
                </Button>
              </Paper>
            )}
          </Box>
        )}
      </Paper>

      {/* Documents Section */}
      <Typography variant={isSmallScreen ? "h6" : "h5"} gutterBottom sx={{ 
        mb: 3,
        fontWeight: 700
      }}>
        Vehicle Documents
      </Typography>

      <Grid container spacing={isSmallScreen ? 2 : 3}>
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
              
              <Box sx={{ p: isSmallScreen ? 1 : 2, flexGrow: 1 }}>
                <Typography 
                  variant={isSmallScreen ? "body2" : "subtitle1"} 
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
                      height: isSmallScreen ? 120 : 180,
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
                      height: isSmallScreen ? 120 : 180,
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      bgcolor: alpha(theme.palette.grey[100], 0.5),
                      borderRadius: '8px',
                      border: `1px dashed ${theme.palette.divider}`
                    }}
                  >
                    <ImageIcon sx={{ 
                      fontSize: isSmallScreen ? 32 : 48, 
                      color: 'grey.400', 
                      mb: 1 
                    }} />
                    <Typography variant={isSmallScreen ? "caption" : "body2"} color="text.secondary">
                      Image not available
                    </Typography>
                  </Box>
                )}
              </Box>
              
              {url && !approvedImages[key] && (
                <Box sx={{ 
                  p: isSmallScreen ? 1 : 2, 
                  borderTop: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                  bgcolor: alpha(theme.palette.background.default, 0.6)
                }}>
                  <Stack direction="row" spacing={1} justifyContent="space-between">
                    <Button
                      size={isSmallScreen ? "small" : "medium"}
                      variant="contained"
                      color="success"
                      startIcon={!isSmallScreen && <ApproveIcon />}
                      onClick={() => handleImageApproval(key)}
                      sx={{
                        borderRadius: '8px',
                        flex: 1,
                        textTransform: 'none',
                        fontWeight: 500,
                        fontSize: isSmallScreen ? '0.75rem' : '0.875rem'
                      }}
                    >
                      {isSmallScreen ? <ApproveIcon fontSize="small" /> : 'Approve'}
                    </Button>
                    <Button
                      size={isSmallScreen ? "small" : "medium"}
                      variant="outlined"
                      color="error"
                      startIcon={!isSmallScreen && <RejectIcon />}
                      onClick={() => setImageRejection(prev => ({
                        ...prev,
                        [key]: { ...prev[key], dialogOpen: true }
                      }))}
                      sx={{
                        borderRadius: '8px',
                        flex: 1,
                        textTransform: 'none',
                        fontWeight: 500,
                        fontSize: isSmallScreen ? '0.75rem' : '0.875rem'
                      }}
                    >
                      {isSmallScreen ? <RejectIcon fontSize="small" /> : 'Reject'}
                    </Button>
                  </Stack>
                </Box>
              )}
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Rejection Dialog for Application */}
      <Dialog 
        open={rejectionDialogOpen} 
        onClose={() => setRejectionDialogOpen(false)}
        maxWidth="sm"
        fullWidth
        fullScreen={isSmallScreen}
      >
        <DialogTitle>Reject Application</DialogTitle>
        <DialogContent>
          <Typography variant="body1" gutterBottom sx={{ mb: 2 }}>
            Please provide a reason for rejecting this rescuer's application:
          </Typography>
          <TextField
            autoFocus
            fullWidth
            multiline
            rows={isSmallScreen ? 3 : 4}
            variant="outlined"
            value={rejectionFeedback}
            onChange={(e) => setRejectionFeedback(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button 
            onClick={() => setRejectionDialogOpen(false)}
            sx={{
              borderRadius: '8px',
              textTransform: 'none',
              fontWeight: 500
            }}
          >
            Cancel
          </Button>
          <Button
            color="error"
            variant="contained"
            onClick={() => handleStatusChange(-1)}
            disabled={!rejectionFeedback.trim()}
            sx={{
              borderRadius: '8px',
              textTransform: 'none',
              fontWeight: 500
            }}
          >
            Submit Rejection
          </Button>
        </DialogActions>
      </Dialog>

      {/* Rejection Dialogs for Images */}
      {docFields.map(({ label, key }) => (
        <Dialog
          key={key}
          open={!!(imageRejection[key]?.dialogOpen)}
          onClose={() => setImageRejection(prev => ({
            ...prev,
            [key]: { ...prev[key], dialogOpen: false }
          }))}
          maxWidth="sm"
          fullWidth
          fullScreen={isSmallScreen}
        >
          <DialogTitle>Reject {label}</DialogTitle>
          <DialogContent>
            <Typography variant="body1" gutterBottom sx={{ mb: 2 }}>
              Please specify why you're rejecting this document:
            </Typography>
            <TextField
              autoFocus
              fullWidth
              multiline
              rows={isSmallScreen ? 3 : 4}
              variant="outlined"
              value={imageRejection[key]?.reason || ''}
              onChange={(e) => setImageRejection(prev => ({
                ...prev,
                [key]: { ...prev[key], reason: e.target.value }
              }))}
            />
          </DialogContent>
          <DialogActions>
            <Button 
              onClick={() => setImageRejection(prev => ({
                ...prev,
                [key]: { ...prev[key], dialogOpen: false }
              }))}
              sx={{
                borderRadius: '8px',
                textTransform: 'none',
                fontWeight: 500
              }}
            >
              Cancel
            </Button>
            <Button
              color="error"
              variant="contained"
              onClick={() => handleImageRejection(key)}
              disabled={!imageRejection[key]?.reason}
              sx={{
                borderRadius: '8px',
                textTransform: 'none',
                fontWeight: 500
              }}
            >
              Confirm Rejection
            </Button>
          </DialogActions>
        </Dialog>
      ))}
    </Box>
  );
};

export default RescuerDetail;