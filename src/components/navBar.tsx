import {
  AppBar,
  Box,
  Button,
  IconButton,
  Toolbar,
  Typography,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import LogoutRoundedIcon from "@mui/icons-material/LogoutRounded";
import type { FC } from "react";
import { auth } from "../firebase";
import { Link, useNavigate } from "react-router-dom";
import { alpha, useTheme } from "@mui/material/styles";

interface NavBarProps {
  onMenuToggle: () => void;
}

const NavBar: FC<NavBarProps> = ({ onMenuToggle }) => {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";
  const navigate = useNavigate();

  const handleLogout = async () => {
    await auth.signOut();
    localStorage.removeItem("isAdmin");
    navigate("/");
  };

  return (
    <AppBar
      position="fixed"
      elevation={0}
      sx={{
        zIndex: (t) => t.zIndex.drawer + 1,
        bgcolor: isDark ? "background.paper" : "primary.main",
        color: isDark ? "text.primary" : "primary.contrastText",
        borderBottom: `1px solid ${
          isDark ? alpha("#fff", 0.08) : alpha("#000", 0.08)
        }`,
        backdropFilter: "blur(10px)",
      }}
    >
      <Toolbar sx={{ justifyContent: "space-between", minHeight: 64, px: { xs: 1.5, md: 2.5 } }}>
        <Box display="flex" alignItems="center" gap={0.5}>
          <IconButton
            color="inherit"
            onClick={onMenuToggle}
            aria-label="Open navigation"
            sx={{
              mr: 0.5,
              color: isDark ? "secondary.light" : "inherit",
              "&:hover": {
                bgcolor: isDark ? alpha("#fff", 0.06) : alpha("#fff", 0.12),
              },
            }}
          >
            <MenuIcon />
          </IconButton>
          <Box
            sx={{
              width: 8,
              height: 8,
              borderRadius: 1,
              bgcolor: isDark ? "secondary.main" : alpha("#fff", 0.85),
              mr: 1,
            }}
          />
          <Typography
            component={Link}
            to="/dashboard"
            variant="h6"
            sx={{
              color: "inherit",
              fontWeight: 800,
              letterSpacing: "-0.03em",
              textDecoration: "none",
              fontSize: { xs: "1.1rem", sm: "1.25rem" },
            }}
          >
            RushRescue
          </Typography>
          <Typography
            variant="caption"
            sx={{
              ml: 1.25,
              display: { xs: "none", sm: "inline-flex" },
              px: 1,
              py: 0.25,
              borderRadius: 1,
              fontWeight: 600,
              letterSpacing: "0.04em",
              color: isDark ? "secondary.light" : alpha("#fff", 0.85),
              border: `1px solid ${
                isDark ? alpha(theme.palette.secondary.main, 0.4) : alpha("#fff", 0.25)
              }`,
            }}
          >
            ADMIN
          </Typography>
        </Box>

        <Button
          variant="outlined"
          size="small"
          startIcon={<LogoutRoundedIcon />}
          onClick={handleLogout}
          sx={{
            color: "inherit",
            borderColor: isDark
              ? alpha(theme.palette.secondary.main, 0.5)
              : alpha("#fff", 0.45),
            px: 1.75,
            "&:hover": {
              borderColor: isDark ? "secondary.light" : "#fff",
              bgcolor: isDark
                ? alpha(theme.palette.secondary.main, 0.1)
                : alpha("#fff", 0.08),
            },
          }}
        >
          Logout
        </Button>
      </Toolbar>
    </AppBar>
  );
};

export default NavBar;
