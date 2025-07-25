import React, { useEffect, useState } from "react";
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
  Chip,
} from "@mui/material";

import {
  Visibility as EyeIcon,
  CheckCircle,
  Warning as WarningIcon,
  Delete as TrashIcon,
} from "@mui/icons-material";

import { useTheme } from "@mui/material/styles";
import { useNavigate } from "react-router-dom";
import { collection, getDocs, updateDoc, doc } from "firebase/firestore";
import { db } from "../../firebase";

export default function RescuerRequests() {
  const [rescuers, setRescuers] = useState<any[]>([]);
  const [page, setPage] = useState(1);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";
  const navigate = useNavigate();

  const fetchRescuers = async () => {
    const snapshot = await getDocs(collection(db, "users"));
    const filtered = snapshot.docs
      .map(doc => ({ id: doc.id, ...(doc.data() as any) }))
      .filter(user => user.role === "rescuer");
    setRescuers(filtered);
  };

  const handleStatusChange = async (id: string, status: number) => {
    try {
      await updateDoc(doc(db, "users", id), { status });
      setMessage({ type: "success", text: "Rescuer status updated." });
      fetchRescuers();
    } catch {
      setMessage({ type: "error", text: "Failed to update status." });
    }
  };

  useEffect(() => {
    fetchRescuers();
  }, []);

  const getStatusColor = (status: any) => {
    switch (status) {
      case 0:
      case "pending":
        return "info";
      case 1:
      case "under-review":
        return "success";
      case 2:
      case "resolved":
        return "success";
      case -1:
        return "error";
      case -2:
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

  return (
    <Box
      sx={{
        minHeight: "100vh",
        bgcolor: isDark ? "#181c2a" : "#f2f6fc",
        pt: 6,
        transition: "background 0.3s",
      }}
    >
      <Box sx={{ maxWidth: 1300, mx: "auto" }}>
     
        <Paper sx={{ p: 4, mb: 4, bgcolor: isDark ? "#23243a" : "#fff", boxShadow: isDark ? 3 : 1 }}>
          {/* Filters */}
          <Stack direction="row" spacing={2} alignItems="center" justifyContent="space-between" sx={{ mb: 3 }}>
            <Box sx={{ display: "flex", gap: 2 }}>
              <Button variant="contained" sx={{ backgroundColor: "#0F3460" }}>
                All Rescuer Requests
              </Button>
            </Box>
          </Stack>

          {/* Table */}
          <TableContainer component={Paper} variant="outlined">
            <Table size="small">
              <TableHead>
                <TableRow>
                  {["#", "Name", "Email", "Phone", "Status", "Actions"].map((head) => (
                    <TableCell
                      key={head}
                      align="center"
                      sx={{ fontWeight: "bold", textAlign: "center" }}
                    >
                      {head}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {rescuers.map((rescuer, idx) => (
                  <TableRow key={rescuer.id} hover>
                    <TableCell align="center">{idx + 1}</TableCell>
                    <TableCell align="center">{rescuer.fName} {rescuer.lName}</TableCell>
                    <TableCell align="center">{rescuer.email}</TableCell>
                    <TableCell align="center">{rescuer.phone}</TableCell>
                    <TableCell align="center">
                      <Chip
                        label={formatStatusLabel(rescuer.status)}
                        color={getStatusColor(rescuer.status)}
                        size="small"
                        variant="outlined"
                      />
                    </TableCell>
                    <TableCell align="center">
                      <Stack direction="row" spacing={1} justifyContent="center">
                        <IconButton color="info" onClick={() => navigate(`/dashboard/rescuer/${rescuer.id}`)}>
                          <EyeIcon />
                        </IconButton>
                        <IconButton color="success" onClick={() => handleStatusChange(rescuer.id, 1)}>
                          <CheckCircle />
                        </IconButton>
                        <IconButton color="warning" onClick={() => handleStatusChange(rescuer.id, -2)}>
                          <WarningIcon />
                        </IconButton>
                        <IconButton color="error" onClick={() => handleStatusChange(rescuer.id, -1)}>
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
              Showing {rescuers.length ? 1 : 0}–{rescuers.length} of {rescuers.length}
            </Typography>
            <Pagination page={page} count={1} variant="outlined" shape="rounded" />
          </Stack>
        </Paper>
      </Box>

      {message && (
        <Snackbar open autoHideDuration={3000} onClose={() => setMessage(null)}>
          <Alert severity={message.type}>{message.text}</Alert>
        </Snackbar>
      )}
    </Box>
  );
}
