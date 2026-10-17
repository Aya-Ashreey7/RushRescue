import { useEffect, useState } from "react";
import { Box } from "@mui/material";
import { useLocation, Outlet, useNavigate } from "react-router-dom";
import PageHeader from "../PageHeader";
import HeaderActions from "../HeaderActions";
import { useThemeToggle } from "../../ThemeToggleContext";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import { db } from "../../firebase";
import Sidebar from "../sideBar";

const DashboardLayout = () => {
    const [isDrawerOpen, setDrawerOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [driverPending, setDriverPending] = useState(0);
    const [rescuerPending, setRescuerPending] = useState(0);

    const navigate = useNavigate();
    const location = useLocation();
    const { toggleDarkMode } = useThemeToggle();
    const pathSegments = location.pathname.split("/").filter(Boolean);
    const breadcrumb = pathSegments.slice(1).map(
        (seg) => seg.charAt(0).toUpperCase() + seg.slice(1)
    ).join(" / ");

    let title = "Dashboard";

    if (location.pathname.includes("driver/")) {
        title = "Driver Details";
    } else if (location.pathname.includes("rescuer/")) {
        title = "Rescuer Details";
    } else {
        const lastSegment = pathSegments[pathSegments.length - 1];
        title = lastSegment
            ?.replace("-", " ")
            ?.replace(/\b\w/g, (char) => char.toUpperCase()) || "Dashboard";
    }

    useEffect(() => {
        const unsubDrivers = onSnapshot(
            query(collection(db, "users"), where("role", "==", "driver"), where("status", "==", 0)),
            (snap) => setDriverPending(snap.size)
        );
        const unsubRescuers = onSnapshot(
            query(collection(db, "users"), where("role", "==", "rescuer"), where("status", "==", 0)),
            (snap) => setRescuerPending(snap.size)
        );
        return () => {
            unsubDrivers();
            unsubRescuers();
        };
    }, []);

    const handleSidebarToggle = () => {
        setDrawerOpen((prev) => !prev);
    };

    return (
        <Box
            sx={{
                minHeight: "100vh",
                bgcolor: "transparent",
                pt: { xs: 9, md: 10 },
                pb: 5,
            }}
        >
            <Sidebar
                open={isDrawerOpen}
                onClose={() => setDrawerOpen(false)}
                onNavigate={navigate}
                currentPath={location.pathname}
                driverPendingCount={driverPending}
                rescuerPendingCount={rescuerPending}
            />
            <Box sx={{ maxWidth: 1280, mx: "auto", px: { xs: 2, md: 3 } }}>
                <PageHeader
                    breadcrumb={breadcrumb}
                    title={title}
                    rightActions={
                        <HeaderActions
                            searchQuery={searchQuery}
                            setSearchQuery={setSearchQuery}
                            toggleDarkMode={toggleDarkMode}
                            onSearch={(q) => setSearchQuery(q)}
                            onOpenDrawer={handleSidebarToggle}
                            driverPending={driverPending}
                            rescuerPending={rescuerPending}
                        />
                    }
                />
                <Box className="rr-page-enter" key={location.pathname}>
                    <Outlet context={{ searchQuery, setSearchQuery, toggleDarkMode }} />
                </Box>
            </Box>
        </Box>
    );
};

export default DashboardLayout;
