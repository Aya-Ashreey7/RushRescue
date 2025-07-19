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
import HeaderActions from "../../components/HeaderActions";

type Props = {
  darkMode: boolean;
  toggleDarkMode: () => void;
};

const RescuerRequests = ({ darkMode, toggleDarkMode }: Props) => {
  const [rescuers, setRescuers] = useState<any[]>([]);
  const [filteredRescuers, setFilteredRescuers] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const navigate = useNavigate();

  const fetchRescuers = async () => {
    const snapshot = await getDocs(collection(db, "users"));
    const filtered = snapshot.docs
      .map(doc => ({ id: doc.id, ...(doc.data() as any) }))
      .filter(user => user.role === "rescuer");
    setRescuers(filtered);
    setFilteredRescuers(filtered);
  };

  useEffect(() => {
    fetchRescuers();
  }, []);

  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredRescuers(rescuers);
    } else {
      const lower = searchQuery.toLowerCase();
      setFilteredRescuers(
        rescuers.filter(
          (r) =>
            r.fName?.toLowerCase().includes(lower) ||
            r.lName?.toLowerCase().includes(lower) ||
            r.email?.toLowerCase().includes(lower) ||
            r.phone?.toLowerCase().includes(lower)
        )
      );
    }
  }, [searchQuery, rescuers]);

  const handleStatusChange = async (id: string, status: number) => {
    try {
      await updateDoc(doc(db, "users", id), { status });
      setMessage({ type: "success", text: "Rescuer status updated." });
      fetchRescuers();
    } catch {
      setMessage({ type: "error", text: "Failed to update status." });
    }
  };

  const getStatusColor = (status: any) => {
    switch (status) {
      case 0:
      case "pending":
        return "info";
      case 1:
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
    switch (status) {
      case 0:
        return "PENDING";
      case 1:
        return "APPROVED";
      case -1:
        return "REJECTED";
      case -2:
        return "INCOMPLETED";
      default:
        return "UNKNOWN";
    }
  };

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: darkMode ? "#181c2a" : "#f2f6fc", pt: 6 }}>
      <Box sx={{ maxWidth: 1300, mx: "auto" }}>
        <Typography variant="h4" gutterBottom sx={{ fontWeight: 600 }}>
          Rescuer Requests
        </Typography>

        <HeaderActions
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          toggleDarkMode={toggleDarkMode}
          onSearch={(query) => setSearchQuery(query)}
        />

        <TableContainer component={Paper} sx={{ mt: 3 }}>
          <Table>
            <TableHead sx={{ backgroundColor: "#f5f5f5" }}>
              <TableRow>
                {["#", "Name", "Email", "Phone", "Status", "Actions"].map((head) => (
                  <TableCell key={head} align="center" sx={{ fontWeight: "bold" }}>
                    {head}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredRescuers.map((rescuer, i) => (
                <TableRow key={rescuer.id} hover>
                  <TableCell align="center">{i + 1}</TableCell>
                  <TableCell align="center">
                    {rescuer.fName} {rescuer.lName}
                  </TableCell>
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

        <Box sx={{ mt: 2, display: "flex", justifyContent: "space-between" }}>
          <Typography variant="body2">
            Showing {filteredRescuers.length} of {rescuer.length}
          </Typography>
          <Pagination count={1} page={page} variant="outlined" shape="rounded" />
        </Box>
      </Box>

      {message && (
        <Snackbar open autoHideDuration={3000} onClose={() => setMessage(null)}>
          <Alert severity={message.type}>{message.text}</Alert>
        </Snackbar>
      )}
    </Box>
  );
};

export default RescuerRequests;
