import React from "react";
import {
  Box, IconButton, TextField, Avatar, Badge, Tooltip,
} from "@mui/material";
import {
  Search, NotificationsNone, DarkModeOutlined, LightModeOutlined, SettingsOutlined,
} from "@mui/icons-material";
import { alpha, useTheme } from "@mui/material/styles";
import { useNavigate } from "react-router-dom";

interface HeaderActionsProps {
  searchQuery: string;
  setSearchQuery: (value: string) => void;
  toggleDarkMode: () => void;
  onSearch: (query: string) => void;
  onOpenDrawer: () => void;
  driverPending: number;
  rescuerPending: number;
}

const HeaderActions: React.FC<HeaderActionsProps> = ({
  searchQuery,
  setSearchQuery,
  toggleDarkMode,
  onSearch,
  onOpenDrawer,
  driverPending,
  rescuerPending,
}) => {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";
  const navigate = useNavigate();

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);
    onSearch(value);
  };

  const settingNavigate = () => navigate("/dashboard/settings");
  const pendingTotal = driverPending + rescuerPending;

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        flexWrap: "wrap",
        gap: 0.75,
        bgcolor: "background.paper",
        borderRadius: 3,
        border: `1px solid ${theme.palette.divider}`,
        px: 1.25,
        py: 0.75,
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          bgcolor: isDark ? alpha("#fff", 0.04) : alpha(theme.palette.primary.main, 0.04),
          borderRadius: 2,
          px: 1.5,
          py: 0.35,
          minWidth: { xs: 140, sm: 200 },
          border: `1px solid ${theme.palette.divider}`,
        }}
      >
        <Search sx={{ color: "text.secondary", mr: 1, fontSize: 20 }} />
        <TextField
          variant="standard"
          placeholder="Search…"
          value={searchQuery}
          onChange={handleSearchChange}
          InputProps={{
            disableUnderline: true,
            sx: {
              fontSize: "0.9rem",
              color: "text.primary",
            },
          }}
          sx={{ flex: 1, bgcolor: "transparent" }}
        />
      </Box>

      <Tooltip title="Pending requests">
        <IconButton onClick={onOpenDrawer} size="small">
          <Badge
            badgeContent={pendingTotal}
            color="error"
            overlap="circular"
            sx={{
              "& .MuiBadge-badge": {
                fontSize: "0.7rem",
                fontWeight: 700,
                minWidth: 18,
                height: 18,
              },
            }}
          >
            <NotificationsNone sx={{ color: "text.secondary" }} />
          </Badge>
        </IconButton>
      </Tooltip>

      <Tooltip title={isDark ? "Light mode" : "Dark mode"}>
        <IconButton onClick={toggleDarkMode} size="small">
          {isDark ? (
            <LightModeOutlined sx={{ color: "secondary.light" }} />
          ) : (
            <DarkModeOutlined sx={{ color: "text.secondary" }} />
          )}
        </IconButton>
      </Tooltip>

      <Tooltip title="Settings">
        <IconButton onClick={settingNavigate} size="small">
          <SettingsOutlined sx={{ color: "text.secondary" }} />
        </IconButton>
      </Tooltip>

      <Avatar
        sx={{
          width: 34,
          height: 34,
          ml: 0.5,
          border: `2px solid ${alpha(theme.palette.secondary.main, 0.45)}`,
          fontSize: "0.85rem",
          fontWeight: 700,
          bgcolor: "primary.main",
        }}
        src="/admin.webp"
      />
    </Box>
  );
};

export default HeaderActions;
