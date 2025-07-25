// pages/dashboard.tsx
import React, { useEffect, useState } from "react";
import { Box } from "@mui/material";
import NavBar from "../components/navBar";
import Sidebar from "../components/sideBar";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import {
  collection,
  query,
  where,
  onSnapshot,
} from "firebase/firestore";
import { db } from "../firebase";

const DashBoard: React.FC = () => {
  const [isDrawerOpen, setDrawerOpen] = useState(false);
  const [driverPending, setDriverPending] = useState(0);
  const [rescuerPending, setRescuerPending] = useState(0);

  const navigate = useNavigate();
  const location = useLocation();

  const toggleDrawer = () => setDrawerOpen((prev) => !prev);
  const handleNavigate = (path: string) => navigate(path);
  const handleClose = () => setDrawerOpen(false);

  useEffect(() => {
    const unsubDrivers = onSnapshot(
      query(
        collection(db, "users"),
        where("role", "==", "driver"),
        where("status", "==", 0)
      ),
      (snap) => setDriverPending(snap.size)
    );

    const unsubRescuers = onSnapshot(
      query(
        collection(db, "users"),
        where("role", "==", "rescuer"),
        where("status", "==", 0)
      ),
      (snap) => setRescuerPending(snap.size)
    );

    return () => {
      unsubDrivers();
      unsubRescuers();
    };
  }, []);

  return (
    <Box sx={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <NavBar onMenuToggle={toggleDrawer} />
      <Sidebar
        open={isDrawerOpen}
        onClose={handleClose}
        onNavigate={handleNavigate}
        currentPath={location.pathname}
        driverPendingCount={driverPending}
        rescuerPendingCount={rescuerPending}
      />
      <Outlet />
    </Box>
  );
};

export default DashBoard;
