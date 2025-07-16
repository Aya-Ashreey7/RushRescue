import React, { useEffect, useState } from "react";
import {
  Box, Button, Paper, Typography, IconButton, MenuItem, Select, FormControl, InputLabel, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Pagination, Stack,
} from "@mui/material";
import { Visibility, Delete, Download } from "@mui/icons-material";
import { useLocation, useNavigate } from "react-router-dom";
import { useTheme } from "@mui/material/styles";
import PageHeader from "../components/PageHeader";
import HeaderActions from "../components/HeaderActions";
import { db } from "../firebase";
import { collection, deleteDoc, doc, getDocs, query, where } from "firebase/firestore";
import { BeatLoader } from "react-spinners";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";


interface DriversProps {
  toggleDarkMode: () => void;
}

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

export default function Drivers({ toggleDarkMode }: DriversProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterDate, setFilterDate] = useState("");
  const [page, setPage] = useState(1);
  const [drivers, setDrivers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const location = useLocation();
  const pathSegments = location.pathname.split("/").filter(Boolean);
  const breadcrumb = pathSegments.map((seg) => seg.charAt(0).toUpperCase() + seg.slice(1)).join(" / ");
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";
  const driversPerPage = 10;
  const startIndex = (page - 1) * driversPerPage;
  const endIndex = startIndex + driversPerPage;
  const paginatedDrivers = drivers.slice(startIndex, endIndex);
  const navigate = useNavigate();

  const driverDetialsNavigate = (id: string) => {
    navigate(`/dashboard/drivers/${id}`);
  }

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
      } catch (err) {
        console.error(" Error fetching drivers", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDrivers();
  }, []);

  const deleteDriver = async (id: string) => {
    try {
      await deleteDoc(doc(db, "users", id));
      setDrivers((prev) => prev.filter((driver) => driver.id !== id));
      console.log(" User deleted:", id);
    } catch (error) {
      console.error(" Error deleting user:", error);
    }
  };

  const exportToExcel = () => {
    const exportData = drivers.map((driver, index) => ({
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
      type:
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8",
    });

    saveAs(fileData, "Drivers.xlsx");
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
        <PageHeader
          breadcrumb={breadcrumb}
          title="Drivers"
          rightActions={
            <HeaderActions
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              toggleDarkMode={toggleDarkMode}
            />
          }
        />
        {/* Header */}
        <Paper
          sx={{
            p: 4,
            mb: 4,
            bgcolor: isDark ? "#23243a" : "#fff",
            boxShadow: isDark ? 3 : 1,
            transition: "background 0.3s",
          }}
        >
          <Typography
            variant="h6"
            sx={{ mb: 3, color: isDark ? "#b0b8d1" : "inherit" }}
          >
            {" "}
            Requests Status
          </Typography>

          {/* Filters */}
          <Stack
            direction="row"
            spacing={2}
            alignItems="center"
            justifyContent="space-between"
            sx={{ mb: 2 }}
          >
            <Box sx={{ display: "flex", gap: 2 }}>
              <Typography className="px-3 py-2 rounded"
                sx={{
                  backgroundColor: isDark ? "#e5e7eb" : "#0F3460",
                  color: isDark ? "#0F3460" : "#e5e7eb",
                  boxShadow: isDark ? 1 : 0,
                }}> All Drivers Requests </Typography>
            </Box>

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

              <Button onClick={exportToExcel}
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
                startIcon={<Download sx={{ color: isDark ? "#ffd700" : "#0F3460" }} />} > Export Drivers
              </Button>
            </Box>
          </Stack>

          {/* Table */}

          <TableContainer component={Paper} variant="outlined">
            <Table size="small">
              <TableHead >
                <TableRow sx={{ bgcolor: isDark ? "#f2f6fc" : "#f2f6fc" }}>
                  {[
                    "",
                    "Name",
                    "Email",
                    "Phone",
                    "Actions",
                  ].map((header) => (
                    <TableCell key={header} sx={{ color: isDark ? "#0F3460" : "#0F3460", fontWeight: "bold" }}>
                      {header}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>

              {loading ? (
                <TableRow>
                  <TableCell colSpan={5} align="center">
                    <Box sx={{ py: 2 }}>
                      <BeatLoader color={isDark ? "#f2f6fc" : "#0F3460"} size={12} />
                    </Box>
                  </TableCell>
                </TableRow>

              ) : (
                <TableBody >
                  {paginatedDrivers.map((driver, index) => (
                    <TableRow key={driver.id} hover>
                      <TableCell>{startIndex + index + 1}</TableCell>
                      <TableCell>{driver.fName} {driver.lName}</TableCell>
                      <TableCell>{driver.email}</TableCell>
                      <TableCell>{driver.phone}</TableCell>

                      <TableCell>
                        <Stack direction="row" spacing={1}>
                          <IconButton color="info" onClick={() => driverDetialsNavigate(driver.id)}><Visibility /></IconButton>
                          {/* <IconButton className="mx-1" color="success"> <CheckCircle /></IconButton> */}
                          <IconButton onClick={() => deleteDriver(driver.id)} color="error"><Delete /></IconButton>
                        </Stack>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              )}

            </Table>
          </TableContainer>



          {/* Pagination */}
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
            sx={{ mt: 3 }}
          >
            <Typography variant="body2">
              Showing {drivers.length === 0 ? 0 : startIndex + 1}–
              {Math.min(endIndex, drivers.length)} of {drivers.length}
            </Typography>
            <Pagination
              page={page}
              count={Math.ceil(drivers.length / driversPerPage)}
              onChange={(_, val) => setPage(val)}
              variant="outlined"
              shape="rounded"
              showFirstButton
              showLastButton
            />

          </Stack>
        </Paper>
      </Box>
    </Box >
  );
}
