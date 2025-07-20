// components/PageHeader.tsx
import React from "react";
import { Box, Typography } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { useLocation } from "react-router-dom";

interface PageHeaderProps {
  title?: string;
  rightActions?: React.ReactNode;
}

const PageHeader: React.FC<PageHeaderProps> = ({ title, rightActions }) => {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";
  const location = useLocation();

  const pathSegments = location.pathname.split("/").filter(Boolean);

  const breadcrumb = pathSegments
    .map((segment) =>
      segment
        .replace(/-/g, " ")
        .replace(/\b\w/g, (char) => char.toUpperCase())
    )
    .join(" / ");

  const displayTitle =
    title ||
    pathSegments[pathSegments.length - 1]
      ?.replace(/-/g, " ")
      .replace(/\b\w/g, (char) => char.toUpperCase()) ||
    "Dashboard";

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        mb: 4,
      }}
    >
      <Box>
        <Typography
          variant="body2"
          color={isDark ? "#b0b8d1" : "#888"}
          sx={{ mb: 0.5 }}
        >
          {breadcrumb}
        </Typography>
        <Typography
          variant="h4"
          sx={{ fontWeight: 700, color: isDark ? "#fff" : "#1A1A2E" }}
        >
          {displayTitle}
        </Typography>
      </Box>
      {rightActions}
    </Box>
  );
};

export default PageHeader;
