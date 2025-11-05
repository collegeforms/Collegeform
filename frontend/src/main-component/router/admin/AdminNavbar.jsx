import React from "react";
import { AppBar, Toolbar, IconButton, Box } from "@mui/material";
import { FaInbox, FaBell, FaCog, FaSignOutAlt, FaBars } from "react-icons/fa"; // React Icons
import { Link } from "react-router-dom";
import LogoutButton from "./LogoutButton";

const AdminNavbar = ({ onSidebarToggle }) => {
  return (
    <AppBar
      position="fixed"
      sx={{
        zIndex: 12, // Ensure it stays above the sidebar
        backgroundColor: "white",
        boxShadow: "0px 4px 10px rgba(0,0,0,0.1)",
        padding: "5px 0",
        margin: "25px 20"
      }}
    >
      <Toolbar sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        
        {/* Sidebar Toggle Button */}
        <IconButton edge="start" color="inherit" onClick={onSidebarToggle} sx={{ mr: 2 }}>
          <FaBars size={24} style={{ color: "#333" }} />
        </IconButton>

        {/* Right Side Icons */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 3 }}>
          <IconButton
            component={Link} to="/admin/messages"
            sx={{
              color: "#555", fontSize: 24,
              "&:hover": { color: "#696CFF", transition: "color 0.3s ease" }
            }}
          >
            <FaInbox size={24} />
          </IconButton>

          <IconButton
            component={Link} to="/admin/notifications"
            sx={{
              color: "#555", fontSize: 24,
              "&:hover": { color: "#696CFF", transition: "color 0.3s ease" }
            }}
          >
            <FaBell size={24} />
          </IconButton>

          <IconButton
            component={Link} to="/admin/settings"
            sx={{
              color: "#555", fontSize: 24,
              "&:hover": { color: "#696CFF", transition: "color 0.3s ease" }
            }}
          >
            <FaCog size={24} />
          </IconButton>

          {/* Logout (Red Text with Icon) */}
          <Box
            component={Link} to="/logout"
            sx={{
              display: "flex", alignItems: "center",
              color: "#d32f2f", textDecoration: "none",
              fontWeight: "bold", cursor: "pointer",
              "&:hover": { color: "#9A0007", transition: "color 0.3s ease" }
            }}
          >
        <LogoutButton/>
          </Box>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default AdminNavbar;
