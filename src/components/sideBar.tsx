import {
    Box,
    List,
    ListItem,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    Drawer,
    Typography,
    Divider,
} from "@mui/material";
import {
    Dashboard,
    AssignmentInd,
    DriveEta,
    HealthAndSafety,
    Settings,
    ReportProblem,
    InsertChartOutlined,
    ReceiptLong,
} from "@mui/icons-material";
import { alpha, useTheme } from "@mui/material/styles";

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
    {
        label: "Reports",
        icon: InsertChartOutlined,
        path: "/dashboard/reports",
    },
    {
        label: "All Requests",
        icon: ReceiptLong,
        path: "/dashboard/allrequests",
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
    const accent = isDark ? theme.palette.secondary.main : theme.palette.primary.main;

    const navButtonSx = (isActive: boolean) => ({
        borderRadius: 2,
        mx: 1,
        my: 0.4,
        py: 1.15,
        backgroundColor: isActive
            ? alpha(accent, isDark ? 0.14 : 0.08)
            : "transparent",
        "&:hover": {
            backgroundColor: isActive
                ? alpha(accent, isDark ? 0.2 : 0.12)
                : alpha(theme.palette.text.primary, 0.04),
        },
        transition: "background 0.2s ease, transform 0.2s ease",
    });

    const renderItem = (
        label: string,
        path: string,
        IconComponent: typeof Dashboard,
        badgeCount = 0
    ) => {
        const isActive = currentPath === path;
        return (
            <ListItem key={path} sx={{ p: 0, position: "relative" }}>
                {isActive && (
                    <Box
                        sx={{
                            position: "absolute",
                            left: 0,
                            top: 10,
                            bottom: 10,
                            width: 3,
                            backgroundColor: accent,
                            borderRadius: "0 3px 3px 0",
                            zIndex: 1,
                        }}
                    />
                )}
                <ListItemButton
                    onClick={() => {
                        onNavigate(path);
                        onClose();
                    }}
                    sx={navButtonSx(isActive)}
                >
                    <ListItemIcon sx={{ minWidth: 40 }}>
                        <IconComponent
                            sx={{
                                fontSize: 20,
                                color: isActive ? accent : "text.secondary",
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
                                    <span>{label}</span>
                                    <Box
                                        component="span"
                                        sx={{
                                            ml: 1,
                                            backgroundColor: "error.main",
                                            color: "#fff",
                                            px: 0.9,
                                            py: 0.15,
                                            borderRadius: 1.5,
                                            fontSize: "0.7rem",
                                            fontWeight: 700,
                                            minWidth: 22,
                                            textAlign: "center",
                                        }}
                                    >
                                        {badgeCount}
                                    </Box>
                                </Box>
                            ) : (
                                label
                            )
                        }
                        sx={{
                            "& .MuiListItemText-primary": {
                                fontSize: 14,
                                fontWeight: isActive ? 600 : 500,
                                color: isActive ? "text.primary" : "text.secondary",
                            },
                        }}
                    />
                </ListItemButton>
            </ListItem>
        );
    };

    return (
        <Drawer anchor="left" open={open} onClose={onClose} variant="temporary">
            <Box
                sx={{
                    width: 268,
                    height: "100vh",
                    bgcolor: "background.paper",
                    display: "flex",
                    flexDirection: "column",
                    mt: "64px",
                    justifyContent: "space-between",
                }}
            >
                <Box>
                    <Box sx={{ px: 2.5, pt: 2.5, pb: 1.5 }}>
                        <Typography
                            variant="overline"
                            sx={{ color: "text.secondary", letterSpacing: "0.12em", fontWeight: 700 }}
                        >
                            Navigation
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ mt: 0.25 }}>
                            Manage rescue operations
                        </Typography>
                    </Box>
                    <List sx={{ p: 0, pt: 0.5 }}>
                        {navigationItems.map((item) => {
                            let badgeCount = 0;
                            if (item.label === "Driver Requests") badgeCount = driverPendingCount;
                            if (item.label === "Rescuer Requests") badgeCount = rescuerPendingCount;
                            return renderItem(item.label, item.path, item.icon, badgeCount);
                        })}
                    </List>
                </Box>

                <Box sx={{ p: 1.5, pb: 3 }}>
                    <Divider sx={{ mb: 1.5 }} />
                    {renderItem("Settings", "/dashboard/settings", Settings)}
                </Box>
            </Box>
        </Drawer>
    );
};

export default Sidebar;
