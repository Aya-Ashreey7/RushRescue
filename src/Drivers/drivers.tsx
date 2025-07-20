import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Paper,
  Typography,
  IconButton,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Pagination,
  Stack,
} from "@mui/material";
import { Visibility, Delete, Download } from "@mui/icons-material";
import { useNavigate, useOutletContext } from "react-router-dom";
import { useTheme } from "@mui/material/styles";
import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import { db } from "../firebase";
import { BeatLoader } from "react-spinners";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

interface User {
  id: string;
  fName: string;
  lName: string;
  email: string;
  isDarker: boolean;
  phone: string;
  role: string;
  status: number;
  driverLicenceBackUrl: string;
  driverLicenceFrontUrl: string;
  vehicleLicenceBackUrl: string;
  vehicleLicenceFrontUrl: string;
}

export default function Drivers() {
  const [filterDate, setFilterDate] = useState("");
  const [page, setPage] = useState(1);
  const [drivers, setDrivers] = useState<User[]>([]);
  const [filteredDrivers, setFilteredDrivers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";

  const { searchQuery } = useOutletContext<{ searchQuery: string }>();

  const driversPerPage = 10;
  const startIndex = (page - 1) * driversPerPage;
  const endIndex = startIndex + driversPerPage;
  const paginatedDrivers = filteredDrivers.slice(startIndex, endIndex);

  const driverDetialsNavigate = (id: string) => {
    navigate(`/dashboard/drivers/${id}`);
  };

  useEffect(() => {
    const fetchDrivers = async () => {
      setLoading(true);
      try {
        const usersRef = collection(db, "users");
        const q = query(
          usersRef,
          where("role", "==", "driver"),
          where("status", "==", 1)
        );
        const snapshot = await getDocs(q);
        const usersList = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as User[];

        setDrivers(usersList);
        setFilteredDrivers(usersList);
      } catch (err) {
        console.error("Error fetching drivers", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDrivers();
  }, []);

  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredDrivers(drivers);
    } else {
      const filtered = drivers.filter(
        (driver) =>
          driver.fName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          driver.lName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          driver.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          driver.phone?.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredDrivers(filtered);
      setPage(1);
    }
  }, [searchQuery, drivers]);

  const deleteDriver = async (id: string) => {
    try {
      await deleteDoc(doc(db, "users", id));
      setDrivers((prev) => prev.filter((driver) => driver.id !== id));
      setFilteredDrivers((prev) =>
        prev.filter((driver) => driver.id !== id)
      );
      console.log("User deleted:", id);
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };

  const exportToExcel = () => {
    const exportData = filteredDrivers.map((driver, index) => ({
      "#": index + 1,
      Name: `${driver.fName} ${driver.lName}`,
      Email: driver.email,
      Phone: driver.phone,
    }));
    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Drivers");
    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });
    const fileData = new Blob([excelBuffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8",
    });
    saveAs(fileData, "Drivers.xlsx");
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        bgcolor: isDark ? "#181c2a" : "#f2f6fc",
        transition: "background 0.3s",
        maxWidth: 1300,
        mx: "auto",
        pt: 4,
      }}
    >

      <Paper
        sx={{
          p: 4,
          mb: 4,
          bgcolor: isDark ? "#23243a" : "#fff",
          boxShadow: isDark ? 3 : 1,
          transition: "background 0.3s",
          borderRadius: 2,
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 3,
          }}
        >
          <Typography
            variant="h6"
            sx={{ color: isDark ? "#b0b8d1" : "inherit" }}
          >
            Requests Status
          </Typography>

          <Box sx={{ display: "flex", gap: 2 }}>
            <FormControl
              sx={{
                minWidth: 160,
                "& .MuiOutlinedInput-root": {
                  "& fieldset": {
                    borderColor: isDark ? "#444a5a" : "#0F3460",
                  },
                  "&:hover fieldset": {
                    borderColor: isDark ? "#5a6a8a" : "#0d2f50",
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: isDark ? "#b0b8d1" : "#0F3460",
                  },
                  backgroundColor: isDark ? "#23243a" : "#fff",
                  color: isDark ? "#fff" : "#222",
                },
                "& .MuiInputLabel-root": {
                  color: isDark ? "#b0b8d1" : "#777",
                },
                "& .MuiInputLabel-root.Mui-focused": {
                  color: isDark ? "#ffd700" : "#0F3460",
                  fontWeight: 500,
                },
              }}
              size="small"
            >
              <InputLabel id="create-date-label">Create Date</InputLabel>
              <Select
                labelId="create-date-label"
                label="Create Date"
                value={filterDate}
                onChange={(e) => setFilterDate(e.target.value)}
                sx={{
                  color: isDark ? "#fff" : "#222",
                  backgroundColor: isDark ? "#23243a" : "#fff",
                }}
              >
                <MenuItem value="7">Last 7 days</MenuItem>
                <MenuItem value="30">Last 30 days</MenuItem>
                <MenuItem value="90">Last 90 days</MenuItem>
              </Select>
            </FormControl>

            <Button
              onClick={exportToExcel}
              sx={{
                borderColor: isDark ? "#b0b8d1" : "#0F3460",
                color: isDark ? "#b0b8d1" : "#0F3460",
                "&:hover": {
                  borderColor: isDark ? "#ffd700" : "#0d2f50",
                  backgroundColor: isDark
                    ? "rgba(176,184,209,0.05)"
                    : "rgba(15, 52, 96, 0.05)",
                },
              }}
              variant="outlined"
              startIcon={
                <Download sx={{ color: isDark ? "#ffd700" : "#0F3460" }} />
              }
            >
              Export Drivers
            </Button>
          </Box>
        </Box>

        <Box sx={{ mb: 3 }}>
          <Typography
            className="px-3 py-2 rounded"
            sx={{
              backgroundColor: isDark ? "#e5e7eb" : "#0F3460",
              color: isDark ? "#0F3460" : "#e5e7eb",
              boxShadow: isDark ? 1 : 0,
              display: "inline-block",
            }}
          >
            All Drivers Requests
          </Typography>
        </Box>

        <TableContainer component={Paper} variant="outlined">
          <Table size="small">
            <TableHead>
              <TableRow sx={{ bgcolor: "#f2f6fc" }}>
                {["", "Name", "Email", "Phone", "Actions"].map((header) => (
                  <TableCell
                    key={header}
                    sx={{
                      color: "#0F3460",
                      fontWeight: "bold",
                    }}
                  >
                    {header}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>

            {loading ? (
              <TableRow>
                <TableCell colSpan={5} align="center">
                  <Box sx={{ py: 2 }}>
                    <BeatLoader
                      color={isDark ? "#f2f6fc" : "#0F3460"}
                      size={12}
                    />
                  </Box>
                </TableCell>
              </TableRow>
            ) : (
              <TableBody>
                {paginatedDrivers.map((driver, index) => (
                  <TableRow key={driver.id} hover>
                    <TableCell>{startIndex + index + 1}</TableCell>
                    <TableCell>
                      {driver.fName} {driver.lName}
                    </TableCell>
                    <TableCell>{driver.email}</TableCell>
                    <TableCell>{driver.phone}</TableCell>
                    <TableCell>
                      <Stack direction="row" spacing={1}>
                        <IconButton
                          color="info"
                          onClick={() => driverDetialsNavigate(driver.id)}
                        >
                          <Visibility />
                        </IconButton>
                        <IconButton
                          onClick={() => deleteDriver(driver.id)}
                          color="error"
                        >
                          <Delete />
                        </IconButton>
                      </Stack>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            )}
          </Table>
        </TableContainer>

        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          sx={{ mt: 3 }}
        >
          <Typography variant="body2">
            Showing {filteredDrivers.length === 0 ? 0 : startIndex + 1}–
            {Math.min(endIndex, filteredDrivers.length)} of{" "}
            {filteredDrivers.length}
          </Typography>
          <Pagination
            page={page}
            count={Math.ceil(filteredDrivers.length / driversPerPage)}
            onChange={(_, val) => setPage(val)}
            variant="outlined"
            shape="rounded"
            showFirstButton
            showLastButton
          />
        </Stack>
      </Paper>

    </Box>
  );
}
