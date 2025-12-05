import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
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
  Grid,
  Typography,
  Snackbar,
  Alert,
  IconButton,
  Chip,
  OutlinedInput,
  InputAdornment,
  ListSubheader,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Card,
  CardContent,
  Divider,
  FormControlLabel,
} from "@mui/material";
import {
  CloudUpload,
  Add,
  Delete,
  Search,
  ExpandMore,
  CalendarToday,
  School,
  Work,
  AttachMoney,
  Description,
  Highlight,
  ArrowBack
} from "@mui/icons-material";

const collegeCategories = [
  "Default",
  "OnlineEducation",
  "StudyAbroad",
  "vocational-institutes",
  "ScholarshipBasedEducation",
  "government-colleges",
    "Top-B-Schools"

];

const collegeTypes = ["UG", "PG", "Certification/Diploma"];

// Searchable Select Component for large datasets
const SearchableSelect = ({
  label,
  options,
  selectedValues,
  onChange,
  required = false,
  placeholder = "Search...",
  multiple = true
}) => {
  const [searchText, setSearchText] = useState("");

  const filteredOptions = options.filter(option =>
    option.toLowerCase().includes(searchText.toLowerCase())
  );

  const handleSearchChange = (event) => {
    setSearchText(event.target.value);
  };

  return (
    <FormControl fullWidth>
      <InputLabel>{label}{required ? " *" : ""}</InputLabel>
      <Select
        multiple={multiple}
        value={selectedValues}
        onChange={onChange}
        input={<OutlinedInput label={label} />}
        renderValue={(selected) => Array.isArray(selected) ? selected.join(", ") : selected}
        required={required}
        MenuProps={{
          autoFocus: false,
          PaperProps: {
            style: {
              maxHeight: 300,
            },
          },
        }}
      >
        <ListSubheader>
          <TextField
            size="small"
            autoFocus
            placeholder={placeholder}
            fullWidth
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search fontSize="small" />
                </InputAdornment>
              ),
            }}
            onChange={handleSearchChange}
            onKeyDown={(e) => {
              if (e.key !== 'Escape') {
                e.stopPropagation();
              }
            }}
          />
        </ListSubheader>
        
        {filteredOptions.map((option, index) => (
          <MenuItem key={`${option}-${index}`} value={option}>
            {multiple && <Checkbox checked={selectedValues.includes(option)} />}
            <ListItemText primary={option} />
          </MenuItem>
        ))}
        
        {filteredOptions.length === 0 && (
          <MenuItem disabled>
            <ListItemText primary="No options found" />
          </MenuItem>
        )}
      </Select>
    </FormControl>
  );
};

