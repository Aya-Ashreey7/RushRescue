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
    navigate(`/dashboard/driver/${id}`);
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



        {/* Filter + Export */}
        <Stack direction="row" justifyContent="space-between" mb={3}>
          <Typography
            sx={{
              backgroundColor: isDark ? "#e5e7eb" : "#0F3460",
              color: isDark ? "#0F3460" : "#e5e7eb",
              px: 2,
              py: 1,
              borderRadius: 1,
            }}
          >
            All Drivers
          </Typography>

          <Stack direction="row" spacing={2}>



            <Button
              onClick={exportToExcel}
              variant="outlined"
              startIcon={<Download />}
              sx={{
                ...(isDark && {
                  color: "#ffd700",
                  borderColor: "#ffd700",
                  "&:hover": {
                    borderColor: "#ffdf00",
                    backgroundColor: "rgba(255, 215, 0, 0.08)",
                  },
                  "& .MuiButton-startIcon": {
                    color: "#ffd700",
                  },
                }),
              }}
            >
              Export Rescues
            </Button>
          </Stack>
        </Stack>
        <Box sx={{ overflowX: "auto" }}>
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
                  <TableCell colSpan={5} align="center" sx={{
                    fontSize: { xs: "0.75rem", sm: "0.875rem" },
                    whiteSpace: "nowrap"
                  }}
                  >
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
                      <TableCell sx={{ fontSize: { xs: "0.75rem", sm: "0.875rem" }, whiteSpace: "nowrap" }}>
                        {startIndex + index + 1}</TableCell>
                      <TableCell sx={{ fontSize: { xs: "0.75rem", sm: "0.875rem" }, whiteSpace: "nowrap" }}>
                        {driver.fName} {driver.lName}
                      </TableCell>
                      <TableCell sx={{ fontSize: { xs: "0.75rem", sm: "0.875rem" }, whiteSpace: "nowrap" }}>{driver.email}</TableCell>
                      <TableCell sx={{ fontSize: { xs: "0.75rem", sm: "0.875rem" }, whiteSpace: "nowrap" }}>{driver.phone}</TableCell>
                      <TableCell sx={{ fontSize: { xs: "0.75rem", sm: "0.875rem" }, whiteSpace: "nowrap" }}>
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
        </Box>
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
