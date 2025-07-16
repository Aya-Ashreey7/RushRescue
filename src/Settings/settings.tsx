import React, { useState, useEffect } from "react";
import { Box, Typography, Paper, Divider, Avatar, TextField, Button, Alert, Stack } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { onAuthStateChanged, updatePassword, reauthenticateWithCredential, EmailAuthProvider } from "firebase/auth";
import { auth } from "../firebase";
import PageHeader from "../components/PageHeader";
import { useLocation } from "react-router-dom";
import HeaderActions from "../components/HeaderActions";

interface SettingsPageProps {
  toggleDarkMode: () => void;
}

const SettingsPage: React.FC<SettingsPageProps> = ({ toggleDarkMode }) => {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";

  const [userEmail, setUserEmail] = useState("Loading...");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const location = useLocation();
  const pathSegments = location.pathname.split("/").filter(Boolean);
  const breadcrumb = pathSegments
    .map((seg) => seg.charAt(0).toUpperCase() + seg.slice(1))
    .join(" / ");

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

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!currentPassword || !newPassword || !confirmPassword) {
      setError("All fields are required.");
      return;
    }

    if (newPassword.length < 8) {
      setError("New password must be at least 8 characters.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("New passwords do not match.");
      return;
    }

    const user = auth.currentUser;
    if (!user || !user.email) {
      setError("No authenticated user.");
      return;
    }

    setLoading(true);
    try {
      const credential = EmailAuthProvider.credential(
        user.email,
        currentPassword
      );
      await reauthenticateWithCredential(user, credential);
      await updatePassword(user, newPassword);
      setSuccess("Password updated successfully!");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err: any) {
      setError(err.message || "Failed to update password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        bgcolor: isDark ? "#181c2a" : "#f2f6fc",
        pt: 6,
        transition: "background 0.3s",
      }}
    >
      <Box sx={{ maxWidth: 1300, mx: "auto", px: 3 }}>
        <PageHeader
          breadcrumb={breadcrumb}
          title="Settings"
          rightActions={
            <HeaderActions
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              toggleDarkMode={toggleDarkMode}
            />
          }
        />
        <Paper
          sx={{
            p: 4,
            borderRadius: 3,
            boxShadow: 2,
            bgcolor: isDark ? "#23243a" : "#fff",
            transition: "background 0.3s",
          }}
        >
          <Typography
            variant="h4"
            sx={{ mb: 2, color: isDark ? "#fff" : "#0F3460", fontWeight: 700 }}
          >
            Settings
          </Typography>
          <Divider sx={{ mb: 3 }} />

          <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
            <Avatar
              sx={{
                bgcolor: "#0F3460",
                color: "white",
                mr: 2,
                width: 56,
                height: 56,
                fontSize: 24,
              }}>
              {userEmail && userEmail[0] ? userEmail[0].toUpperCase() : "?"}
            </Avatar>
            <Box>
              <Typography
                variant="subtitle1"
                sx={{ color: isDark ? "#fff" : "#222" }}
              >
                {userEmail}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Admin
              </Typography>
            </Box>
          </Box>

          <Divider sx={{ mb: 3 }} />

          <Typography
            variant="h6"
            sx={{
              mb: 2,
              color: isDark ? "#b0b8d1" : "primary.main",
              fontWeight: 600,
            }}
          >
            Change Password
          </Typography>

          <form onSubmit={handleChangePassword} autoComplete="off">
            <Stack spacing={2}>
              <TextField
                label="Current Password"
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                fullWidth
                required
                autoComplete="current-password"
                InputLabelProps={{
                  style: { color: isDark ? "#b0b8d1" : undefined },
                }}
                InputProps={{
                  style: {
                    color: isDark ? "#fff" : undefined,
                    background: isDark ? "#181c2a" : undefined,
                  },
                }}
              />
              <TextField
                label="New Password"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                fullWidth
                required
                autoComplete="new-password"
                InputLabelProps={{
                  style: { color: isDark ? "#b0b8d1" : undefined },
                }}
                InputProps={{
                  style: {
                    color: isDark ? "#fff" : undefined,
                    background: isDark ? "#181c2a" : undefined,
                  },
                }}
              />
              <TextField
                label="Confirm New Password"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                fullWidth
                required
                autoComplete="new-password"
                InputLabelProps={{
                  style: { color: isDark ? "#b0b8d1" : undefined },
                }}
                InputProps={{
                  style: {
                    color: isDark ? "#fff" : undefined,
                    background: isDark ? "#181c2a" : undefined,
                  },
                }}
              />
              {error && <Alert severity="error">{error}</Alert>}
              {success && <Alert severity="success">{success}</Alert>}
              <Button
                type="submit"
                variant="contained"
                color="primary"
                disabled={loading}
                sx={{
                  fontWeight: 600,
                  py: 1.2,
                  mt: 1,
                  bgcolor: isDark ? "#0F3460" : undefined,
                }}
              >
                {loading ? "Saving..." : "Save Password"}
              </Button>
            </Stack>
          </form>
        </Paper>
      </Box>
    </Box>
  );
};

export default SettingsPage;
