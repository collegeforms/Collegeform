import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Paper,
  Typography,
  Rating,
  TextField, // Added TextField for search
  InputAdornment, // For search icon
} from "@mui/material";
import { useNavigate } from "react-router";
import { Add, Delete, Edit, Search } from "@mui/icons-material"; // Added Search icon
import AddCollegeDialog from "./AddCollegePage";
import Swal from "sweetalert2";
import axios from "axios";
const Colleges = () => {
  const API_URL = "https://www.collegeforms.in";

  const navigate = useNavigate();
  const [colleges, setColleges] = useState([]);
  const [filteredColleges, setFilteredColleges] = useState([]); // For filtered results
  const [searchTerm, setSearchTerm] = useState(""); // Search term state
  const [open, setOpen] = useState(false);
  const [editCollege, setEditCollege] = useState(null);

  useEffect(() => {
    fetchColleges();
  }, []);

  // Filter colleges when search term or colleges list changes
  useEffect(() => {
    const filtered = colleges.filter(college =>
      college.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredColleges(filtered);
  }, [searchTerm, colleges]);

  const fetchColleges = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/colleges`);
      setColleges(response.data);
      console.log(response.data);
      
    } catch (error) {
      console.error("Error fetching colleges:", error);
    }
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleClickOpen = () =>  navigate("/admin/colleges/add");
  const handleClose = () => {
    setOpen(false);
    setEditCollege(null);
  };

  const handleAddOrUpdateCollege = async (collegeData) => {
    try {
      const formData = new FormData();
      formData.append("name", collegeData.name);
      formData.append("location", collegeData.location);
      formData.append("courses", JSON.stringify(collegeData.courses));
      formData.append("reviews", collegeData.reviews);
      formData.append("rating", collegeData.rating);
      if (collegeData.imageFile) {
        formData.append("image", collegeData.imageFile);
      }

      if (editCollege) {
        await axios.put(`${API_URL}/api/colleges/${editCollege._id}`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        Swal.fire("Updated!", "College details updated successfully.", "success");
      } else {
        const response = await axios.post(`${API_URL}/api/colleges`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        setColleges([...colleges, response.data.college]);
        Swal.fire("Added!", "New college added successfully.", "success");
      }
      fetchColleges();
      handleClose();
    } catch (error) {
      console.error("Error saving college:", error);
    }
  };

  const handleDeleteCollege = async (id) => {
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
          await axios.delete(`${API_URL}/api/colleges/${id}`);
          setColleges(colleges.filter((college) => college._id !== id));
          Swal.fire("Deleted!", "The college has been deleted.", "success");
        } catch (error) {
          console.error("Error deleting college:", error);
        }
      }
    });
  };

  const handleEditCollege = (college) => {
    setEditCollege(college);
    setOpen(true);
  };

  const handleRatingChange = async (collegeId, newValue) => {
    try {
      await axios.put(`${API_URL}/api/colleges/${collegeId}/rating`, {
        rating: newValue
      });
      fetchColleges();
    } catch (error) {
      console.error("Error updating rating:", error);
    }
  };

  return (
    <Box sx={{ padding: "20px", backgroundColor: "#F1F5FB" }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
        <TextField
          placeholder="Search colleges..."
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
          sx={{ width: "300px" }}
        />
        <Button 
          variant="contained" 
          sx={{ backgroundColor: "#564BD5" }} 
          startIcon={<Add />} 
          onClick={handleClickOpen}
        >
          Add College
        </Button>
      </Box>

      <TableContainer component={Paper} sx={{ marginBottom: "20px", boxShadow: 2, borderRadius: 1, overflow: "hidden" }}>
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: "#564BD5" }}>
              {["#", "College Name", "Image", "Location", "Courses", "Rating", "Actions"].map((header) => (
                <TableCell key={header} align="center">
                  <Typography sx={{ fontWeight: "bold", color: "#fff" }}>{header}</Typography>
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredColleges.map((college, key) => (
              <TableRow key={college._id} sx={{ "&:hover": { backgroundColor: "#E8F5E9" } }}>
                <TableCell align="center">{key + 1}</TableCell>
                <TableCell align="center">{college.name}</TableCell>
                <TableCell align="center">
                  <img src={college.image} alt={college.name} style={{ width: "50px" }} />
                </TableCell>
                <TableCell align="center">{college.location}</TableCell>
                <TableCell align="center">{college.courses.join(", ")}</TableCell>
                <TableCell align="center">
                  <Rating
                    name={`rating-${college._id}`}
                    value={college.rating || 0}
                    precision={0.5}
                    onChange={(event, newValue) => handleRatingChange(college._id, newValue)}
                  />
                </TableCell>
                <TableCell align="center">
                  <IconButton color="primary" onClick={() => navigate(`/admin/edit-college/${college._id}`)}>
                    <Edit />
                  </IconButton>
                  <IconButton color="error" onClick={() => handleDeleteCollege(college._id)}>
                    <Delete />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        {filteredColleges.length === 0 && (
          <Box sx={{ padding: "20px", textAlign: "center" }}>
            <Typography>No colleges found matching your search.</Typography>
          </Box>
        )}
      </TableContainer>

      {/* <AddCollegeDialog
        open={open}
        handleClose={handleClose}
        handleAddCollege={handleAddOrUpdateCollege}
        editCollege={editCollege}
      /> */}
    </Box>
  );
};

export default Colleges;