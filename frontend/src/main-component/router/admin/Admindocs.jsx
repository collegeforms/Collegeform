import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  IconButton,
  Typography,
  Snackbar,
  Alert,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TablePagination,
  TextField
} from "@mui/material";
import {
  CheckCircle,
  Cancel,
  Visibility,
  Delete,
} from "@mui/icons-material";
import axios from "axios";

const AdminDocs = () => {
   const API_URL = "https://collegeforms.in";

  const [documents, setDocuments] = useState([]);
  const [filteredDocuments, setFilteredDocuments] = useState([]);
  const [statusFilter, setStatusFilter] = useState("all");
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewDocument, setPreviewDocument] = useState(null);
  const [loading, setLoading] = useState(true);
  const [adminToken, setAdminToken] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  useEffect(() => {
    // Get admin token from localStorage or prompt for it
    const token = localStorage.getItem("adminToken");
    if (token) {
      setAdminToken(token);
      fetchDocuments(token);
    } else {
      // For demo purposes, we'll use a placeholder token
      // In a real app, you would redirect to login
      const demoToken = "admin-demo-token-123";
      setAdminToken(demoToken);
      localStorage.setItem("adminToken", demoToken);
      fetchDocuments(demoToken);
    }
  }, []);

  useEffect(() => {
    filterDocuments();
  }, [documents, statusFilter]);

  const fetchDocuments = async (token) => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}/api/documents/all`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setDocuments(response.data);
    } catch (error) {
      showSnackbar("Error fetching documents.", "error");
      console.error("Fetch error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (id, status) => {
    try {
      const response = await axios.patch(
        `${API_URL}/api/documents/${id}/status`,
        { status },
        { headers: { Authorization: `Bearer ${adminToken}` } }
      );
      
      setDocuments(documents.map(doc => 
        doc._id === id ? response.data : doc
      ));
      showSnackbar(`Document ${status} successfully!`, "success");
    } catch (error) {
      showSnackbar("Failed to update document status.", "error");
      console.error("Status change error:", error);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this document?")) return;

    try {
      await axios.delete(`${API_URL}/api/documents/admin/${id}`, {
        headers: { Authorization: `Bearer ${adminToken}` }
      });
      setDocuments(documents.filter((doc) => doc._id !== id));
      showSnackbar("Document deleted successfully!", "success");
    } catch (error) {
      showSnackbar("Failed to delete document.", "error");
      console.error("Delete error:", error);
    }
  };

  const handlePreview = (document) => {
    setPreviewDocument(document);
    setPreviewOpen(true);
  };

  const filterDocuments = () => {
    if (statusFilter === "all") {
      setFilteredDocuments(documents);
    } else {
      setFilteredDocuments(documents.filter(doc => doc.status === statusFilter));
    }
  };

  const showSnackbar = (message, severity) => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setSnackbarOpen(true);
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'approved': return 'success';
      case 'rejected': return 'error';
      default: return 'warning';
    }
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ padding: "20px" }}>
      <Typography variant="h4" sx={{ marginBottom: "20px", textAlign: "center" }}>
        Document Verification Portal
      </Typography>

      {/* Filter Section */}
      <Box sx={{ 
        display: "flex", 
        justifyContent: "space-between", 
        alignItems: "center", 
        marginBottom: 3,
        flexWrap: 'wrap',
        gap: 2
      }}>
        <Typography variant="h6">
          Documents to Verify ({filteredDocuments.length})
        </Typography>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Chip 
            label="All" 
            onClick={() => setStatusFilter("all")} 
            color={statusFilter === "all" ? "primary" : "default"}
            variant={statusFilter === "all" ? "filled" : "outlined"}
          />
          <Chip 
            label="Pending" 
            onClick={() => setStatusFilter("pending")} 
            color={statusFilter === "pending" ? "primary" : "default"}
            variant={statusFilter === "pending" ? "filled" : "outlined"}
          />
          <Chip 
            label="Approved" 
            onClick={() => setStatusFilter("approved")} 
            color={statusFilter === "approved" ? "primary" : "default"}
            variant={statusFilter === "approved" ? "filled" : "outlined"}
          />
          <Chip 
            label="Rejected" 
            onClick={() => setStatusFilter("rejected")} 
            color={statusFilter === "rejected" ? "primary" : "default"}
            variant={statusFilter === "rejected" ? "filled" : "outlined"}
          />
        </Box>
      </Box>

      {/* Documents Table */}
      {filteredDocuments.length === 0 ? (
        <Box sx={{ textAlign: 'center', py: 4 }}>
          <Typography variant="h6" color="textSecondary">
            No documents found
          </Typography>
          <Typography variant="body2" color="textSecondary">
            {statusFilter !== "all" ? `No documents with status "${statusFilter}"` : "No documents to display"}
          </Typography>
        </Box>
      ) : (
        <>
          <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }} aria-label="documents table">
              <TableHead>
                <TableRow>
                  <TableCell>Document Name</TableCell>
                  <TableCell>Type</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Upload Date</TableCell>
                  <TableCell>Uploaded By</TableCell>
                  <TableCell align="center">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredDocuments
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((doc) => (
                  <TableRow key={doc._id}>
                    <TableCell component="th" scope="row">
                      {doc.name}
                    </TableCell>
                    <TableCell>{doc.fileType}</TableCell>
                    <TableCell>
                      <Chip 
                        label={doc.status} 
                        color={getStatusColor(doc.status)}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      {new Date(doc.createdAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      {doc.uploadedBy?.userName || 'Unknown'}
                    </TableCell>
                    <TableCell align="center">
                      <IconButton 
                        color="primary" 
                        onClick={() => handlePreview(doc)}
                        title="Preview"
                      >
                        <Visibility />
                      </IconButton>
                      <IconButton 
                        color="success" 
                        onClick={() => handleStatusChange(doc._id, 'approved')}
                        title="Approve"
                      >
                        <CheckCircle />
                      </IconButton>
                      <IconButton 
                        color="error" 
                        onClick={() => handleStatusChange(doc._id, 'rejected')}
                        title="Reject"
                      >
                        <Cancel />
                      </IconButton>
                      <IconButton 
                        color="error" 
                        onClick={() => handleDelete(doc._id)}
                        title="Delete"
                      >
                        <Delete />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={filteredDocuments.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </>
      )}

      {/* Preview Dialog */}
      <Dialog 
        open={previewOpen} 
        onClose={() => setPreviewOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          {previewDocument?.name}
          <Chip 
            label={previewDocument?.status} 
            color={getStatusColor(previewDocument?.status)}
            sx={{ ml: 2 }}
          />
        </DialogTitle>
        <DialogContent>
          {previewDocument?.fileType === 'image' ? (
            <img 
              src={previewDocument.fileUrl} 
              alt={previewDocument.name}
              style={{ width: '100%', height: 'auto' }}
            />
          ) : (
            <iframe 
              src={previewDocument?.fileUrl} 
              title={previewDocument?.name}
              width="100%" 
              height="500px"
              style={{ border: 'none' }}
            />
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setPreviewOpen(false)}>Close</Button>
          <Button 
            color="success" 
            startIcon={<CheckCircle />}
            onClick={() => {
              handleStatusChange(previewDocument._id, 'approved');
              setPreviewOpen(false);
            }}
          >
            Approve
          </Button>
          <Button 
            color="error" 
            startIcon={<Cancel />}
            onClick={() => {
              handleStatusChange(previewDocument._id, 'rejected');
              setPreviewOpen(false);
            }}
          >
            Reject
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar for Alerts */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
      >
        <Alert onClose={handleSnackbarClose} severity={snackbarSeverity} sx={{ width: "100%" }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default AdminDocs;