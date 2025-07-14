import React, { useState } from "react";
import {
    Box, Button, TextField, Paper, Typography, IconButton,
    MenuItem, Select, FormControl, InputLabel, Table,
    TableBody, TableCell, TableContainer, TableHead,
    TableRow, Pagination, Stack
} from "@mui/material";

import {
    CheckCircle,
    Search as SearchIcon,
    Visibility as EyeIcon,
    Delete as TrashIcon,
    Download as DownloadIcon,
} from "@mui/icons-material";


export default function Drivers() {
    const [searchQuery, setSearchQuery] = useState("");
    const [filterDate, setFilterDate] = useState("");
    const [page, setPage] = useState(1);

    const products = Array.from({ length: 10 }, (_, i) => ({
        id: i + 1,
        productId: "#65432a",
        productName: "Mandouka",
        category: "Sport",
        createName: "Jan 15, 2024",
        updateDate: "Jan 15, 2024",
    }));

    return (
        <Box sx={{ minHeight: "100vh", bgcolor: "grey.50", pt: 6 }}>
            <Box sx={{ maxWidth: 1300, mx: "auto" }}>
                {/* Header */}
                <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 4 }}>
                    <Typography variant="h4">Drivers Requests List</Typography>
                    {/* <Button variant="contained" color="primary">
                        Add Drivers Requests
                    </Button> */}
                </Box>

                <Paper sx={{ p: 4, mb: 4 }}>
                    <Typography variant="h6" sx={{ mb: 3 }}> Requests Status</Typography>

                    {/* Filters */}
                    <Stack direction="row" spacing={2} alignItems="center" justifyContent="space-between" sx={{ mb: 2 }}>
                       <Box sx={{ display: "flex", gap: 2 }}>  
                        <Button sx={{ backgroundColor: "#0F3460", color: "white" }}>All Drivers Requests</Button>
                        <Box sx={{
                            display: "flex",
                            alignItems: "center",
                            backgroundColor: "#fff",
                            border: "1px solid #ccc",
                            borderRadius: 2,
                            overflow: "hidden",
                            height: 40,
                            width: 300,
                        }}
                        >
                            <TextField
                                variant="standard"
                                placeholder="Search "
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                InputProps={{
                                    disableUnderline: true,
                                }}
                                sx={{
                                    flex: 1,
                                    pl: 2,
                                }}
                            />
                            <IconButton
                                sx={{
                                    height: "100%",
                                    borderRadius: 0,
                                    backgroundColor: "#0F3460",
                                    color: "#fff",
                                    "&:hover": {
                                        backgroundColor: "#0d2f50",
                                    },
                                }}
                            >
                                <SearchIcon />
                            </IconButton>
                        </Box>
                        </Box>
                       

                <Box sx={{ display: "flex", gap: 2 }}>
                        <FormControl sx={{
                            minWidth: 160,
                            '& .MuiOutlinedInput-root': {
                                '& fieldset': {
                                    borderColor: '#0F3460',
                                },
                                '&:hover fieldset': {
                                    borderColor: '#0d2f50',
                                },
                                '&.Mui-focused fieldset': {
                                    borderColor: '#0F3460',
                                },
                            },
                            '& .MuiInputLabel-root': {
                                color: '#777',
                            },
                            '& .MuiInputLabel-root.Mui-focused': {
                                color: '#0F3460',
                                fontWeight: 500,
                            },
                        }} size="small" >
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

                        <Button sx={{ borderColor: "#0F3460", color: "#0F3460",
                            "&:hover": { borderColor: "#0d2f50",
                                backgroundColor: "rgba(15, 52, 96, 0.05)",
                            },
                        }} variant="outlined" startIcon={<DownloadIcon sx={{ color: "#0F3460" }} />}>
                            Export Drivers
                        </Button>
                        </Box>


                    </Stack>

                    {/* Table */}
                    <TableContainer component={Paper} variant="outlined">
                        <Table size="small">
                            <TableHead>
                                <TableRow>
                                    {["#", "Product ID", "Name", "Category", "Created", "Updated", "Actions"].map(header => (
                                        <TableCell key={header} sx={{ fontWeight: "bold" }}>
                                            {header}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {products.map(prod => (
                                    <TableRow key={prod.id} hover>
                                        <TableCell>{prod.id}</TableCell>
                                        <TableCell>{prod.productId}</TableCell>
                                        <TableCell>{prod.productName}</TableCell>
                                        <TableCell>{prod.category}</TableCell>
                                        <TableCell>{prod.createName}</TableCell>
                                        <TableCell>{prod.updateDate}</TableCell>
                                        <TableCell>
                                            <Stack direction="row" spacing={1}>
                                                <IconButton color="info"><EyeIcon /></IconButton>
                                                <IconButton color="success"> <CheckCircle /> </IconButton>
                                                <IconButton color="error"><TrashIcon /></IconButton>
                                            </Stack>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>

                    {/* Pagination */}
                    <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mt: 3 }}>
                        <Typography variant="body2">Showing 1–10 of 1000</Typography>
                        <Pagination
                            page={page}
                            count={100}
                            onChange={(_, val) => setPage(val)}
                            variant="outlined"
                            shape="rounded"
                            showFirstButton
                            showLastButton
                        />
                    </Stack>
                </Paper>
            </Box>
        </Box>
    );
}
