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
import { Delete, Phone, Visibility, VisibilityOff, Search, Email } from "@mui/icons-material";
import Swal from "sweetalert2";
import axios from "axios";

const BannerInquiry = () => {
  const API_URL = "https://collegeforms.in";

  const [inquiries, setInquiries] = useState([]);
  const [filteredInquiries, setFilteredInquiries] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedInquiry, setSelectedInquiry] = useState(null);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [showContact, setShowContact] = useState({});

  useEffect(() => {
    fetchInquiries();
  }, []);

  useEffect(() => {
    const filtered = inquiries.filter(inquiry =>
      inquiry.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inquiry.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inquiry.category?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inquiry.inquiry?.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredInquiries(filtered);
  }, [searchTerm, inquiries]);

  const fetchInquiries = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/banner-enquiries`);
      setInquiries(response.data.data || response.data);
    } catch (error) {
      console.error("Error fetching banner inquiries:", error);
      Swal.fire("Error!", "Failed to fetch banner inquiries.", "error");
    }
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleViewDetails = (inquiry) => {
    setSelectedInquiry(inquiry);
    setViewDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setViewDialogOpen(false);
    setSelectedInquiry(null);
  };

  const handleToggleContact = (id) => {
    setShowContact(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const handleDeleteInquiry = async (id) => {
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
          await axios.delete(`${API_URL}/api/banner-enquiries/${id}`);
          setInquiries(inquiries.filter((inquiry) => inquiry._id !== id));
          Swal.fire("Deleted!", "The banner inquiry has been deleted.", "success");
        } catch (error) {
          console.error("Error deleting inquiry:", error);
          Swal.fire("Error!", "Failed to delete banner inquiry.", "error");
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
      await axios.put(`${API_URL}/api/banner-enquiries/${id}`, { status: newStatus });
      setInquiries(inquiries.map(inquiry => 
        inquiry._id === id ? { ...inquiry, status: newStatus } : inquiry
      ));
      Swal.fire("Updated!", "Status updated successfully.", "success");
    } catch (error) {
      console.error("Error updating status:", error);
      Swal.fire("Error!", "Failed to update status.", "error");
    }
  };

  const handleCall = (phoneNumber) => {
    if (phoneNumber) {
      window.open(`tel:${phoneNumber}`, '_self');
    }
  };

  const handleEmail = (email) => {
    if (email) {
      window.open(`mailto:${email}`, '_self');
    }
  };

  return (
    <Box sx={{ padding: "20px", backgroundColor: "#F1F5FB", minHeight: "100vh" }}>
      <Typography variant="h4" sx={{ marginBottom: "20px", color: "#564BD5" }}>
        Banner Inquiries
      </Typography>

      {/* Search Box */}
      <Box sx={{ marginBottom: "20px" }}>
        <TextField
          placeholder="Search by name, email, category or inquiry..."
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

      {/* Inquiries Table */}
      <TableContainer component={Paper} sx={{ boxShadow: 2, borderRadius: 1, overflow: "hidden" }}>
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: "#564BD5" }}>
              {["#", "Name", "Contact", "Email", "Category", "Status", "Date", "Actions"].map((header) => (
                <TableCell key={header} align="center">
                  <Typography sx={{ fontWeight: "bold", color: "#fff" }}>{header}</Typography>
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredInquiries.map((inquiry, index) => (
              <TableRow key={inquiry._id} sx={{ "&:hover": { backgroundColor: "#f5f5f5" } }}>
                <TableCell align="center">{index + 1}</TableCell>
                <TableCell align="center">
                  {inquiry.name || "N/A"}
                </TableCell>
                <TableCell align="center">
                  <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 1 }}>
                    {showContact[inquiry._id] ? (
                      <Typography>{inquiry.phone || "N/A"}</Typography>
                    ) : (
                      <Typography>••••••••••</Typography>
                    )}
                    <IconButton 
                      size="small" 
                      onClick={() => handleToggleContact(inquiry._id)}
                      color="primary"
                    >
                      {showContact[inquiry._id] ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                    {inquiry.phone && (
                      <IconButton 
                        size="small" 
                        onClick={() => handleCall(inquiry.phone)}
                        color="success"
                      >
                        <Phone />
                      </IconButton>
                    )}
                  </Box>
                </TableCell>
                <TableCell align="center">
                  <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 1 }}>
                    {inquiry.email || "N/A"}
                    {inquiry.email && (
                      <IconButton 
                        size="small" 
                        onClick={() => handleEmail(inquiry.email)}
                        color="primary"
                      >
                        <Email />
                      </IconButton>
                    )}
                  </Box>
                </TableCell>
                <TableCell align="center">{inquiry.category || "N/A"}</TableCell>
                <TableCell align="center">
                  <Chip 
                    label={inquiry.status || "pending"} 
                    color={getStatusColor(inquiry.status || "pending")}
                    size="small"
                  />
                </TableCell>
                <TableCell align="center">
                  {new Date(inquiry.createdAt).toLocaleDateString()}
                </TableCell>
                <TableCell align="center">
                  <Box sx={{ display: "flex", gap: 1, justifyContent: "center" }}>
                    <Button 
                      variant="outlined" 
                      size="small"
                      onClick={() => handleViewDetails(inquiry)}
                    >
                      View
                    </Button>
                    <IconButton 
                      color="error" 
                      size="small"
                      onClick={() => handleDeleteInquiry(inquiry._id)}
                    >
                      <Delete />
                    </IconButton>
                  </Box>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        {filteredInquiries.length === 0 && (
          <Box sx={{ padding: "40px", textAlign: "center" }}>
            <Typography variant="h6" color="textSecondary">
              No banner inquiries found
            </Typography>
          </Box>
        )}
      </TableContainer>

      {/* View Details Dialog */}
      <Dialog open={viewDialogOpen} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <DialogTitle>Banner Inquiry Details</DialogTitle>
        <DialogContent>
          {selectedInquiry && (
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2, marginTop: 2 }}>
              <TextField
                label="Name"
                value={selectedInquiry.name || "Not provided"}
                InputProps={{ readOnly: true }}
                fullWidth
              />
              <TextField
                label="Phone Number"
                value={selectedInquiry.phone || "Not provided"}
                InputProps={{ readOnly: true }}
                fullWidth
              />
              <TextField
                label="Email"
                value={selectedInquiry.email || "Not provided"}
                InputProps={{ readOnly: true }}
                fullWidth
              />
              <TextField
                label="Category"
                value={selectedInquiry.category || "Not provided"}
                InputProps={{ readOnly: true }}
                fullWidth
              />
              <TextField
                label="Inquiry"
                value={selectedInquiry.inquiry || "Not provided"}
                multiline
                rows={3}
                InputProps={{ readOnly: true }}
                fullWidth
              />
              <TextField
                label="Submission Date"
                value={new Date(selectedInquiry.createdAt).toLocaleString()}
                InputProps={{ readOnly: true }}
                fullWidth
              />
              <Box>
                <Typography variant="subtitle2" gutterBottom>
                  Update Status:
                </Typography>
                <Box sx={{ display: "flex", gap: 1, flexWrap: 'wrap' }}>
                  {["pending", "contacted", "completed"].map(status => (
                    <Chip
                      key={status}
                      label={status}
                      clickable
                      color={getStatusColor(status)}
                      variant={selectedInquiry.status === status ? "filled" : "outlined"}
                      onClick={() => handleStatusUpdate(selectedInquiry._id, status)}
                      sx={{ mb: 1 }}
                    />
                  ))}
                </Box>
              </Box>
              <Box sx={{ display: "flex", gap: 1, mt: 2 }}>
                {selectedInquiry.phone && (
                  <Button
                    variant="contained"
                    startIcon={<Phone />}
                    onClick={() => handleCall(selectedInquiry.phone)}
                    color="success"
                  >
                    Call
                  </Button>
                )}
                {selectedInquiry.email && (
                  <Button
                    variant="contained"
                    startIcon={<Email />}
                    onClick={() => handleEmail(selectedInquiry.email)}
                    color="primary"
                  >
                    Email
                  </Button>
                )}
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

export default BannerInquiry;