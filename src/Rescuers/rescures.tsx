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
    const [filterDate, setFilterDate] = useState("");
    const [page, setPage] = useState(1);
    const [rescures, setRescures] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const theme = useTheme();
    const isDark = theme.palette.mode === "dark";
    const navigate = useNavigate();
    const { searchQuery } = useOutletContext<{ searchQuery: string }>();

    const rescuresPerPage = 10;
    const startIndex = (page - 1) * rescuresPerPage;
    const endIndex = startIndex + rescuresPerPage;

    const paginatedRescures = rescures.slice(startIndex, endIndex);

    const navigateToRescuerDetail = (id: string) => {
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
            } catch (err) {
                console.error("Error fetching rescues:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchRescures();
    }, []);

    useEffect(() => {
        if (!searchQuery || searchQuery.trim() === "") return;
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
            setRescures((prev) => prev.filter((r) => r.id !== id));
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
        <Box
            sx={{
                bgcolor: isDark ? "#181c2a" : "#f2f6fc",
                transition: "background 0.3s", maxWidth: 1300,
            }}
        >
            <Paper
                sx={{
                    p: 4,
                    mb: 4,
                    bgcolor: isDark ? "#23243a" : "#fff",
                    boxShadow: isDark ? 3 : 1,
                    transition: "background 0.3s",
                }}
            >
                <Stack
                    direction="row"
                    justifyContent="space-between"
                    alignItems="center"
                    mb={3}
                >
                    <Typography
                        sx={{
                            backgroundColor: isDark ? "#e5e7eb" : "#0F3460",
                            color: isDark ? "#0F3460" : "#e5e7eb",
                            px: 2,
                            py: 1,
                            borderRadius: 1,
                        }}
                    >
                        All Rescures Requests
                    </Typography>

                    <Stack direction="row" spacing={2}>
                        <FormControl
                            size="small"
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
                        >
                            <InputLabel id="create-date-label">Create Date</InputLabel>
                            <Select
                                labelId="create-date-label"
                                label="Create Date"
                                value={filterDate}
                                onChange={(e) => setFilterDate(e.target.value)}
                            >
                                <MenuItem value="7">Last 7 days</MenuItem>
                                <MenuItem value="30">Last 30 days</MenuItem>
                                <MenuItem value="90">Last 90 days</MenuItem>
                            </Select>
                        </FormControl>

                        <Button
                            onClick={exportToExcel}
                            variant="outlined"
                            startIcon={
                                <Download sx={{ color: isDark ? "#ffd700" : "#0F3460" }} />
                            }
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
                        >
                            Export Rescures
                        </Button>
                    </Stack>
                </Stack>

                <TableContainer component={Paper} variant="outlined">
                    <Table size="small">
                        <TableHead>
                            <TableRow sx={{ bgcolor: "#f2f6fc" }}>
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

                        {loading ? (
                            <TableBody>
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
                            </TableBody>
                        ) : (
                            <TableBody>
                                {paginatedRescures.map((rescuer, index) => (
                                    <TableRow key={rescuer.id} hover>
                                        <TableCell>{startIndex + index + 1}</TableCell>
                                        <TableCell>{rescuer.fName} {rescuer.lName}</TableCell>
                                        <TableCell>{rescuer.email}</TableCell>
                                        <TableCell>{rescuer.phone}</TableCell>
                                        <TableCell>
                                            <Stack direction="row" spacing={1}>
                                                <IconButton
                                                    color="info"
                                                    onClick={() => navigateToRescuerDetail(rescuer.id)}
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

                <Stack
                    direction="row"
                    justifyContent="space-between"
                    alignItems="center"
                    sx={{ mt: 3 }}
                >
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
