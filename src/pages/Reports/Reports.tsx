import React, { useState, useEffect } from 'react';
import {
  Box, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  TablePagination, Typography, TextField, InputAdornment, Tooltip, Avatar,
  Chip, IconButton, Menu, MenuItem, Dialog, DialogTitle, DialogContent,
  DialogActions, Button, CircularProgress, Select, MenuItem as SelectItem,
  Card, CardContent, Grid, Fade, Skeleton, Stack, Divider, Badge, useTheme
} from '@mui/material';
import {
  Search, MoreVert, Visibility, CheckCircle, Cancel,
  Pending, Block, FilterList, TrendingUp, Assessment, Warning,
  KeyboardArrowDown
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
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";

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
  
  // New state for priority dropdown
  const [priorityAnchorEl, setPriorityAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedPriorityReport, setSelectedPriorityReport] = useState<Report | null>(null);

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

  // Priority dropdown handlers
  const handlePriorityClick = (e: React.MouseEvent<HTMLDivElement>, report: Report) => {
    e.stopPropagation();
    setPriorityAnchorEl(e.currentTarget);
    setSelectedPriorityReport(report);
  };

  const handlePriorityClose = () => {
    setPriorityAnchorEl(null);
    setSelectedPriorityReport(null);
  };

  const handlePriorityUpdate = (newPriority: 'high' | 'medium' | 'low') => {
    if (!selectedPriorityReport) return;
    setReports(prev => prev.map(r => 
      r.id === selectedPriorityReport.id ? { ...r, priority: newPriority } : r
    ));
    handlePriorityClose();
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
        background: isDark 
          ? `linear-gradient(135deg, ${color}25 0%, ${color}10 100%)`
          : `linear-gradient(135deg, ${color}15 0%, ${color}05 100%)`,
        border: isDark 
          ? `1px solid ${color}40`
          : `1px solid ${color}30`,
        backgroundColor: isDark ? "#23243a" : "#fff",
        transition: 'all 0.3s ease',
        '&:hover': {
          transform: 'translateY(-2px)',
          boxShadow: isDark 
            ? `0 8px 25px ${color}30`
            : `0 8px 25px ${color}20`
        }
      }}
    >
      <CardContent sx={{ p: 3 }}>
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <Box>
            <Typography 
              variant="h4" 
              fontWeight="700" 
              color={color}
              sx={{ color: isDark ? '#fff' : color }}
            >
              {value}
            </Typography>
            <Typography 
              variant="body2" 
              color={isDark ? "rgba(255,255,255,0.7)" : "text.secondary"} 
              fontWeight="500"
            >
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
              backgroundColor: isDark ? `${color}30` : `${color}20`,
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
      backgroundColor: isDark ? "#1a1b2e" : '#f8fafc',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      p: 3,
      minHeight: '100vh'
    }}>
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
      <Card sx={{ 
        mb: 3, 
        borderRadius: 3, 
        boxShadow: isDark 
          ? '0 4px 20px rgba(0,0,0,0.3)' 
          : '0 4px 20px rgba(0,0,0,0.08)', 
        width: '100%',
        backgroundColor: isDark ? "#23243a" : "#fff"
      }}>
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
                  backgroundColor: isDark ? '#1a1b2e' : '#f8fafc',
                  color: isDark ? '#fff' : 'inherit',
                  '&:hover': { 
                    backgroundColor: isDark ? '#2a2b3e' : '#f1f5f9' 
                  },
                  '& .MuiOutlinedInput-notchedOutline': {
                    borderColor: isDark ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.1)'
                  }
                },
                '& .MuiInputBase-input::placeholder': {
                  color: isDark ? 'rgba(255,255,255,0.6)' : 'rgba(0,0,0,0.6)'
                }
              }}
              InputProps={{ 
                startAdornment: (
                  <InputAdornment position="start">
                    <Search sx={{ color: isDark ? 'rgba(255,255,255,0.6)' : 'text.secondary' }} />
                  </InputAdornment>
                )
              }}
            />
            <Box display="flex" alignItems="center" gap={1}>
              <FilterList sx={{ color: isDark ? 'rgba(255,255,255,0.6)' : 'text.secondary' }} />
              <Select
                value={priorityFilter}
                onChange={e => setPriorityFilter(e.target.value as any)}
                sx={{ 
                  minWidth: 150,
                  borderRadius: 2,
                  backgroundColor: isDark ? '#1a1b2e' : '#fff',
                  color: isDark ? '#fff' : 'inherit',
                  '& .MuiOutlinedInput-notchedOutline': {
                    borderColor: isDark ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.1)'
                  },
                  '& .MuiSvgIcon-root': {
                    color: isDark ? '#fff' : 'inherit'
                  }
                }}
                MenuProps={{
                  PaperProps: {
                    sx: {
                      backgroundColor: isDark ? "#23243a" : "#fff",
                      '& .MuiMenuItem-root': {
                        color: isDark ? '#fff' : 'inherit',
                        '&:hover': {
                          backgroundColor: isDark ? '#1a1b2e' : 'rgba(0,0,0,0.04)'
                        }
                      }
                    }
                  }
                }}
              >
                <SelectItem value="all">All Priorities</SelectItem>
                <SelectItem value="high"> High Priority</SelectItem>
                <SelectItem value="medium"> Medium Priority</SelectItem>
                <SelectItem value="low"> Low Priority</SelectItem>
              </Select>
            </Box>
            <Badge badgeContent={filtered.length} color="primary" showZero>
              <Chip 
                label="Results" 
                variant="outlined" 
                sx={{ 
                  fontWeight: 600,
                  color: isDark ? '#fff' : 'inherit',
                  borderColor: isDark ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.23)'
                }}
              />
            </Badge>
          </Box>
        </CardContent>
      </Card>
      
      {/* Main Table */}
      {loading ? (
        <Card sx={{ 
          borderRadius: 3, 
          width: '100%',
          backgroundColor: isDark ? "#23243a" : "#fff"
        }}>
          <CardContent sx={{ p: 4, textAlign: 'center' }}>
            <CircularProgress size={40} sx={{ mb: 2 }} />
            <Typography 
              variant="h6" 
              color={isDark ? "rgba(255,255,255,0.7)" : "text.secondary"}
            >
              Loading reports...
            </Typography>
            <Box mt={3}>
              {[...Array(5)].map((_, i) => (
                <Skeleton 
                  key={i} 
                  height={60} 
                  sx={{ 
                    mb: 1, 
                    borderRadius: 2,
                    backgroundColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.11)'
                  }} 
                />
              ))}
            </Box>
          </CardContent>
        </Card>
      ) : (
        <Fade in={!loading}>
          <Card sx={{ 
            borderRadius: 4, 
            boxShadow: isDark 
              ? '0 20px 40px rgba(0,0,0,0.5)' 
              : '0 20px 40px rgba(0,0,0,0.08)',
            overflow: 'hidden',
            width: '100%',
            backgroundColor: isDark ? "#23243a" : "#fff",
            border: isDark ? '1px solid rgba(255,255,255,0.08)' : '1px solid rgba(0,0,0,0.06)'
          }}>
            <TableContainer sx={{ 
              '&::-webkit-scrollbar': {
                height: 8,
                width: 8
              },
              '&::-webkit-scrollbar-track': {
                backgroundColor: isDark ? '#1a1b2e' : '#f1f5f9',
                borderRadius: 4
              },
              '&::-webkit-scrollbar-thumb': {
                backgroundColor: isDark ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.3)',
                borderRadius: 4,
                '&:hover': {
                  backgroundColor: isDark ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.5)'
                }
              }
            }}>
              <Table sx={{ minWidth: 800 }}>
                <TableHead>
                  <TableRow sx={{ 
                    background: isDark 
                      ? 'linear-gradient(135deg, #1a1b2e 0%, #252640 100%)'
                      : 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
                    height: 65,
                    '& .MuiTableCell-head': {
                      fontWeight: 800,
                      fontSize: '0.9rem',
                      color: isDark ? '#e2e8f0' : '#1e293b',
                      borderBottom: 'none',
                      textAlign: 'center',
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px',
                      padding: '20px 16px',
                      position: 'relative',
                      '&::after': {
                        content: '""',
                        position: 'absolute',
                        bottom: 0,
                        left: '20%',
                        right: '20%',
                        height: 2,
                        background: isDark 
                          ? 'linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)'
                          : 'linear-gradient(90deg, transparent, rgba(0,0,0,0.1), transparent)'
                      }
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
                        height: 80,
                        background: index % 2 === 0 
                          ? (isDark ? 'rgba(255,255,255,0.02)' : 'rgba(248,250,252,0.5)')
                          : 'transparent',
                        '&:hover': { 
                          background: isDark 
                            ? 'linear-gradient(135deg, rgba(59,130,246,0.1) 0%, rgba(168,85,247,0.1) 100%)'
                            : 'linear-gradient(135deg, rgba(59,130,246,0.05) 0%, rgba(168,85,247,0.05) 100%)',
                          transform: 'translateY(-1px)',
                          boxShadow: isDark 
                            ? '0 8px 25px rgba(0,0,0,0.3)'
                            : '0 8px 25px rgba(0,0,0,0.08)'
                        },
                        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                        borderBottom: isDark 
                          ? '1px solid rgba(255,255,255,0.05)' 
                          : '1px solid rgba(0,0,0,0.04)',
                        cursor: 'pointer',
                        '& .MuiTableCell-root': {
                          borderBottom: 'none',
                          padding: '16px 12px'
                        }
                      }}
                    >
                      {['reportedUserId','reporterId'].map((key, idx) => {
                        const user = users[r[key as keyof Report] as string];
                        return (
                          <TableCell key={idx} align="center">
                            <Box display="flex" alignItems="center" gap={2.5} justifyContent="center">
                              <Box
                                sx={{
                                  position: 'relative',
                                  '&::before': {
                                    content: '""',
                                    position: 'absolute',
                                    inset: -2,
                                    borderRadius: '50%',
                                    padding: 2,
                                    background: isDark
                                      ? 'linear-gradient(135deg, rgba(59,130,246,0.3), rgba(168,85,247,0.3))'
                                      : 'linear-gradient(135deg, rgba(59,130,246,0.1), rgba(168,85,247,0.1))',
                                    WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                                    WebkitMaskComposite: 'xor',
                                    maskComposite: 'exclude'
                                  }
                                }}
                              >
                                <Avatar 
                                  src={user?.profilePic} 
                                  alt={user?.name} 
                                  sx={{ 
                                    width: 45, 
                                    height: 45,
                                    background: isDark
                                      ? 'linear-gradient(135deg, #4c4c6d, #3e3e56)'
                                      : 'linear-gradient(135deg, #667eea, #764ba2)',
                                    boxShadow: isDark 
                                      ? '0 4px 15px rgba(0,0,0,0.4)' 
                                      : '0 4px 15px rgba(0,0,0,0.1)',
                                    fontSize: '1.1rem',
                                    fontWeight: 600,
                                    border: isDark 
                                      ? '2px solid rgba(255,255,255,0.1)' 
                                      : '2px solid rgba(255,255,255,0.8)',
                                    transition: 'all 0.3s ease',
                                    '&:hover': {
                                      transform: 'scale(1.1)',
                                      boxShadow: isDark 
                                        ? '0 6px 20px rgba(0,0,0,0.6)' 
                                        : '0 6px 20px rgba(0,0,0,0.15)'
                                    }
                                  }}
                                >
                                  {user?.name?.[0]?.toUpperCase()||'?'}
                                </Avatar>
                              </Box>
                              <Box>
                                <Typography 
                                  variant="body1" 
                                  fontWeight="700"
                                  sx={{ 
                                    mb: 0.5,
                                    color: isDark ? '#f1f5f9' : '#1e293b',
                                    fontSize: '0.95rem'
                                  }}
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
                                      fontWeight: 700,
                                      textTransform: 'uppercase',
                                      height: 22,
                                      borderRadius: '6px',
                                      '& .MuiChip-label': {
                                        px: 1
                                      }
                                    }}
                                  />
                                )}
                              </Box>
                            </Box>
                          </TableCell>
                        );
                      })}
                      <TableCell align="center">
                        <Tooltip 
                          title={
                            <Box sx={{ p: 1, maxWidth: 300 }}>
                              <Typography variant="body2" fontWeight="600" mb={1}>
                                Full Reason:
                              </Typography>
                              <Typography variant="body2" sx={{ wordBreak: 'break-word' }}>
                                {r.reason}
                              </Typography>
                            </Box>
                          } 
                          arrow 
                          placement="top"
                          componentsProps={{
                            tooltip: {
                              sx: {
                                backgroundColor: isDark ? '#1e293b' : '#374151',
                                color: '#fff',
                                fontSize: '0.875rem',
                                borderRadius: 2,
                                boxShadow: isDark 
                                  ? '0 8px 25px rgba(0,0,0,0.4)' 
                                  : '0 8px 25px rgba(0,0,0,0.15)'
                              }
                            },
                            arrow: {
                              sx: {
                                color: isDark ? '#1e293b' : '#374151'
                              }
                            }
                          }}
                        >
                          <Box
                            sx={{
                              px: 2,
                              py: 1,
                              borderRadius: 2,
                              background: isDark
                                ? 'linear-gradient(135deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.02) 100%)'
                                : 'linear-gradient(135deg, rgba(0,0,0,0.02) 0%, rgba(0,0,0,0.05) 100%)',
                              border: isDark
                                ? '1px solid rgba(255,255,255,0.1)'
                                : '1px solid rgba(0,0,0,0.08)',
                              cursor: 'help',
                              transition: 'all 0.2s ease',
                              '&:hover': {
                                background: isDark
                                  ? 'linear-gradient(135deg, rgba(59,130,246,0.1) 0%, rgba(168,85,247,0.1) 100%)'
                                  : 'linear-gradient(135deg, rgba(59,130,246,0.05) 0%, rgba(168,85,247,0.05) 100%)',
                                transform: 'translateY(-1px)'
                              }
                            }}
                          >
                            <Typography 
                              variant="body2" 
                              sx={{ 
                                fontWeight: 500,
                                color: isDark ? '#e2e8f0' : '#475569',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                whiteSpace: 'nowrap',
                                maxWidth: 150,
                                lineHeight: 1.4
                              }}
                            >
                              {r.reason}
                            </Typography>
                          </Box>
                        </Tooltip>
                      </TableCell>
                      <TableCell align="center">
                        <Box display="flex" justifyContent="center">
                          <Box
                            onClick={(e) => handlePriorityClick(e, r)}
                            sx={{
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              gap: 0.5,
                              transition: 'all 0.2s ease',
                              '&:hover': {
                                transform: 'scale(1.05)'
                              }
                            }}
                          >
                            <Chip 
                              label={r.priority?.toUpperCase()}
                              color={getStatusColor(r.priority||'low')}
                              size="small"
                              sx={{ 
                                fontWeight: 800,
                                minWidth: 85,
                                height: 28,
                                textTransform: 'uppercase',
                                fontSize: '0.75rem',
                                borderRadius: '8px',
                                background: (theme) => {
                                  const colors = {
                                    high: isDark ? 'linear-gradient(135deg, #dc2626, #b91c1c)' : 'linear-gradient(135deg, #fca5a5, #f87171)',
                                    medium: isDark ? 'linear-gradient(135deg, #d97706, #b45309)' : 'linear-gradient(135deg, #fbbf24, #f59e0b)',
                                    low: isDark ? 'linear-gradient(135deg, #059669, #047857)' : 'linear-gradient(135deg, #6ee7b7, #34d399)'
                                  };
                                  return colors[r.priority as keyof typeof colors] || colors.low;
                                },
                                boxShadow: isDark ? '0 2px 8px rgba(0,0,0,0.3)' : '0 2px 8px rgba(0,0,0,0.1)',
                                '& .MuiChip-label': {
                                  color: '#fff',
                                  fontWeight: 800,
                                  textShadow: '0 1px 2px rgba(0,0,0,0.3)'
                                }
                              }}
                            />
                            <KeyboardArrowDown 
                              sx={{ 
                                fontSize: 16, 
                                color: isDark ? '#94a3b8' : '#64748b',
                                ml: 0.5
                              }} 
                            />
                          </Box>
                        </Box>
                      </TableCell>
                      <TableCell align="center">
                        <Box display="flex" justifyContent="center">
                          <Chip 
                            icon={getStatusIcon(r.status)}
                            label={r.status.toUpperCase()}
                              color={getStatusColor(r.status)}
                            size="small"
                            sx={{ 
                              fontWeight: 800,
                              minWidth: 110,
                              height: 28,
                              textTransform: 'uppercase',
                              fontSize: '0.75rem',
                              borderRadius: '8px',
                              boxShadow: isDark ? '0 2px 8px rgba(0,0,0,0.3)' : '0 2px 8px rgba(0,0,0,0.1)',
                              '& .MuiChip-icon': {
                                fontSize: '1rem',
                                marginLeft: '4px'
                              },
                              '& .MuiChip-label': {
                                fontWeight: 800,
                                paddingX: 1
                              }
                            }}
                          />
                        </Box>
                      </TableCell>
                      <TableCell align="center">
                        <Box
                          sx={{
                            px: 2,
                            py: 1,
                            borderRadius: 2,
                            background: isDark
                              ? 'linear-gradient(135deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.02) 100%)'
                              : 'linear-gradient(135deg, rgba(0,0,0,0.02) 0%, rgba(0,0,0,0.05) 100%)',
                            border: isDark
                              ? '1px solid rgba(255,255,255,0.08)'
                              : '1px solid rgba(0,0,0,0.06)'
                          }}
                        >
                          <Typography 
                            variant="body2" 
                            fontWeight="600"
                            sx={{ 
                              color: isDark ? '#94a3b8' : '#64748b',
                              fontSize: '0.85rem'
                            }}
                          >
                            {formatDate(r.reportDate)}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell align="center">
                        <Tooltip title="More actions" arrow>
                          <IconButton 
                            onClick={(e)=>handleMenuOpen(e, r)}
                            sx={{ 
                              width: 44,
                              height: 44,
                              background: isDark
                                ? 'linear-gradient(135deg, rgba(59,130,246,0.15) 0%, rgba(168,85,247,0.15) 100%)'
                                : 'linear-gradient(135deg, rgba(59,130,246,0.08) 0%, rgba(168,85,247,0.08) 100%)',
                              color: isDark ? '#e2e8f0' : '#475569',
                              border: isDark
                                ? '1px solid rgba(255,255,255,0.1)'
                                : '1px solid rgba(0,0,0,0.08)',
                              borderRadius: '12px',
                              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                              '&:hover': { 
                                background: isDark
                                  ? 'linear-gradient(135deg, #3b82f6 0%, #a855f7 100%)'
                                  : 'linear-gradient(135deg, #3b82f6 0%, #a855f7 100%)',
                                color: 'white',
                                transform: 'translateY(-2px) scale(1.05)',
                                boxShadow: isDark 
                                  ? '0 8px 25px rgba(0,0,0,0.4)' 
                                  : '0 8px 25px rgba(0,0,0,0.15)'
                              }
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
            <Divider sx={{ borderColor: isDark ? 'rgba(255,255,255,0.1)' : '#e5e7eb' }} />
            <TablePagination
              component="div"
              count={filtered.length}
              page={page}
              onPageChange={(_,n)=>setPage(n)}
              rowsPerPage={rowsPerPage}
              onRowsPerPageChange={e=>{ setRowsPerPage(+e.target.value); setPage(0); }}
              sx={{ 
                backgroundColor: isDark ? '#1a1b2e' : '#f8fafc',
                color: isDark ? '#fff' : 'inherit',
                '& .MuiTablePagination-toolbar': {
                  paddingX: 3
                },
                '& .MuiTablePagination-selectLabel, & .MuiTablePagination-displayedRows': {
                  color: isDark ? '#fff' : 'inherit'
                },
                '& .MuiSelect-select': {
                  color: isDark ? '#fff' : 'inherit'
                },
                '& .MuiIconButton-root': {
                  color: isDark ? '#fff' : 'inherit'
                }
              }}
            />
          </Card>
        </Fade>
      )}

      {/* Priority Dropdown Menu */}
      <Menu 
        anchorEl={priorityAnchorEl} 
        open={!!priorityAnchorEl} 
        onClose={handlePriorityClose}
        PaperProps={{
          sx: {
            borderRadius: 2,
            boxShadow: isDark 
              ? '0 10px 30px rgba(0,0,0,0.6)' 
              : '0 10px 30px rgba(0,0,0,0.15)',
            border: isDark 
              ? '1px solid rgba(255,255,255,0.1)' 
              : '1px solid #e5e7eb',
            backgroundColor: isDark ? "#23243a" : "#fff",
            minWidth: 160
          }
        }}
      >
        <MenuItem 
          onClick={() => handlePriorityUpdate('high')} 
          sx={{ 
            gap: 1.5, 
            py: 1.5,
            px: 2,
            color: isDark ? '#fff' : 'inherit',
            '&:hover': {
              backgroundColor: isDark ? '#1a1b2e' : 'rgba(220, 38, 38, 0.08)',
              '& .MuiChip-root': {
                transform: 'scale(1.05)'
              }
            },
            transition: 'all 0.2s ease'
          }}
        >
          <Chip 
            label="HIGH" 
            color="error" 
            size="small"
            sx={{ 
              fontWeight: 800,
              fontSize: '0.7rem',
              height: 24,
              minWidth: 60,
              '& .MuiChip-label': {
                px: 1.5
              }
            }}
          />
          <Typography variant="body2" sx={{ color: isDark ? '#fff' : 'inherit' }}>
            High Priority
          </Typography>
        </MenuItem>
        <MenuItem 
          onClick={() => handlePriorityUpdate('medium')} 
          sx={{ 
            gap: 1.5, 
            py: 1.5,
            px: 2,
            color: isDark ? '#fff' : 'inherit',
            '&:hover': {
              backgroundColor: isDark ? '#1a1b2e' : 'rgba(245, 158, 11, 0.08)',
              '& .MuiChip-root': {
                transform: 'scale(1.05)'
              }
            },
            transition: 'all 0.2s ease'
          }}
        >
          <Chip 
            label="MEDIUM" 
            color="warning" 
            size="small"
            sx={{ 
              fontWeight: 800,
              fontSize: '0.7rem',
              height: 24,
              minWidth: 60,
              '& .MuiChip-label': {
                px: 1.5
              }
            }}
          />
          <Typography variant="body2" sx={{ color: isDark ? '#fff' : 'inherit' }}>
            Medium Priority
          </Typography>
        </MenuItem>
        <MenuItem 
          onClick={() => handlePriorityUpdate('low')} 
          sx={{ 
            gap: 1.5, 
            py: 1.5,
            px: 2,
            color: isDark ? '#fff' : 'inherit',
            '&:hover': {
              backgroundColor: isDark ? '#1a1b2e' : 'rgba(16, 185, 129, 0.08)',
              '& .MuiChip-root': {
                transform: 'scale(1.05)'
              }
            },
            transition: 'all 0.2s ease'
          }}
        >
          <Chip 
            label="LOW" 
            color="success" 
            size="small"
            sx={{ 
              fontWeight: 800,
              fontSize: '0.7rem',
              height: 24,
              minWidth: 60,
              '& .MuiChip-label': {
                px: 1.5
              }
            }}
          />
          <Typography variant="body2" sx={{ color: isDark ? '#fff' : 'inherit' }}>
            Low Priority
          </Typography>
        </MenuItem>
      </Menu>

      {/* Action Menu */}
      <Menu 
        anchorEl={anchorEl} 
        open={!!anchorEl} 
        onClose={handleMenuClose}
        PaperProps={{
          sx: {
            borderRadius: 2,
            boxShadow: isDark 
              ? '0 10px 30px rgba(0,0,0,0.6)' 
              : '0 10px 30px rgba(0,0,0,0.15)',
            border: isDark 
              ? '1px solid rgba(255,255,255,0.1)' 
              : '1px solid #e5e7eb',
            backgroundColor: isDark ? "#23243a" : "#fff"
          }
        }}
      >
        <MenuItem 
          onClick={handleView} 
          sx={{ 
            gap: 1, 
            py: 1.5,
            color: isDark ? '#fff' : 'inherit',
            '&:hover': {
              backgroundColor: isDark ? '#1a1b2e' : 'rgba(0,0,0,0.04)'
            }
          }}
        >
          <Visibility color="primary" /> View Details
        </MenuItem>
        <Divider sx={{ borderColor: isDark ? 'rgba(255,255,255,0.1)' : '#e5e7eb' }} />
        <MenuItem 
          onClick={()=>handleStatusUpdate('resolved')} 
          sx={{ 
            gap: 1, 
            py: 1.5,
            color: isDark ? '#fff' : 'inherit',
            '&:hover': {
              backgroundColor: isDark ? '#1a1b2e' : 'rgba(0,0,0,0.04)'
            }
          }}
        >
          <CheckCircle color="success" /> Mark Resolved
        </MenuItem>
        <MenuItem 
          onClick={()=>handleStatusUpdate('reviewed')} 
          sx={{ 
            gap: 1, 
            py: 1.5,
            color: isDark ? '#fff' : 'inherit',
            '&:hover': {
              backgroundColor: isDark ? '#1a1b2e' : 'rgba(0,0,0,0.04)'
            }
          }}
        >
          <Visibility color="info" /> Mark Reviewed
        </MenuItem>
        <MenuItem 
          onClick={()=>handleStatusUpdate('rejected')} 
          sx={{ 
            gap: 1, 
            py: 1.5,
            color: isDark ? '#fff' : 'inherit',
            '&:hover': {
              backgroundColor: isDark ? '#1a1b2e' : 'rgba(0,0,0,0.04)'
            }
          }}
        >
          <Cancel color="error" /> Reject Report
        </MenuItem>
        <MenuItem 
          onClick={()=>handleStatusUpdate('pending')} 
          sx={{ 
            gap: 1, 
            py: 1.5,
            color: isDark ? '#fff' : 'inherit',
            '&:hover': {
              backgroundColor: isDark ? '#1a1b2e' : 'rgba(0,0,0,0.04)'
            }
          }}
        >
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
            boxShadow: isDark 
              ? '0 20px 60px rgba(0,0,0,0.6)' 
              : '0 20px 60px rgba(0,0,0,0.15)',
            backgroundColor: isDark ? "#23243a" : "#fff"
          }
        }}
      >
        <DialogTitle sx={{ 
          background: isDark 
            ? 'linear-gradient(135deg, #4c4c6d 0%, #3e3e56 100%)'
            : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          fontWeight: 700,
          fontSize: '1.5rem',
          textAlign: 'center'
        }}>
          Report Details
        </DialogTitle>
        <DialogContent 
          dividers 
          sx={{ 
            p: 4,
            backgroundColor: isDark ? "#23243a" : "#fff",
            borderColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.12)'
          }}
        >
          {usersLoading ? (
            <Box textAlign="center" py={4}>
              <CircularProgress size={30} sx={{ mb: 2 }} />
              <Typography color={isDark ? "rgba(255,255,255,0.7)" : "text.secondary"}>
                Loading user information...
              </Typography>
            </Box>
          ) : selectedReport ? (
            <Stack spacing={3}>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <Card sx={{ 
                    p: 3, 
                    backgroundColor: isDark ? '#1a1b2e' : '#f8fafc', 
                    borderRadius: 2 
                  }}>
                    <Typography 
                    sx={{ 
                    
                    color: isDark ? 'rgba(74, 83, 93, 1)':'#1a1b2e', 
                   
                  }}
                      variant="h6" 
                      color="primary" 
                      fontWeight="700" 
                      mb={2} 
                      textAlign="center"
                    >
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
                        <Typography 
                          fontWeight="600"
                          sx={{ color: isDark ? '#fff' : 'inherit' }}
                        >
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
                  <Card sx={{ 
                    p: 3, 
                    backgroundColor: isDark ? '#1a1b2e' : '#f8fafc', 
                    borderRadius: 2 
                  }}>
                    <Typography 
                      variant="h6" 
                      color="secondary" 
                      fontWeight="700" 
                      mb={2} 
                      textAlign="center"
                    >
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
                        <Typography 
                          fontWeight="600"
                          sx={{ color: isDark ? '#fff' : 'inherit' }}
                        >
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
              
              <Card sx={{ 
                p: 3, 
                borderRadius: 2,
                backgroundColor: isDark ? '#1a1b2e' : '#fff',
                border: isDark ? '1px solid rgba(255,255,255,0.1)' : 'none'
              }}>
                <Typography 
                  variant="h6" 
                  fontWeight="700" 
                  mb={2} 
                  textAlign="center"
                  sx={{ color: isDark ? '#fff' : 'inherit' }}
                >
                  Report Information
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <Typography 
                      color={isDark ? "rgba(255,255,255,0.7)" : "text.secondary"} 
                      variant="body2" 
                      textAlign="center"
                    >
                      Reason
                    </Typography>
                    <Typography 
                      fontWeight="600" 
                      mb={2} 
                      textAlign="center"
                      sx={{ color: isDark ? '#fff' : 'inherit' }}
                    >
                      {selectedReport.report || selectedReport.reason}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography 
                      color={isDark ? "rgba(255,255,255,0.7)" : "text.secondary"} 
                      variant="body2" 
                      textAlign="center"
                    >
                      Report Date
                    </Typography>
                    <Typography 
                      fontWeight="600" 
                      mb={2} 
                      textAlign="center"
                      sx={{ color: isDark ? '#fff' : 'inherit' }}
                    >
                      {formatDate(selectedReport.reportDate)}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography 
                      color={isDark ? "rgba(255,255,255,0.7)" : "text.secondary"} 
                      variant="body2" 
                      textAlign="center"
                    >
                      Status
                    </Typography>
                    <Box display="flex" justifyContent="center" mb={3}>
                      <Chip 
                        icon={getStatusIcon(selectedReport.status)}
                        label={selectedReport.status.toUpperCase()}
                        color={getStatusColor(selectedReport.status)}
                        sx={{ fontWeight: 700 }}
                      />
                    </Box>
                  </Grid>
                </Grid>
              </Card>
            </Stack>
          ) : (
            <Typography 
              textAlign="center"
              sx={{ color: isDark ? '#fff' : 'inherit' }}
            >
              No report selected.
            </Typography>
          )}
        </DialogContent>
        <DialogActions sx={{ 
          p: 3, 
          justifyContent: 'center',
          backgroundColor: isDark ? "#23243a" : "#fff"
        }}>
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