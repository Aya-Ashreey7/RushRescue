
import {
    Box,
    List,
    ListItem,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    Drawer,
} from "@mui/material"
import {
    Dashboard, AssignmentInd,
    DriveEta,
    HealthAndSafety, Settings, ReportProblem
} from "@mui/icons-material"
import { useTheme } from '@mui/material/styles';

const navigationItems = [
    {
        label: "Dashboard",
        icon: Dashboard,
        active: true,
        path: "/dashboard"
    },
    {
        label: "Driver Requests",
        icon: AssignmentInd,
        active: false,
        path: "/dashboard/driver-requests"
    },
    {
        label: "Rescuer Requests",
        icon: ReportProblem,
        active: false,
        path: "/dashboard/rescuer-requests"

    },
    {
        label: "Drivers",
        icon: DriveEta,
        active: false,
        path: "/dashboard/drivers"
    },
    {
        label: "Rescuers",
        icon: HealthAndSafety,
        active: false,
        path: "/dashboard/rescuers"
    },

]

interface Props {
    open: boolean;
    onClose: () => void;
    onNavigate: (label: string) => void;
}

const Sidebar: React.FC<Props> = ({ open, onClose, onNavigate }) => {
    const theme = useTheme();
    const isDark = theme.palette.mode === 'dark';
    return (
        <Drawer anchor="left"
            open={open}
            onClose={onClose}
            variant="temporary"
        >
            <Box sx={{
                width: 256,
                height: "100vh",
                backgroundColor: isDark ? '#181c2a' : "#fafafa",
                display: "flex",
                flexDirection: "column",
                borderRight: isDark ? '1px solid #23243a' : "1px solid #e0e0e0",
                marginTop: "64px",
                transition: 'background 0.3s',
                justifyContent: 'space-between',
            }}>
                {/*============================== Header ==============================*/}
                {/* <Box sx={{ p: 3, borderBottom: "1px solid #e0e0e0" }}>
                    <Typography
                        variant="h5"
                        sx={{
                            fontWeight: "bold",
                            color: "#1e293b",
                            letterSpacing: "0.1em",
                        }}
                    >
                        HORIZON
                    </Typography>
                </Box> */}

                {/*============================== Navigation ==============================*/}
                <List sx={{ p: 0 }}>
                    {navigationItems.map((item, index) => {
                        const IconComponent = item.icon
                        return (
                            <ListItem key={index} sx={{ p: 0, position: "relative" }}>
                                {/* Active indicator */}
                                {item.active && (
                                    <Box
                                        sx={{
                                            position: "absolute",
                                            right: 0,
                                            top: 0,
                                            bottom: 0,
                                            width: 4,
                                            backgroundColor: isDark ? '#ffd700' : "#2563eb",
                                            borderRadius: "4px 0 0 4px",
                                            zIndex: 1,
                                        }}
                                    />
                                )}
                                <ListItemButton onClick={() => {
                                    onNavigate(item.path);
                                    onClose();
                                }}
                                    sx={{
                                        borderRadius: 2,
                                        mx: 1,
                                        my: 0.5,
                                        py: 1.5,
                                        backgroundColor: item.active ? (isDark ? 'rgba(255, 215, 0, 0.08)' : "rgba(37, 99, 235, 0.05)") : "transparent",
                                        "&:hover": {
                                            backgroundColor: item.active ? (isDark ? 'rgba(255, 215, 0, 0.12)' : "rgba(37, 99, 235, 0.08)") : (isDark ? 'rgba(255,255,255,0.04)' : "rgba(0, 0, 0, 0.04)"),
                                        },
                                        transition: 'background 0.3s',
                                    }}
                                >
                                    <ListItemIcon sx={{ minWidth: 40 }}>
                                        <IconComponent
                                            sx={{
                                                fontSize: 20,
                                                color: item.active ? (isDark ? '#ffd700' : "#1e293b") : (isDark ? '#b0b8d1' : "#9ca3af"),
                                            }}
                                        />
                                    </ListItemIcon>
                                    <ListItemText
                                        primary={item.label}
                                        primaryTypographyProps={{
                                            fontSize: 14,
                                            fontWeight: item.active ? 500 : 400,
                                            color: item.active ? (isDark ? '#ffd700' : "#1e293b") : (isDark ? '#b0b8d1' : "#9ca3af"),
                                        }}
                                    />
                                </ListItemButton>
                            </ListItem>
                        )
                    })}
                </List>
                {/*=========================== setting ==============================*/}
                <Box sx={{ p: 2 }}>
                    <ListItem sx={{ p: 0, px: 1, pb: 2 }}>
                        <ListItemButton
                            onClick={() => {
                                onNavigate("/dashboard/settings");
                                onClose();
                            }}
                            sx={{
                                borderRadius: 2,
                                py: 1.5,
                                backgroundColor: "transparent",
                                "&:hover": {
                                    backgroundColor: isDark ? 'rgba(255,255,255,0.04)' : "rgba(0, 0, 0, 0.04)",
                                },
                                transition: 'background 0.3s',
                            }}
                        >
                            <ListItemIcon sx={{ minWidth: 40 }}>
                                <Settings sx={{ fontSize: 20, color: isDark ? '#ffd700' : "#9ca3af" }} />
                            </ListItemIcon>
                            <ListItemText
                                primary="Settings"
                                primaryTypographyProps={{
                                    fontSize: 14,
                                    fontWeight: 400,
                                    color: isDark ? '#ffd700' : "#9ca3af",
                                }}
                            />
                        </ListItemButton>
                    </ListItem>

                </Box>
            </Box>
        </Drawer>
    )
}

export default Sidebar;
