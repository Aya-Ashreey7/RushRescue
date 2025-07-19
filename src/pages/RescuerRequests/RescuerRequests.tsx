import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  IconButton,
  Tabs,
  Tab,
  Pagination,
  Snackbar,
  Alert,
} from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import DeleteIcon from "@mui/icons-material/Delete";
import WarningIcon from "@mui/icons-material/Warning";
import { useEffect, useState } from "react";
import { db } from "../../firebase";
import {
  collection,
  getDocs,
  deleteDoc,
  updateDoc,
  doc,
} from "firebase/firestore";
import { useNavigate } from "react-router-dom";

const RescuerRequests = () => {
  const [rescuers, setRescuers] = useState<any[]>([]);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);
  const navigate = useNavigate();

  const fetchRescuers = async () => {
    const querySnapshot = await getDocs(collection(db, "users"));
    const filtered = querySnapshot.docs
      .map((doc) => ({ id: doc.id, ...(doc.data() as any) }))
      .filter((doc) => doc.role === "rescuer");
    setRescuers(filtered);
  };
  const isDark = false; // غيرها حسب حالتك

  useEffect(() => {
    fetchRescuers();
  }, []);

  const handleStatusChange = async (id: string, status: number) => {
    try {
      await updateDoc(doc(db, "users", id), { status });
      setMessage({ type: "success", text: `Rescuer status updated.` });
      fetchRescuers();
    } catch {
      setMessage({ type: "error", text: "Failed to update status." });
    }
  };

  return (
    <Box>
      <Typography variant="h5" gutterBottom sx={{ mt: 4 }}>
        Rescuer Requests
      </Typography>
      <Tabs value={0}>
        <Tab label="All Requests" />
      </Tabs>

      {message && (
        <Snackbar open autoHideDuration={3000} onClose={() => setMessage(null)}>
          <Alert severity={message.type}>{message.text}</Alert>
        </Snackbar>
      )}

      <TableContainer component={Paper} elevation={3} sx={{ borderRadius: 2 }}>
        <Table>
          <TableHead sx={{ backgroundColor: "#f5f5f5" }}>
            <TableRow>
              {["#", "Name", "Email", "Phone", "Actions"].map((header, i) => (
                <TableCell
                  key={i}
                  align="center"
                  sx={{
                    fontWeight: "bold",
                    color: isDark ? "#0F3460" : "#000",
                  }}
                >
                  {header}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {rescuers.map((rescuer, i) => (
              <TableRow key={rescuer.id} hover>
                <TableCell align="center">{i + 1}</TableCell>
                <TableCell align="center">
                  {rescuer.fName} {rescuer.lName}
                </TableCell>
                <TableCell align="center">{rescuer.email}</TableCell>
                <TableCell align="center">{rescuer.phone}</TableCell>
                <TableCell align="center">
                  <IconButton
                    color="primary"
                    onClick={() => navigate(`/dashboard/rescuer/${rescuer.id}`)}
                  >
                    <VisibilityIcon />
                  </IconButton>
                  <IconButton
                    color="success"
                    onClick={() => handleStatusChange(rescuer.id, 1)}
                  >
                    <CheckCircleIcon />
                  </IconButton>
                  <IconButton
                    color="warning"
                    onClick={() => handleStatusChange(rescuer.id, -2)}
                  >
                    <WarningIcon />
                  </IconButton>
                  <IconButton
                    color="error"
                    onClick={() => handleStatusChange(rescuer.id, -1)}
                  >
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Box sx={{ mt: 2, display: "flex", justifyContent: "space-between" }}>
        <Typography variant="body2">Showing 1 - {rescuers.length}</Typography>
        <Pagination count={1} page={1} variant="outlined" shape="rounded" />
      </Box>
    </Box>
  );
};

export default RescuerRequests;
