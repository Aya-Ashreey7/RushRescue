// components/HeaderActions.tsx
import React, { useEffect, useState } from "react";
import { Box, IconButton, TextField, Avatar, Badge } from "@mui/material";
import { Search, NotificationsNone, DarkModeOutlined, InfoOutlined, } from "@mui/icons-material";
import { useTheme } from "@mui/material/styles";
import { useNavigate } from "react-router-dom";
import { collection, onSnapshot, query } from "firebase/firestore";
import { db } from "../firebase";

interface HeaderActionsProps {
  searchQuery: string;
  setSearchQuery: (value: string) => void;
  toggleDarkMode: () => void;
  onSearch: (query: string) => void;
  breadcrumb: string;
}

const HeaderActions: React.FC<HeaderActionsProps> = ({
  searchQuery,
  setSearchQuery,
  toggleDarkMode,
  onSearch,
}) => {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";
  const navigate = useNavigate();

  const [newUsersCount, setNewUsersCount] = useState(0);
  useEffect(() => {
    const q = query(collection(db, "users"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setNewUsersCount(snapshot.size);
    });

    return () => unsubscribe();
  }, []);

  const settingNavigate = () => {
    navigate("/dashboard/settings");
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);
    onSearch(value); // استدعاء دالة البحث الفوري عند كل تغيير
  };

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        bgcolor: isDark ? "#23243a" : "#fff",
        borderRadius: 8,
        boxShadow: isDark ? 3 : 1,
        pr: 2,
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
        <Search sx={{ color: isDark ? "#b0b8d1" : "#888", mr: 1 }} />
        <TextField variant="standard" placeholder="Search" value={searchQuery}
          onChange={handleSearchChange}
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
        <Badge
          badgeContent={newUsersCount}
          color="error"
          overlap="circular"
          sx={{
            "& .MuiBadge-badge": {
              fontSize: "0.75rem",
              fontWeight: "bold",
              minWidth: 20,
              height: 20,
            },
          }}
        >
          <NotificationsNone sx={{ color: isDark ? "#b0b8d1" : "#888" }} />
        </Badge>
      </IconButton>
      <IconButton onClick={toggleDarkMode}>
        <DarkModeOutlined sx={{ color: isDark ? "#ffd700" : "#888" }} />
      </IconButton>
      <IconButton onClick={settingNavigate}>
        <InfoOutlined sx={{ color: isDark ? "#b0b8d1" : "#888" }} />
      </IconButton>
      <Avatar
        sx={{ width: 30, height: 30, ml: 1, boxShadow: isDark ? 2 : 0 }}
        src="/admin.webp"
      />
    </Box>
  );
};

export default HeaderActions;