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
import { alpha } from '@mui/material/styles';
import type { SvgIconComponent } from '@mui/icons-material';

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

  const chartColors = {
    drivers: theme.palette.primary.main,
    rescuers: theme.palette.secondary.main,
    admins: theme.palette.warning.main,
  };

  const CustomTooltip: React.FC<CustomTooltipProps> = ({
    active,
    payload,
    label,
  }) => {
    if (active && payload && payload.length) {
      return (
        <Paper
          sx={{
            p: 2,
            borderRadius: 2,
            bgcolor: 'background.paper',
          }}
        >
          <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1 }}>
            {label}
          </Typography>
          {payload.map((entry, index) => (
            <Box key={`${entry.name}-${index}`} display="flex" alignItems="center" gap={1}>
              <Box
                sx={{
                  width: 8,
                  height: 8,
                  borderRadius: 0.5,
                  backgroundColor: entry.color,
                }}
              />
              <Typography variant="body2" color="text.secondary">
                {entry.name}:{' '}
                <Box component="strong" sx={{ color: 'text.primary' }}>
                  {entry.value}
                </Box>
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
        minHeight="55vh"
      >
        <Box textAlign="center">
          <CircularProgress
            size={48}
            thickness={4}
            sx={{ color: 'primary.main', mb: 2 }}
          />
          <Typography variant="body1" color="text.secondary" fontWeight={500}>
            Loading dashboard…
          </Typography>
        </Box>
      </Box>
    );
  }

  const totalUsers = totals.drivers + totals.rescuers + totals.admins;

  const statCards: Array<{
    label: string;
    value: number;
    icon: SvgIconComponent;
    color: string;
  }> = [
    { label: 'Total Users', value: totalUsers, icon: TrendingUpIcon, color: theme.palette.primary.main },
    { label: 'Drivers', value: totals.drivers, icon: DriveEtaIcon, color: theme.palette.info.main },
    { label: 'Rescuers', value: totals.rescuers, icon: ReportProblemIcon, color: theme.palette.secondary.main },
    { label: 'Admins', value: totals.admins, icon: AdminPanelSettingsIcon, color: theme.palette.warning.main },
  ];

  return (
    <Box sx={{ pb: 2 }}>
      <Box mb={3.5}>
        <Typography variant="h5" sx={{ fontWeight: 800, letterSpacing: '-0.02em', mb: 0.5 }}>
          Operations overview
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Live counts and registration trends across RushRescue
        </Typography>
      </Box>

      <Grid container spacing={2.5} mb={3.5}>
        {statCards.map(({ label, value, icon: Icon, color }) => (
          <Grid key={label} size={{ xs: 12, sm: 6, md: 3 }}>
            <Card
              sx={{
                borderRadius: 3,
                height: '100%',
                transition: 'transform 0.25s ease, border-color 0.25s ease',
                borderColor: alpha(color, isDark ? 0.35 : 0.2),
                background: isDark
                  ? `linear-gradient(160deg, ${alpha(color, 0.12)} 0%, ${alpha('#fff', 0.02)} 100%)`
                  : `linear-gradient(160deg, ${alpha(color, 0.08)} 0%, #fff 70%)`,
                '&:hover': {
                  transform: 'translateY(-4px)',
                  borderColor: alpha(color, 0.45),
                },
              }}
            >
              <CardContent sx={{ p: 2.75, '&:last-child': { pb: 2.75 } }}>
                <Box display="flex" alignItems="flex-start" justifyContent="space-between">
                  <Box>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 0.75, fontWeight: 600 }}>
                      {label}
                    </Typography>
                    <Typography variant="h4" sx={{ fontWeight: 800, letterSpacing: '-0.03em' }}>
                      {value.toLocaleString()}
                    </Typography>
                  </Box>
                  <Box
                    sx={{
                      width: 44,
                      height: 44,
                      borderRadius: 2,
                      display: 'grid',
                      placeItems: 'center',
                      bgcolor: alpha(color, isDark ? 0.2 : 0.12),
                      color,
                    }}
                  >
                    <Icon sx={{ fontSize: 24 }} />
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Paper
        sx={{
          borderRadius: 3,
          p: { xs: 2.5, md: 3.5 },
          bgcolor: 'background.paper',
        }}
      >
        <Box
          display="flex"
          alignItems={{ xs: 'flex-start', sm: 'center' }}
          justifyContent="space-between"
          flexDirection={{ xs: 'column', sm: 'row' }}
          gap={1}
          mb={3}
        >
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 700 }}>
              Registration trends
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Monthly new users · {new Date().getFullYear()}
            </Typography>
          </Box>
        </Box>

        <Box sx={{ height: 380 }}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={chartData}
              margin={{ top: 12, right: 16, left: 0, bottom: 8 }}
            >
              <XAxis
                dataKey="month"
                axisLine={false}
                tickLine={false}
                tick={{
                  fill: theme.palette.text.secondary,
                  fontSize: 12,
                  fontWeight: 500,
                }}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{
                  fill: theme.palette.text.secondary,
                  fontSize: 12,
                  fontWeight: 500,
                }}
                domain={[0, 'dataMax + 3']}
              />
              <CartesianGrid
                strokeDasharray="4 4"
                stroke={theme.palette.divider}
                vertical={false}
              />
              <Tooltip content={<CustomTooltip />} />

              <Line
                type="monotone"
                dataKey="drivers"
                name="Drivers"
                stroke={chartColors.drivers}
                strokeWidth={2.5}
                dot={{ r: 3, fill: chartColors.drivers, strokeWidth: 0 }}
                activeDot={{ r: 5, fill: chartColors.drivers, strokeWidth: 0 }}
              />
              <Line
                type="monotone"
                dataKey="rescuers"
                name="Rescuers"
                stroke={chartColors.rescuers}
                strokeWidth={2.5}
                dot={{ r: 3, fill: chartColors.rescuers, strokeWidth: 0 }}
                activeDot={{ r: 5, fill: chartColors.rescuers, strokeWidth: 0 }}
              />
              <Line
                type="monotone"
                dataKey="admins"
                name="Admins"
                stroke={chartColors.admins}
                strokeWidth={2.5}
                dot={{ r: 3, fill: chartColors.admins, strokeWidth: 0 }}
                activeDot={{ r: 5, fill: chartColors.admins, strokeWidth: 0 }}
              />

              <Legend
                verticalAlign="top"
                height={36}
                iconType="circle"
                wrapperStyle={{
                  fontSize: '13px',
                  fontWeight: 600,
                  color: theme.palette.text.secondary,
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