import React, { useState } from "react";
import {
  Box,
  Button,
  TextField,
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

import {
  CheckCircle,
  Search as SearchIcon,
  Visibility as EyeIcon,
  Delete as TrashIcon,
  Download as DownloadIcon,
} from "@mui/icons-material";

import { useLocation } from "react-router-dom";
import { useTheme } from "@mui/material/styles";
import PageHeader from "../components/PageHeader";
import HeaderActions from "../components/HeaderActions";

interface DriversProps {
  toggleDarkMode: () => void;
}

export default function Drivers({ toggleDarkMode }: DriversProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterDate, setFilterDate] = useState("");
  const [page, setPage] = useState(1);
  const location = useLocation();
  const pathSegments = location.pathname.split("/").filter(Boolean);
  const breadcrumb = pathSegments
    .map((seg) => seg.charAt(0).toUpperCase() + seg.slice(1))
    .join(" / ");

  const products = Array.from({ length: 10 }, (_, i) => ({
    id: i + 1,
    productId: "#65432a",
    productName: "Mandouka",
    category: "Sport",
    createName: "Jan 15, 2024",
    updateDate: "Jan 15, 2024",
  }));

  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";

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
              <Button
                sx={{
                  backgroundColor: isDark ? "#22304a" : "#0F3460",
                  color: "white",
                  boxShadow: isDark ? 1 : 0,
                }}
              >
                All Drivers Requests
              </Button>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  backgroundColor: isDark ? "#23243a" : "#fff",
                  border: `1px solid ${isDark ? "#444a5a" : "#ccc"}`,
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
                    style: {
                      color: isDark ? "#fff" : "#222",
                      background: "transparent",
                    },
                  }}
                  sx={{
                    flex: 1,
                    pl: 2,
                    bgcolor: "transparent",
                  }}
                />
                <IconButton
                  sx={{
                    height: "100%",
                    borderRadius: 0,
                    backgroundColor: isDark ? "#22304a" : "#0F3460",
                    color: "#fff",
                    "&:hover": {
                      backgroundColor: isDark ? "#1a2233" : "#0d2f50",
                    },
                  }}
                >
                  <SearchIcon />
                </IconButton>
              </Box>
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

              <Button
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
                  <DownloadIcon
                    sx={{ color: isDark ? "#ffd700" : "#0F3460" }}
                  />
                }
              >
                Export Drivers
              </Button>
            </Box>
          </Stack>

          {/* Table */}
          <TableContainer component={Paper} variant="outlined">
            <Table size="small">
              <TableHead>
                <TableRow>
                  {[
                    "#",
                    "Product ID",
                    "Name",
                    "Category",
                    "Created",
                    "Updated",
                    "Actions",
                  ].map((header) => (
                    <TableCell key={header} sx={{ fontWeight: "bold" }}>
                      {header}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {products.map((prod) => (
                  <TableRow key={prod.id} hover>
                    <TableCell>{prod.id}</TableCell>
                    <TableCell>{prod.productId}</TableCell>
                    <TableCell>{prod.productName}</TableCell>
                    <TableCell>{prod.category}</TableCell>
                    <TableCell>{prod.createName}</TableCell>
                    <TableCell>{prod.updateDate}</TableCell>
                    <TableCell>
                      <Stack direction="row" spacing={1}>
                        <IconButton color="info">
                          <EyeIcon />
                        </IconButton>
                        <IconButton color="success">
                          {" "}
                          <CheckCircle />{" "}
                        </IconButton>
                        <IconButton color="error">
                          <TrashIcon />
                        </IconButton>
                      </Stack>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          {/* Pagination */}
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
            sx={{ mt: 3 }}
          >
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
