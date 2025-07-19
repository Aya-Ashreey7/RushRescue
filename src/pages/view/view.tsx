import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  CircularProgress,
} from "@mui/material";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Legend,
} from "recharts";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import DriveEtaIcon from "@mui/icons-material/DriveEta";
import ReportProblemIcon from "@mui/icons-material/ReportProblem";
import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../firebase";
import Loader from "../../components/Loader";

const DashboardView = () => {
  const [chartData, setChartData] = useState([]);
  const [totals, setTotals] = useState({ drivers: 0, rescuers: 0, admins: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCounts = async () => {
      try {
        const snapshot = await getDocs(collection(db, "users"));
        const users = snapshot.docs.map((doc) => doc.data());

        const counts = {
          drivers: 0,
          rescuers: 0,
          admins: 0,
        };

        const monthly = Array(12)
          .fill(null)
          .map((_, index) => ({
            month: new Date(0, index).toLocaleString("default", {
              month: "short",
            }),
            drivers: 0,
            rescuers: 0,
            admins: 0,
          }));

        users.forEach((user) => {
          const createdAt = user.createdAt?.toDate?.() || new Date();
          const month = createdAt.getMonth();

          if (user.role === "driver") {
            counts.drivers++;
            monthly[month].drivers++;
          } else if (user.role === "rescuer") {
            counts.rescuers++;
            monthly[month].rescuers++;
          } else if (user.role === "admin") {
            counts.admins++;
            monthly[month].admins++;
          }
        });

        setTotals(counts);
        setChartData(monthly);
      } catch (error) {
        console.error("Error fetching user data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCounts();
  }, []);

  if (loading) {
    return <Loader />;
  }

  return (
    <Box sx={{ maxWidth: 1300, mx: "auto", pt: 4 }}>
      <Typography variant="h5" my={2} color="text.secondary">
        Total Users
      </Typography>

      {/* Chart */}
      <Box
        sx={{
          width: "100%",
          height: 300,
          backgroundColor: "#eef1f6",
          borderRadius: 3,
          p: 2,
        }}
      >
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={chartData}
            margin={{ top: 20, right: 30, left: 0, bottom: 5 }}
          >
            <defs>
              <linearGradient id="colorDrivers" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3f51b5" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#3f51b5" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="colorRescuers" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#4caf50" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#4caf50" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="colorAdmins" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#9c27b0" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#9c27b0" stopOpacity={0} />
              </linearGradient>
            </defs>

            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip
              contentStyle={{
                backgroundColor: "#fff",
                borderRadius: 8,
                border: "1px solid #ddd",
              }}
              formatter={(value: number) => value.toFixed(0)}
            />
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <Line
              type="monotone"
              dataKey="drivers"
              name="Drivers"
              stroke="#3f51b5"
              strokeWidth={3}
              dot={{ r: 4 }}
              activeDot={{ r: 6 }}
              fill="url(#colorDrivers)"
            />
            <Line
              type="monotone"
              dataKey="rescuers"
              name="Rescuers"
              stroke="#4caf50"
              strokeWidth={2}
              dot={{ r: 3 }}
              activeDot={{ r: 5 }}
              fill="url(#colorRescuers)"
            />
            <Line
              type="monotone"
              dataKey="admins"
              name="Admins"
              stroke="#9c27b0"
              strokeWidth={2}
              dot={{ r: 3 }}
              activeDot={{ r: 5 }}
              fill="url(#colorAdmins)"
            />
            <Legend verticalAlign="top" align="right" iconType="circle" />
          </LineChart>
        </ResponsiveContainer>
      </Box>

      {/* Cards */}
      <Box sx={{ mt: 5, display: "flex", justifyContent: "center" }}>
        <Grid container spacing={3} justifyContent="center" maxWidth="md">
          <Grid item xs={12} sm={4}>
            <Card sx={{ display: "flex", alignItems: "center", p: 2 }}>
              <DriveEtaIcon sx={{ fontSize: 40, mr: 2, color: "#3f51b5" }} />
              <CardContent sx={{ p: 0 }}>
                <Typography variant="subtitle2" color="text.secondary">
                  Total Drivers
                </Typography>
                <Typography variant="h6">{totals.drivers}</Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={4}>
            <Card sx={{ display: "flex", alignItems: "center", p: 2 }}>
              <ReportProblemIcon
                sx={{ fontSize: 40, mr: 2, color: "#4caf50" }}
              />
              <CardContent sx={{ p: 0 }}>
                <Typography variant="subtitle2" color="text.secondary">
                  Total Rescuers
                </Typography>
                <Typography variant="h6">{totals.rescuers}</Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={4}>
            <Card sx={{ display: "flex", alignItems: "center", p: 2 }}>
              <AdminPanelSettingsIcon
                sx={{ fontSize: 40, mr: 2, color: "#9c27b0" }}
              />
              <CardContent sx={{ p: 0 }}>
                <Typography variant="subtitle2" color="text.secondary">
                  Total Admins
                </Typography>
                <Typography variant="h6">{totals.admins}</Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};

export default DashboardView;
