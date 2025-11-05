import React, { useState } from "react";
import {
  Button,
  TextField,
  MenuItem,
  Grid,
  FormControl,
  InputLabel,
  Select,
  Typography,
  Box,
  Stepper,
  Step,
  StepLabel,
  Container,
  Paper,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormLabel,
} from "@mui/material";

import axios from "axios";
const genderOptions = ["Male", "Female", "Other"];
const courseOptions = ["B.Tech", "M.Tech", "BCA", "MCA", "MBA"];
const boardOptions = ["CBSE", "ICSE", "State Board"];

const steps = [
  "Personal Information",
  "Family Information",
  "10th Education",
  "12th Education",
];

const StepForm = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [formData, setFormData] = useState({
    name: "",
    number: "",
    dob: "",
    gender: "",
    aadhar: "",
    course: "",
    fatherName: "",
    fatherNumber: "",
    email: "",
    occupation: "",
    motherName: "",
    motherNumber: "",
    schoolName10: "",
    board10: "",
    passingYear10: "",
    percentage10: "",
    cgpa10: "",
    schoolName12: "",
    board12: "",
    passingYear12: "",
    percentage12: "",
    cgpa12: "",
    graduationUniversity: "",
    graduationCourse: "",
    passingYearGraduation: "",
    percentageGraduation: "",
    isGraduation: false,
    cgpaGraduation: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleNext = () => {
    setActiveStep((prevStep) => prevStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
  };

  const handleSubmit = async () => {
    try {
      // Send the form data to the backend
      const response = await axios.post(
        "http://localhost:5000/api/students/submit",
        formData
      );

      // Log the response from the backend
      console.log("Response from backend:", response.data);

      // Optionally, show a success message or reset the form
      alert("Form submitted successfully!");
      setFormData({
        name: "",
        number: "",
        dob: "",
        gender: "",
        aadhar: "",
        course: "",
        fatherName: "",
        fatherNumber: "",
        email: "",
        occupation: "",
        motherName: "",
        motherNumber: "",
        schoolName10: "",
        board10: "",
        passingYear10: "",
        percentage10: "",
        cgpa10: "",
        schoolName12: "",
        board12: "",
        passingYear12: "",
        percentage12: "",
        cgpa12: "",
        isGraduation: false,
        graduationUniversity: "",
        graduationCourse: "",
        passingYearGraduation: "",
        percentageGraduation: "",
        cgpaGraduation: "",
      });
    } catch (error) {
      // Handle error if the request fails
      console.error("Error submitting form:", error);
      alert("There was an error submitting the form. Please try again.");
    }
  };

  return (
    <Container maxWidth="md" sx={{ mt: 5 }}>
      <Box sx={{ p: 0 }}>
        <Stepper
          activeStep={activeStep}
          alternativeLabel
          sx={{
            "& .MuiStepIcon-root": { color: "#aaa" }, // Default step color
            "& .Mui-active": { color: "black" }, // Active step color
            "& .Mui-completed": { color: "black" }, // Completed step color
          }}
        >
          {steps.map((label, index) => (
            <Step key={index}>
              <StepLabel
                sx={{
                  "& .MuiStepLabel-label": {
                    color: activeStep === index ? "#5B5EFF" : "#aaa", // Active step label color
                    fontWeight: activeStep === index ? "bold" : "normal",
                  },
                }}
              >
                {label}
              </StepLabel>
            </Step>
          ))}
        </Stepper>

        <Box sx={{ mt: 3 }}>
          <form>
            {activeStep === 0 && (
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <TextField
                    label="Name"
                    fullWidth
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    label="Number"
                    fullWidth
                    name="number"
                    value={formData.number}
                    onChange={handleChange}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    label="Date of Birth"
                    type="date"
                    fullWidth
                    name="dob"
                    value={formData.dob}
                    onChange={handleChange}
                    InputLabelProps={{
                      shrink: true,
                    }}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <FormControl fullWidth>
                    <InputLabel>Gender</InputLabel>
                    <Select
                      label="Gender"
                      name="gender"
                      value={formData.gender}
                      onChange={handleChange}
                    >
                      {genderOptions.map((gender, idx) => (
                        <MenuItem key={idx} value={gender}>
                          {gender}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    label="Aadhar Card"
                    fullWidth
                    name="aadhar"
                    value={formData.aadhar}
                    onChange={handleChange}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <FormControl fullWidth>
                    <InputLabel>Course</InputLabel>
                    <Select
                      label="Course"
                      name="course"
                      value={formData.course}
                      onChange={handleChange}
                    >
                      {courseOptions.map((course, idx) => (
                        <MenuItem key={idx} value={course}>
                          {course}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>

                <Grid item xs={12} md={12}>
                  <TextField
                    label="Email ID"
                    fullWidth
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                  />
                </Grid>
              </Grid>
            )}

            {activeStep === 1 && (
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <TextField
                    label="Father's Name"
                    fullWidth
                    name="fatherName"
                    value={formData.fatherName}
                    onChange={handleChange}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    label="Father's Number"
                    fullWidth
                    name="fatherNumber"
                    value={formData.fatherNumber}
                    onChange={handleChange}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    label="Email ID"
                    fullWidth
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    label="Occupation"
                    fullWidth
                    name="occupation"
                    value={formData.occupation}
                    onChange={handleChange}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    label="Mother's Name"
                    fullWidth
                    name="motherName"
                    value={formData.motherName}
                    onChange={handleChange}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    label="Mother's Number"
                    fullWidth
                    name="motherNumber"
                    value={formData.motherNumber}
                    onChange={handleChange}
                  />
                </Grid>
              </Grid>
            )}

            {activeStep === 2 && (
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <TextField
                    label="10th School Name"
                    fullWidth
                    name="schoolName10"
                    value={formData.schoolName10}
                    onChange={handleChange}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <FormControl fullWidth>
                    <InputLabel>10th Board</InputLabel>
                    <Select
                      label="10th Board"
                      name="board10"
                      value={formData.board10}
                      onChange={handleChange}
                    >
                      {boardOptions.map((board, idx) => (
                        <MenuItem key={idx} value={board}>
                          {board}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    label="10th Passing Year"
                    fullWidth
                    name="passingYear10"
                    value={formData.passingYear10}
                    onChange={handleChange}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    label="10th Percentage or CGPA"
                    fullWidth
                    name="percentage10"
                    value={formData.percentage10}
                    onChange={handleChange}
                  />
                </Grid>
              </Grid>
            )}

            {activeStep === 3 && (
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <TextField
                    label="12th School Name"
                    fullWidth
                    name="schoolName12"
                    value={formData.schoolName12}
                    onChange={handleChange}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <FormControl fullWidth>
                    <InputLabel>12th Board</InputLabel>
                    <Select
                      label="12th Board"
                      name="board12"
                      value={formData.board12}
                      onChange={handleChange}
                    >
                      {boardOptions.map((board, idx) => (
                        <MenuItem key={idx} value={board}>
                          {board}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    label="12th Passing Year"
                    fullWidth
                    name="passingYear12"
                    value={formData.passingYear12}
                    onChange={handleChange}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    label="12th Percentage or CGPA"
                    fullWidth
                    name="percentage12"
                    value={formData.percentage12}
                    onChange={handleChange}
                  />
                </Grid>

                <Grid item xs={12} md={12}>
  <Box
    elevation={3}
    sx={{
      p: 3,
      borderRadius: 3,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      gap: 2, // Space between text and buttons
      flexWrap: "nowrap", // Prevent wrapping on large screens
      "@media (max-width: 768px)": {
        flexDirection: "column", // Stack on small screens
        textAlign: "center",
      },
    }}
  >
    {/* Question Text */}
    <Typography
      variant="body2"
      color="textSecondary"
      sx={{ whiteSpace: "nowrap" }} // Prevents text from wrapping
    >
      Do you have graduation details to provide?
    </Typography>

    {/* Radio Buttons */}
    <RadioGroup
      row
      name="isGraduation"
      value={formData.isGraduation ? "yes" : "no"}
      onChange={(e) =>
        setFormData({
          ...formData,
          isGraduation: e.target.value === "yes",
        })
      }
      sx={{
        display: "flex",
        justifyContent: "center",
        gap: 2,
        flexWrap: "nowrap", // Ensures it stays in one row
      }}
    >
      <FormControlLabel
        value="yes"
        control={
          <Radio
            sx={{
              color: "black",
              "&.Mui-checked": { color: "black" },
            }}
          />
        }
        label="Yes"
        sx={{
          border: "1px solid black",
          borderRadius: 2,
          p: 1,
          width: "100px",
          textAlign: "center",
          display: "flex",
          justifyContent: "center",
        }}
      />
      <FormControlLabel
        value="no"
        control={
          <Radio
            sx={{
              color: "black",
              "&.Mui-checked": { color: "black" },
            }}
          />
        }
        label="No"
        sx={{
          border: "1px solid black",
          borderRadius: 2,
          p: 1,
          width: "100px",
          textAlign: "center",
          display: "flex",
          justifyContent: "center",
        }}
      />
    </RadioGroup>
  </Box>
</Grid>


                {formData.isGraduation && (
                  <>
                    {" "}
                    <Grid item xs={12} md={6}>
                      <TextField
                        label="Graduation University"
                        fullWidth
                        name="graduationUniversity"
                        value={formData.graduationUniversity}
                        onChange={handleChange}
                        sx={{ backgroundColor: "#fff", borderRadius: 1 }}
                      />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <TextField
                        label="Graduation Course"
                        fullWidth
                        name="graduationCourse"
                        value={formData.graduationCourse}
                        onChange={handleChange}
                        sx={{ backgroundColor: "#fff", borderRadius: 1 }}
                      />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <TextField
                        label="Graduation Passing Year"
                        fullWidth
                        name="passingYearGraduation"
                        value={formData.passingYearGraduation}
                        onChange={handleChange}
                        sx={{ backgroundColor: "#fff", borderRadius: 1 }}
                      />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <TextField
                        label="Graduation Percentage"
                        fullWidth
                        name="percentageGraduation"
                        value={formData.percentageGraduation}
                        onChange={handleChange}
                        sx={{ backgroundColor: "#fff", borderRadius: 1 }}
                      />
                    </Grid>
                  </>
                )}
              </Grid>
            )}

            <Box
              sx={{ display: "flex", justifyContent: "space-between", mt: 4 }}
            >
              <Button
                disabled={activeStep === 0}
                onClick={handleBack}
                variant="outlined"
                sx={{
                  borderColor: "#333",
                  color: "#333",
                  "&:hover": { backgroundColor: "#333", color: "#fff" },
                }}
              >
                Back
              </Button>
              {activeStep === steps.length - 1 ? (
                <Button
                  onClick={handleSubmit}
                  variant="contained"
                  sx={{
                    backgroundColor: "#333",
                    color: "#fff",
                    "&:hover": { backgroundColor: "#222" },
                  }}
                >
                  Submit
                </Button>
              ) : (
                <Button
                  onClick={handleNext}
                  variant="contained"
                  sx={{
                    backgroundColor: "#333",
                    color: "#fff",
                    "&:hover": { backgroundColor: "#222" },
                  }}
                >
                  Next
                </Button>
              )}
            </Box>
          </form>
        </Box>
      </Box>
    </Container>
  );
};

export default StepForm;
