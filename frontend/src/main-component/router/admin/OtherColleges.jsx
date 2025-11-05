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
  Tabs,
  Tab,
} from "@mui/material";
import { useNavigate } from "react-router";
import { Add, Delete, Edit } from "@mui/icons-material";
import AddCollegeDialog from "./AddCollegePage";
import Swal from "sweetalert2";
import axios from "axios";

const OtherColleges = () => {  const API_URL = "https://collegeform.onrender.com" || "https://collegeform-production.up.railway.app" || "http://localhost:5000";

  const navigate = useNavigate();
  const [colleges, setColleges] = useState([]);
  const [filteredColleges, setFilteredColleges] = useState([]);
  const [open, setOpen] = useState(false);
  const [editCollege, setEditCollege] = useState(null);
  const [activeTab, setActiveTab] = useState("government-colleges");

  const categories = [
    "government-colleges",

    "OnlineEducation",
    "OverseasEducation",
    "ScholarshipBasedEducation",
    "vocational-institutes"
  ];

  useEffect(() => {
    fetchColleges();
  }, []);

  useEffect(() => {
    filterCollegesByCategory();
  }, [colleges, activeTab]);

  const fetchColleges = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/colleges`);
      setColleges(response.data);
    } catch (error) {
      console.error("Error fetching colleges:", error);
    }
  };

  const filterCollegesByCategory = () => {
    if (activeTab === "government-colleges") {
       const filtered = colleges.filter(college => college.category === activeTab);
      setFilteredColleges(filtered);
    } else {
      const filtered = colleges.filter(college => college.category === activeTab);
      setFilteredColleges(filtered);
    }
  };

  const handleTabChange = (event, newValue) => {
    setActiveTab(categories[newValue]);
  };

  const handleClickOpen = () => navigate("/admin/colleges/add");
  const handleClose = () => {
    setOpen(false);
    setEditCollege(null);
  };

  const handleAddOrUpdateCollege = async (collegeData) => {
    try {
      const formData = new FormData();
      formData.append("name", collegeData.name);
      formData.append("location", collegeData.location);
      formData.append("category", collegeData.category);
      formData.append("courses", JSON.stringify(collegeData.courses));
      formData.append("specializations", JSON.stringify(collegeData.specializations));
      formData.append("exams", JSON.stringify(collegeData.exams));
      formData.append("minFees", collegeData.minFees);
      formData.append("maxFees", collegeData.maxFees);
      formData.append("avgPackage", collegeData.avgPackage);
      formData.append("rating", collegeData.rating);
      formData.append("description", collegeData.description);
      if (collegeData.imageFile) {
        formData.append("image", collegeData.imageFile);
      }

      if (editCollege) {
        await axios.put(`${API_URL}/api/colleges/${editCollege._id}`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        Swal.fire("Updated!", "College details updated successfully.", "success");
      } else {
        await axios.post(`${API_URL}/api/colleges`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        Swal.fire("Added!", "New college added successfully.", "success");
      }
      fetchColleges();
      handleClose();
    } catch (error) {
      console.error("Error saving college:", error);
      Swal.fire("Error!", "Failed to save college details.", "error");
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
          Swal.fire("Error!", "Failed to delete college.", "error");
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
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: "20px" }}>
      <Tabs
  value={categories.indexOf(activeTab)}
  onChange={handleTabChange}
  indicatorColor="primary"
  textColor="primary"
  variant="scrollable"
  scrollButtons="auto"
  sx={{
    '.MuiTab-root': {
      fontFamily: 'Poppins, sans-serif',
      fontWeight: 600,
      fontSize: '16px',
      color: '#333',
      textTransform: 'none',
      transition: 'color 0.3s',
    },
    '.Mui-selected': {
      color: '#564BD5',
    },
    '.MuiTabs-indicator': {
      backgroundColor: '#564BD5',
      height: '4px',
    },
  }}
>
  {categories.map((category) => (
    <Tab key={category} label={category} />
  ))}
</Tabs>

        
        <Button 
          variant="contained" 
          sx={{ backgroundColor: "#564BD5" }} 
          startIcon={<Add />} 
          onClick={handleClickOpen}
        >
          Add College
        </Button>
      </Box>

      <TableContainer 
        component={Paper} 
        sx={{ 
          marginBottom: "20px", 
          boxShadow: 2, 
          borderRadius: 1, 
          overflow: "hidden" 
        }}
      >
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: "#564BD5" }}>
              {["#", "College Name", "Image", "Location", "Category", "Courses", "Actions"].map((header) => (
                <TableCell key={header} align="center">
                  <Typography sx={{ fontWeight: "bold", color: "#fff" }}>{header}</Typography>
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredColleges.length > 0 ? (
              filteredColleges.map((college, index) => (
                <TableRow 
                  key={college._id} 
                  sx={{ "&:hover": { backgroundColor: "#E8F5E9" } }}
                >
                  <TableCell align="center">{index + 1}</TableCell>
                  <TableCell align="center">{college.name}</TableCell>
                  <TableCell align="center">
                    <img 
                      src={college.image} 
                      alt={college.name} 
                      style={{ width: "50px", height: "50px", objectFit: "cover" }} 
                    />
                  </TableCell>
                  <TableCell align="center">{college.location}</TableCell>
                  <TableCell align="center">{college.category}</TableCell>
                  <TableCell align="center">
                    {Array.isArray(college.courses) ? college.courses.join(", ") : college.courses}
                  </TableCell>
                  <TableCell align="center">
                    <IconButton 
                      color="primary" 
                      onClick={() => navigate(`/admin/edit-college/${college._id}`)}
                    >
                      <Edit />
                    </IconButton>
                    <IconButton 
                      color="error" 
                      onClick={() => handleDeleteCollege(college._id)}
                    >
                      <Delete />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={7} align="center" sx={{ py: 4 }}>
                  <Typography variant="h6">
                    No colleges found {activeTab !== "government-colleges" ? `in ${activeTab} category` : ""}
                  </Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
{/* 
      <AddCollegeDialog
        open={open}
        handleClose={handleClose}
        handleAddCollege={handleAddOrUpdateCollege}
        editCollege={editCollege}
        categories={categories.filter(cat => cat !== "Overseas Education")}
      /> */}
    </Box>
  );
};

export default OtherColleges;