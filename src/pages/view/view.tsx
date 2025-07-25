import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  CircularProgress,
  useTheme,
  Paper,
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
} from 'recharts';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import DriveEtaIcon from '@mui/icons-material/DriveEta';
import ReportProblemIcon from '@mui/icons-material/ReportProblem';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../firebase';

const DashboardView = () => {
  const [chartData, setChartData] = useState([]);
  const [totals, setTotals] = useState({ drivers: 0, rescuers: 0, admins: 0 });
  const [loading, setLoading] = useState(true);
  const theme = useTheme();

  useEffect(() => {
    const fetchCounts = async () => {
      try {
        const [userSnap, adminSnap] = await Promise.all([
          getDocs(collection(db, 'users')),
          getDocs(collection(db, 'admins')),
        ]);

        const counts = {
          drivers: 0,
          rescuers: 0,
          admins: 0,
        };

        const monthly = Array.from({ length: 12 }, (_, i) => ({
          month: new Date(0, i).toLocaleString('default', { month: 'short' }),
          drivers: 0,
          rescuers: 0,
          admins: 0,
        }));

        userSnap.forEach(doc => {
          const user = doc.data();
          const role = user.role;
          const createdAt = user.createdAt?.toDate?.();

          if (role === 'driver') counts.drivers++;
          else if (role === 'rescuer') counts.rescuers++;

          if (createdAt instanceof Date && !isNaN(createdAt)) {
            const m = createdAt.getMonth();
            if (role === 'driver') monthly[m].drivers++;
            else if (role === 'rescuer') monthly[m].rescuers++;
          }
        });

        adminSnap.forEach(doc => {
          const admin = doc.data();
          counts.admins++;
          const createdAt = admin.createdAt?.toDate?.();
          if (createdAt instanceof Date && !isNaN(createdAt)) {
            const m = createdAt.getMonth();
            monthly[m].admins++;
          }
        });

        setTotals(counts);
        setChartData(monthly);
        
        // Debug: Log data to console
        console.log('Chart Data:', monthly);
        console.log('Totals:', counts);
      } catch (err) {
        console.error('Error fetching data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchCounts();
  }, []);

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <Paper
          elevation={8}
          sx={{
            p: 2,
            borderRadius: 3,
            border: 'none',
            background: 'linear-gradient(145deg, rgba(255,255,255,0.95) 0%, rgba(248,250,252,0.95) 100%)',
            backdropFilter: 'blur(10px)',
            boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
          }}
        >
          <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1, color: '#1e293b' }}>
            {label}
          </Typography>
          {payload.map((entry, index) => (
            <Box key={index} display="flex" alignItems="center" gap={1}>
              <Box
                sx={{
                  width: 8,
                  height: 8,
                  borderRadius: '50%',
                  backgroundColor: entry.color,
                }}
              />
              <Typography variant="body2" sx={{ color: '#475569' }}>
                {entry.name}: <strong>{entry.value}</strong>
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
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        }}
      >
        <Box textAlign="center">
          <CircularProgress 
            size={60} 
            thickness={4}
            sx={{ 
              color: '#ffffff',
              mb: 2,
              '& .MuiCircularProgress-circle': {
                strokeLinecap: 'round',
              }
            }} 
          />
          <Typography variant="h6" sx={{ color: '#ffffff', fontWeight: 300 }}>
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
        background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
        p: 4,
      }}
    >
      {/* Header */}
      <Box textAlign="center" mb={6}>
        <Typography 
          variant="h3" 
          sx={{ 
            fontWeight: 700,
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            mb: 1,
          }}
        >
          Dashboard Analytics
        </Typography>
        <Typography variant="h6" sx={{ color: '#64748b', fontWeight: 400 }}>
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
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: 'white',
              transition: 'all 0.3s ease',
              '&:hover': {
                transform: 'translateY(-8px)',
                boxShadow: '0 20px 40px rgba(102, 126, 234, 0.3)',
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
                    {totalUsers}
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
              background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
              color: 'white',
              transition: 'all 0.3s ease',
              '&:hover': {
                transform: 'translateY(-8px)',
                boxShadow: '0 20px 40px rgba(79, 172, 254, 0.3)',
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
                    {totals.drivers}
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
              background: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
              color: 'white',
              transition: 'all 0.3s ease',
              '&:hover': {
                transform: 'translateY(-8px)',
                boxShadow: '0 20px 40px rgba(67, 233, 123, 0.3)',
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
                    {totals.rescuers}
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
              background: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
              color: 'white',
              transition: 'all 0.3s ease',
              '&:hover': {
                transform: 'translateY(-8px)',
                boxShadow: '0 20px 40px rgba(250, 112, 154, 0.3)',
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
                    {totals.admins}
                  </Typography>
                </Box>
                <AdminPanelSettingsIcon sx={{ fontSize: 40, opacity: 0.8 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Chart */}
      <Paper
        elevation={0}
        sx={{
          borderRadius: 6,
          p: 4,
          background: 'rgba(255, 255, 255, 0.9)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          boxShadow: '0 25px 50px rgba(0, 0, 0, 0.1)',
        }}
      >
        <Typography 
          variant="h5" 
          sx={{ 
            fontWeight: 600, 
            mb: 4, 
            textAlign: 'center',
            color: '#1e293b'
          }}
        >
          Monthly User Registration Trends
        </Typography>

        <Box sx={{ height: 400 }}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
              <XAxis 
                dataKey="month" 
                axisLine={false}
                tickLine={false}
                tick={{ fill: '#64748b', fontSize: 12, fontWeight: 500 }}
              />
              <YAxis 
                axisLine={false}
                tickLine={false}
                tick={{ fill: '#64748b', fontSize: 12, fontWeight: 500 }}
              />
              <CartesianGrid 
                strokeDasharray="3 3" 
                stroke="#e2e8f0" 
                vertical={false}
              />
              <Tooltip content={<CustomTooltip />} />
              
              <Line
                type="monotone"
                dataKey="drivers"
                name="Drivers"
                stroke="#4facfe"
                strokeWidth={4}
                dot={{ r: 5, fill: '#4facfe', strokeWidth: 2, stroke: '#fff' }}
                activeDot={{ r: 7, fill: '#4facfe', strokeWidth: 3, stroke: '#fff' }}
              />
              <Line
                type="monotone"
                dataKey="rescuers"
                name="Rescuers"
                stroke="#43e97b"
                strokeWidth={4}
                dot={{ r: 5, fill: '#43e97b', strokeWidth: 2, stroke: '#fff' }}
                activeDot={{ r: 7, fill: '#43e97b', strokeWidth: 3, stroke: '#fff' }}
              />
              <Line
                type="monotone"
                dataKey="admins"
                name="Admins"
                stroke="#fa709a"
                strokeWidth={4}
                dot={{ r: 5, fill: '#fa709a', strokeWidth: 2, stroke: '#fff' }}
                activeDot={{ r: 7, fill: '#fa709a', strokeWidth: 3, stroke: '#fff' }}
              />
              
              <Legend 
                verticalAlign="top" 
                height={36}
                iconType="circle"
                wrapperStyle={{
                  fontSize: '14px',
                  fontWeight: 500,
                  color: '#475569'
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