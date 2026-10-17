import { useEffect, useState } from "react";
import {
  Box, Button, Paper, Typography, IconButton, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Pagination, Stack,
} from "@mui/material";
import { Visibility, Delete, Download } from "@mui/icons-material";
import { useNavigate, useOutletContext } from "react-router-dom";
import { db } from "../firebase";
import {
  collection, deleteDoc, doc, getDocs, query, where
} from "firebase/firestore";
import { BeatLoader } from "react-spinners";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

interface User {
  id: string;
  fName: string;
  lName: string;
  email: string;
  phone: string;
  role: string;
  status: number;
  driverLicenceBackUrl: string;
  driverLicenceFrontUrl: string;
  vehicleLicenceBackUrl: string;
  vehicleLicenceFrontUrl: string;
}

export default function Rescures() {
  const [rescures, setRescures] = useState<User[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const { searchQuery } = useOutletContext<{ searchQuery: string }>();


  // const { searchQuery, setSearchQuery, toggleDarkMode } = useOutletContext<{
  //   searchQuery: string;
  //   setSearchQuery: (val: string) => void;
  //   toggleDarkMode: () => void;
  // }>();

  const rescuresPerPage = 10;
  const startIndex = (page - 1) * rescuresPerPage;
  const endIndex = startIndex + rescuresPerPage;
  const paginatedRescures = rescures.slice(startIndex, endIndex);

  const fetchRescures = async () => {
    setLoading(true);
    try {
      const q = query(
        collection(db, "users"),
        where("role", "==", "rescuer"),
        where("status", "==", 1)
      );
      const snapshot = await getDocs(q);
      const usersList = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      })) as User[];
      setRescures(usersList);
    } catch (err) {
      console.error("Error fetching rescues:", err);
    } finally {
      setLoading(false);
    }
  };

  const rescureDetialsNavigate = (id: string) => {
    navigate(`/dashboard/rescuer/${id}`);
  };

  useEffect(() => {
    fetchRescures();
  }, []);

  useEffect(() => {
    if (!searchQuery) return;
    const filtered = rescures.filter(
      (r) =>
        r.fName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.lName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.phone.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setRescures(filtered);
    setPage(1);
  }, [searchQuery]);

  const deleteRescuer = async (id: string) => {
    try {
      await deleteDoc(doc(db, "users", id));
      setRescures((prev) => prev.filter((rescuer) => rescuer.id !== id));
    } catch (error) {
      console.error("Error deleting rescuer:", error);
    }
  };

  const exportToExcel = () => {
    const exportData = rescures.map((rescuer, index) => ({
      "#": index + 1,
      Name: `${rescuer.fName} ${rescuer.lName}`,
      Email: rescuer.email,
      Phone: rescuer.phone,
    }));

    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Rescures");

    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });

    const fileData = new Blob([excelBuffer], {
      type:
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8",
    });

    saveAs(fileData, "Rescures.xlsx");
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
                  ? "rgba(13, 148, 136, 0.15)"
                  : "rgba(15, 52, 96, 0.08)",
              color: "primary.main",
              px: 2,
              py: 1,
              borderRadius: 2,
              fontWeight: 600,
              border: 1,
              borderColor: "divider",
            }}
          >
            All Rescuers
          </Typography>

          <Stack direction="row" spacing={2}>
            <Button
              onClick={exportToExcel}
              variant="outlined"
              color="primary"
              startIcon={<Download />}
            >
              Export Rescuers
            </Button>
          </Stack>
        </Stack>

        {/* Table */}
        <TableContainer sx={{ borderRadius: 2, border: 1, borderColor: "divider" }}>
            <Table size="small">
            <TableHead>
              <TableRow>
                {["", "Name", "Email", "Phone", "Actions"].map((header) => (
                  <TableCell
                    key={header}
                    sx={{ color: "#0F3460", fontWeight: "bold" }}
                  >
                    {header}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={5} align="center">
                    <Box sx={{ py: 2 }}>
                      <BeatLoader size={10} color="#0F3460" />
                    </Box>
                  </TableCell>
                </TableRow>
              ) : (
                paginatedRescures.map((rescuer, index) => (
                  <TableRow key={rescuer.id} hover>
                    <TableCell>{startIndex + index + 1}</TableCell>
                    <TableCell>{rescuer.fName} {rescuer.lName}</TableCell>
                    <TableCell>{rescuer.email}</TableCell>
                    <TableCell>{rescuer.phone}</TableCell>
                    <TableCell>
                      <Stack direction="row" spacing={1}>
                        <IconButton
                          color="info"
                          onClick={() => rescureDetialsNavigate(rescuer.id)}
                        >
                          <Visibility />
                        </IconButton>
                        <IconButton
                          color="error"
                          onClick={() => deleteRescuer(rescuer.id)}
                        >
                          <Delete />
                        </IconButton>
                      </Stack>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Pagination */}
        <Stack direction="row" justifyContent="space-between" mt={3}>
          <Typography variant="body2">
            Showing {rescures.length === 0 ? 0 : startIndex + 1}–{Math.min(endIndex, rescures.length)} of {rescures.length}
          </Typography>
          <Pagination
            page={page}
            count={Math.ceil(rescures.length / rescuresPerPage)}
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
