import React, { useState, useEffect } from "react";
import { Box, Typography, Paper, Divider, Avatar, TextField, Button, Alert, Stack } from "@mui/material";
import { onAuthStateChanged, updatePassword, reauthenticateWithCredential, EmailAuthProvider } from "firebase/auth";
import { auth } from "../firebase";

const SettingsPage: React.FC = () => {
  const [userEmail, setUserEmail] = useState("Loading...");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) setUserEmail(user.email || "No Email");
      else setUserEmail("Unknown");
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
      const message =
        err.code === "auth/wrong-password"
          ? "Current password is incorrect."
          : err.message || "Failed to update password.";
      setError(message);
    } finally {
      setLoading(false);
    }
  };
  console.log(auth.currentUser?.providerData);




  return (
    <Box>
        <Paper
          sx={{
            p: { xs: 2.5, md: 4 },
            borderRadius: 3,
            bgcolor: "background.paper",
            maxWidth: 640,
          }}
        >
          <Typography
            variant="h5"
            sx={{ mb: 1, fontWeight: 800, letterSpacing: "-0.02em" }}
          >
            Account settings
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2.5 }}>
            Manage your admin profile and password
          </Typography>
          <Divider sx={{ mb: 3 }} />

          <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
            <Avatar
              sx={{
                bgcolor: "primary.main",
                color: "primary.contrastText",
                mr: 2,
                width: 56,
                height: 56,
                fontSize: 24,
                fontWeight: 700,
              }}
            >
              {userEmail && userEmail[0] ? userEmail[0].toUpperCase() : "?"}
            </Avatar>
            <Box>
              <Typography variant="subtitle1" fontWeight={600}>
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
              color: "text.primary",
              fontWeight: 700,
            }}
          >
            Change password
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
              />
              <TextField
                label="New Password"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                fullWidth
                required
              />
              <TextField
                label="Confirm New Password"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                fullWidth
                required
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
                }}
              >
                {loading ? "Saving..." : "Save Password"}
              </Button>
            </Stack>
          </form>
        </Paper>
    </Box>
  );
};

export default SettingsPage;
