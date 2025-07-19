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
import { collection, getDocs, updateDoc, doc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import HeaderActions from "../../components/HeaderActions";

// ✅ props to receive darkMode and toggle function
type Props = {
  darkMode: boolean;
  toggleDarkMode: () => void;
};

const RescuerRequests = ({ darkMode, toggleDarkMode }: Props) => {
  const [rescuers, setRescuers] = useState<any[]>([]);
  const [filteredRescuers, setFilteredRescuers] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);
  const navigate = useNavigate();
  const isDark = darkMode; // ✅ استخدام darkMode من الـ props

  const fetchRescuers = async () => {
    const querySnapshot = await getDocs(collection(db, "users"));
    const filtered = querySnapshot.docs
      .map((doc) => ({ id: doc.id, ...(doc.data() as any) }))
      .filter((doc) => doc.role === "rescuer");
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
      const filtered = rescuers.filter(
        (rescuer) =>
          rescuer.fName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          rescuer.lName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          rescuer.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          rescuer.phone?.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredRescuers(filtered);
    }
  }, [searchQuery, rescuers]);

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
    <Box sx={{ maxWidth: 1300, mx: "auto", pt: 4 }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Typography variant="h5" gutterBottom sx={{ mt: 4 }}>
          Rescuer Requests
        </Typography>

        <HeaderActions
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          toggleDarkMode={toggleDarkMode} // ✅ الآن تعمل فعلياً
          onSearch={(query) => setSearchQuery(query)}
        />
      </Box>

      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          p: 2,
          bgcolor: "#f9fafe",
          borderRadius: 2,
          mb: 2,
        }}
      >
        <Tabs value={0}>
          <Tab label="All Requests" />
        </Tabs>
      </Box>

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
                    color: isDark ? "#0F3460" : "#000", // ✅ لون حسب الوضع
                  }}
                >
                  {header}
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
        <Typography variant="body2">
          Showing 1 - {filteredRescuers.length} of {rescuers.length}
        </Typography>
        <Pagination count={1} page={1} variant="outlined" shape="rounded" />
      </Box>
    </Box>
  );
};

export default RescuerRequests;
