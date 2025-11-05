import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Checkbox,
  ListItemText,
  Rating,
  Box,
  Typography,
  Snackbar,
  Alert,
} from "@mui/material";
import { CloudUpload } from "@mui/icons-material";

const availableCourses = [
  "BCA",
  "MCA",
  "BA",
  "BSC",
  "MSC",
  "BE",
  "BTECH",
  "BBA",
];

const availableExams = ["JEE", "NEET", "CAT", "GATE", "SAT", "GMAT"];

const availableSpecializations = [
  "Computer Science",
  "Mechanical Engineering",
  "Civil Engineering",
  "Electrical Engineering",
  "Biotechnology",
  "Data Science",
  "Artificial Intelligence",
];

const AddCollegeDialog = ({ open, handleClose, handleAddCollege }) => {
  const [newCollege, setNewCollege] = useState({
    name: "",
    location: "",
    description: "",
    minFees: "",
    maxFees: "",
    avgPackage: "",
    exams: [],
    courses: [],
    specializations: [],  // Added specialization
    imageFile: null,
  });

  const [rating, setRating] = useState(0);
  const [previewImage, setPreviewImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });

  // Reset form when the dialog opens or closes
  useEffect(() => {
    if (!open) {
      setNewCollege({
        name: "",
        location: "",
        description: "",
        minFees: "",
        maxFees: "",
        avgPackage: "",
        exams: [],
        courses: [],
        specializations: [],  // Reset specializations as well
        imageFile: null,
      });
      setPreviewImage(null);
      setRating(0);
    }
  }, [open]);

  // Handle input changes
  const handleInputChange = (e) => {
    setNewCollege({ ...newCollege, [e.target.name]: e.target.value });
  };

  // Handle course selection
  const handleCoursesChange = (e) => {
    setNewCollege({ ...newCollege, courses: e.target.value });
  };

  // Handle exam selection
  const handleExamsChange = (e) => {
    setNewCollege({ ...newCollege, exams: e.target.value });
  };

  // Handle specialization selection
  const handleSpecializationsChange = (e) => {
    setNewCollege({ ...newCollege, specializations: e.target.value });
  };

  // Handle image upload
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setNewCollege({ ...newCollege, imageFile: file });

      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async () => {
    if (!newCollege.name || !newCollege.location || !newCollege.courses.length || !newCollege.specializations.length || !newCollege.imageFile) {
      setSnackbar({ open: true, message: "Please fill all fields and upload an image.", severity: "error" });
      return;
    }

    const formData = new FormData();
    formData.append("name", newCollege.name);
    formData.append("location", newCollege.location);
    formData.append("description", newCollege.description);
    formData.append("minFees", newCollege.minFees);
    formData.append("maxFees", newCollege.maxFees);
    formData.append("avgPackage", newCollege.avgPackage);
    formData.append("exams", JSON.stringify(newCollege.exams));
    formData.append("courses", JSON.stringify(newCollege.courses));
    formData.append("specializations", JSON.stringify(newCollege.specializations));  // Added specializations field
    formData.append("rating", rating);
    formData.append("image", newCollege.imageFile);

    try {
      setLoading(true);
      const response = await axios.post("http://localhost:5000/api/colleges", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      handleAddCollege(response.data.college);
      setSnackbar({ open: true, message: "College added successfully!", severity: "success" });
      handleClose();
    } catch (error) {
      setSnackbar({
        open: true,
        message: error.response?.data?.message || "Failed to add college. Please try again.",
        severity: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ backgroundColor: "#564BD5", color: "white", textAlign: "center" }}>
          Add College
        </DialogTitle>
        <DialogContent sx={{ padding: "20px" }}>
          <TextField
            label="College Name"
            type="text"
            fullWidth
            name="name"
            value={newCollege.name}
            onChange={handleInputChange}
            margin="dense"
            variant="outlined"
          />

          <TextField
            label="Location"
            type="text"
            fullWidth
            name="location"
            value={newCollege.location}
            onChange={handleInputChange}
            margin="dense"
            variant="outlined"
          />

          <FormControl fullWidth margin="dense">
            <InputLabel>Courses</InputLabel>
            <Select
              multiple
              value={newCollege.courses}
              onChange={handleCoursesChange}
              renderValue={(selected) => selected.join(", ")}
            >
              {availableCourses.map((course) => (
                <MenuItem key={course} value={course}>
                  <Checkbox checked={newCollege.courses.includes(course)} />
                  <ListItemText primary={course} />
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <TextField
            label="Description"
            multiline
            rows={3}
            fullWidth
            name="description"
            value={newCollege.description}
            onChange={handleInputChange}
            margin="dense"
            variant="outlined"
          />

          <TextField
            label="Minimum Fees (INR)"
            type="number"
            fullWidth
            name="minFees"
            value={newCollege.minFees}
            onChange={handleInputChange}
            margin="dense"
            variant="outlined"
          />

          <TextField
            label="Maximum Fees (INR)"
            type="number"
            fullWidth
            name="maxFees"
            value={newCollege.maxFees}
            onChange={handleInputChange}
            margin="dense"
            variant="outlined"
          />

          <TextField
            label="Average Package (LPA)"
            type="number"
            fullWidth
            name="avgPackage"
            value={newCollege.avgPackage}
            onChange={handleInputChange}
            margin="dense"
            variant="outlined"
          />

          {/* Specialization Field */}
          <FormControl fullWidth margin="dense">
            <InputLabel>Specializations</InputLabel>
            <Select
              multiple
              value={newCollege.specializations}
              onChange={handleSpecializationsChange}
              renderValue={(selected) => selected.join(", ")}
            >
              {availableSpecializations.map((specialization) => (
                <MenuItem key={specialization} value={specialization}>
                  <Checkbox checked={newCollege.specializations.includes(specialization)} />
                  <ListItemText primary={specialization} />
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl fullWidth margin="dense">
            <InputLabel>Entrance Exams</InputLabel>
            <Select
              multiple
              value={newCollege.exams}
              onChange={handleExamsChange}
              renderValue={(selected) => selected.join(", ")}
            >
              {availableExams.map((exam) => (
                <MenuItem key={exam} value={exam}>
                  <Checkbox checked={newCollege.exams.includes(exam)} />
                  <ListItemText primary={exam} />
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <Box sx={{ display: "flex", width: "100%", alignItems: "center", gap: 2, marginTop: 2, flexDirection: "column" }}>
            <input
              accept="image/*"
              style={{ display: "none" }}
              id="upload-image"
              type="file"
              onChange={handleImageUpload}
            />
            <label htmlFor="upload-image">
              <Button component="span" variant="contained" color="secondary" startIcon={<CloudUpload />}>
                Upload Image
              </Button>
            </label>
            {previewImage && (
              <Box
                component="img"
                src={previewImage}
                sx={{
                  width: "100px",
                  height: "100px",
                  borderRadius: "10px",
                  objectFit: "cover",
                  border: "2px solid white",
                  boxShadow: 3,
                }}
                alt="Uploaded Preview"
              />
            )}
          </Box>

          <Box sx={{ display: "flex", alignItems: "center", marginTop: 2 }}>
            <Typography variant="subtitle1">Rating:</Typography>
            <Rating value={rating} onChange={(e, newValue) => setRating(newValue)} />
          </Box>
        </DialogContent>

        <DialogActions sx={{ padding: "20px" }}>
          <Button onClick={handleClose} color="error" variant="contained">
            Cancel
          </Button>
          <Button onClick={handleSubmit} color="primary" variant="contained" disabled={loading}>
            {loading ? "Uploading..." : "Add College"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar Notification */}
      <Snackbar open={snackbar.open} autoHideDuration={4000} onClose={() => setSnackbar({ ...snackbar, open: false })}>
        <Alert onClose={() => setSnackbar({ ...snackbar, open: false })} severity={snackbar.severity} sx={{ width: "100%" }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  );
};

export default AddCollegeDialog;
