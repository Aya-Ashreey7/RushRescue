import React, { useEffect, useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  CircularProgress,
  Paper,
  useTheme,
} from '@mui/material';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Legend,
  type TooltipProps,
} from 'recharts';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import DriveEtaIcon from '@mui/icons-material/DriveEta';
import ReportProblemIcon from '@mui/icons-material/ReportProblem';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../firebase';

interface ChartItem {
  month: string;
  drivers: number;
  rescuers: number;
  admins: number;
}

interface Totals {
  drivers: number;
  rescuers: number;
  admins: number;
}

interface CustomTooltipProps extends TooltipProps<number, string> {
  active?: boolean;
  payload?: Array<{
    name: string;
    value: number;
    color: string;
  }>;
  label?: string;
}

const DashboardView: React.FC = () => {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
  const [chartData, setChartData] = useState<ChartItem[]>([]);
  const [totals, setTotals] = useState<Totals>({ drivers: 0, rescuers: 0, admins: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCounts = async () => {
      try {
        const [usersSnap, adminsSnap] = await Promise.all([
          getDocs(collection(db, 'users')),
          getDocs(collection(db, 'admins'))
        ]);

        const counts: Totals = { drivers: 0, rescuers: 0, admins: 0 };
        const monthly: ChartItem[] = Array.from({ length: 12 }, (_, i) => ({
          month: new Date(0, i).toLocaleString('default', { month: 'short' }),
          drivers: 0,
          rescuers: 0,
          admins: 0
        }));

        usersSnap.forEach(doc => {
          const user = doc.data();
          const role = (user.role || '').toLowerCase();
          const createdAt = user.createdAt?.toDate?.() || new Date();
          const monthIdx = createdAt.getMonth();

          if (role === 'driver') {
            counts.drivers++;
            monthly[monthIdx].drivers++;
          } else if (role === 'rescuer') {
            counts.rescuers++;
            monthly[monthIdx].rescuers++;
          }
        });

        adminsSnap.forEach(doc => {
          const admin = doc.data();
          const createdAt = admin.createdAt?.toDate?.() || new Date();
          const monthIdx = createdAt.getMonth();

          counts.admins++;
          monthly[monthIdx].admins++;
        });

        setTotals(counts);
        setChartData(monthly);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCounts();
  }, []);

  const CustomTooltip: React.FC<CustomTooltipProps> = ({ 
    active, 
    payload, 
    label 
  }) => {
    if (active && payload && payload.length) {
      return (
        <Paper
          elevation={8}
          sx={{
            p: 2,
            borderRadius: 3,
            border: 'none',
            background: isDark 
              ? 'linear-gradient(145deg, rgba(30,41,59,0.95) 0%, rgba(15,23,42,0.95) 100%)'
              : 'linear-gradient(145deg, rgba(255,255,255,0.95) 0%, rgba(248,250,252,0.95) 100%)',
            backdropFilter: 'blur(10px)',
            boxShadow: isDark ? '0 8px 32px rgba(0,0,0,0.3)' : '0 8px 32px rgba(0,0,0,0.1)',
          }}
        >
          <Typography variant="subtitle2" sx={{ 
            fontWeight: 600, 
            mb: 1, 
            color: isDark ? '#e2e8f0' : '#1e293b' 
          }}>
            {label}
          </Typography>
          {payload.map((entry, index) => (
            <Box key={`${entry.name}-${index}`} display="flex" alignItems="center" gap={1}>
              <Box
                sx={{
                  width: 8,
                  height: 8,
                  borderRadius: '50%',
                  backgroundColor: entry.color,
                }}
              />
              <Typography variant="body2" sx={{ color: isDark ? '#94a3b8' : '#475569' }}>
                {entry.name}: <strong style={{ color: isDark ? '#f8fafc' : '#1e293b' }}>{entry.value}</strong>
              </Typography>
            </Box>
          ))}
        </Paper>
      );
    }
    return null;
  };

  if (loading) {
    return (
      <Box 
        display="flex" 
        justifyContent="center" 
        alignItems="center" 
        minHeight="70vh"
        sx={{
          background: isDark 
            ? 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)'
            : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        }}
      >
        <Box textAlign="center">
          <CircularProgress 
            size={60} 
            thickness={4}
            sx={{ 
              color: isDark ? '#38bdf8' : '#ffffff',
              mb: 2,
              '& .MuiCircularProgress-circle': {
                strokeLinecap: 'round',
              }
            }} 
          />
          <Typography variant="h6" sx={{ 
            color: isDark ? '#e2e8f0' : '#ffffff', 
            fontWeight: 300 
          }}>
            Loading Dashboard...
          </Typography>
        </Box>
      </Box>
    );
  }

  const totalUsers = totals.drivers + totals.rescuers + totals.admins;

  return (
    <Box 
      sx={{ 
        minHeight: '100vh',
        background: isDark
          ? 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)'
          : 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
        p: 4,
      }}
    >
      {/* Header */}
      <Box textAlign="center" mb={6}>
        <Typography 
          variant="h3" 
          sx={{ 
            fontWeight: 700,
            background: isDark
              ? 'linear-gradient(135deg, #e2e8f0 0%, #94a3b8 100%)'
              : 'linear-gradient(135deg, #1e293b 0%, #334155 100%)',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            mb: 1,
          }}
        >
          Dashboard Analytics
        </Typography>
        <Typography variant="h6" sx={{ 
          color: isDark ? '#94a3b8' : '#64748b', 
          fontWeight: 400 
        }}>
          Real-time user insights and trends
        </Typography>
      </Box>

      {/* Stats Cards */}
      <Grid container spacing={3} mb={6} justifyContent="center">
        <Grid item xs={12} sm={6} md={3}>
          <Card 
            elevation={0}
            sx={{ 
              borderRadius: 4,
              background: isDark
                ? 'linear-gradient(135deg, #7c3aed 0%, #4f46e5 100%)'
                : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: 'white',
              transition: 'all 0.3s ease',
              cursor: 'pointer',
              '&:hover': {
                transform: 'translateY(-8px)',
                boxShadow: isDark
                  ? '0 20px 40px rgba(124, 58, 237, 0.3)'
                  : '0 20px 40px rgba(102, 126, 234, 0.3)',
              }
            }}
          >
            <CardContent sx={{ p: 3 }}>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography variant="body2" sx={{ opacity: 0.8, mb: 1 }}>
                    Total Users
                  </Typography>
                  <Typography variant="h4" sx={{ fontWeight: 700 }}>
                    {totalUsers.toLocaleString()}
                  </Typography>
                </Box>
                <TrendingUpIcon sx={{ fontSize: 40, opacity: 0.8 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card 
            elevation={0}
            sx={{ 
              borderRadius: 4,
              background: isDark
                ? 'linear-gradient(135deg, #0891b2 0%, #06b6d4 100%)'
                : 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
              color: 'white',
              transition: 'all 0.3s ease',
              cursor: 'pointer',
              '&:hover': {
                transform: 'translateY(-8px)',
                boxShadow: isDark
                  ? '0 20px 40px rgba(8, 145, 178, 0.3)'
                  : '0 20px 40px rgba(79, 172, 254, 0.3)',
              }
            }}
          >
            <CardContent sx={{ p: 3 }}>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography variant="body2" sx={{ opacity: 0.8, mb: 1 }}>
                    Drivers
                  </Typography>
                  <Typography variant="h4" sx={{ fontWeight: 700 }}>
                    {totals.drivers.toLocaleString()}
                  </Typography>
                </Box>
                <DriveEtaIcon sx={{ fontSize: 40, opacity: 0.8 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card 
            elevation={0}
            sx={{ 
              borderRadius: 4,
              background: isDark
                ? 'linear-gradient(135deg, #059669 0%, #10b981 100%)'
                : 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
              color: 'white',
              transition: 'all 0.3s ease',
              cursor: 'pointer',
              '&:hover': {
                transform: 'translateY(-8px)',
                boxShadow: isDark
                  ? '0 20px 40px rgba(5, 150, 105, 0.3)'
                  : '0 20px 40px rgba(67, 233, 123, 0.3)',
              }
            }}
          >
            <CardContent sx={{ p: 3 }}>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography variant="body2" sx={{ opacity: 0.8, mb: 1 }}>
                    Rescuers
                  </Typography>
                  <Typography variant="h4" sx={{ fontWeight: 700 }}>
                    {totals.rescuers.toLocaleString()}
                  </Typography>
                </Box>
                <ReportProblemIcon sx={{ fontSize: 40, opacity: 0.8 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card 
            elevation={0}
            sx={{ 
              borderRadius: 4,
              background: isDark
                ? 'linear-gradient(135deg, #c026d3 0%, #d946ef 100%)'
                : 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
              color: 'white',
              transition: 'all 0.3s ease',
              cursor: 'pointer',
              '&:hover': {
                transform: 'translateY(-8px)',
                boxShadow: isDark
                  ? '0 20px 40px rgba(192, 38, 211, 0.3)'
                  : '0 20px 40px rgba(250, 112, 154, 0.3)',
              }
            }}
          >
            <CardContent sx={{ p: 3 }}>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography variant="body2" sx={{ opacity: 0.8, mb: 1 }}>
                    Admins
                  </Typography>
                  <Typography variant="h4" sx={{ fontWeight: 700 }}>
                    {totals.admins.toLocaleString()}
                  </Typography>
                </Box>
                <AdminPanelSettingsIcon sx={{ fontSize: 40, opacity: 0.8 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* User Registration Chart */}
      <Paper
        elevation={0}
        sx={{
          borderRadius: 6,
          p: 4,
          mb: 4,
          background: isDark
            ? 'rgba(15, 23, 42, 0.95)'
            : 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(20px)',
          border: isDark
            ? '1px solid rgba(255, 255, 255, 0.1)'
            : '1px solid rgba(255, 255, 255, 0.2)',
          boxShadow: isDark
            ? '0 25px 50px rgba(0, 0, 0, 0.3)'
            : '0 25px 50px rgba(0, 0, 0, 0.1)',
        }}
      >
        <Typography 
          variant="h5" 
          sx={{ 
            fontWeight: 600, 
            mb: 4, 
            textAlign: 'center',
            color: isDark ? '#e2e8f0' : '#1e293b'
          }}
        >
          User Registration Trends ({new Date().getFullYear()})
        </Typography>

        <Box sx={{ height: 400 }}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart 
              data={chartData} 
              margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
            >
              <defs>
                <linearGradient id="driversGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={isDark ? '#0891b2' : '#4facfe'} stopOpacity={0.6}/>
                  <stop offset="100%" stopColor={isDark ? '#0891b2' : '#4facfe'} stopOpacity={0.05}/>
                </linearGradient>
                <linearGradient id="rescuersGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={isDark ? '#059669' : '#43e97b'} stopOpacity={0.6}/>
                  <stop offset="100%" stopColor={isDark ? '#059669' : '#43e97b'} stopOpacity={0.05}/>
                </linearGradient>
              </defs>
              
              <XAxis 
                dataKey="month" 
                axisLine={false}
                tickLine={false}
                tick={{ 
                  fill: isDark ? '#94a3b8' : '#64748b', 
                  fontSize: 12, 
                  fontWeight: 500 
                }}
              />
              <YAxis 
                axisLine={false}
                tickLine={false}
                tick={{ 
                  fill: isDark ? '#94a3b8' : '#64748b', 
                  fontSize: 12, 
                  fontWeight: 500 
                }}
                domain={[0, 'dataMax + 3']}
              />
              <CartesianGrid 
                strokeDasharray="3 3" 
                stroke={isDark ? '#1e293b' : '#e2e8f0'} 
                vertical={false}
                opacity={0.5}
              />
              <Tooltip content={<CustomTooltip />} />
              
              <Line
                type="monotone"
                dataKey="drivers"
                name="Drivers"
                stroke={isDark ? '#06b6d4' : '#4facfe'}
                strokeWidth={3}
                dot={{ 
                  r: 4, 
                  fill: isDark ? '#06b6d4' : '#4facfe', 
                  strokeWidth: 2, 
                  stroke: isDark ? '#0f172a' : '#fff' 
                }}
                activeDot={{ 
                  r: 6, 
                  fill: isDark ? '#06b6d4' : '#4facfe', 
                  strokeWidth: 3, 
                  stroke: isDark ? '#0f172a' : '#fff' 
                }}
              />
              <Line
                type="monotone"
                dataKey="rescuers"
                name="Rescuers"
                stroke={isDark ? '#10b981' : '#43e97b'}
                strokeWidth={3}
                dot={{ 
                  r: 4, 
                  fill: isDark ? '#10b981' : '#43e97b', 
                  strokeWidth: 2, 
                  stroke: isDark ? '#0f172a' : '#fff' 
                }}
                activeDot={{ 
                  r: 6, 
                  fill: isDark ? '#10b981' : '#43e97b', 
                  strokeWidth: 3, 
                  stroke: isDark ? '#0f172a' : '#fff' 
                }}
              />
              <Line
                type="monotone"
                dataKey="admins"
                name="Admins"
                stroke={isDark ? '#d946ef' : '#fa709a'}
                strokeWidth={3}
                dot={{ 
                  r: 4, 
                  fill: isDark ? '#d946ef' : '#fa709a', 
                  strokeWidth: 2, 
                  stroke: isDark ? '#0f172a' : '#fff' 
                }}
                activeDot={{ 
                  r: 6, 
                  fill: isDark ? '#d946ef' : '#fa709a', 
                  strokeWidth: 3, 
                  stroke: isDark ? '#0f172a' : '#fff' 
                }}
              />
              
              <Legend 
                verticalAlign="top" 
                height={36}
                iconType="circle"
                wrapperStyle={{
                  fontSize: '14px',
                  fontWeight: 500,
                  color: isDark ? '#94a3b8' : '#475569'
                }}
              />
            </LineChart>
          </ResponsiveContainer>
        </Box>
      </Paper>
    </Box>
  );
};

export default DashboardView;