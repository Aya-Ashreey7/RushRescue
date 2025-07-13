
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
    return (
        <Drawer anchor="left"
            open={open}
            onClose={onClose}
            variant="temporary"

        >
            <Box sx={{
                width: 256,
                height: "100vh",
                backgroundColor: "#fafafa",
                display: "flex",
                flexDirection: "column",
                borderRight: "1px solid #e0e0e0",
                marginTop: "64px",
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
                <Box sx={{ flex: 1, p: 1 }}>
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
                                                backgroundColor: "#2563eb",
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
                                            backgroundColor: item.active ? "rgba(37, 99, 235, 0.05)" : "transparent",
                                            "&:hover": {
                                                backgroundColor: item.active ? "rgba(37, 99, 235, 0.08)" : "rgba(0, 0, 0, 0.04)",
                                            },
                                        }}
                                    >
                                        <ListItemIcon sx={{ minWidth: 40 }}>
                                            <IconComponent
                                                sx={{
                                                    fontSize: 20,
                                                    color: item.active ? "#1e293b" : "#9ca3af",
                                                }}
                                            />
                                        </ListItemIcon>
                                        <ListItemText
                                            primary={item.label}
                                            primaryTypographyProps={{
                                                fontSize: 14,
                                                fontWeight: item.active ? 500 : 400,
                                                color: item.active ? "#1e293b" : "#9ca3af",
                                            }}
                                        />
                                    </ListItemButton>
                                </ListItem>
                            )
                        })}
                    </List>
                </Box>

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
                                    backgroundColor: "rgba(0, 0, 0, 0.04)",
                                },
                            }}
                        >
                            <ListItemIcon sx={{ minWidth: 40 }}>
                                <Settings sx={{ fontSize: 20, color: "#9ca3af" }} />
                            </ListItemIcon>
                            <ListItemText
                                primary="Settings"
                                primaryTypographyProps={{
                                    fontSize: 14,
                                    fontWeight: 400,
                                    color: "#9ca3af",
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
