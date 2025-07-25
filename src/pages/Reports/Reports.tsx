import React, { useState, useEffect } from 'react';
import {
  Box, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  TablePagination, Typography, TextField, InputAdornment, Tooltip, Avatar,
  Chip, IconButton, Menu, MenuItem, Dialog, DialogTitle, DialogContent,
  DialogActions, Button, CircularProgress, Select, MenuItem as SelectItem,
  Card, CardContent, Grid, Fade, Skeleton, Stack, Divider, Badge
} from '@mui/material';
import {
  Search, MoreVert, Visibility, CheckCircle, Cancel,
  Pending, Block, FilterList, TrendingUp, Assessment, Warning
} from '@mui/icons-material';
import { collection, getDocs, doc, getDoc, Timestamp } from 'firebase/firestore';
import { db } from '../../firebase';

interface Report {
  id: string;
  reportedUserId: string;
  reporterId: string;
  reason: string;
  description: string;
  reportDate: Timestamp | string;
  status: string;
  priority?: 'high' | 'medium' | 'low';
  rescuerId?: string;
  report?: string;
}

interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  profilePic?: string;
  role?: string;
}

const Reports: React.FC = () => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [priorityFilter, setPriorityFilter] = useState<'all'|'high'|'medium'|'low'>('all');
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [usersLoading, setUsersLoading] = useState(true);
  const [users, setUsers] = useState<Record<string, User>>({});

  const fetchUserData = async (userId: string): Promise<User> => {
    if (!userId) return { id: userId, name: 'Unknown', email: '' };
    const collections = ['users', 'rescuers', 'admins'];
    for (const col of collections) {
      const snap = await getDoc(doc(db, col, userId));
      if (snap.exists()) {
        const d = snap.data();
        const name = d.fName && d.lName ? `${d.fName} ${d.lName}` :
          d.fName || d.name || d.displayName || d.fullName || 'Unknown';
        return {
          id: userId,
          name,
          email: d.email || '',
          phone: d.phone || d.phoneNumber || '',
          profilePic: d.profilePic || '',
          role: d.role || col.slice(0, -1)
        };
      }
    }
    return { id: userId, name: `User Not Found (${userId})`, email: '' };
  };

  const fetchReports = async () => {
    setLoading(true);
    setUsersLoading(true);
    const snapshot = await getDocs(collection(db, 'reports'));
    const data = snapshot.docs.map(doc => {
      const d = doc.data();
      return {
        id: doc.id,
        reportedUserId: d.rescuerId || d.reportedUserId || d.userId || '',
        reporterId: d.reporterId || d.reporterUserId || '',
        reason: d.report || 'No reason provided',
        description: d.description || 'No description provided',
        reportDate: d.reportDate || d.createdAt || d.timestamp || Timestamp.now(),
        status: d.status || 'pending',
        priority: d.priority || 'low',
        rescuerId: d.rescuerId || '',
        report: d.report || ''
      } as Report;
    });
    setReports(data);

    const ids = new Set<string>();
    data.forEach(r => {
      if (r.reportedUserId) ids.add(r.reportedUserId);
      if (r.reporterId) ids.add(r.reporterId);
    });

    const map: Record<string, User> = {};
    await Promise.all(Array.from(ids).map(async id => {
      map[id] = await fetchUserData(id);
    }));
    setUsers(map);
    setLoading(false);
    setUsersLoading(false);
  };

  useEffect(() => {
    fetchReports();
  }, []);

  const formatDate = (ts?: Timestamp|string) => {
    if (!ts) return 'N/A';
    try {
      const date = typeof ts === 'string' ? new Date(ts) : ts.toDate();
      return date.toLocaleDateString('en-US', { year:'numeric', month:'short', day:'numeric', hour:'2-digit', minute:'2-digit' });
    } catch { return 'Invalid date'; }
  };

  const getStatusColor = (v: string) => {
    switch (v.toLowerCase()) {
      case 'pending': return 'warning';
      case 'reviewed': return 'info';
      case 'resolved': return 'success';
      case 'rejected': return 'error';
      case 'high': return 'error';
      case 'medium': return 'warning';
      case 'low': return 'success';
      case 'admin': return 'error';
      case 'rescuer': return 'success';
      case 'user': return 'primary';
      default: return 'default';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending': return <Pending />;
      case 'reviewed': return <Visibility />;
      case 'resolved': return <CheckCircle />;
      case 'rejected': return <Cancel />;
      default: return <Block />;
    }
  };

  const handleMenuOpen = (e: React.MouseEvent<HTMLButtonElement>, r: Report) => {
    setAnchorEl(e.currentTarget);
    setSelectedReport(r);
  };
  const handleMenuClose = () => setAnchorEl(null);
  const handleView = () => { setViewDialogOpen(true); handleMenuClose(); };
  const handleStatusUpdate = (newStatus: string) => {
    if (!selectedReport) return;
    setReports(prev => prev.map(r => r.id === selectedReport.id ? { ...r, status: newStatus } : r));
    handleMenuClose();
  };

  const filtered = reports.filter(r => {
    const prioOk = priorityFilter === 'all' || r.priority === priorityFilter;
    const rep = users[r.reporterId]?.name || '';
    const repd = users[r.reportedUserId]?.name || '';
    const term = searchTerm.toLowerCase();
    return prioOk && (
      rep.toLowerCase().includes(term) ||
      repd.toLowerCase().includes(term) ||
      r.reason.toLowerCase().includes(term) ||
      r.description.toLowerCase().includes(term)
    );
  });

  // Statistics for dashboard cards
  const stats = {
    total: reports.length,
    pending: reports.filter(r => r.status === 'pending').length,
    resolved: reports.filter(r => r.status === 'resolved').length,
    highPriority: reports.filter(r => r.priority === 'high').length
  };

  const StatCard = ({ title, value, icon, color, trend }: any) => (
    <Card 
      sx={{ 
        background: `linear-gradient(135deg, ${color}15 0%, ${color}05 100%)`,
        border: `1px solid ${color}30`,
        transition: 'all 0.3s ease',
        '&:hover': {
          transform: 'translateY(-2px)',
          boxShadow: `0 8px 25px ${color}20`
        }
      }}
    >
      <CardContent sx={{ p: 3 }}>
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <Box>
            <Typography variant="h4" fontWeight="700" color={color}>
              {value}
            </Typography>
            <Typography variant="body2" color="text.secondary" fontWeight="500">
              {title}
            </Typography>
            {trend && (
              <Box display="flex" alignItems="center" mt={1}>
                <TrendingUp sx={{ fontSize: 16, color: 'success.main', mr: 0.5 }} />
                <Typography variant="caption" color="success.main">
                  {trend}
                </Typography>
              </Box>
            )}
          </Box>
          <Box 
            sx={{ 
              p: 2, 
              borderRadius: '12px', 
              backgroundColor: `${color}20`,
              color: color
            }}
          >
            {icon}
          </Box>
        </Box>
      </CardContent>
    </Card>
  );

  return (
    <Box sx={{ 
      maxWidth: 1300, 
      mx: "auto",
      backgroundColor: '#f8fafc',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      p: 3
    }}>
      {/* Header */}
      <Box mb={6} width="100%">
        <Typography 
          variant="h4" 
          fontWeight="600" 
          sx={{ 
            background: 'rgba(29, 32, 36, 1)',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            color: 'transparent',
            mb: 1,
            textAlign: 'center'
          }}
        >
          Reports
        </Typography>
      </Box>

      {/* Statistics Cards */}
      <Grid container spacing={3} mb={4} width="100%">
        <Grid item xs={12} sm={6} md={3}>
          <StatCard 
            title="Total Reports" 
            value={stats.total} 
            icon={<Assessment />} 
            color="#3b82f6"
            trend="+12% this month"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard 
            title="Pending" 
            value={stats.pending} 
            icon={<Pending />} 
            color="#f59e0b"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard 
            title="Resolved" 
            value={stats.resolved} 
            icon={<CheckCircle />} 
            color="#10b981"
            trend="+8% this week"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard 
            title="High Priority" 
            value={stats.highPriority} 
            icon={<Warning />} 
            color="#ef4444"
          />
        </Grid>
      </Grid>

      {/* Filters Section */}
      <Card sx={{ mb: 3, borderRadius: 3, boxShadow: '0 4px 20px rgba(0,0,0,0.08)', width: '100%' }}>
        <CardContent sx={{ p: 3 }}>
          <Box display="flex" gap={3} alignItems="center" flexWrap="wrap" justifyContent="center">
            <TextField
              placeholder="Search reports, users, or reasons..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              sx={{ 
                minWidth: 300,
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                  backgroundColor: '#f8fafc',
                  '&:hover': { backgroundColor: '#f1f5f9' }
                }
              }}
              InputProps={{ 
                startAdornment: (
                  <InputAdornment position="start">
                    <Search sx={{ color: 'text.secondary' }} />
                  </InputAdornment>
                )
              }}
            />
            <Box display="flex" alignItems="center" gap={1}>
              <FilterList sx={{ color: 'text.secondary' }} />
              <Select
                value={priorityFilter}
                onChange={e => setPriorityFilter(e.target.value as any)}
                sx={{ 
                  minWidth: 150,
                  borderRadius: 2,
                  '& .MuiOutlinedInput-notchedOutline': {
                    borderColor: 'rgba(0,0,0,0.1)'
                  }
                }}
              >
                <SelectItem value="all">All Priorities</SelectItem>
                <SelectItem value="high">🔴 High Priority</SelectItem>
                <SelectItem value="medium">🟡 Medium Priority</SelectItem>
                <SelectItem value="low">🟢 Low Priority</SelectItem>
              </Select>
            </Box>
            <Badge badgeContent={filtered.length} color="primary" showZero>
              <Chip 
                label="Results" 
                variant="outlined" 
                sx={{ fontWeight: 600 }}
              />
            </Badge>
          </Box>
        </CardContent>
      </Card>
      
      {/* Main Table */}
      {loading ? (
        <Card sx={{ borderRadius: 3, width: '100%' }}>
          <CardContent sx={{ p: 4, textAlign: 'center' }}>
            <CircularProgress size={40} sx={{ mb: 2 }} />
            <Typography variant="h6" color="text.secondary">Loading reports...</Typography>
            <Box mt={3}>
              {[...Array(5)].map((_, i) => (
                <Skeleton key={i} height={60} sx={{ mb: 1, borderRadius: 2 }} />
              ))}
            </Box>
          </CardContent>
        </Card>
      ) : (
        <Fade in={!loading}>
          <Card sx={{ 
            borderRadius: 3, 
            boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
            overflow: 'hidden',
            width: '100%'
          }}>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow sx={{ 
                    backgroundColor: '#f8fafc',
                    '& .MuiTableCell-head': {
                      fontWeight: 700,
                      fontSize: '0.95rem',
                      color: '#374151',
                      borderBottom: '2px solid #e5e7eb',
                      textAlign: 'center'
                    }
                  }}>
                    <TableCell align="center">Reported User</TableCell>
                    <TableCell align="center">Reporter</TableCell>
                    <TableCell align="center">Reason</TableCell>
                    <TableCell align="center">Priority</TableCell>
                    <TableCell align="center">Status</TableCell>
                    <TableCell align="center">Date</TableCell>
                    <TableCell align="center">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filtered.slice(page*rowsPerPage, page*rowsPerPage + rowsPerPage).map((r, index) => (
                    <TableRow 
                      key={r.id}
                      sx={{ 
                        '&:hover': { 
                          backgroundColor: '#f8fafc',
                          transform: 'scale(1.001)'
                        },
                        transition: 'all 0.2s ease',
                        borderBottom: '1px solid #f1f5f9'
                      }}
                    >
                      {['reportedUserId','reporterId'].map((key, idx) => {
                        const user = users[r[key as keyof Report] as string];
                        return (
                          <TableCell key={idx} align="center">
                            <Box display="flex" alignItems="center" gap={2} justifyContent="center">
                              <Avatar 
                                src={user?.profilePic} 
                                alt={user?.name} 
                                sx={{ 
                                  width: 40, 
                                  height: 40,
                                  boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                                  border: '2px solid #fff'
                                }}
                              >
                                {user?.name?.[0]?.toUpperCase()||'?'}
                              </Avatar>
                              <Box>
                                <Typography 
                                  variant="body2" 
                                  fontWeight="600"
                                  sx={{ mb: 0.5 }}
                                >
                                  {user?.name||'Unknown'}
                                </Typography>
                                {user?.role && (
                                  <Chip 
                                    label={user.role}
                                    color={getStatusColor(user.role)}
                                    size="small" 
                                    sx={{ 
                                      fontSize: '0.7rem',
                                      fontWeight: 600,
                                      textTransform: 'uppercase'
                                    }}
                                  />
                                )}
                              </Box>
                            </Box>
                          </TableCell>
                        );
                      })}
                      <TableCell align="center">
                        <Typography variant="body2" sx={{ 
                          maxWidth: 200, 
                          overflow: 'hidden', 
                          textOverflow: 'ellipsis',
                          fontWeight: 500
                        }}>
                          {r.reason}
                        </Typography>
                      </TableCell>
                      <TableCell align="center">
                        <Chip 
                          label={r.priority?.toUpperCase()}
                          color={getStatusColor(r.priority||'low')}
                          size="small"
                          sx={{ 
                            fontWeight: 700,
                            minWidth: 80,
                            textTransform: 'uppercase'
                          }}
                        />
                      </TableCell>
                      <TableCell align="center">
                        <Chip 
                          icon={getStatusIcon(r.status)}
                          label={r.status.toUpperCase()}
                          color={getStatusColor(r.status)}
                          size="small"
                          sx={{ 
                            fontWeight: 700,
                            minWidth: 100,
                            textTransform: 'uppercase'
                          }}
                        />
                      </TableCell>
                      <TableCell align="center">
                        <Typography variant="body2" color="text.secondary" fontWeight="500">
                          {formatDate(r.reportDate)}
                        </Typography>
                      </TableCell>
                      <TableCell align="center">
                        <Tooltip title="More actions" arrow>
                          <IconButton 
                            onClick={(e)=>handleMenuOpen(e, r)}
                            sx={{ 
                              '&:hover': { 
                                backgroundColor: 'primary.main',
                                color: 'white',
                                transform: 'scale(1.1)'
                              },
                              transition: 'all 0.2s ease'
                            }}
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
            <Divider />
            <TablePagination
              component="div"
              count={filtered.length}
              page={page}
              onPageChange={(_,n)=>setPage(n)}
              rowsPerPage={rowsPerPage}
              onRowsPerPageChange={e=>{ setRowsPerPage(+e.target.value); setPage(0); }}
              sx={{ 
                backgroundColor: '#f8fafc',
                '& .MuiTablePagination-toolbar': {
                  paddingX: 3
                }
              }}
            />
          </Card>
        </Fade>
      )}

      {/* Action Menu */}
      <Menu 
        anchorEl={anchorEl} 
        open={!!anchorEl} 
        onClose={handleMenuClose}
        PaperProps={{
          sx: {
            borderRadius: 2,
            boxShadow: '0 10px 30px rgba(0,0,0,0.15)',
            border: '1px solid #e5e7eb'
          }
        }}
      >
        <MenuItem onClick={handleView} sx={{ gap: 1, py: 1.5 }}>
          <Visibility color="primary" /> View Details
        </MenuItem>
        <Divider />
        <MenuItem onClick={()=>handleStatusUpdate('resolved')} sx={{ gap: 1, py: 1.5 }}>
          <CheckCircle color="success" /> Mark Resolved
        </MenuItem>
        <MenuItem onClick={()=>handleStatusUpdate('reviewed')} sx={{ gap: 1, py: 1.5 }}>
          <Visibility color="info" /> Mark Reviewed
        </MenuItem>
        <MenuItem onClick={()=>handleStatusUpdate('rejected')} sx={{ gap: 1, py: 1.5 }}>
          <Cancel color="error" /> Reject Report
        </MenuItem>
        <MenuItem onClick={()=>handleStatusUpdate('pending')} sx={{ gap: 1, py: 1.5 }}>
          <Pending color="warning" /> Mark Pending
        </MenuItem>
      </Menu>

      {/* Enhanced Report Details Dialog */}
      <Dialog 
        open={viewDialogOpen} 
        onClose={()=>setViewDialogOpen(false)} 
        maxWidth="md" 
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 3,
            boxShadow: '0 20px 60px rgba(0,0,0,0.15)'
          }
        }}
      >
        <DialogTitle sx={{ 
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          fontWeight: 700,
          fontSize: '1.5rem',
          textAlign: 'center'
        }}>
          Report Details
        </DialogTitle>
        <DialogContent dividers sx={{ p: 4 }}>
          {usersLoading ? (
            <Box textAlign="center" py={4}>
              <CircularProgress size={30} sx={{ mb: 2 }} />
              <Typography color="text.secondary">Loading user information...</Typography>
            </Box>
          ) : selectedReport ? (
            <Stack spacing={3}>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <Card sx={{ p: 3, backgroundColor: '#f8fafc', borderRadius: 2 }}>
                    <Typography variant="h6" color="primary" fontWeight="700" mb={2} textAlign="center">
                      Reported User
                    </Typography>
                    <Box display="flex" alignItems="center" gap={2} mb={2} justifyContent="center">
                      <Avatar 
                        src={users[selectedReport.reportedUserId]?.profilePic}
                        sx={{ width: 50, height: 50 }}
                      >
                        {users[selectedReport.reportedUserId]?.name?.[0]}
                      </Avatar>
                      <Box textAlign="center">
                        <Typography fontWeight="600">
                          {users[selectedReport.reportedUserId]?.name}
                        </Typography>
                        <Chip 
                          label={users[selectedReport.reportedUserId]?.role}
                          size="small"
                          color={getStatusColor(users[selectedReport.reportedUserId]?.role || '')}
                        />
                      </Box>
                    </Box>
                  </Card>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Card sx={{ p: 3, backgroundColor: '#f8fafc', borderRadius: 2 }}>
                    <Typography variant="h6" color="secondary" fontWeight="700" mb={2} textAlign="center">
                      Reporter
                    </Typography>
                    <Box display="flex" alignItems="center" gap={2} mb={2} justifyContent="center">
                      <Avatar 
                        src={users[selectedReport.reporterId]?.profilePic}
                        sx={{ width: 50, height: 50 }}
                      >
                        {users[selectedReport.reporterId]?.name?.[0]}
                      </Avatar>
                      <Box textAlign="center">
                        <Typography fontWeight="600">
                          {users[selectedReport.reporterId]?.name}
                        </Typography>
                        <Chip 
                          label={users[selectedReport.reporterId]?.role}
                          size="small"
                          color={getStatusColor(users[selectedReport.reporterId]?.role || '')}
                        />
                      </Box>
                    </Box>
                  </Card>
                </Grid>
              </Grid>
              
              <Card sx={{ p: 3, borderRadius: 2 }}>
                <Typography variant="h6" fontWeight="700" mb={2} textAlign="center">Report Information</Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <Typography color="text.secondary" variant="body2" textAlign="center">Reason</Typography>
                    <Typography fontWeight="600" mb={2} textAlign="center">
                      {selectedReport.report || selectedReport.reason}
                    </Typography>
                  </Grid>
              
        
                  <Grid item xs={12} sm={6}>
                    <Typography color="text.secondary" variant="body2" textAlign="center">Report Date</Typography>
                    <Typography fontWeight="600" mb={2} textAlign="center">
                      {formatDate(selectedReport.reportDate)}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography color="text.secondary" variant="body2" textAlign="center">Status</Typography>
                    <Box display="flex" justifyContent="center" mb={3}>
                      <Chip 
                        icon={getStatusIcon(selectedReport.status)}
                        label={selectedReport.status.toUpperCase()}
                        color={getStatusColor(selectedReport.status)}
                        sx={{ fontWeight: 700 }}
                      />
                    </Box>
                  </Grid>
                                 <Grid item xs={12} sm={6}>
                    <Typography color="text.secondary" variant="body2" textAlign="center">Priority</Typography>
                    <Box display="flex" justifyContent="center" mb={2}>
                      <Chip 
                        label={selectedReport.priority?.toUpperCase()}
                        color={getStatusColor(selectedReport.priority || '')}
                        sx={{ fontWeight: 700 }}
                      />
                    </Box>
                  </Grid>
        
                </Grid>
              </Card>
            </Stack>
          ) : (
            <Typography textAlign="center">No report selected.</Typography>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 3, justifyContent: 'center' }}>
          <Button 
            onClick={()=>setViewDialogOpen(false)}
            variant="contained"
            sx={{ borderRadius: 2, px: 3 }}
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Reports;