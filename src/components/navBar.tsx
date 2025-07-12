import {
    AppBar, Box, Button, Drawer, IconButton,
    Toolbar, Typography
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { useState, useEffect } from 'react';
import { auth } from '../firebase';
import { useNavigate } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';

const NavBar: React.FC = () => {
    const [drawerOpen, setDrawerOpen] = useState<boolean>(false);
    const [userEmail, setUserEmail] = useState<string>('Loading...');

    const navigate = useNavigate();

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                setUserEmail(user.email || 'No Email');
            } else {
                setUserEmail('Unknown');
            }
        });

        return () => unsubscribe();
    }, []);

    const handleLogout = async () => {
        await auth.signOut();
        localStorage.removeItem("isAdmin");
        navigate('/');
    };

    const handleNavigateDashboard = () => {
        navigate('/dashboard');
        setDrawerOpen(false);
    };
    const toggleDrawer = () => setDrawerOpen(prev => !prev);


    return (
        <>
            <AppBar position="fixed" sx={{ zIndex: 1201, bgcolor: "#1A1A2E", color: "#FFFFFF" }}>
                <Toolbar sx={{ justifyContent: "space-between" }}>
                    <Box display="flex" alignItems="center">
                        <IconButton color="inherit" onClick={toggleDrawer}>
                            <MenuIcon />
                        </IconButton>
                        <Typography variant="h6" ml={1}>RushRescue</Typography>
                        {/* <Box
                            component="img"
                            src="./icon.png"
                            alt="RushRescue"
                            sx={{ height: 40, mr: 2 }}
                        /> */}
                    </Box>
                    <Box display="flex" alignItems="center" gap={2}>
                        <Typography>{userEmail}</Typography>
                        <Button
                            variant="outlined"
                            sx={{ color: "#FFFFFF", borderColor: "#FFFFFF" }}
                            onClick={handleLogout}
                        >
                            Logout
                        </Button>
                    </Box>
                </Toolbar>
            </AppBar>

            <Drawer anchor="left" open={drawerOpen} onClose={() => setDrawerOpen(false)}>
                <Box sx={{ width: 250, p: 2 }}>
                    <Typography variant="h6" mb={2}>Menu</Typography>
                    <Button fullWidth onClick={handleNavigateDashboard}>Dashboard</Button>
                </Box>
            </Drawer>
        </>
    );
};

export default NavBar;
