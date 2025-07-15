// components/HeaderActions.tsx

import React from "react";
import { Box, IconButton, TextField, Avatar } from "@mui/material";
import {
  Search as SearchIcon,
  NotificationsNone as NotificationsNoneIcon,
  DarkModeOutlined as DarkModeOutlinedIcon,
  InfoOutlined as InfoOutlinedIcon,
} from "@mui/icons-material";
import { useTheme } from "@mui/material/styles";

interface HeaderActionsProps {
  searchQuery: string;
  setSearchQuery: (value: string) => void;
  toggleDarkMode: () => void;
}

const HeaderActions: React.FC<HeaderActionsProps> = ({
  searchQuery,
  setSearchQuery,
  toggleDarkMode,
}) => {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        bgcolor: isDark ? "#23243a" : "#fff",
        borderRadius: 8,
        boxShadow: isDark ? 3 : 1,
        px: 2,
        py: 0.5,
        gap: 1,
        transition: "background 0.3s",
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          bgcolor: isDark ? "#23243a" : "#f5f6fa",
          borderRadius: 8,
          px: 2,
          py: 0.5,
          mr: 1,
          boxShadow: isDark ? 1 : 0,
        }}
      >
        <SearchIcon sx={{ color: isDark ? "#b0b8d1" : "#888", mr: 1 }} />
        <TextField
          variant="standard"
          placeholder="Search"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          InputProps={{
            disableUnderline: true,
            style: {
              background: "transparent",
              color: isDark ? "#fff" : "#222",
            },
          }}
          sx={{ width: 120, bgcolor: "transparent" }}
        />
      </Box>
      <IconButton>
        <NotificationsNoneIcon sx={{ color: isDark ? "#b0b8d1" : "#888" }} />
      </IconButton>
      <IconButton onClick={toggleDarkMode}>
        <DarkModeOutlinedIcon sx={{ color: isDark ? "#ffd700" : "#888" }} />
      </IconButton>
      <IconButton>
        <InfoOutlinedIcon sx={{ color: isDark ? "#b0b8d1" : "#888" }} />
      </IconButton>
      <Avatar
        sx={{ width: 32, height: 32, ml: 1, boxShadow: isDark ? 2 : 0 }}
        src="https://randomuser.me/api/portraits/men/32.jpg"
      />
    </Box>
  );
};

export default HeaderActions;
