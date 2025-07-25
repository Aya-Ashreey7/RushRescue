import {
    Box,
    List,
    ListItem,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    Drawer,
} from "@mui/material";
import {
    Dashboard,
    AssignmentInd,
    DriveEta,
    HealthAndSafety,
    Settings,
    ReportProblem,
} from "@mui/icons-material";
import { useTheme } from "@mui/material/styles";

interface Props {
    open: boolean;
    onClose: () => void;
    onNavigate: (path: string) => void;
    currentPath: string;
    driverPendingCount: number;
    rescuerPendingCount: number;
}

const navigationItems = [
    {
        label: "Dashboard",
        icon: Dashboard,
        path: "/dashboard",
    },
    {
        label: "Driver Requests",
        icon: AssignmentInd,
        path: "/dashboard/driver-requests",
    },
    {
        label: "Rescuer Requests",
        icon: ReportProblem,
        path: "/dashboard/rescuer-requests",
    },
    {
        label: "Drivers",
        icon: DriveEta,
        path: "/dashboard/drivers",
    },
    {
        label: "Rescuers",
        icon: HealthAndSafety,
        path: "/dashboard/rescuers",
    },
];

const Sidebar: React.FC<Props> = ({
    open,
    onClose,
    onNavigate,
    currentPath,
    driverPendingCount,
    rescuerPendingCount,
}) => {
    const theme = useTheme();
    const isDark = theme.palette.mode === "dark";

    return (
        <Drawer anchor="left" open={open} onClose={onClose} variant="temporary">
            <Box
                sx={{
                    width: 256,
                    height: "100vh",
                    backgroundColor: isDark ? "#181c2a" : "#fafafa",
                    display: "flex",
                    flexDirection: "column",
                    borderRight: isDark ? "1px solid #23243a" : "1px solid #e0e0e0",
                    marginTop: "64px",
                    transition: "background 0.3s",
                    justifyContent: "space-between",
                }}
            >
                <List sx={{ p: 0 }}>
                    {navigationItems.map((item, index) => {
                        const isActive = currentPath === item.path;
                        const IconComponent = item.icon;

                        let badgeCount = 0;
                        if (item.label === "Driver Requests") badgeCount = driverPendingCount;
                        if (item.label === "Rescuer Requests") badgeCount = rescuerPendingCount;

                        return (
                            <ListItem key={index} sx={{ p: 0, position: "relative" }}>
                                {isActive && (
                                    <Box
                                        sx={{
                                            position: "absolute",
                                            right: 0,
                                            top: 0,
                                            bottom: 0,
                                            width: 4,
                                            backgroundColor: isDark ? "#ffd700" : "#2563eb",
                                            borderRadius: "4px 0 0 4px",
                                            zIndex: 1,
                                        }}
                                    />
                                )}

                                <ListItemButton
                                    onClick={() => {
                                        onNavigate(item.path);
                                        onClose();
                                    }}
                                    sx={{
                                        borderRadius: 2,
                                        mx: 1,
                                        my: 0.5,
                                        py: 1.5,
                                        backgroundColor: isActive
                                            ? isDark
                                                ? "rgba(255, 215, 0, 0.08)"
                                                : "rgba(37, 99, 235, 0.05)"
                                            : "transparent",
                                        "&:hover": {
                                            backgroundColor: isActive
                                                ? isDark
                                                    ? "rgba(255, 215, 0, 0.12)"
                                                    : "rgba(37, 99, 235, 0.08)"
                                                : isDark
                                                    ? "rgba(255,255,255,0.04)"
                                                    : "rgba(0, 0, 0, 0.04)",
                                        },
                                        transition: "background 0.3s",
                                    }}
                                >
                                    <ListItemIcon sx={{ minWidth: 40 }}>
                                        <IconComponent
                                            sx={{
                                                fontSize: 20,
                                                color: isActive
                                                    ? isDark
                                                        ? "#ffd700"
                                                        : "#1e293b"
                                                    : isDark
                                                        ? "#b0b8d1"
                                                        : "#9ca3af",
                                            }}
                                        />
                                    </ListItemIcon>
                                    <ListItemText
                                        primaryTypographyProps={{ component: "div" }}
                                        primary={
                                            badgeCount > 0 ? (
                                                <Box
                                                    sx={{
                                                        display: "flex",
                                                        alignItems: "center",
                                                        justifyContent: "space-between",
                                                    }}
                                                >
                                                    <span>{item.label}</span>
                                                    <Box
                                                        component="span"
                                                        sx={{
                                                            ml: 1,
                                                            backgroundColor: "#ef4444",
                                                            color: "#fff",
                                                            px: 1,
                                                            borderRadius: "8px",
                                                            fontSize: "0.75rem",
                                                            fontWeight: 600,
                                                            minWidth: 20,
                                                            textAlign: "center",
                                                        }}
                                                    >
                                                        {badgeCount}
                                                    </Box>
                                                </Box>
                                            ) : (
                                                item.label
                                            )
                                        }
                                        sx={{
                                            fontSize: 14,
                                            fontWeight: isActive ? 500 : 400,
                                            color: isActive
                                                ? isDark
                                                    ? "#ffd700"
                                                    : "#1e293b"
                                                : isDark
                                                    ? "#b0b8d1"
                                                    : "#9ca3af",
                                        }}
                                    />

                                </ListItemButton>
                            </ListItem>
                        );
                    })}
                </List>

                {/* Settings */}
                <Box sx={{ p: 2 }}>
                    <ListItem sx={{ p: 0, px: 1, position: "relative" }}>
                        {currentPath === "/dashboard/settings" && (
                            <Box
                                sx={{
                                    position: "absolute",
                                    right: 0,
                                    top: 0,
                                    bottom: 0,
                                    width: 4,
                                    backgroundColor: isDark ? "#ffd700" : "#2563eb",
                                    borderRadius: "4px 0 0 4px",
                                    zIndex: 1,
                                }}
                            />
                        )}

                        <ListItemButton
                            onClick={() => {
                                onNavigate("/dashboard/settings");
                                onClose();
                            }}
                            sx={{
                                borderRadius: 2,
                                py: 1.5,
                                backgroundColor:
                                    currentPath === "/dashboard/settings"
                                        ? isDark
                                            ? "rgba(255, 215, 0, 0.08)"
                                            : "rgba(37, 99, 235, 0.05)"
                                        : "transparent",
                                "&:hover": {
                                    backgroundColor:
                                        currentPath === "/dashboard/settings"
                                            ? isDark
                                                ? "rgba(255, 215, 0, 0.12)"
                                                : "rgba(37, 99, 235, 0.08)"
                                            : isDark
                                                ? "rgba(255,255,255,0.04)"
                                                : "rgba(0, 0, 0, 0.04)",
                                },
                                transition: "background 0.3s",
                            }}
                        >
                            <ListItemIcon sx={{ minWidth: 40 }}>
                                <Settings
                                    sx={{
                                        fontSize: 20,
                                        color:
                                            currentPath === "/dashboard/settings"
                                                ? isDark
                                                    ? "#ffd700"
                                                    : "#1e293b"
                                                : isDark
                                                    ? "#b0b8d1"
                                                    : "#9ca3af",
                                    }}
                                />
                            </ListItemIcon>
                            <ListItemText
                                primary="Settings"
                                sx={{
                                    fontSize: 14,
                                    fontWeight: currentPath === "/dashboard/settings" ? 500 : 400,
                                    color:
                                        currentPath === "/dashboard/settings"
                                            ? isDark
                                                ? "#ffd700"
                                                : "#1e293b"
                                            : isDark
                                                ? "#b0b8d1"
                                                : "#9ca3af",
                                }}
                            />
                        </ListItemButton>
                    </ListItem>
                </Box>
            </Box>
        </Drawer>
    );
};

export default Sidebar;