// Course Pricing Component
const CoursePricingSection = ({ courses, coursePricing, setCoursePricing }) => {
  const addCoursePricing = () => {
    setCoursePricing([
      ...coursePricing,
      {
        courseName: "",
        originalFees: "",
        discountedFees: "",
        duration: "",
        eligibility: "",
        seatsAvailable: ""
      }
    ]);
  };

  const updateCoursePricing = (index, field, value) => {
    const updated = [...coursePricing];
    updated[index][field] = value;
    
    // Auto-calculate discount percentage
    if (field === 'originalFees' || field === 'discountedFees') {
      const original = parseFloat(updated[index].originalFees) || 0;
      const discounted = parseFloat(updated[index].discountedFees) || 0;
      if (original > 0 && discounted > 0) {
        updated[index].discountPercentage = Math.round(((original - discounted) / original) * 100);
      }
    }
    
    setCoursePricing(updated);
  };

  const removeCoursePricing = (index) => {
    setCoursePricing(coursePricing.filter((_, i) => i !== index));
  };

  return (
    <Card variant="outlined" sx={{ mb: 2 }}>
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <AttachMoney /> Course Pricing
          </Typography>
          <Button startIcon={<Add />} onClick={addCoursePricing} size="small">
            Add Course Pricing
          </Button>
        </Box>

        {coursePricing.map((course, index) => (
          <Box key={index} sx={{ mb: 3, p: 2, border: '1px solid #e0e0e0', borderRadius: 1 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="subtitle1">Course #{index + 1}</Typography>
              <IconButton 
                size="small" 
                color="error" 
                onClick={() => removeCoursePricing(index)}
              >
                <Delete />
              </IconButton>
            </Box>

            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <FormControl fullWidth size="small">
                  <InputLabel>Course Name</InputLabel>
                  <Select
                    value={course.courseName}
                    onChange={(e) => updateCoursePricing(index, 'courseName', e.target.value)}
                    label="Course Name"
                  >
                    {courses.map((courseName) => (
                      <MenuItem key={courseName} value={courseName}>
                        {courseName}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  label="Duration"
                  value={course.duration}
                  onChange={(e) => updateCoursePricing(index, 'duration', e.target.value)}
                  fullWidth
                  size="small"
                  placeholder="e.g., 3 Years"
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField
                  label="Original Fees (₹)"
                  type="number"
                  value={course.originalFees}
                  onChange={(e) => updateCoursePricing(index, 'originalFees', e.target.value)}
                  fullWidth
                  size="small"
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField
                  label="Discounted Fees (₹)"
                  type="number"
                  value={course.discountedFees}
                  onChange={(e) => updateCoursePricing(index, 'discountedFees', e.target.value)}
                  fullWidth
                  size="small"
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField
                  label="Discount %"
                  value={course.discountPercentage || ''}
                  InputProps={{ readOnly: true }}
                  fullWidth
                  size="small"
                  helperText="Auto-calculated"
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  label="Eligibility"
                  value={course.eligibility}
                  onChange={(e) => updateCoursePricing(index, 'eligibility', e.target.value)}
                  fullWidth
                  size="small"
                  placeholder="e.g., 10+2 with 50% marks"
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  label="Seats Available"
                  type="number"
                  value={course.seatsAvailable}
                  onChange={(e) => updateCoursePricing(index, 'seatsAvailable', e.target.value)}
                  fullWidth
                  size="small"
                />
              </Grid>
            </Grid>
          </Box>
        ))}

        {coursePricing.length === 0 && (
          <Typography variant="body2" color="text.secondary" textAlign="center">
            No course pricing added. Click "Add Course Pricing" to get started.
          </Typography>
        )}
      </CardContent>
    </Card>
  );
};

// Admission Process Component
const AdmissionProcessSection = ({ admissionProcess, setAdmissionProcess }) => {
  const addAdmissionStep = () => {
    setAdmissionProcess([
      ...admissionProcess,
      {
        step: admissionProcess.length + 1,
        title: "",
        description: "",
        duration: ""
      }
    ]);
  };

  const updateAdmissionStep = (index, field, value) => {
    const updated = [...admissionProcess];
    updated[index][field] = value;
    setAdmissionProcess(updated);
  };

  const removeAdmissionStep = (index) => {
    setAdmissionProcess(admissionProcess.filter((_, i) => i !== index));
  };

  return (
    <Card variant="outlined" sx={{ mb: 2 }}>
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <School /> Admission Process
          </Typography>
          <Button startIcon={<Add />} onClick={addAdmissionStep} size="small">
            Add Step
          </Button>
        </Box>

        {admissionProcess.map((step, index) => (
          <Box key={index} sx={{ mb: 2, p: 2, border: '1px solid #e0e0e0', borderRadius: 1 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="subtitle1">Step {step.step}</Typography>
              <IconButton 
                size="small" 
                color="error" 
                onClick={() => removeAdmissionStep(index)}
              >
                <Delete />
              </IconButton>
            </Box>

            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  label="Step Title"
                  value={step.title}
                  onChange={(e) => updateAdmissionStep(index, 'title', e.target.value)}
                  fullWidth
                  size="small"
                  placeholder="e.g., Application Form Submission"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Description"
                  multiline
                  rows={2}
                  value={step.description}
                  onChange={(e) => updateAdmissionStep(index, 'description', e.target.value)}
                  fullWidth
                  size="small"
                  placeholder="Detailed description of this step"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Duration"
                  value={step.duration}
                  onChange={(e) => updateAdmissionStep(index, 'duration', e.target.value)}
                  fullWidth
                  size="small"
                  placeholder="e.g., 1-2 weeks"
                />
              </Grid>
            </Grid>
          </Box>
        ))}

        {admissionProcess.length === 0 && (
          <Typography variant="body2" color="text.secondary" textAlign="center">
            No admission steps added. Click "Add Step" to create the admission process.
          </Typography>
        )}
      </CardContent>
    </Card>
  );
};

// Important Dates Component


// Placement Companies Component
const PlacementCompaniesSection = ({ placementCompanies, setPlacementCompanies }) => {
  const addCompany = () => {
    setPlacementCompanies([
      ...placementCompanies,
      {
        name: "",
        avgPackage: "",
        studentsPlaced: ""
      }
    ]);
  };

  const updateCompany = (index, field, value) => {
    const updated = [...placementCompanies];
    updated[index][field] = value;
    setPlacementCompanies(updated);
  };

  const removeCompany = (index) => {
    setPlacementCompanies(placementCompanies.filter((_, i) => i !== index));
  };

  return (
    <Card variant="outlined" sx={{ mb: 2 }}>
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Work /> Placement Companies
          </Typography>
          <Button startIcon={<Add />} onClick={addCompany} size="small">
            Add Company
          </Button>
        </Box>

        {placementCompanies.map((company, index) => (
          <Box key={index} sx={{ mb: 2, p: 2, border: '1px solid #e0e0e0', borderRadius: 1 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="subtitle1">Company #{index + 1}</Typography>
              <IconButton 
                size="small" 
                color="error" 
                onClick={() => removeCompany(index)}
              >
                <Delete />
              </IconButton>
            </Box>

            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <TextField
                  label="Company Name"
                  value={company.name}
                  onChange={(e) => updateCompany(index, 'name', e.target.value)}
                  fullWidth
                  size="small"
                  placeholder="e.g., Google, Microsoft"
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField
                  label="Average Package (LPA)"
                  type="number"
                  value={company.avgPackage}
                  onChange={(e) => updateCompany(index, 'avgPackage', e.target.value)}
                  fullWidth
                  size="small"
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField
                  label="Students Placed"
                  type="number"
                  value={company.studentsPlaced}
                  onChange={(e) => updateCompany(index, 'studentsPlaced', e.target.value)}
                  fullWidth
                  size="small"
                />
              </Grid>
            </Grid>
          </Box>
        ))}

        {placementCompanies.length === 0 && (
          <Typography variant="body2" color="text.secondary" textAlign="center">
            No companies added. Click "Add Company" to add placement companies.
          </Typography>
        )}
      </CardContent>
    </Card>
  );
};

// Key Highlights Component
const KeyHighlightsSection = ({ keyHighlights, setKeyHighlights }) => {
  const addHighlight = () => {
    setKeyHighlights([
      ...keyHighlights,
      {
        title: "",
        description: ""
      }
    ]);
  };

  const updateHighlight = (index, field, value) => {
    const updated = [...keyHighlights];
    updated[index][field] = value;
    setKeyHighlights(updated);
  };

  const removeHighlight = (index) => {
    setKeyHighlights(keyHighlights.filter((_, i) => i !== index));
  };

  return (
    <Card variant="outlined" sx={{ mb: 2 }}>
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Highlight /> Key Highlights
          </Typography>
          <Button startIcon={<Add />} onClick={addHighlight} size="small">
            Add Highlight
          </Button>
        </Box>

        {keyHighlights.map((highlight, index) => (
          <Box key={index} sx={{ mb: 2, p: 2, border: '1px solid #e0e0e0', borderRadius: 1 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="subtitle1">Highlight #{index + 1}</Typography>
              <IconButton 
                size="small" 
                color="error" 
                onClick={() => removeHighlight(index)}
              >
                <Delete />
              </IconButton>
            </Box>

            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  label="Title"
                  value={highlight.title}
                  onChange={(e) => updateHighlight(index, 'title', e.target.value)}
                  fullWidth
                  size="small"
                  placeholder="e.g., Industry Partnerships"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Description"
                  multiline
                  rows={2}
                  value={highlight.description}
                  onChange={(e) => updateHighlight(index, 'description', e.target.value)}
                  fullWidth
                  size="small"
                  placeholder="Detailed description of this highlight"
                />
              </Grid>
            </Grid>
          </Box>
        ))}

        {keyHighlights.length === 0 && (
          <Typography variant="body2" color="text.secondary" textAlign="center">
            No key highlights added. Click "Add Highlight" to add key features.
          </Typography>
        )}
      </CardContent>
    </Card>
  );
};

// Required Documents Component
const RequiredDocumentsSection = ({ requiredDocuments, setRequiredDocuments }) => {
  const addDocument = () => {
    setRequiredDocuments([
      ...requiredDocuments,
      {
        name: "",
        isRequired: true,
        description: ""
      }
    ]);
  };

  const updateDocument = (index, field, value) => {
    const updated = [...requiredDocuments];
    updated[index][field] = value;
    setRequiredDocuments(updated);
  };

  const removeDocument = (index) => {
    setRequiredDocuments(requiredDocuments.filter((_, i) => i !== index));
  };

  return (
    <Card variant="outlined" sx={{ mb: 2 }}>
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Description /> Required Documents
          </Typography>
          <Button startIcon={<Add />} onClick={addDocument} size="small">
            Add Document
          </Button>
        </Box>

        {requiredDocuments.map((doc, index) => (
          <Box key={index} sx={{ mb: 2, p: 2, border: '1px solid #e0e0e0', borderRadius: 1 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="subtitle1">Document #{index + 1}</Typography>
              <IconButton 
                size="small" 
                color="error" 
                onClick={() => removeDocument(index)}
              >
                <Delete />
              </IconButton>
            </Box>

            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <TextField
                  label="Document Name"
                  value={doc.name}
                  onChange={(e) => updateDocument(index, 'name', e.target.value)}
                  fullWidth
                  size="small"
                  placeholder="e.g., Aadhar Card"
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={doc.isRequired}
                      onChange={(e) => updateDocument(index, 'isRequired', e.target.checked)}
                      color="primary"
                    />
                  }
                  label="Required"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Description"
                  multiline
                  rows={2}
                  value={doc.description}
                  onChange={(e) => updateDocument(index, 'description', e.target.value)}
                  fullWidth
                  size="small"
                  placeholder="Additional details about this document"
                />
              </Grid>
            </Grid>
          </Box>
        ))}

        {requiredDocuments.length === 0 && (
          <Typography variant="body2" color="text.secondary" textAlign="center">
            No documents added. Default documents will be used.
          </Typography>
        )}
      </CardContent>
    </Card>
  );
};

const AddCollegePage = () => {
  const navigate = useNavigate();
  const API_URL = "https://www.collegeforms.in";
  const [newCollege, setNewCollege] = useState({
    name: "",
    location: "",
    description: "",
    shortDescription: "",
    minFees: "",
    maxFees: "",
    avgPackage: "",
    exams: [],
    courses: [],
    collegeType: [],
    specializations: [],
    category: "Default",
    imageFile: null,
    additionalImageFiles: [],
    isTopCollege: false,
    isRequestcallback: false,
    coursePricing: [],
    admissionProcess: [],
    importantDates: [],
    applicationDeadline: "",
    entranceExams: [],
    placementStats: [],
    placementCompanies: [],
    placementHighlights: [],
    keyHighlights: [],
    requiredDocuments: []
  });

  const [rating, setRating] = useState(0);
  const [previewImage, setPreviewImage] = useState(null);
  const [previewAdditionalImages, setPreviewAdditionalImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });
  const [availableCourses, setAvailableCourses] = useState([]);
  const [availableSpecializations, setAvailableSpecializations] = useState([]);
  const [availableExams, setAvailableExams] = useState([]);
  const [newExam, setNewExam] = useState("");

  // State for new sections
  const [coursePricing, setCoursePricing] = useState([]);
  const [admissionProcess, setAdmissionProcess] = useState([]);
  const [importantDates, setImportantDates] = useState([]);
  const [placementCompanies, setPlacementCompanies] = useState([]);
  const [placementHighlights, setPlacementHighlights] = useState([""]);
  const [keyHighlights, setKeyHighlights] = useState([]);
  const [requiredDocuments, setRequiredDocuments] = useState([]);

  useEffect(() => {
    fetchCourses();
    fetchSpecializations();
    fetchExams();
  }, []);

  const fetchCourses = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/courses`);
      setAvailableCourses(response.data);
    } catch (error) {
      console.error("Error fetching courses:", error);
    }
  };

  const fetchSpecializations = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/specializations`);
      setAvailableSpecializations(response.data);
    } catch (error) {
      console.error("Error fetching specializations:", error);
    }
  };

  const fetchExams = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/exams`);
      setAvailableExams(response.data);
    } catch (error) {
      console.error("Error fetching exams:", error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setNewCollege({ 
      ...newCollege, 
      [name]: type === 'checkbox' ? checked : value 
    });
  };

  const handleCoursesChange = (event) => {
    setNewCollege({ ...newCollege, courses: event.target.value });
  };

  const handleCollegeTypeChange = (e) => {
    setNewCollege({ ...newCollege, collegeType: e.target.value });
  };

  const handleExamsChange = (event) => {
    setNewCollege({ ...newCollege, exams: event.target.value });
  };

  const handleSpecializationsChange = (event) => {
    setNewCollege({ ...newCollege, specializations: event.target.value });
  };

  const handleCategoryChange = (e) => {
    setNewCollege({ ...newCollege, category: e.target.value });
  };

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

  const handleAdditionalImagesUpload = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 0) {
      // Limit to maximum 3 additional images
      const filesToUpload = files.slice(0, 3 - previewAdditionalImages.length);
      
      setNewCollege({ 
        ...newCollege, 
        additionalImageFiles: [...newCollege.additionalImageFiles, ...filesToUpload] 
      });

      // Create previews
      filesToUpload.forEach(file => {
        const reader = new FileReader();
        reader.onloadend = () => {
          setPreviewAdditionalImages(prev => [...prev, reader.result]);
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const removeAdditionalImage = (index) => {
    const updatedFiles = [...newCollege.additionalImageFiles];
    const updatedPreviews = [...previewAdditionalImages];
    
    updatedFiles.splice(index, 1);
    updatedPreviews.splice(index, 1);
    
    setNewCollege({ ...newCollege, additionalImageFiles: updatedFiles });
    setPreviewAdditionalImages(updatedPreviews);
  };

  const handleAddNewExam = async () => {
    if (!newExam.trim()) return;
    
    try {
      const response = await axios.post(`${API_URL}/api/exams`, { name: newExam });
      setAvailableExams([...availableExams, response.data]);
      setNewCollege({ 
        ...newCollege, 
        exams: [...newCollege.exams, response.data.name] 
      });
      setNewExam("");
      setSnackbar({ open: true, message: "Exam added successfully!", severity: "success" });
    } catch (error) {
      console.error("Error adding exam:", error);
      setSnackbar({ 
        open: true, 
        message: error.response?.data?.error || "Failed to add exam", 
        severity: "error" 
      });
    }
  };

  const handleDeleteExam = async (examId, examName) => {
    try {
      await axios.delete(`${API_URL}/api/exams/${examId}`);
      setAvailableExams(availableExams.filter(exam => exam._id !== examId));
      
      // Remove from selected exams if it was selected
      if (newCollege.exams.includes(examName)) {
        setNewCollege({
          ...newCollege,
          exams: newCollege.exams.filter(exam => exam !== examName)
        });
      }
      
      setSnackbar({ open: true, message: "Exam deleted successfully!", severity: "success" });
    } catch (error) {
      console.error("Error deleting exam:", error);
      setSnackbar({ 
        open: true, 
        message: "Failed to delete exam", 
        severity: "error" 
      });
    }
  };

  const handlePlacementHighlightChange = (index, value) => {
    const updated = [...placementHighlights];
    updated[index] = value;
    setPlacementHighlights(updated);
  };

  const addPlacementHighlight = () => {
    setPlacementHighlights([...placementHighlights, ""]);
  };

  const removePlacementHighlight = (index) => {
    setPlacementHighlights(placementHighlights.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    // Required field validation
    if (!newCollege.name || !newCollege.location || !newCollege.description || 
        !newCollege.shortDescription || !newCollege.courses.length || 
        !newCollege.specializations.length || !newCollege.imageFile) {
      setSnackbar({ 
        open: true, 
        message: "Please fill all required fields (Name, Location, Short Description, Description, Courses, Specializations, and Main Image).", 
        severity: "error" 
      });
      return;
    }

    const formData = new FormData();
    formData.append("name", newCollege.name);
    formData.append("location", newCollege.location);
    formData.append("description", newCollege.description);
    formData.append("shortDescription", newCollege.shortDescription);
    formData.append("minFees", newCollege.minFees || "0");
    formData.append("maxFees", newCollege.maxFees || "0");
    formData.append("collegeType", JSON.stringify(newCollege.collegeType));
    formData.append("category", newCollege.category);
    formData.append("avgPackage", newCollege.avgPackage || "0");
    formData.append("exams", JSON.stringify(newCollege.exams));
    formData.append("courses", JSON.stringify(newCollege.courses));
    formData.append("specializations", JSON.stringify(newCollege.specializations));
    formData.append("rating", rating.toString());
    formData.append("isTopCollege", newCollege.isTopCollege.toString());
    formData.append("isRequestcallback", newCollege.isRequestcallback.toString());
    
    // Append new fields
    formData.append("coursePricing", JSON.stringify(coursePricing));
    formData.append("admissionProcess", JSON.stringify(admissionProcess));
    formData.append("importantDates", JSON.stringify(importantDates));
    formData.append("applicationDeadline", newCollege.applicationDeadline || "");
    formData.append("entranceExams", JSON.stringify(newCollege.entranceExams || []));
    formData.append("placementCompanies", JSON.stringify(placementCompanies));
    formData.append("placementHighlights", JSON.stringify(placementHighlights.filter(h => h.trim() !== "")));
    formData.append("keyHighlights", JSON.stringify(keyHighlights));
    formData.append("requiredDocuments", JSON.stringify(requiredDocuments));
    
    // Append main image with correct field name 'image'
    if (newCollege.imageFile) {
      formData.append("image", newCollege.imageFile);
    }

    // Append additional images with correct field name 'additionalImages'
    newCollege.additionalImageFiles.forEach((file, index) => {
      formData.append("additionalImages", file);
    });

    try {
      setLoading(true);
      
      const response = await axios.post(`${API_URL}/api/colleges`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      console.log("API Response:", response.data);
      
      if (response.data.success) {
        setSnackbar({ open: true, message: "College added successfully!", severity: "success" });
        
        // Navigate back to colleges list after successful submission
        setTimeout(() => {
          navigate("/admin/colleges");
        }, 1500);
      } else {
        throw new Error(response.data.message || "Failed to save college");
      }
    } catch (error) {
      console.error("Error:", error);
      const errorMessage = error.response?.data?.message || 
                          error.response?.data?.error || 
                          "Failed to save college. Please try again.";
      setSnackbar({
        open: true,
        message: errorMessage,
        severity: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  // Get course names for the searchable select
  const courseNames = availableCourses.map(course => course.name || course);
  const specializationNames = availableSpecializations.map(spec => spec.name || spec);
  const examNames = availableExams.map(exam => exam.name || exam);

  return (
    <Box sx={{ p: 3 }}>
      {/* Header Section */}
      <Box sx={{ mb: 4 }}>
        <Button 
          startIcon={<ArrowBack />} 
          onClick={() => navigate("/admin/colleges")}
          sx={{ mb: 2 }}
        >
          Back to Colleges
        </Button>
        <Typography variant="h4" gutterBottom>
          Add New College
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Fill in the details below to add a new college to the system.
        </Typography>
      </Box>

      <Box component="form" sx={{ maxWidth: '100%' }}>
        {/* Basic Information Accordion */}
        <Accordion defaultExpanded>
          <AccordionSummary expandIcon={<ExpandMore />}>
            <Typography variant="h6">Basic Information</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <TextField
                  label="College Name *"
                  type="text"
                  fullWidth
                  name="name"
                  value={newCollege.name}
                  onChange={handleInputChange}
                  margin="dense"
                  variant="outlined"
                  required
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <FormControl fullWidth margin="dense" required>
                  <InputLabel>Category *</InputLabel>
                  <Select
                    value={newCollege.category}
                    onChange={handleCategoryChange}
                    label="Category"
                  >
                    {collegeCategories.map((category) => (
                      <MenuItem key={category} value={category}>
                        {category}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
            </Grid>

            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <TextField
                  label="Location *"
                  type="text"
                  fullWidth
                  name="location"
                  value={newCollege.location}
                  onChange={handleInputChange}
                  margin="dense"
                  variant="outlined"
                  required
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <SearchableSelect
                  label="Courses *"
                  options={courseNames}
                  selectedValues={newCollege.courses}
                  onChange={handleCoursesChange}
                  required={true}
                  placeholder="Search courses..."
                />
              </Grid>
            </Grid>

            <TextField
              label="Short Description *"
              multiline
              rows={2}
              fullWidth
              name="shortDescription"
              value={newCollege.shortDescription}
              onChange={handleInputChange}
              margin="dense"
              variant="outlined"
              placeholder="Brief description (max 200 characters)"
              inputProps={{ maxLength: 200 }}
              helperText={`${newCollege.shortDescription.length}/200 characters`}
            />

            <TextField
              label="Full Description *"
              multiline
              rows={3}
              fullWidth
              name="description"
              value={newCollege.description}
              onChange={handleInputChange}
              margin="dense"
              variant="outlined"
              placeholder="Detailed description of the college"
            />

            <Grid container spacing={2}>
              <Grid item xs={12} md={4}>
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
              </Grid>
              <Grid item xs={12} md={4}>
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
              </Grid>
              <Grid item xs={12} md={4}>
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
              </Grid>
            </Grid>

            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <SearchableSelect
                  label="Specializations *"
                  options={specializationNames}
                  selectedValues={newCollege.specializations}
                  onChange={handleSpecializationsChange}
                  required={true}
                  placeholder="Search specializations..."
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <SearchableSelect
                  label="College Type"
                  options={collegeTypes}
                  selectedValues={newCollege.collegeType}
                  onChange={handleCollegeTypeChange}
                  required={false}
                  placeholder="Search college types..."
                />
              </Grid>
            </Grid>

            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <SearchableSelect
                  label="Entrance Exams"
                  options={examNames}
                  selectedValues={newCollege.exams}
                  onChange={handleExamsChange}
                  required={false}
                  placeholder="Search exams..."
                />
                
                <Box sx={{ display: 'flex', alignItems: 'center', mt: 1, gap: 1 }}>
                  <TextField
                    size="small"
                    placeholder="Add new exam (optional)"
                    value={newExam}
                    onChange={(e) => setNewExam(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleAddNewExam()}
                    fullWidth
                  />
                  <IconButton 
                    color="primary" 
                    onClick={handleAddNewExam}
                    disabled={!newExam.trim()}
                    sx={{ flexShrink: 0 }}
                  >
                    <Add />
                  </IconButton>
                </Box>
                
                <Box sx={{ mt: 1, maxHeight: 150, overflow: 'auto' }}>
                  {availableExams.map((exam) => (
                    <Chip
                      key={exam._id}
                      label={exam.name}
                      onDelete={() => handleDeleteExam(exam._id, exam.name)}
                      size="small"
                      sx={{ m: 0.5 }}
                      color={newCollege.exams.includes(exam.name) ? "primary" : "default"}
                    />
                  ))}
                </Box>
              </Grid>
              <Grid item xs={12} md={6}>
                <Box sx={{ display: "flex", alignItems: "center", marginTop: 2 }}>
                  <Typography variant="subtitle1" sx={{ mr: 2 }}>Rating:</Typography>
                  <Rating 
                    value={rating} 
                    onChange={(e, newValue) => setRating(newValue)} 
                    precision={0.5} 
                    size="large"
                  />
                </Box>
                
                {/* Main Image Upload */}
                <Box sx={{ mt: 2 }}>
                  <Typography variant="subtitle2" gutterBottom>
                    Main College Image *
                  </Typography>
                  <input
                    accept="image/*"
                    style={{ display: "none" }}
                    id="upload-image"
                    type="file"
                    onChange={handleImageUpload}
                  />
                  <label htmlFor="upload-image">
                    <Button 
                      component="span" 
                      variant="outlined" 
                      color="primary" 
                      startIcon={<CloudUpload />}
                      size="small"
                    >
                      Upload Main Image
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
                        border: "2px solid #ddd",
                        boxShadow: 3,
                        mt: 1
                      }}
                      alt="College Preview"
                    />
                  )}
                </Box>

                {/* Additional Images Upload */}
                <Box sx={{ mt: 2 }}>
                  <Typography variant="subtitle2" gutterBottom>
                    Additional Images (Max 3)
                  </Typography>
                  <input
                    accept="image/*"
                    style={{ display: "none" }}
                    id="upload-additional-images"
                    type="file"
                    multiple
                    onChange={handleAdditionalImagesUpload}
                    disabled={previewAdditionalImages.length >= 3}
                  />
                  <label htmlFor="upload-additional-images">
                    <Button 
                      component="span" 
                      variant="outlined" 
                      color="secondary" 
                      startIcon={<CloudUpload />}
                      size="small"
                      disabled={previewAdditionalImages.length >= 3}
                    >
                      Upload Additional Images ({previewAdditionalImages.length}/3)
                    </Button>
                  </label>
                  
                  <Box sx={{ display: 'flex', gap: 1, mt: 1, flexWrap: 'wrap' }}>
                    {previewAdditionalImages.map((preview, index) => (
                      <Box key={index} sx={{ position: 'relative' }}>
                        <Box
                          component="img"
                          src={preview}
                          sx={{
                            width: "80px",
                            height: "80px",
                            borderRadius: "8px",
                            objectFit: "cover",
                            border: "1px solid #ddd",
                          }}
                          alt={`Additional ${index + 1}`}
                        />
                        <IconButton
                          size="small"
                          color="error"
                          sx={{
                            position: 'absolute',
                            top: -8,
                            right: -8,
                            backgroundColor: 'white',
                            '&:hover': { backgroundColor: 'white' }
                          }}
                          onClick={() => removeAdditionalImage(index)}
                        >
                          <Delete fontSize="small" />
                        </IconButton>
                      </Box>
                    ))}
                  </Box>
                </Box>
              </Grid>
            </Grid>

            {/* Top College Checkbox */}
            <Grid container spacing={2} sx={{ mt: 1 }}>
              <Grid item xs={3}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={newCollege.isTopCollege}
                      onChange={handleInputChange}
                      name="isTopCollege"
                      color="primary"
                    />
                  }
                  label="Mark as Top College"
                />
              </Grid>

  <Grid item xs={3}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={newCollege.isRequestcallback}
                      onChange={handleInputChange}
                      name="isRequestcallback"
                      color="primary"
                    />
                  }
                  label="Request Call back"
                />
              </Grid>


            </Grid>
          </AccordionDetails>
        </Accordion>

        {/* Key Highlights Accordion */}
        <Accordion>
          <AccordionSummary expandIcon={<ExpandMore />}>
            <Typography variant="h6">Key Highlights</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <KeyHighlightsSection 
              keyHighlights={keyHighlights}
              setKeyHighlights={setKeyHighlights}
            />
          </AccordionDetails>
        </Accordion>

        {/* Course Pricing Accordion */}
        <Accordion>
          <AccordionSummary expandIcon={<ExpandMore />}>
            <Typography variant="h6">Course Pricing & Discounts</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <CoursePricingSection 
              courses={newCollege.courses}
              coursePricing={coursePricing}
              setCoursePricing={setCoursePricing}
            />
          </AccordionDetails>
        </Accordion>

        {/* Admission Process Accordion */}
        <Accordion>
          <AccordionSummary expandIcon={<ExpandMore />}>
            <Typography variant="h6">Admission Process & Dates</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <AdmissionProcessSection 
              admissionProcess={admissionProcess}
              setAdmissionProcess={setAdmissionProcess}
            />
            


            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <TextField
                  label="Application Deadline"
                  type="date"
                  fullWidth
                  name="applicationDeadline"
                  value={newCollege.applicationDeadline}
                  onChange={handleInputChange}
                  margin="dense"
                  variant="outlined"
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
            </Grid>
          </AccordionDetails>
        </Accordion>

        {/* Required Documents Accordion */}
        <Accordion>
          <AccordionSummary expandIcon={<ExpandMore />}>
            <Typography variant="h6">Required Documents</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <RequiredDocumentsSection 
              requiredDocuments={requiredDocuments}
              setRequiredDocuments={setRequiredDocuments}
            />
          </AccordionDetails>
        </Accordion>

        {/* Placement Information Accordion */}
        <Accordion>
          <AccordionSummary expandIcon={<ExpandMore />}>
            <Typography variant="h6">Placement Information</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <PlacementCompaniesSection 
              placementCompanies={placementCompanies}
              setPlacementCompanies={setPlacementCompanies}
            />

            <Card variant="outlined" sx={{ mb: 2 }}>
              <CardContent>
                <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                  <Work /> Placement Highlights
                </Typography>
                
                {placementHighlights.map((highlight, index) => (
                  <Box key={index} sx={{ display: 'flex', gap: 1, mb: 1 }}>
                    <TextField
                      label={`Highlight ${index + 1}`}
                      value={highlight}
                      onChange={(e) => handlePlacementHighlightChange(index, e.target.value)}
                      fullWidth
                      size="small"
                      placeholder="e.g., 100+ companies visited campus"
                    />
                    {placementHighlights.length > 1 && (
                      <IconButton 
                        size="small" 
                        color="error" 
                        onClick={() => removePlacementHighlight(index)}
                      >
                        <Delete />
                      </IconButton>
                    )}
                  </Box>
                ))}
                
                <Button startIcon={<Add />} onClick={addPlacementHighlight} size="small">
                  Add Highlight
                </Button>
              </CardContent>
            </Card>
          </AccordionDetails>
        </Accordion>
        
        <Typography variant="caption" sx={{ display: 'block', mt: 2, color: 'text.secondary' }}>
          * indicates required fields
        </Typography>

        {/* Submit Button */}
        <Box sx={{ mt: 4, display: 'flex', gap: 2 }}>
          <Button 
            onClick={() => navigate("/admin/colleges")} 
            color="error" 
            variant="outlined" 
            size="large"
          >
            Cancel
          </Button>
          <Button 
            onClick={handleSubmit} 
            color="primary" 
            variant="contained" 
            disabled={loading}
            size="large"
          >
            {loading ? "Processing..." : "Add College"}
          </Button>
        </Box>
      </Box>

      <Snackbar 
        open={snackbar.open} 
        autoHideDuration={4000} 
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert 
          onClose={() => setSnackbar({ ...snackbar, open: false })} 
          severity={snackbar.severity} 
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default AddCollegePage;