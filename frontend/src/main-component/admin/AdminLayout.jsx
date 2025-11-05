import React, { useState } from "react";
import {
  Box,
  CssBaseline,
  useMediaQuery,
  Drawer,
  useTheme,
} from "@mui/material";
import AdminSidebar from "./AdminSidebar"; 
import AdminNavbar from "./AdminNavbar"; 

const drawerWidth = 280; // Sidebar width

const AdminLayout = ({ children }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [sidebarOpen, setSidebarOpen] = useState(!isMobile); // Sidebar open by default on large screens

  // Toggle Sidebar
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <Box sx={{ display: "flex", minHeight: "100vh", backgroundColor: "#f5f5f9" }}>
      <CssBaseline />

      {/* Navbar (Pass Sidebar Toggle Function) */}

      {/* Sidebar */}
      <Drawer
        variant={isMobile ? "temporary" : "persistent"}
        open={sidebarOpen}
        onClose={toggleSidebar}
        sx={{
          width: sidebarOpen ? drawerWidth : 0,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: drawerWidth,
            boxSizing: "border-box",
            backgroundColor: "#FFFFFF",
            color: "#ffffff",
            transition: "width 0.3s ease-in-out",
          },
        }}
      >
        <AdminSidebar />
      </Drawer>


      {/* Main Content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          padding: "20px",
          marginTop: "64px",
          // marginLeft: sidebarOpen && !isMobile ? `${drawerWidth}px` : 0,
          transition: "margin-left 0.3s ease-in-out",
        }}
      >


      <AdminNavbar onSidebarToggle={toggleSidebar} />

        {children}
      </Box>
    </Box>
  );
};

export default AdminLayout;
