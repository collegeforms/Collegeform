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
  CircularProgress,
} from "@mui/material";
import { Delete, Phone, Visibility, VisibilityOff, Search, Email, School, Category } from "@mui/icons-material";
import Swal from "sweetalert2";
import axios from "axios";

const ExamEnquiries = () => {
  const API_URL = "https://www.collegeforms.in";

  const [enquiries, setEnquiries] = useState([]);
  const [filteredEnquiries, setFilteredEnquiries] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedEnquiry, setSelectedEnquiry] = useState(null);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [showContact, setShowContact] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEnquiries();
  }, []);

  useEffect(() => {
    const filtered = enquiries.filter(enquiry =>
      enquiry.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      enquiry.phone?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      enquiry.examName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      enquiry.courseName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      enquiry.inquiry?.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredEnquiries(filtered);
  }, [searchTerm, enquiries]);

  const fetchEnquiries = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}/api/examenquiries`);
      setEnquiries(response.data.data || response.data);
    } catch (error) {
      console.error("Error fetching exam enquiries:", error);
      Swal.fire("Error!", "Failed to fetch exam enquiries.", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleViewDetails = (enquiry) => {
    setSelectedEnquiry(enquiry);
    setViewDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setViewDialogOpen(false);
    setSelectedEnquiry(null);
  };

  const handleToggleContact = (id) => {
    setShowContact(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const handleDeleteEnquiry = async (id) => {
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
          await axios.delete(`${API_URL}/api/examenquiry/${id}`);
          setEnquiries(enquiries.filter((enquiry) => enquiry._id !== id));
          Swal.fire("Deleted!", "The exam enquiry has been deleted.", "success");
        } catch (error) {
          console.error("Error deleting enquiry:", error);
          Swal.fire("Error!", "Failed to delete exam enquiry.", "error");
        }
      }
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "pending": return "warning";
      case "contacted": return "info";
      case "resolved": return "success";
      case "cancelled": return "error";
      default: return "default";
    }
  };

  const handleStatusUpdate = async (id, newStatus) => {
    try {
      await axios.patch(`${API_URL}/api/examenquiry/${id}/status`, { status: newStatus });
      setEnquiries(enquiries.map(enquiry => 
        enquiry._id === id ? { ...enquiry, status: newStatus } : enquiry
      ));
      // Update selected enquiry if it's the same one
      if (selectedEnquiry && selectedEnquiry._id === id) {
        setSelectedEnquiry({ ...selectedEnquiry, status: newStatus });
      }
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

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '50vh',
        backgroundColor: "#F1F5FB"
      }}>
        <CircularProgress sx={{ color: "#564BD5" }} />
      </Box>
    );
  }

  return (
    <Box sx={{ padding: "20px", backgroundColor: "#F1F5FB", minHeight: "100vh" }}>
      <Typography variant="h4" sx={{ marginBottom: "20px", color: "#564BD5" }}>
        Exam Enquiries
      </Typography>

      {/* Stats Summary */}
      <Box sx={{ display: 'flex', gap: 2, mb: 3, flexWrap: 'wrap' }}>
        <Chip 
          label={`Total: ${enquiries.length}`} 
          variant="outlined" 
          sx={{ backgroundColor: 'white', fontWeight: 'bold' }}
        />
        <Chip 
          label={`Pending: ${enquiries.filter(e => e.status === 'pending').length}`} 
          color="warning" 
          variant="outlined"
        />
        <Chip 
          label={`Contacted: ${enquiries.filter(e => e.status === 'contacted').length}`} 
          color="info" 
          variant="outlined"
        />
        <Chip 
          label={`Resolved: ${enquiries.filter(e => e.status === 'resolved').length}`} 
          color="success" 
          variant="outlined"
        />
      </Box>

      {/* Search Box */}
      <Box sx={{ marginBottom: "20px" }}>
        <TextField
          placeholder="Search by name, phone, exam, course or inquiry..."
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

      {/* Enquiries Table */}
      <TableContainer component={Paper} sx={{ boxShadow: 2, borderRadius: 1, overflow: "hidden" }}>
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: "#564BD5" }}>
              {["#", "Name", "Phone", "Exam", "Course", "Category", "Status", "Date", "Actions"].map((header) => (
                <TableCell key={header} align="center">
                  <Typography sx={{ fontWeight: "bold", color: "#fff" }}>{header}</Typography>
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredEnquiries.map((enquiry, index) => (
              <TableRow key={enquiry._id} sx={{ "&:hover": { backgroundColor: "#f5f5f5" } }}>
                <TableCell align="center">{index + 1}</TableCell>
                <TableCell align="center">
                  {enquiry.name || "N/A"}
                </TableCell>
                <TableCell align="center">
                  <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 1 }}>
                    {showContact[enquiry._id] ? (
                      <Typography>{enquiry.phone || "N/A"}</Typography>
                    ) : (
                      <Typography>••••••••••</Typography>
                    )}
                    <IconButton 
                      size="small" 
                      onClick={() => handleToggleContact(enquiry._id)}
                      color="primary"
                    >
                      {showContact[enquiry._id] ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                    {enquiry.phone && (
                      <IconButton 
                        size="small" 
                        onClick={() => handleCall(enquiry.phone)}
                        color="success"
                      >
                        <Phone />
                      </IconButton>
                    )}
                  </Box>
                </TableCell>
                <TableCell align="center">
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 0.5 }}>
                    <School fontSize="small" color="primary" />
                    {enquiry.examName || "N/A"}
                  </Box>
                </TableCell>
                <TableCell align="center">{enquiry.courseName || "N/A"}</TableCell>
                <TableCell align="center">
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 0.5 }}>
                    <Category fontSize="small" color="secondary" />
                    {enquiry.category || "Competitive Exams"}
                  </Box>
                </TableCell>
                <TableCell align="center">
                  <Chip 
                    label={enquiry.status || "pending"} 
                    color={getStatusColor(enquiry.status || "pending")}
                    size="small"
                  />
                </TableCell>
                <TableCell align="center">
                  {formatDate(enquiry.createdAt)}
                </TableCell>
                <TableCell align="center">
                  <Box sx={{ display: "flex", gap: 1, justifyContent: "center" }}>
                    <Button 
                      variant="outlined" 
                      size="small"
                      onClick={() => handleViewDetails(enquiry)}
                    >
                      View
                    </Button>
                    <IconButton 
                      color="error" 
                      size="small"
                      onClick={() => handleDeleteEnquiry(enquiry._id)}
                    >
                      <Delete />
                    </IconButton>
                  </Box>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        {filteredEnquiries.length === 0 && (
          <Box sx={{ padding: "40px", textAlign: "center" }}>
            <Typography variant="h6" color="textSecondary">
              {searchTerm ? "No matching exam enquiries found" : "No exam enquiries yet"}
            </Typography>
          </Box>
        )}
      </TableContainer>

      {/* View Details Dialog */}
      <Dialog open={viewDialogOpen} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <DialogTitle>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <School color="primary" />
            Exam Enquiry Details
          </Box>
        </DialogTitle>
        <DialogContent>
          {selectedEnquiry && (
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2, marginTop: 2 }}>
              <TextField
                label="Full Name"
                value={selectedEnquiry.name || "Not provided"}
                InputProps={{ readOnly: true }}
                fullWidth
              />
              <TextField
                label="Phone Number"
                value={selectedEnquiry.phone || "Not provided"}
                InputProps={{ readOnly: true }}
                fullWidth
              />
              <TextField
                label="Exam Name"
                value={selectedEnquiry.examName || "Not provided"}
                InputProps={{ readOnly: true }}
                fullWidth
              />
              <TextField
                label="Course Name"
                value={selectedEnquiry.courseName || "Not provided"}
                InputProps={{ readOnly: true }}
                fullWidth
              />
              <TextField
                label="Category"
                value={selectedEnquiry.category || "Competitive Exams"}
                InputProps={{ readOnly: true }}
                fullWidth
              />
              <TextField
                label="Inquiry Message"
                value={selectedEnquiry.inquiry || "Not provided"}
                multiline
                rows={4}
                InputProps={{ readOnly: true }}
                fullWidth
              />
              <TextField
                label="Agreed to Contact"
                value={selectedEnquiry.agreeToContact ? "Yes" : "No"}
                InputProps={{ readOnly: true }}
                fullWidth
              />
              <TextField
                label="Submission Date"
                value={formatDate(selectedEnquiry.createdAt)}
                InputProps={{ readOnly: true }}
                fullWidth
              />
              
              <Box>
                <Typography variant="subtitle2" gutterBottom>
                  Update Status:
                </Typography>
                <Box sx={{ display: "flex", gap: 1, flexWrap: 'wrap' }}>
                  {["pending", "contacted", "resolved", "cancelled"].map(status => (
                    <Chip
                      key={status}
                      label={status}
                      clickable
                      color={getStatusColor(status)}
                      variant={selectedEnquiry.status === status ? "filled" : "outlined"}
                      onClick={() => handleStatusUpdate(selectedEnquiry._id, status)}
                      sx={{ mb: 1 }}
                    />
                  ))}
                </Box>
              </Box>
              
              <Box sx={{ display: "flex", gap: 1, mt: 2 }}>
                {selectedEnquiry.phone && (
                  <Button
                    variant="contained"
                    startIcon={<Phone />}
                    onClick={() => handleCall(selectedEnquiry.phone)}
                    color="success"
                  >
                    Call
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

export default ExamEnquiries;