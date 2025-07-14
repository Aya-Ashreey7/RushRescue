import {
    AppBar, Box, Button, IconButton,
    Toolbar, Typography
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { useState, useEffect } from 'react';
import { auth } from '../firebase';
import { useNavigate } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';

interface NavBarProps {
    onMenuToggle: () => void;
}

const NavBar: React.FC<NavBarProps> = ({ onMenuToggle }) => {
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




    return (
        <>
            <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1, bgcolor: "#0F3460", color: "#FFFFFF" }}>
                <Toolbar sx={{ justifyContent: "space-between" }}>
                    <Box display="flex" alignItems="center">
                        <IconButton color="inherit" onClick={onMenuToggle}>
                            <MenuIcon />
                        </IconButton>
                        {/* <Box
                            component="img"
                            src="./icon.png"
                            alt="RushRescue"
                            sx={{ height: 40, mr: 2 }}
                        /> */}
                        <Typography variant="h6" ml={1}>RushRescue</Typography>

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


        </>
    );
};

export default NavBar;
