import React from "react";
import { Box, Typography } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { useLocation } from "react-router-dom";

interface PageHeaderProps {
  title?: string;
  rightActions?: React.ReactNode;
  breadcrumb: string;
}

const PageHeader: React.FC<PageHeaderProps> = ({ title, rightActions }) => {
  const theme = useTheme();
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
        alignItems: { xs: "stretch", md: "center" },
        justifyContent: "space-between",
        flexDirection: { xs: "column", md: "row" },
        gap: 2,
        mb: 3.5,
      }}
      className="rr-page-enter"
    >
      <Box>
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ mb: 0.5, fontWeight: 500, letterSpacing: "0.02em" }}
        >
          {breadcrumb}
        </Typography>
        <Typography
          variant="h4"
          sx={{
            fontWeight: 800,
            letterSpacing: "-0.03em",
            color: "text.primary",
            fontSize: { xs: "1.6rem", md: "2rem" },
          }}
        >
          {displayTitle}
        </Typography>
        <Box
          sx={{
            mt: 1.25,
            width: 44,
            height: 3,
            borderRadius: 2,
            background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
          }}
        />
      </Box>
      {rightActions}
    </Box>
  );
};

export default PageHeader;
