import React, { useState, useEffect } from "react";
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Paper,
  Typography,
  Chip,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  InputAdornment,
} from "@mui/material";
import { Delete, Phone, Visibility, VisibilityOff, Search } from "@mui/icons-material";
import Swal from "sweetalert2";
import axios from "axios";

const Requestcallback = () => {
  const API_URL = "https://collegeforms.in";

  const [callbacks, setCallbacks] = useState([]);
  const [filteredCallbacks, setFilteredCallbacks] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCallback, setSelectedCallback] = useState(null);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [showContact, setShowContact] = useState({});

  useEffect(() => {
    fetchCallbacks();
  }, []);

  useEffect(() => {
    const filtered = callbacks.filter(callback =>
      callback.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      callback.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      callback.collegeName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      callback.course?.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredCallbacks(filtered);
  }, [searchTerm, callbacks]);

  const fetchCallbacks = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/callbacks`);
      setCallbacks(response.data);
    } catch (error) {
      console.error("Error fetching callbacks:", error);
      Swal.fire("Error!", "Failed to fetch callback requests.", "error");
    }
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleViewDetails = (callback) => {
    setSelectedCallback(callback);
    setViewDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setViewDialogOpen(false);
    setSelectedCallback(null);
  };

  const handleToggleContact = (id) => {
    setShowContact(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const handleDeleteCallback = async (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axios.delete(`${API_URL}/api/callbacks/${id}`);
          setCallbacks(callbacks.filter((callback) => callback._id !== id));
          Swal.fire("Deleted!", "The callback request has been deleted.", "success");
        } catch (error) {
          console.error("Error deleting callback:", error);
          Swal.fire("Error!", "Failed to delete callback request.", "error");
        }
      }
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "pending": return "warning";
      case "contacted": return "info";
      case "completed": return "success";
      default: return "default";
    }
  };

  const handleStatusUpdate = async (id, newStatus) => {
    try {
      await axios.put(`${API_URL}/api/callbacks/${id}`, { status: newStatus });
      setCallbacks(callbacks.map(callback => 
        callback._id === id ? { ...callback, status: newStatus } : callback
      ));
      Swal.fire("Updated!", "Status updated successfully.", "success");
    } catch (error) {
      console.error("Error updating status:", error);
      Swal.fire("Error!", "Failed to update status.", "error");
    }
  };

  return (
    <Box sx={{ padding: "20px", backgroundColor: "#F1F5FB", minHeight: "100vh" }}>
      <Typography variant="h4" sx={{ marginBottom: "20px", color: "#564BD5" }}>
        Callback Requests
      </Typography>

      {/* Search Box */}
      <Box sx={{ marginBottom: "20px" }}>
        <TextField
          placeholder="Search by name, email, college or course..."
          variant="outlined"
          size="small"
          value={searchTerm}
          onChange={handleSearchChange}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search />
              </InputAdornment>
            ),
          }}
          sx={{ width: "400px" }}
        />
      </Box>

      {/* Callbacks Table */}
      <TableContainer component={Paper} sx={{ boxShadow: 2, borderRadius: 1, overflow: "hidden" }}>
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: "#564BD5" }}>
              {["#", "Name", "Contact", "Email", "Course", "Status", "Date", "Actions"].map((header) => (
                <TableCell key={header} align="center">
                  <Typography sx={{ fontWeight: "bold", color: "#fff" }}>{header}</Typography>
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredCallbacks.map((callback, index) => (
              <TableRow key={callback._id} sx={{ "&:hover": { backgroundColor: "#f5f5f5" } }}>
                <TableCell align="center">{index + 1}</TableCell>
                <TableCell align="center">{callback.name}</TableCell>
                <TableCell align="center">
                  <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 1 }}>
                    {showContact[callback._id] ? (
                      <Typography>{callback.mobile}</Typography>
                    ) : (
                      <Typography>••••••••••</Typography>
                    )}
                    <IconButton 
                      size="small" 
                      onClick={() => handleToggleContact(callback._id)}
                      color="primary"
                    >
                      {showContact[callback._id] ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                    <IconButton 
                      size="small" 
                      href={`tel:${callback.mobile}`}
                      color="success"
                    >
                      <Phone />
                    </IconButton>
                  </Box>
                </TableCell>
                <TableCell align="center">{callback.email}</TableCell>
                <TableCell align="center">{callback.course}</TableCell>
                <TableCell align="center">
                  <Chip 
                    label={callback.status || "pending"} 
                    color={getStatusColor(callback.status || "pending")}
                    size="small"
                  />
                </TableCell>
                <TableCell align="center">
                  {new Date(callback.createdAt).toLocaleDateString()}
                </TableCell>
                <TableCell align="center">
                  <Box sx={{ display: "flex", gap: 1, justifyContent: "center" }}>
                    <Button 
                      variant="outlined" 
                      size="small"
                      onClick={() => handleViewDetails(callback)}
                    >
                      View
                    </Button>
                    <IconButton 
                      color="error" 
                      size="small"
                      onClick={() => handleDeleteCallback(callback._id)}
                    >
                      <Delete />
                    </IconButton>
                  </Box>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        {filteredCallbacks.length === 0 && (
          <Box sx={{ padding: "40px", textAlign: "center" }}>
            <Typography variant="h6" color="textSecondary">
              No callback requests found
            </Typography>
          </Box>
        )}
      </TableContainer>

      {/* View Details Dialog */}
      <Dialog open={viewDialogOpen} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <DialogTitle>Callback Request Details</DialogTitle>
        <DialogContent>
          {selectedCallback && (
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2, marginTop: 2 }}>
              <TextField
                label="Name"
                value={selectedCallback.name}
                InputProps={{ readOnly: true }}
                fullWidth
              />
              <TextField
                label="Mobile"
                value={selectedCallback.mobile}
                InputProps={{ readOnly: true }}
                fullWidth
              />
              <TextField
                label="Email"
                value={selectedCallback.email}
                InputProps={{ readOnly: true }}
                fullWidth
              />
              <TextField
                label="Preferred Course"
                value={selectedCallback.course}
                InputProps={{ readOnly: true }}
                fullWidth
              />
           
              <TextField
                label="Submission Date"
                value={new Date(selectedCallback.createdAt).toLocaleString()}
                InputProps={{ readOnly: true }}
                fullWidth
              />
              <Box>
                <Typography variant="subtitle2" gutterBottom>
                  Update Status:
                </Typography>
                <Box sx={{ display: "flex", gap: 1 }}>
                  {["pending", "contacted", "completed"].map(status => (
                    <Chip
                      key={status}
                      label={status}
                      clickable
                      color={getStatusColor(status)}
                      variant={selectedCallback.status === status ? "filled" : "outlined"}
                      onClick={() => handleStatusUpdate(selectedCallback._id, status)}
                    />
                  ))}
                </Box>
              </Box>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Close</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Requestcallback;