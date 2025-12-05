import React, { useEffect, useState, useContext } from "react";
import AuthContext from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Button, Select, MenuItem, FormControl, InputLabel, Box, Typography, 
  Switch, FormControlLabel, Modal, TextField, Paper, List, 
  ListItem, ListItemText, Divider, Chip, Card, CardContent,
  Grid, Avatar, Stack
} from "@mui/material";
import "./user.css";
import axios from "axios";
import {
  FiBook,
  FiMapPin,
  FiDollarSign,
  FiBarChart2,
  FiCalendar,
  FiEye
} from "react-icons/fi";

const Adminusers = () => {
  const API_URL = "https://www.collegeforms.in";  
  const { admin, logoutAdmin } = useContext(AuthContext);
  const token = localStorage.getItem("adminToken");

  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [filteredStatus, setFilteredStatus] = useState("All");
  const [openModal, setOpenModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [remark, setRemark] = useState("");
  const [historyModalOpen, setHistoryModalOpen] = useState(false);
  const [selectedUserHistory, setSelectedUserHistory] = useState([]);
  const [activeHistoryTab, setActiveHistoryTab] = useState("colleges"); // "colleges" or "searches"

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch(`${API_URL}/api/admin/users`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
          },
        });

        const data = await response.json();
        if (!response.ok) throw new Error(data.message);
        setUsers(data);
      } catch (error) {
        console.error("Error fetching users:", error.message);
      }
    };

    fetchUsers();
  }, [admin, navigate, token]);

  const fetchUserSearchHistory = async (userId) => {
    try {
      const response = await axios.get(`${API_URL}/api/search/history/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setSelectedUserHistory(response.data.searchHistory || []);
      setHistoryModalOpen(true);
    } catch (error) {
      console.error("Error fetching search history:", error);
    }
  };

  // Extract all college views from search history
  const getAllCollegeViews = () => {
    const collegeViews = [];
    
    selectedUserHistory.forEach(search => {
      if (search.collegesViewed && search.collegesViewed.length > 0) {
        search.collegesViewed.forEach(view => {
          collegeViews.push({
            ...view,
            searchDate: search.createdAt,
            searchQuery: search.searchQuery
          });
        });
      }
    });

    // Sort by last viewed date (newest first)
    return collegeViews.sort((a, b) => new Date(b.lastViewedAt || b.viewedAt) - new Date(a.lastViewedAt || a.viewedAt));
  };

  const filteredUsers = filteredStatus === "All" ? users : users.filter(user => user.status === filteredStatus);

  const changeStatus = async (userId, newStatus) => {
    try {
      const response = await fetch(`${API_URL}/api/admin/users/${userId}/status`, {
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

  const handleCloseHistoryModal = () => {
    setHistoryModalOpen(false);
    setSelectedUserHistory([]);
    setActiveHistoryTab("colleges");
  };

  const handleSaveRemark = async () => {
    if (!selectedUser) return;

    try {
      const response = await fetch(`${API_URL}/api/admin/users/${selectedUser._id}/remark`, {
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

  const collegeViews = getAllCollegeViews();

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
              <TableCell>Search History</TableCell>
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
                <TableCell>
                  <Button variant="outlined" onClick={() => fetchUserSearchHistory(user._id)}>
                    View History
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Remark Modal */}
      <Modal open={openModal} onClose={handleCloseModal}>
        <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: 400, bgcolor: 'background.paper', boxShadow: 24, p: 4 }}>
          <Typography variant="h6">Add Remark</Typography>
          <TextField fullWidth multiline rows={4} value={remark} onChange={(e) => setRemark(e.target.value)} sx={{ mt: 2, mb: 2 }} />
          <Button variant="contained" onClick={handleSaveRemark} sx={{ mr: 2 }}>Save</Button>
          <Button variant="outlined" onClick={handleCloseModal}>Cancel</Button>
        </Box>
      </Modal>

      {/* Enhanced Search History Modal */}
      <Modal open={historyModalOpen} onClose={handleCloseHistoryModal}>
        <Box sx={{ 
          position: 'absolute', 
          top: '50%', 
          left: '50%', 
          transform: 'translate(-50%, -50%)', 
          width: '90%', 
          maxWidth: 1200,
          maxHeight: '90vh',
          overflow: 'auto',
          bgcolor: 'background.paper', 
          boxShadow: 24, 
          p: 4,
          borderRadius: 2
        }}>
          <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', color: 'primary.main' }}>
            User Activity History
          </Typography>
          
          {/* Tabs for switching between views */}
          <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
            <Button
              variant={activeHistoryTab === "colleges" ? "contained" : "outlined"}
              onClick={() => setActiveHistoryTab("colleges")}
              sx={{ mr: 2 }}
            >
              <FiEye style={{ marginRight: 8 }} />
              Viewed Colleges ({collegeViews.length})
            </Button>
            <Button
              variant={activeHistoryTab === "searches" ? "contained" : "outlined"}
              onClick={() => setActiveHistoryTab("searches")}
            >
              <FiBook style={{ marginRight: 8 }} />
              Search History ({selectedUserHistory.length})
            </Button>
          </Box>

          {activeHistoryTab === "colleges" ? (
            // College Views Tab
            <Box>
              <Typography variant="h6" gutterBottom>
                Colleges Viewed by User
              </Typography>
              
              {collegeViews.length > 0 ? (
                <Grid container spacing={3}>
                  {collegeViews.map((college, index) => (
                    <Grid item xs={12} md={6} key={index}>
                      <Card 
                        sx={{ 
                          height: '100%',
                          transition: 'all 0.3s ease',
                          '&:hover': {
                            transform: 'translateY(-4px)',
                            boxShadow: 4
                          }
                        }}
                      >
                        <CardContent>
                          {/* College Header */}
                          <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 2 }}>
                            <Avatar
                              src={college.collegeImage}
                              sx={{ width: 60, height: 60, mr: 2 }}
                            >
                              {college.collegeName?.charAt(0)}
                            </Avatar>
                            <Box sx={{ flex: 1 }}>
                              <Typography variant="h6" component="div" gutterBottom>
                                {college.collegeName || 'Unknown College'}
                              </Typography>
                              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                <FiMapPin size={16} style={{ marginRight: 8, color: '#666' }} />
                                <Typography variant="body2" color="text.secondary">
                                  {college.location || 'Location not specified'}
                                </Typography>
                              </Box>
                            </Box>
                          </Box>

                          {/* College Details */}
                          <Stack spacing={1} sx={{ mb: 2 }}>
                            {college.courses && college.courses.length > 0 && (
                              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                <FiBook size={16} style={{ marginRight: 8, color: '#666' }} />
                                <Typography variant="body2">
                                  Courses: {college.courses.slice(0, 3).join(', ')}
                                  {college.courses.length > 3 && ` +${college.courses.length - 3} more`}
                                </Typography>
                              </Box>
                            )}
                            
                            {(college.minFees || college.maxFees) && (
                              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                <FiDollarSign size={16} style={{ marginRight: 8, color: '#666' }} />
                                <Typography variant="body2">
                                  Fees: ₹{college.minFees || '0'} - ₹{college.maxFees || '0'} Lakhs
                                </Typography>
                              </Box>
                            )}
                            
                            {college.avgPackage && (
                              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                <FiBarChart2 size={16} style={{ marginRight: 8, color: '#666' }} />
                                <Typography variant="body2">
                                  Avg Package: ₹{college.avgPackage} LPA
                                </Typography>
                              </Box>
                            )}
                          </Stack>

                          {/* View Statistics */}
                          <Box sx={{ 
                            display: 'flex', 
                            justifyContent: 'space-between', 
                            alignItems: 'center',
                            pt: 2,
                            borderTop: 1,
                            borderColor: 'divider'
                          }}>
                            <Box>
                              <Chip 
                                label={`Views: ${college.viewCount || 1}`}
                                size="small"
                                color="primary"
                                variant="outlined"
                              />
                            </Box>
                            <Box sx={{ textAlign: 'right' }}>
                              <Typography variant="caption" color="text.secondary">
                                First viewed: {new Date(college.firstViewedAt || college.viewedAt).toLocaleDateString()}
                              </Typography>
                              <br />
                              <Typography variant="caption" color="text.secondary">
                                Last viewed: {new Date(college.lastViewedAt || college.viewedAt).toLocaleString()}
                              </Typography>
                            </Box>
                          </Box>

                          {/* Associated Search */}
                          {college.searchQuery && (
                            <Box sx={{ mt: 1, p: 1, bgcolor: 'grey.50', borderRadius: 1 }}>
                              <Typography variant="caption" color="text.secondary">
                                From search: "{college.searchQuery}"
                              </Typography>
                            </Box>
                          )}
                        </CardContent>
                      </Card>
                    </Grid>
                  ))}
                </Grid>
              ) : (
                <Box sx={{ textAlign: 'center', py: 4 }}>
                  <FiEye size={48} style={{ color: '#ccc', marginBottom: 16 }} />
                  <Typography variant="h6" color="text.secondary">
                    No colleges viewed yet
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    This user hasn't viewed any college details yet.
                  </Typography>
                </Box>
              )}
            </Box>
          ) : (
            // Search History Tab (Original)
            <Box>
              <Typography variant="h6" gutterBottom>
                Search History
              </Typography>
              
              {selectedUserHistory.length > 0 ? (
                <List>
                  {selectedUserHistory.map((search, index) => (
                    <Paper key={index} elevation={2} sx={{ mb: 2, p: 2 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                        <Typography variant="subtitle1" fontWeight="bold">
                          {search.searchQuery || "General Search"}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {new Date(search.createdAt).toLocaleString()}
                        </Typography>
                      </Box>
                      
                      <Box sx={{ mt: 1, mb: 1 }}>
                        <Typography variant="subtitle2" gutterBottom>Filters Used:</Typography>
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                          {Object.entries(search.filters).map(([key, value]) => (
                            value && (
                              <Chip 
                                key={key}
                                label={`${key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}: ${value}`}
                                size="small"
                                color="primary"
                                variant="outlined"
                              />
                            )
                          ))}
                        </Box>
                      </Box>
                      
                      {search.collegesViewed?.length > 0 && (
                        <>
                          <Divider sx={{ my: 1 }} />
                          <Typography variant="subtitle2" gutterBottom>
                            Viewed Colleges ({search.collegesViewed.length}):
                          </Typography>
                          <List dense>
                            {search.collegesViewed.map((view, idx) => (
                              <ListItem key={idx} sx={{ py: 0.5 }}>
                                <ListItemText
                                  primary={view.collegeName || view.collegeId?.name || 'Unknown College'}
                                  secondary={`Viewed ${view.viewCount || 1} time(s) - Last: ${new Date(view.lastViewedAt || view.viewedAt).toLocaleString()}`}
                                />
                              </ListItem>
                            ))}
                          </List>
                        </>
                      )}
                    </Paper>
                  ))}
                </List>
              ) : (
                <Box sx={{ textAlign: 'center', py: 4 }}>
                  <FiBook size={48} style={{ color: '#ccc', marginBottom: 16 }} />
                  <Typography variant="h6" color="text.secondary">
                    No search history found
                  </Typography>
                </Box>
              )}
            </Box>
          )}
          
          <Box sx={{ textAlign: 'center', mt: 3 }}>
            <Button 
              variant="contained" 
              onClick={handleCloseHistoryModal}
              sx={{ minWidth: 120 }}
            >
              Close
            </Button>
          </Box>
        </Box>
      </Modal>
    </Box>
  );
};

export default Adminusers;