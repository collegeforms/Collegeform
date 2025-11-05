import React, { useContext } from "react";
import { List, ListItem, ListItemIcon, ListItemText } from "@mui/material";
import { Link } from "react-router-dom";
import { Logout } from "@mui/icons-material";
import AuthContext from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const LogoutButton = () => {
    const { logout } = useContext(AuthContext);
    const navigate = useNavigate(); // ✅ Import useNavigate

    const handleLogout = () => {
        try {

            navigate("/"); // ✅ Redirect to home after logout
            logout(); // Call the logout function from context
        } catch (error) {
            console.error("Logout failed:", error);
        }
    };

    return (
        <List>
            <ListItem
                button
                component={Link}
                to="/"
                onClick={handleLogout}
                sx={{
                    color: "#ff4d4d",
                    "&:hover": {
                        backgroundColor: "rgba(255, 77, 77, 0.1)",
                        borderRadius: "8px",
                    },
                }}
            >
                <ListItemIcon sx={{ color: "#ff4d4d" }}>
                    <Logout />
                </ListItemIcon>
                <ListItemText primary="Logout" />
            </ListItem>
        </List>
    );
};

export default LogoutButton;