import React, { useEffect, useState, useContext } from "react";
import AuthContext from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Button, Select, MenuItem, FormControl, InputLabel, Box, Typography, Switch, FormControlLabel, Modal, TextField
} from "@mui/material";
import "./user.css";

const Adminusers = () => {
  const { admin, logoutAdmin } = useContext(AuthContext);
  const token = localStorage.getItem("adminToken");

  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [filteredStatus, setFilteredStatus] = useState("All");
  const [openModal, setOpenModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [remark, setRemark] = useState("");

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/admin/users", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
          },
        });

        const data = await response.json();
        console.log(data);
        
        if (!response.ok) throw new Error(data.message);

        setUsers(data);
      } catch (error) {
        console.error("Error fetching users:", error.message);
      }
    };

    fetchUsers();
  }, [admin, navigate]);

  const filteredUsers = filteredStatus === "All" ? users : users.filter(user => user.status === filteredStatus);

  const changeStatus = async (userId, newStatus) => {
    try {
      const response = await fetch(`http://localhost:5000/api/admin/users/${userId}/status`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: newStatus }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message);

      setUsers(users.map(user => user._id === userId ? { ...user, status: newStatus } : user));
    } catch (error) {
      console.error("Error changing status:", error.message);
    }
  };

  const handleSwitchChange = (userId, currentStatus) => {
    const newStatus = currentStatus === "Pending" ? "Complete" : "Pending";
    changeStatus(userId, newStatus);
  };

  const handleOpenModal = (user) => {
    setSelectedUser(user);
    setRemark(user.remark || "");
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setSelectedUser(null);
    setRemark("");
  };

  const handleSaveRemark = async () => {
    if (!selectedUser) return;

    try {
      const response = await fetch(`http://localhost:5000/api/admin/users/${selectedUser._id}/remark`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ remark }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message);

      setUsers(users.map(user => user._id === selectedUser._id ? { ...user, remark } : user));
    } catch (error) {
      console.error("Error saving remark:", error.message);
    }

    handleCloseModal();
  };

  return (
    <Box className="admin-users" sx={{ padding: 3, boxShadow: 3 }}>
      <FormControl fullWidth sx={{ marginBottom: 3 }}>
        <InputLabel id="status-label">Filter by Status</InputLabel>
        <Select
          labelId="status-label"
          id="status"
          value={filteredStatus}
          label="Filter by Status"
          onChange={(e) => setFilteredStatus(e.target.value)}
        >
          <MenuItem value="All">All</MenuItem>
          <MenuItem value="Complete">Complete</MenuItem>
          <MenuItem value="Pending">Pending</MenuItem>
        </Select>
      </FormControl>

      <TableContainer sx={{ boxShadow: 0 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Phone</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Action</TableCell>
              <TableCell>Remark</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredUsers.map((user) => (
              <TableRow key={user._id}>
                <TableCell>{user.name}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.phone}</TableCell>
                <TableCell>
                  <Box sx={{
                    display: "inline-block",
                    padding: "4px 10px",
                    borderRadius: "4px",
                    backgroundColor: user.status === "Complete" ? "#28a745" : "#dc3545",
                    color: "#fff"
                  }}>
                    {user.status}
                  </Box>
                </TableCell>
                <TableCell>
                  <FormControlLabel
                    control={<Switch checked={user.status === "Complete"} onChange={() => handleSwitchChange(user._id, user.status)} color="primary" />}
                    label={user.status === "Complete" ? "Complete" : "Pending"}
                  />
                </TableCell>
                <TableCell>
                  <Button variant="outlined" onClick={() => handleOpenModal(user)}>Remark</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Modal open={openModal} onClose={handleCloseModal}>
        <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: 400, bgcolor: 'background.paper', boxShadow: 24, p: 4 }}>
          <Typography variant="h6">Add Remark</Typography>
          <TextField fullWidth multiline rows={4} value={remark} onChange={(e) => setRemark(e.target.value)} sx={{ mt: 2, mb: 2 }} />
          <Button variant="contained" onClick={handleSaveRemark} sx={{ mr: 2 }}>Save</Button>
          <Button variant="outlined" onClick={handleCloseModal}>Cancel</Button>
        </Box>
      </Modal>
    </Box>
  );
};

export default Adminusers;