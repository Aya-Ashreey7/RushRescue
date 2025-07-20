import {
  AppBar,
  Box,
  Button,
  IconButton,
  Toolbar,
  Typography,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { useState, useEffect } from "react";
import { auth } from "../firebase";
import { Link, useNavigate } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import { useTheme } from "@mui/material/styles";

interface NavBarProps {
  onMenuToggle: () => void;
}

const NavBar: React.FC<NavBarProps> = ({ onMenuToggle }) => {
  const [userEmail, setUserEmail] = useState<string>("Loading...");
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";

  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserEmail(user.email || "No Email");
      } else {
        setUserEmail("Unknown");
      }
    });

    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    await auth.signOut();
    localStorage.removeItem("isAdmin");
    navigate("/");
  };

  return (
    <>
      <AppBar
        position="fixed"
        elevation={isDark ? 4 : 1}
        sx={{
          zIndex: (theme) => theme.zIndex.drawer + 1,
          bgcolor: isDark ? "#23243a" : "#0F3460",
          color: isDark ? "#fff" : "#FFFFFF",
          transition: "background 0.3s",
        }}
      >
        <Toolbar sx={{ justifyContent: "space-between", minHeight: 64 }}>
          <Box display="flex" alignItems="center">
            <IconButton
              color="inherit"
              onClick={onMenuToggle}
              sx={{ color: isDark ? "#ffd700" : "#fff" }}
            >
              <MenuIcon />
            </IconButton>
            {/* <Box
                            component="img"
                            src="./icon.png"
                            alt="RushRescue"
                            sx={{ height: 40, mr: 2 }}
                        /> */}
            <Typography
              component={Link}
              to="/dashboard"
              variant="h6"
              ml={1}
              sx={{
                color: isDark ? "#ffd700" : "#fff",
                fontWeight: 700,
                letterSpacing: 1,
              }}
            >
              RushRescue
            </Typography>
          </Box>
          <Box display="flex" alignItems="center" gap={2}>
            <Button
              variant="outlined"
              sx={{
                color: isDark ? "#ffd700" : "#fff",
                borderColor: isDark ? "#ffd700" : "#fff",
                fontWeight: 600,
                transition: "all 0.3s",
                "&:hover": {
                  borderColor: isDark ? "#fff" : "#ffd700",
                  color: isDark ? "#fff" : "#ffd700",
                  background: isDark
                    ? "rgba(255,255,255,0.04)"
                    : "rgba(255,215,0,0.04)",
                },
              }}
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
