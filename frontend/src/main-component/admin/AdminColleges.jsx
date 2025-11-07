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
} from "@mui/material";
import { Add, Delete, Edit } from "@mui/icons-material";
import AddCollegeDialog from "./AddCollegeDialog";
import Swal from "sweetalert2";
import axios from "axios";

const Colleges = () => {
  const [colleges, setColleges] = useState([]);
  const [open, setOpen] = useState(false);
  const [editCollege, setEditCollege] = useState(null);

  useEffect(() => {
    fetchColleges();
  }, []);

  const fetchColleges = async () => {
    try {
      const response = await axios.get("https://collegeforms.in/api/colleges");
      setColleges(response.data);
    } catch (error) {
      console.error("Error fetching colleges:", error);
    }
  };

  const handleClickOpen = () => setOpen(true);
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
      if (collegeData.imageFile) {
        formData.append("image", collegeData.imageFile);
      }

      if (editCollege) {
        await axios.put(`https://collegeforms.in/api/colleges/${editCollege._id}`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        Swal.fire("Updated!", "College details updated successfully.", "success");
      } else {
        const response = await axios.post("https://collegeforms.in/api/colleges", formData, {
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
          await axios.delete(`https://collegeforms.in/api/colleges/${id}`);
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

  return (
    <Box sx={{ padding: "20px", backgroundColor: "#F1F5FB" }}>
      <Box sx={{ textAlign: "end", marginBottom: "20px" }}>
        <Button variant="contained" sx={{ backgroundColor: "#564BD5" }} startIcon={<Add />} onClick={handleClickOpen}>
          Add College
        </Button>
      </Box>

      <TableContainer component={Paper} sx={{ marginBottom: "20px", boxShadow: 2, borderRadius: 1, overflow: "hidden" }}>
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: "#564BD5" }}>
              {["College Name", "Image", "Location", "Courses", "Rating", "Actions"].map((header) => (
                <TableCell key={header} align="center">
                  <Typography sx={{ fontWeight: "bold", color: "#fff" }}>{header}</Typography>
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {colleges.map((college) => (
              <TableRow key={college._id} sx={{ "&:hover": { backgroundColor: "#E8F5E9" } }}>
                <TableCell align="center">{college.name}</TableCell>
                <TableCell align="center">
                  <img src={`https://collegeforms.in${college.image}`} alt={college.name} style={{ width: "50px" }} />
                </TableCell>
                <TableCell align="center">{college.location}</TableCell>
                <TableCell align="center">{college.courses.join(", ")}</TableCell>
                <TableCell align="center">
                  <Rating value={college.reviews} readOnly precision={0.5} />
                </TableCell>
                <TableCell align="center">
                  <IconButton color="primary" onClick={() => handleEditCollege(college)}>
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
      </TableContainer>

      <AddCollegeDialog
        open={open}
        handleClose={handleClose}
        handleAddCollege={handleAddOrUpdateCollege}
        editCollege={editCollege}
      />
    </Box>
  );
};

export default Colleges;
