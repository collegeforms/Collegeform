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
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from "@mui/material";
import { Delete, Phone, Visibility, VisibilityOff, Search } from "@mui/icons-material";
import Swal from "sweetalert2";
import axios from "axios";

const Requestcallback = () => {
  const API_URL = "https://www.collegeforms.in";

  const [callbacks, setCallbacks] = useState([]);
  const [filteredCallbacks, setFilteredCallbacks] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCallback, setSelectedCallback] = useState(null);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [showContact, setShowContact] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCallbacks();
  }, []);

  useEffect(() => {
    // Ensure callbacks is an array before filtering
    if (Array.isArray(callbacks)) {
      const filtered = callbacks.filter(callback =>
        callback?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        callback?.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        callback?.inquiry?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        callback?.category?.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredCallbacks(filtered);
    } else {
      setFilteredCallbacks([]);
    }
  }, [searchTerm, callbacks]);

  const fetchCallbacks = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}/api/callbacks`);
      
      // Log the response for debugging
      console.log("API Response:", response);
      
      // Extract data based on your API structure
      let data = [];
      if (response.data && response.data.data && Array.isArray(response.data.data)) {
        data = response.data.data;
      } else if (Array.isArray(response.data)) {
        data = response.data;
      }
      
      console.log("Extracted callbacks data:", data);
      setCallbacks(data);
      setFilteredCallbacks(data);
    } catch (error) {
      console.error("Error fetching callbacks:", error);
      Swal.fire("Error!", "Failed to fetch callback requests.", "error");
      setCallbacks([]);
      setFilteredCallbacks([]);
    } finally {
      setLoading(false);
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

  // Function to format date
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <Box sx={{ padding: "20px", backgroundColor: "#F1F5FB", minHeight: "100vh" }}>
      <Typography variant="h4" sx={{ marginBottom: "20px", color: "#564BD5" }}>
        Callback Requests
      </Typography>

      {/* Search Box and Stats */}
      <Box sx={{ 
        marginBottom: "20px", 
        display: "flex", 
        justifyContent: "space-between",
        alignItems: "center",
        flexWrap: "wrap",
        gap: 2 
      }}>
        <TextField
          placeholder="Search by name, email, inquiry or category..."
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
        
        <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
          <Chip 
            label={`Total: ${callbacks.length}`} 
            color="primary" 
            variant="outlined"
          />
          <Chip 
            label={`Pending: ${callbacks.filter(c => c.status === 'pending').length}`} 
            color="warning" 
            variant="outlined"
          />
          <Chip 
            label={`Contacted: ${callbacks.filter(c => c.status === 'contacted').length}`} 
            color="info" 
            variant="outlined"
          />
          <Chip 
            label={`Completed: ${callbacks.filter(c => c.status === 'completed').length}`} 
            color="success" 
            variant="outlined"
          />
        </Box>
      </Box>

      {/* Callbacks Table */}
      <TableContainer component={Paper} sx={{ boxShadow: 2, borderRadius: 1, overflow: "hidden" }}>
        {loading ? (
          <Box sx={{ padding: "40px", textAlign: "center" }}>
            <Typography variant="h6" color="textSecondary">
              Loading callback requests...
            </Typography>
          </Box>
        ) : (
          <>
            <Table>
              <TableHead>
                <TableRow sx={{ backgroundColor: "#564BD5" }}>
                  {["#", "Name", "Contact", "Email", "Category", "Inquiry", "Status", "Date", "Actions"].map((header) => (
                    <TableCell key={header} align="center">
                      <Typography sx={{ fontWeight: "bold", color: "#fff" }}>{header}</Typography>
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {Array.isArray(filteredCallbacks) && filteredCallbacks.map((callback, index) => (
                  <TableRow key={callback._id} sx={{ "&:hover": { backgroundColor: "#f5f5f5" } }}>
                    <TableCell align="center">{index + 1}</TableCell>
                    <TableCell align="center">{callback.name || "N/A"}</TableCell>
                    <TableCell align="center">
                      <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 1 }}>
                        {showContact[callback._id] ? (
                          <Typography sx={{ fontFamily: "monospace" }}>
                            {callback.phone || "No phone"}
                          </Typography>
                        ) : (
                          <Typography sx={{ letterSpacing: "2px" }}>••••••••••</Typography>
                        )}
                        <IconButton 
                          size="small" 
                          onClick={() => handleToggleContact(callback._id)}
                          color="primary"
                          disabled={!callback.phone}
                        >
                          {showContact[callback._id] ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                        <IconButton 
                          size="small" 
                          href={`tel:${callback.phone}`}
                          color="success"
                          disabled={!callback.phone}
                        >
                          <Phone />
                        </IconButton>
                      </Box>
                    </TableCell>
                    <TableCell align="center">
                      <a href={`mailto:${callback.email}`} style={{ color: "#564BD5", textDecoration: "none" }}>
                        {callback.email || "N/A"}
                      </a>
                    </TableCell>
                    <TableCell align="center">
                      <Chip 
                        label={callback.category || "Default"} 
                        size="small"
                        variant="outlined"
                      />
                    </TableCell>
                    <TableCell align="center" sx={{ maxWidth: "200px" }}>
                      <Typography 
                        sx={{ 
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap"
                        }}
                        title={callback.inquiry || "No inquiry"}
                      >
                        {callback.inquiry || "No inquiry"}
                      </Typography>
                    </TableCell>
                    <TableCell align="center">
                      <Chip 
                        label={callback.status || "pending"} 
                        color={getStatusColor(callback.status || "pending")}
                        size="small"
                      />
                    </TableCell>
                    <TableCell align="center">
                      {formatDate(callback.createdAt)}
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
            
            {!loading && filteredCallbacks.length === 0 && (
              <Box sx={{ padding: "40px", textAlign: "center" }}>
                <Typography variant="h6" color="textSecondary">
                  {searchTerm ? "No matching callback requests found" : "No callback requests available"}
                </Typography>
              </Box>
            )}
          </>
        )}
      </TableContainer>

      {/* View Details Dialog */}
      <Dialog open={viewDialogOpen} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <DialogTitle sx={{ backgroundColor: "#564BD5", color: "#fff" }}>
          Callback Request Details
        </DialogTitle>
        <DialogContent>
          {selectedCallback && (
            <Box sx={{ display: "flex", flexDirection: "column", gap: 3, marginTop: 2 }}>
              <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 2 }}>
                <TextField
                  label="Name"
                  value={selectedCallback.name || ""}
                  InputProps={{ readOnly: true }}
                  fullWidth
                  variant="outlined"
                />
                <TextField
                  label="Phone Number"
                  value={selectedCallback.phone || "Not provided"}
                  InputProps={{ readOnly: true }}
                  fullWidth
                  variant="outlined"
                />
              </Box>
              
              <TextField
                label="Email"
                value={selectedCallback.email || ""}
                InputProps={{ readOnly: true }}
                fullWidth
                variant="outlined"
              />
              
              <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 2 }}>
                <TextField
                  label="Category"
                  value={selectedCallback.category || "Default"}
                  InputProps={{ readOnly: true }}
                  fullWidth
                  variant="outlined"
                />
                <TextField
                  label="Submission Date"
                  value={formatDate(selectedCallback.createdAt)}
                  InputProps={{ readOnly: true }}
                  fullWidth
                  variant="outlined"
                />
              </Box>
              
              <TextField
                label="Inquiry / Message"
                value={selectedCallback.inquiry || "No inquiry provided"}
                InputProps={{ readOnly: true }}
                fullWidth
                multiline
                rows={4}
                variant="outlined"
              />
              
              <Box>
                <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: "bold" }}>
                  Update Status:
                </Typography>
                <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
                  {["pending", "contacted", "completed"].map(status => (
                    <Chip
                      key={status}
                      label={status.charAt(0).toUpperCase() + status.slice(1)}
                      clickable
                      color={getStatusColor(status)}
                      variant={selectedCallback.status === status ? "filled" : "outlined"}
                      onClick={() => handleStatusUpdate(selectedCallback._id, status)}
                      sx={{ fontSize: "0.9rem", padding: "8px 12px" }}
                    />
                  ))}
                </Box>
              </Box>
              
              <Box sx={{ display: "flex", gap: 2, justifyContent: "flex-end", marginTop: 2 }}>
                <Button 
                  variant="outlined" 
                  href={`mailto:${selectedCallback.email}`}
                  disabled={!selectedCallback.email}
                >
                  Send Email
                </Button>
                <Button 
                  variant="outlined" 
                  color="success"
                  href={`tel:${selectedCallback.phone}`}
                  disabled={!selectedCallback.phone}
                  startIcon={<Phone />}
                >
                  Call Now
                </Button>
              </Box>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Requestcallback;