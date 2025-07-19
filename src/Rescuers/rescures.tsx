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
  Container,
} from "@mui/material";
import { Visibility, Delete, Download } from "@mui/icons-material";
import { useLocation, useNavigate } from "react-router-dom";
import { useTheme } from "@mui/material/styles";
import PageHeader from "../components/PageHeader";
import HeaderActions from "../components/HeaderActions";
import { db } from "../firebase";
import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import { BeatLoader } from "react-spinners";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

interface RescuresProps {
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

export default function Rescures({ toggleDarkMode }: RescuresProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterDate, setFilterDate] = useState("");
  const [page, setPage] = useState(1);
  const [rescures, setRescures] = useState<User[]>([]);
  const [filteredRescures, setFilteredRescures] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const location = useLocation();
  const pathSegments = location.pathname.split("/").filter(Boolean);
  const breadcrumb = pathSegments
    .map((seg) => seg.charAt(0).toUpperCase() + seg.slice(1))
    .join(" / ");
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";
  const rescuresPerPage = 10;
  const startIndex = (page - 1) * rescuresPerPage;
  const endIndex = startIndex + rescuresPerPage;
  const paginatedRescures = filteredRescures.slice(startIndex, endIndex);
  const navigate = useNavigate();

  const rescuerDetailsNavigate = (id: string) => {
    navigate(`/dashboard/rescures/${id}`);
  };

  useEffect(() => {
    const fetchRescures = async () => {
      setLoading(true);
      try {
        const usersRef = collection(db, "users");
        const q = query(
          usersRef,
          where("role", "==", "rescuer"),
          where("status", "==", 1)
        );
        const snapshot = await getDocs(q);
        const usersList = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as User[];

        setRescures(usersList);
        setFilteredRescures(usersList);
      } catch (err) {
        console.error("Error fetching Rescures", err);
      } finally {
        setLoading(false);
      }
    };

    fetchRescures();
  }, []);

  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredRescures(rescures);
    } else {
      const filtered = rescures.filter(
        (rescuer) =>
          rescuer.fName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          rescuer.lName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          rescuer.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          rescuer.phone?.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredRescures(filtered);
      setPage(1); // Reset to first page when searching
    }
  }, [searchQuery, rescures]);

  const deleteRescuer = async (id: string) => {
    try {
      await deleteDoc(doc(db, "users", id));
      setRescures((prev) => prev.filter((rescuer) => rescuer.id !== id));
      setFilteredRescures((prev) =>
        prev.filter((rescuer) => rescuer.id !== id)
      );
      console.log("User deleted:", id);
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };

  const exportToExcel = () => {
    const exportData = filteredRescures.map((rescuer, index) => ({
      "#": index + 1,
      Name: `${rescuer.fName} ${rescuer.lName}`,
      Email: rescuer.email,
      Phone: rescuer.phone,
    }));
    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Rescuers");

    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });

    const fileData = new Blob([excelBuffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8",
    });

    saveAs(fileData, "Rescuers.xlsx");
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
      <Container maxWidth="xl">
        <PageHeader
          breadcrumb={breadcrumb}
          title="Rescuers"
          rightActions={
            <HeaderActions
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              toggleDarkMode={toggleDarkMode}
              onSearch={(query) => setSearchQuery(query)}
            />
          }
        />

        {/* Main Content */}
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
                Export Rescuers
              </Button>
            </Box>
          </Box>

          {/* Status Filter */}
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
              All Rescuers Requests
            </Typography>
          </Box>

          {/* Table */}
          <TableContainer component={Paper} variant="outlined">
            <Table size="small">
              <TableHead>
                <TableRow sx={{ bgcolor: isDark ? "#f2f6fc" : "#f2f6fc" }}>
                  {["", "Name", "Email", "Phone", "Actions"].map((header) => (
                    <TableCell
                      key={header}
                      sx={{
                        color: isDark ? "#0F3460" : "#0F3460",
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
                  {paginatedRescures.map((rescuer, index) => (
                    <TableRow key={rescuer.id} hover>
                      <TableCell>{startIndex + index + 1}</TableCell>
                      <TableCell>
                        {rescuer.fName} {rescuer.lName}
                      </TableCell>
                      <TableCell>{rescuer.email}</TableCell>
                      <TableCell>{rescuer.phone}</TableCell>

                      <TableCell>
                        <Stack direction="row" spacing={1}>
                          <IconButton
                            color="info"
                            onClick={() => rescuerDetailsNavigate(rescuer.id)}
                          >
                            <Visibility />
                          </IconButton>
                          <IconButton
                            onClick={() => deleteRescuer(rescuer.id)}
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

          {/* Pagination */}
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
            sx={{ mt: 3 }}
          >
            <Typography variant="body2">
              Showing {filteredRescures.length === 0 ? 0 : startIndex + 1}–
              {Math.min(endIndex, filteredRescures.length)} of{" "}
              {filteredRescures.length}
            </Typography>
            <Pagination
              page={page}
              count={Math.ceil(filteredRescures.length / rescuresPerPage)}
              onChange={(_, val) => setPage(val)}
              variant="outlined"
              shape="rounded"
              showFirstButton
              showLastButton
            />
          </Stack>
        </Paper>
      </Container>
    </Box>
  );
}
