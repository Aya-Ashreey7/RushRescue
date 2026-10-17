import { useEffect, useState } from "react";
import {
  Box,
  Button,
  Paper,
  Typography,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Pagination,
  Stack,
  Snackbar,
  Alert,
} from "@mui/material";
import { Chip } from "@mui/material";

import {
  Visibility as EyeIcon,
  CheckCircle,
  Warning as WarningIcon,
  Delete as TrashIcon,
} from "@mui/icons-material";

import { useNavigate } from "react-router-dom";
import { collection, getDocs, updateDoc, doc } from "firebase/firestore";
import { db } from "../../firebase";

export default function DriverRequests() {
  const [searchQuery] = useState("");
  const [page] = useState(1);
  const [drivers, setDrivers] = useState<any[]>([]);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const navigate = useNavigate();

  const fetchDrivers = async () => {
    const snapshot = await getDocs(collection(db, "users"));
    const filtered = snapshot.docs
      .map(doc => ({ id: doc.id, ...(doc.data() as any) }))
      .filter(user => user.role === "driver");
    setDrivers(filtered);
  };
const getStatusColor = (status: any) => {
  switch (status) {
    case 0:
    case "pending":
      return "info";
    case 1:
    case "approved":
      return "success";
    case -1:
    case "rejected":
      return "error";
    case -2:
    case "incompleted":
      return "warning";
    default:
      return "default";
  }
};

const formatStatusLabel = (status: any) => {
  if (typeof status === "string") return status.replace("-", " ").toUpperCase();
  switch (status) {
    case 0: return "PENDING";
    case 1: return "APPROVED";
    case -1: return "REJECTED";
    case -2: return "INCOMPLETED";
    default: return "UNKNOWN";
  }
};

  const handleStatusChange = async (id: string, status: number) => {
    try {
      await updateDoc(doc(db, "users", id), { status });
      setMessage({ type: "success", text: "Driver status updated." });
      fetchDrivers();
    } catch {
      setMessage({ type: "error", text: "Failed to update status." });
    }
  };

  useEffect(() => {
    fetchDrivers();
  }, []);

  const filteredDrivers = drivers.filter(driver =>
    driver.fName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    driver.lName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    driver.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Box>
        <Paper sx={{ p: { xs: 2.5, md: 3.5 }, mb: 3, borderRadius: 3, bgcolor: "background.paper" }}>
          {/* Filters */}
          <Stack direction="row" spacing={2} alignItems="center" justifyContent="space-between" sx={{ mb: 3 }}>
            <Box sx={{ display: "flex", gap: 2 }}>
              <Button variant="contained" color="primary">
                All Driver Requests
              </Button>
            </Box>
          </Stack>

          {/* Table */}
          <TableContainer sx={{ borderRadius: 2, border: 1, borderColor: "divider" }}>
            <Table size="small">
              <TableHead>
                <TableRow>
                  {["#", "Name", "Email", "Phone", "Status", "Actions"].map((head) => (
                    <TableCell
                      key={head}
                      align="center"
                    >
                      {head}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredDrivers.map((driver, idx) => (
                  <TableRow key={driver.id} hover>
                    <TableCell align="center">{idx + 1}</TableCell>
                    <TableCell align="center">
                      {driver.fName} {driver.lName}
                    </TableCell>
                    <TableCell align="center">{driver.email}</TableCell>
                    <TableCell align="center">{driver.phone}</TableCell>
                    <TableCell align="center">
                    
  <Chip
    label={formatStatusLabel(driver.status)}
    color={getStatusColor(driver.status)}
    size="small"
    variant="outlined"
  />

                    </TableCell>
                    <TableCell align="center">
                      <Stack direction="row" spacing={1} justifyContent="center">
                        <IconButton color="info" onClick={() => navigate(`/dashboard/driver/${driver.id}`)}>
                          <EyeIcon />
                        </IconButton>
                        <IconButton color="success" onClick={() => handleStatusChange(driver.id, 1)}>
                          <CheckCircle />
                        </IconButton>
                        <IconButton color="warning" onClick={() => handleStatusChange(driver.id, -2)}>
                          <WarningIcon />
                        </IconButton>
                        <IconButton color="error" onClick={() => handleStatusChange(driver.id, -1)}>
                          <TrashIcon />
                        </IconButton>
                      </Stack>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          {/* Pagination */}
          <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mt: 3 }}>
            <Typography variant="body2">
              Showing {filteredDrivers.length ? 1 : 0}–{filteredDrivers.length} of {drivers.length}
            </Typography>
            <Pagination page={page} count={1} variant="outlined" shape="rounded" />
          </Stack>
        </Paper>

      {message && (
        <Snackbar open autoHideDuration={3000} onClose={() => setMessage(null)}>
          <Alert severity={message.type}>{message.text}</Alert>
        </Snackbar>
      )}
    </Box>
  );
}
