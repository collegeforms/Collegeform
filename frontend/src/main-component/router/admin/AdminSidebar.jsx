import React from "react";
import { Box, Divider, List, ListItem, ListItemText, ListItemIcon, Typography } from "@mui/material";
import { FaTachometerAlt, FaUsers, FaCog, FaChartBar, FaSignOutAlt } from "react-icons/fa"; // Importing icons from React Icons
import { Link, useLocation } from "react-router-dom";
import LogoutButton from "./LogoutButton";

// Menu Items
const menuItems = [
  { text: "Dashboard", icon: <FaTachometerAlt />, path: "/admin/dashboard", section: "admin-tools" },
  { text: "Colleges", icon: <FaUsers />, path: "/admin/colleges", section: "user-management" },
  { text: "Other Colleges", icon: <FaUsers />, path: "/admin/other-colleges", section: "user-management" },

  { text: "Inquiry", icon: <FaCog />, path: "/admin/inquiry", section: "admin-tools" },
  { text: "Banner", icon: <FaChartBar />, path: "/admin/addbanner", section: "uploads" },
  { text: "AddBlogs", icon: <FaChartBar />, path: "/admin/addBlogs", section: "uploads" },

  { text: "Specializations", icon: <FaChartBar />, path: "/admin/specialization", section: "uploads" },
  { text: "Slider", icon: <FaUsers />, path: "/admin/slidermanager", section: "uploads" },
  { text: "Verify Docs", icon: <FaUsers />, path: "/admin/verifydocs", section: "uploads" },
  { text: "FAQ", icon: <FaUsers />, path: "/admin/addfaq", section: "uploads" },

  { text: "Exams", icon: <FaUsers />, path: "/admin/exams", section: "uploads" },
  { text: "Reviews", icon: <FaUsers />, path: "/admin/addreview", section: "uploads" },

  { text: "Tests", icon: <FaUsers />, path: "/admin/tests", section: "uploads" },
  { text: "Manage exams", icon: <FaUsers />, path: "/admin/manage-exams", section: "uploads" },
  { text: "Banner Inquiry", icon: <FaUsers />, path: "/admin/bannerinq", section: "uploads" },

  { text: "Logos", icon: <FaUsers />, path: "/admin/addlogo", section: "uploads" },
  { text: "Users", icon: <FaUsers />, path: "/admin/users", section: "user-management" },
  { text: "Applications", icon: <FaUsers />, path: "/admin/Applications", section: "user-management" },
  { text: "Callbacks", icon: <FaCog />, path: "/admin/callbacks", section: "user-management" },

  { text: "Details", icon: <FaCog />, path: "/admin/upload", section: "uploads" },
];

const AdminSidebar = () => {
  const location = useLocation(); // Get current route

  return (
    <Box
      sx={{
        width: "100%",
        height: "100%",
        backgroundColor: "white", // Light background color
        color: "#333", // Dark text for contrast
        padding: "20px",
        boxShadow: "4px 0 12px rgba(0, 0, 0, 0.1)", // Light box shadow for depth
        overflowY: "auto",
        "&::-webkit-scrollbar": {
          width: "2px",
        },
        "&::-webkit-scrollbar-thumb": {
          backgroundColor: "rgba(0, 0, 0, 0.2)",
          borderRadius: "10px",
        },
        "&::-webkit-scrollbar-thumb:hover": {
          backgroundColor: "rgba(0, 0, 0, 0.4)",
        },
      }}
    >
      {/* Profile Section */}
      <img src="/img/college-logo-2.png" width={"210px"} alt="college logo" />
      <Divider sx={{ borderColor: "rgba(0, 0, 0, 0.2)", mb: 2, mt: 3 }} />

      {/* Admin Tools Section */}
      <Typography variant="subtitle2" sx={{ fontWeight: "bold", color: "#333", mb: 1 }}>
        Admin Tools
      </Typography>
      <List>
        {menuItems
          .filter((item) => item.section === "admin-tools")
          .map((item) => (
            <ListItem
              button
              key={item.text}
              component={Link}
              to={item.path}
              sx={{
                color: "#333",
                backgroundColor: location.pathname === item.path ? "#e7e7ff" : "transparent",
                "&:hover": {
                  backgroundColor: "#e7e7ff",
                  borderRadius: "8px",
                },
                padding: "10px 16px",
                borderRadius: "8px",
                transition: "background 0.3s ease",
                "&:active": {
                  backgroundColor: "#e7e7ff",
                },
                borderRight: location.pathname === item.path ? "4px solid #696cff" : "none",
              }}
            >
              <ListItemIcon sx={{ color: "#333" }}>{item.icon}</ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItem>
          ))}
      </List>




      <Divider sx={{ borderColor: "rgba(0, 0, 0, 0.2)", mt: 2, mb: 2 }} />

      {/* User Management Section */}
      <Typography variant="subtitle2" sx={{ fontWeight: "bold", color: "#333", mb: 1 }}>
        User Management
      </Typography>
      <List>
        {menuItems
          .filter((item) => item.section === "user-management")
          .map((item) => (
            <ListItem
              button
              key={item.text}
              component={Link}
              to={item.path}
              sx={{
                color: "#333",
                backgroundColor: location.pathname === item.path ? "#e7e7ff" : "transparent",
                "&:hover": {
                  backgroundColor: "#e7e7ff",
                  borderRadius: "8px",
                },
                padding: "10px 16px",
                borderRadius: "8px",
                transition: "background 0.3s ease",
                "&:active": {
                  backgroundColor: "#e7e7ff",
                },
                borderRight: location.pathname === item.path ? "4px solid #696cff" : "none",
              }}
            >
              <ListItemIcon sx={{ color: "#333" }}>{item.icon}</ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItem>
          ))}
      </List>



      <Divider sx={{ borderColor: "rgba(0, 0, 0, 0.2)", mt: 2, mb: 2 }} />

      {/* Uploads Section */}
      <Typography variant="subtitle2" sx={{ fontWeight: "bold", color: "#333", mb: 1 }}>
        Uploads
      </Typography>
      <List>
        {menuItems
          .filter((item) => item.section === "uploads")
          .map((item) => (
            <ListItem
              button
              key={item.text}
              component={Link}
              to={item.path}
              sx={{
                color: "#333",
                backgroundColor: location.pathname === item.path ? "#e7e7ff" : "transparent",
                "&:hover": {
                  backgroundColor: "#e7e7ff",
                  borderRadius: "8px",
                },
                padding: "10px 16px",
                borderRadius: "8px",
                transition: "background 0.3s ease",
                "&:active": {
                  backgroundColor: "#e7e7ff",
                },
                borderRight: location.pathname === item.path ? "4px solid #696cff" : "none",
              }}
            >
              <ListItemIcon sx={{ color: "#333" }}>{item.icon}</ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItem>
          ))}
      </List>


      <Divider sx={{ borderColor: "rgba(0, 0, 0, 0.2)", mt: 2, mb: 2 }} />

      {/* Logout Button */}
      <LogoutButton />
    </Box>
  );
};

export default AdminSidebar;
