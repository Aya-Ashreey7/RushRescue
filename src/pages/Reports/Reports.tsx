import React, { useState } from 'react';
import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Typography,
  Button,
  Chip,
  IconButton,
  Menu,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Select,
  FormControl,
  InputLabel,
  Card,
  CardContent,
  Grid,
  Toolbar,
  InputAdornment,
  Tooltip,
  Badge,
  Avatar
} from '@mui/material';
import {
  Search,
  FilterList,
  MoreVert,
  Visibility,
  Block,
  CheckCircle,
  Warning,
  Person,
  Email,
  Phone,
  CalendarToday,
  TrendingUp,
  Report,
  People,
  Security
} from '@mui/icons-material';

// Sample data for reported users
const reportedUsers = [
  {
    id: 1,
    reportedUser: 'Karlos',
    reportedBy: 'Mohamed khamese',
    email: 'karlos@gmail.com',
    phone: '+1234567890',
    reason: 'Inappropriate Content',
    description: 'User posted offensive material in community forums',
    status: 'pending',
    priority: 'high',
    reportDate: '2025-06-25',
    evidence: 'Screenshot attached'
  },
  {
    id: 2,
    reportedUser: 'Karlos',
    reportedBy: 'Mohamed khamese',
    email: 'karlos@gmail.com',
    phone: '+1234567890',
    reason: 'Inappropriate Content',
    description: 'User posted offensive material in community forums',
    status: 'pending',
    priority: 'high',
    reportDate: '2025-06-25',
    evidence: 'Screenshot attached'
  },
 
 
];

