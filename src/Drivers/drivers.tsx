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
} from "@mui/material";
import { Visibility, Delete, Download } from "@mui/icons-material";
import { useNavigate, useOutletContext } from "react-router-dom";
import { alpha, useTheme } from "@mui/material/styles";
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
    <Box>
      <Paper
        sx={{
          p: { xs: 2.5, md: 3.5 },
          mb: 3,
          bgcolor: "background.paper",
          borderRadius: 3,
        }}
      >
        {/* Filter + Export */}
        <Stack direction="row" justifyContent="space-between" mb={3} flexWrap="wrap" gap={2}>
          <Typography
            sx={{
              backgroundColor: (t) =>
                t.palette.mode === "dark"
                  ? alpha(t.palette.secondary.main, 0.15)
                  : alpha(t.palette.primary.main, 0.08),
              color: "primary.main",
              px: 2,
              py: 1,
              borderRadius: 2,
              fontWeight: 600,
              border: 1,
              borderColor: "divider",
            }}
          >
            All Drivers
          </Typography>

          <Stack direction="row" spacing={2}>
            <Button
              onClick={exportToExcel}
              variant="outlined"
              color="primary"
              startIcon={<Download />}
            >
              Export Drivers
            </Button>
          </Stack>
        </Stack>
        <Box sx={{ overflowX: "auto" }}>
          <TableContainer sx={{ borderRadius: 2, border: 1, borderColor: "divider" }}>
            <Table size="small">
              <TableHead>
                <TableRow>
                  {["", "Name", "Email", "Phone", "Actions"].map((header) => (
                    <TableCell key={header}>
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
