import React, { useEffect, useState } from "react";
import axios from "axios";
import * as XLSX from "xlsx";
import { 
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, 
  CircularProgress, Checkbox, Button, Typography, TextField, InputAdornment, IconButton, 
  useMediaQuery, useTheme, Modal, Box 
} from "@mui/material";
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import SearchIcon from '@mui/icons-material/Search';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import NoteAddIcon from '@mui/icons-material/NoteAdd';

const AdminInquiry = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [completedApps, setCompletedApps] = useState({});
  const [openNoteModal, setOpenNoteModal] = useState(false);
  const [currentAppId, setCurrentAppId] = useState(null);
  const [note, setNote] = useState("");

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/applications");
      setApplications(response.data);

      const completedState = {};
      response.data.forEach(app => {
        completedState[app._id] = app.completed;
      });
      setCompletedApps(completedState);
    } catch (error) {
      console.error("Error fetching applications:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCheckboxChange = async (id) => {
    try {
      await axios.put(`http://localhost:5000/api/applications/${id}/complete`);
      setCompletedApps((prev) => ({ ...prev, [id]: !prev[id] }));
    } catch (error) {
      console.error("Error updating application status:", error);
    }
  };

  const handleNoteOpen = (appId, existingNote = "") => {
    setCurrentAppId(appId);
    setNote(existingNote);  // Pass the existing note to the modal input
    setOpenNoteModal(true);
  };
  

  const handleNoteClose = () => {
    setOpenNoteModal(false);
    setNote("");  // Clear the note input when modal is closed
  };
  const handleNoteSave = async () => {
    if (note.trim()) {
      try {
        // Save the note to the backend
        await axios.put(`http://localhost:5000/api/applications/${currentAppId}/add-note`, { note });
        // Optionally, update the applications state with the new note (not necessary if note is only stored on the server)
        setApplications(prevApps =>
          prevApps.map(app => 
            app._id === currentAppId ? { ...app, note } : app
          )
        );
        handleNoteClose();
      } catch (error) {
        console.error("Error saving note:", error);
      }
    }
  };
  

  const filteredApplications = applications.filter(app =>
    app.name.toLowerCase().includes(search.toLowerCase()) ||
    app.email.toLowerCase().includes(search.toLowerCase()) ||
    app.city.toLowerCase().includes(search.toLowerCase()) ||
    app.collegeName.toLowerCase().includes(search.toLowerCase())
  );

  const exportToExcel = () => {
    const data = filteredApplications.map(app => ({
      Name: app.name,
      Number: app.number,
      Email: app.email,
      City: app.city,
      Course: app.course,
      College: app.collegeName,
      Location: app.location,
      Date: new Date(app.createdAt).toLocaleDateString(),
      Status: completedApps[app._id] ? "✅ Completed" : "⏳ Pending"
    }));

    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Applications");
    const columnWidths = [
      { wch: 20 }, { wch: 15 }, { wch: 25 }, { wch: 15 }, { wch: 20 }, { wch: 25 }, { wch: 20 }, { wch: 15 }, { wch: 12 }
    ];
    worksheet["!cols"] = columnWidths;
    XLSX.writeFile(workbook, "Student_Applications.xlsx");
  };

  return (
    <div style={{ padding: isMobile ? "10px" : "20px" }}>
      <TextField
        fullWidth
        label="Search Applications..."
        variant="outlined"
        sx={{
          mb: 3,
          backgroundColor: "white",
          boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
          borderRadius: "8px"
        }}
        onChange={(e) => setSearch(e.target.value)}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton>
                <SearchIcon />
              </IconButton>
            </InputAdornment>
          )
        }}
      />

      {loading ? (
        <CircularProgress sx={{ display: "block", margin: "auto" }} />
      ) : filteredApplications.length === 0 ? (
        <Typography variant="h6" sx={{ textAlign: "center", color: "gray" }}>
          No applications found.
        </Typography>
      ) : (
        <>
          <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: "10px" }}>
            <Button 
              variant="contained" 
              sx={{backgroundColor:"#5B5EFF"}}
              startIcon={<FileDownloadIcon />}
              onClick={exportToExcel}
              size={isMobile ? "small" : "medium"}
            >
              {isMobile ? "Download" : "Download Excel"}
            </Button>
          </div>

          <TableContainer 
            component={Paper} 
            sx={{
              borderRadius: "10px", 
              overflow: "auto", 
              maxWidth: "100%", 
              boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)"
            }}
          >
            <Table>
              <TableHead>
                <TableRow sx={{ backgroundColor: "#5B5EFF", color: "white" }}>
                  <TableCell sx={{ color: "white", fontWeight: "bold", fontSize: isMobile ? "12px" : "14px" }}>Completed</TableCell>
                  <TableCell sx={{ color: "white", fontWeight: "bold", fontSize: isMobile ? "12px" : "14px" }}>Name</TableCell>
                  <TableCell sx={{ color: "white", fontWeight: "bold", fontSize: isMobile ? "12px" : "14px" }}>Number</TableCell>
                  <TableCell sx={{ color: "white", fontWeight: "bold", fontSize: isMobile ? "12px" : "14px" }}>Email</TableCell>
                  <TableCell sx={{ color: "white", fontWeight: "bold", fontSize: isMobile ? "12px" : "14px" }}>City</TableCell>
                  <TableCell sx={{ color: "white", fontWeight: "bold", fontSize: isMobile ? "12px" : "14px" }}>Course</TableCell>
                  <TableCell sx={{ color: "white", fontWeight: "bold", fontSize: isMobile ? "12px" : "14px" }}>College</TableCell>
                  <TableCell sx={{ color: "white", fontWeight: "bold", fontSize: isMobile ? "12px" : "14px" }}>Location</TableCell>
                  <TableCell sx={{ color: "white", fontWeight: "bold", fontSize: isMobile ? "12px" : "14px" }}>Date</TableCell>
                  <TableCell sx={{ color: "white", fontWeight: "bold", fontSize: isMobile ? "12px" : "14px" }}>Remark</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
  {filteredApplications.map((app) => (
    <TableRow key={app._id} sx={{ "&:nth-of-type(odd)": { backgroundColor: "#f9f9f9" } }}>
      <TableCell sx={{ fontSize: isMobile ? "12px" : "14px" }}>
        <Checkbox
          checked={!!completedApps[app._id]}
          onChange={() => handleCheckboxChange(app._id)}
          size={isMobile ? "small" : "medium"}
        />
        {completedApps[app._id] ? (
          <CheckCircleIcon sx={{ color: "green", ml: 1, fontSize: isMobile ? "16px" : "20px" }} />
        ) : (
          <CancelIcon sx={{ color: "red", ml: 1, fontSize: isMobile ? "16px" : "20px" }} />
        )}
      </TableCell>
      <TableCell sx={{ fontSize: isMobile ? "12px" : "14px" }}>{app.name}</TableCell>
      <TableCell sx={{ fontSize: isMobile ? "12px" : "14px" }}>{app.number}</TableCell>
      <TableCell sx={{ fontSize: isMobile ? "12px" : "14px" }}>{app.email}</TableCell>
      <TableCell sx={{ fontSize: isMobile ? "12px" : "14px" }}>{app.city}</TableCell>
      <TableCell sx={{ fontSize: isMobile ? "12px" : "14px" }}>{app.course}</TableCell>
      <TableCell sx={{ fontSize: isMobile ? "12px" : "14px" }}>{app.collegeName}</TableCell>
      <TableCell sx={{ fontSize: isMobile ? "12px" : "14px" }}>{app.location}</TableCell>
      <TableCell sx={{ fontSize: isMobile ? "12px" : "14px" }}>{new Date(app.createdAt).toLocaleDateString()}</TableCell>
      {/* Show Remark data */}
      <TableCell sx={{ fontSize: isMobile ? "12px" : "14px" }}>
        <Button
    startIcon={<NoteAddIcon />}
    size={isMobile ? "small" : "medium"}
    onClick={() => handleNoteOpen(app._id, app.note)}  // Pass the existing note here
  >
    Remark
  </Button>

      </TableCell>
    </TableRow>
  ))}
</TableBody>

            </Table>
          </TableContainer>
        </>
      )}

      {/* Note Modal */}
      <Modal open={openNoteModal} onClose={handleNoteClose}>
  <Box
    sx={{
      position: "absolute",
      top: "50%",
      left: "50%",
      transform: "translate(-50%, -50%)",
      backgroundColor: "white",
      padding: "20px",
      borderRadius: "8px",
      width: isMobile ? "80%" : "400px",
      boxShadow: 24
    }}
  >
    <Typography variant="h6">Add/Update a Remark</Typography>
    <TextField
      fullWidth
      multiline
      rows={4}
      value={note}  // Bind value to the note state
      onChange={(e) => setNote(e.target.value)}  // Update note state when input changes
      variant="outlined"
      sx={{ mt: 2 }}
    />
    <Box sx={{ display: "flex", justifyContent: "space-between", marginTop: "10px" }}>
      <Button onClick={handleNoteClose} color="secondary">Cancel</Button>
      <Button onClick={handleNoteSave} variant="contained" color="primary">Save</Button>
    </Box>
  </Box>
</Modal>

    </div>
  );
};

export default AdminInquiry;