const Reports = () => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedReport, setSelectedReport] = useState(null);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [actionDialogOpen, setActionDialogOpen] = useState(false);
  const [actionType, setActionType] = useState('');
  const [actionNotes, setActionNotes] = useState('');

  const handleChangePage = (event: any, newPage: React.SetStateAction<number>) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: { target: { value: string; }; }) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleMenuOpen = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>, report: React.SetStateAction<null>) => {
    setAnchorEl(event.currentTarget);
    setSelectedReport(report);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedReport(null);
  };

  const handleViewReport = () => {
    setViewDialogOpen(true);
    handleMenuClose();
  };

  const handleAction = (type: React.SetStateAction<string>) => {
    setActionType(type);
    setActionDialogOpen(true);
    handleMenuClose();
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'warning';
      case 'under-review': return 'info';
      case 'resolved': return 'success';
      default: return 'default';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'error';
      case 'medium': return 'warning';
      case 'low': return 'success';
      default: return 'default';
    }
  };

  const filteredReports = reportedUsers.filter(report => {
    const matchesSearch = report.reportedUser.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         report.reportedBy.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         report.reason.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || report.status === statusFilter;
    const matchesPriority = priorityFilter === 'all' || report.priority === priorityFilter;
    return matchesSearch && matchesStatus && matchesPriority;
  });

  const stats = {
    totalReports: reportedUsers.length,
    pendingReports: reportedUsers.filter(r => r.status === 'pending').length,
    highPriority: reportedUsers.filter(r => r.priority === 'high').length,
    resolved: reportedUsers.filter(r => r.status === 'resolved').length
  };

  return (
    <Box sx={{ p: 3, bgcolor: '#f5f5f5', minHeight: '100vh' }}>
        <Box sx={{ maxWidth: '1200px', mx: 'auto' }}>
      <Typography variant="h4" sx={{ mb: 3, fontWeight: 'bold'}}>
        User Reports 
      </Typography>

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ bgcolor: '#e3f2fd', borderLeft: '4px solid #1976d2' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#1976d2' }}>
                    {stats.totalReports}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Total Reports
                  </Typography>
                </Box>
                <Report sx={{ fontSize: 40, color: '#1976d2' }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ bgcolor: '#fff3e0', borderLeft: '4px solid #f57c00' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#f57c00' }}>
                    {stats.pendingReports}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Pending Review
                  </Typography>
                </Box>
                <Warning sx={{ fontSize: 40, color: '#f57c00' }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ bgcolor: '#ffebee', borderLeft: '4px solid #d32f2f' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#d32f2f' }}>
                    {stats.highPriority}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    High Priority
                  </Typography>
                </Box>
                <Security sx={{ fontSize: 40, color: '#d32f2f' }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ bgcolor: '#e8f5e8', borderLeft: '4px solid #2e7d32' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#2e7d32' }}>
                    {stats.resolved}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Resolved
                  </Typography>
                </Box>
                <CheckCircle sx={{ fontSize: 40, color: '#2e7d32' }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Filters and Search */}
      <Paper sx={{ p: 2, mb: 2 }}>
        <Toolbar sx={{ px: 0 }}>
          <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', flexWrap: 'wrap', width: '100%' }}>
            <TextField
              size="small"
              placeholder="Search reports..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search />
                  </InputAdornment>
                )
              }}
              sx={{ minWidth: 250 }}
            />
            <FormControl size="small" sx={{ minWidth: 120 }}>
              <InputLabel>Status</InputLabel>
              <Select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                label="Status"
              >
                <MenuItem value="all">All Status</MenuItem>
                <MenuItem value="pending">Pending</MenuItem>
                <MenuItem value="under-review">Under Review</MenuItem>
                <MenuItem value="resolved">Resolved</MenuItem>
              </Select>
            </FormControl>
            <FormControl size="small" sx={{ minWidth: 120 }}>
              <InputLabel>Priority</InputLabel>
              <Select
                value={priorityFilter}
                onChange={(e) => setPriorityFilter(e.target.value)}
                label="Priority"
              >
                <MenuItem value="all">All Priority</MenuItem>
                <MenuItem value="high">High</MenuItem>
                <MenuItem value="medium">Medium</MenuItem>
                <MenuItem value="low">Low</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </Toolbar>
      </Paper>

      {/* Reports Table */}
      <Paper sx={{ boxShadow: 3, borderRadius: 2 }}>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow sx={{ bgcolor: '#f5f5f5' }}>
                <TableCell sx={{ fontWeight: 'bold' }}>Reported User</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Reported By</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Reason</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Priority</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Status</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Report Date</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredReports
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((report) => (
                  <TableRow key={report.id} hover>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Avatar sx={{ width: 32, height: 32, bgcolor: '#0F3460' }}>
                          {report.reportedUser.charAt(0)}
                        </Avatar>
                        <Box>
                          <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
                            {report.reportedUser}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {report.email}
                          </Typography>
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">{report.reportedBy}</Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">{report.reason}</Typography>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={report.priority.toUpperCase()}
                        color={getPriorityColor(report.priority)}
                        size="small"
                        sx={{ fontWeight: 'bold' }}
                      />
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={report.status.replace('-', ' ').toUpperCase()}
                        color={getStatusColor(report.status)}
                        size="small"
                        variant="outlined"
                      />
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">{report.reportDate}</Typography>
                    </TableCell>
                    <TableCell>
                      <Tooltip title="More actions">
                        <IconButton
                          onClick={(e) => handleMenuOpen(e, report)}
                          size="small"
                        >
                          <MoreVert />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          component="div"
          count={filteredReports.length}
          page={page}
          onPageChange={handleChangePage}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          rowsPerPageOptions={[5, 10, 25]}
        />
      </Paper>

      {/* Action Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={handleViewReport}>
          <Visibility sx={{ mr: 1 }} />
          View Details
        </MenuItem>
        <MenuItem onClick={() => handleAction('approve')}>
          <CheckCircle sx={{ mr: 1 }} />
          Approve Report
        </MenuItem>
        <MenuItem onClick={() => handleAction('suspend')}>
          <Block sx={{ mr: 1 }} />
          Suspend User
        </MenuItem>
        <MenuItem onClick={() => handleAction('dismiss')}>
          <Warning sx={{ mr: 1 }} />
          Dismiss Report
        </MenuItem>
      </Menu>

      {/* View Report Dialog */}
      <Dialog open={viewDialogOpen} onClose={() => setViewDialogOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>
          Report Details
        </DialogTitle>
        <DialogContent>
          {selectedReport && (
            <Box sx={{ mt: 2 }}>
              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <Typography variant="h6" gutterBottom>Reported User</Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                    <Person />
                    <Typography>{selectedReport.reportedUser}</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                    <Email />
                    <Typography>{selectedReport.email}</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                    <Phone />
                    <Typography>{selectedReport.phone}</Typography>
                  </Box>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Typography variant="h6" gutterBottom>Report Information</Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                    <People />
                    <Typography>Reported by: {selectedReport.reportedBy}</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                    <CalendarToday />
                    <Typography>Date: {selectedReport.reportDate}</Typography>
                  </Box>
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="body2" color="text.secondary">
                      Priority: 
                      <Chip
                        label={selectedReport.priority.toUpperCase()}
                        color={getPriorityColor(selectedReport.priority)}
                        size="small"
                        sx={{ ml: 1 }}
                      />
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="h6" gutterBottom>Report Details</Typography>
                  <Typography variant="body2" sx={{ mb: 1 }}>
                    <strong>Reason:</strong> {selectedReport.reason}
                  </Typography>
                  <Typography variant="body2" sx={{ mb: 1 }}>
                    <strong>Description:</strong> {selectedReport.description}
                  </Typography>
                  <Typography variant="body2">
                    <strong>Evidence:</strong> {selectedReport.evidence}
                  </Typography>
                </Grid>
              </Grid>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setViewDialogOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>

      {/* Action Dialog */}
      <Dialog open={actionDialogOpen} onClose={() => setActionDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>
          {actionType === 'approve' && 'Approve Report'}
          {actionType === 'suspend' && 'Suspend User'}
          {actionType === 'dismiss' && 'Dismiss Report'}
        </DialogTitle>
        <DialogContent>
          <Typography variant="body2" sx={{ mb: 2 }}>
            {actionType === 'approve' && 'Are you sure you want to approve this report? This will mark it as validated.'}
            {actionType === 'suspend' && 'Are you sure you want to suspend this user? They will be unable to access their account.'}
            {actionType === 'dismiss' && 'Are you sure you want to dismiss this report? It will be marked as resolved without action.'}
          </Typography>
          <TextField
            fullWidth
            multiline
            rows={3}
            label="Action Notes"
            placeholder="Add notes about this action..."
            value={actionNotes}
            onChange={(e) => setActionNotes(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setActionDialogOpen(false)}>Cancel</Button>
          <Button 
            variant="contained" 
            color={actionType === 'suspend' ? 'error' : 'primary'}
            onClick={() => {
              // Handle action here
              setActionDialogOpen(false);
              setActionNotes('');
            }}
          >
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
      </Box>
    </Box>
    
  );
};

export default Reports;