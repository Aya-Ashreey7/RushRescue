// components/PageHeader.tsx

import React from "react";
import { Box, Typography } from "@mui/material";
import { useTheme } from "@mui/material/styles";

interface PageHeaderProps {
  breadcrumb: string;
  title: string;
  rightActions?: React.ReactNode;
}

const PageHeader: React.FC<PageHeaderProps> = ({
  breadcrumb,
  title,
  rightActions,
}) => {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";

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
          {title}
        </Typography>
      </Box>
      {rightActions}
    </Box>
  );
};

export default PageHeader;
