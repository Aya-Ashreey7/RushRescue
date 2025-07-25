// layout/DashboardLayout.tsx
import React, { useState } from "react";
import { Box } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { useLocation, Outlet } from "react-router-dom";
import PageHeader from "../PageHeader";
import HeaderActions from "../HeaderActions";
import { useThemeToggle } from "../../ThemeToggleContext";

const DashboardLayout = () => {
    const [isDrawerOpen, setDrawerOpen] = useState(false);

    const location = useLocation();
    const { toggleDarkMode } = useThemeToggle();
    const theme = useTheme();
    const isDark = theme.palette.mode === "dark";

    const pathSegments = location.pathname.split("/").filter(Boolean);
    const breadcrumb = pathSegments.slice(1).map(
        (seg) => seg.charAt(0).toUpperCase() + seg.slice(1)
    ).join(" / ");

    const title = pathSegments[pathSegments.length - 1]
        ?.replace("-", " ")
        ?.replace(/\b\w/g, (char) => char.toUpperCase()) || "Dashboard";

    const [searchQuery, setSearchQuery] = useState("");

    return (
        <Box sx={{
            minHeight: "100vh",
            bgcolor: isDark ? "#181c2a" : "#f2f6fc",
            pt: 10,
            transition: "background 0.3s"
        }}>
            <Box sx={{ maxWidth: 1300, mx: "auto", px: 2 }}>
                <PageHeader
                    breadcrumb={breadcrumb}
                    title={title}
                    rightActions={
                        <HeaderActions
                            searchQuery={searchQuery}
                            setSearchQuery={setSearchQuery}
                            toggleDarkMode={toggleDarkMode}
                            onSearch={(q) => setSearchQuery(q)}
                            onOpenDrawer={() => setDrawerOpen(true)}
                        />
                    }
                />
                <Outlet context={{ searchQuery, setSearchQuery, toggleDarkMode }} />
            </Box>
        </Box>
    );
};

export default DashboardLayout;
