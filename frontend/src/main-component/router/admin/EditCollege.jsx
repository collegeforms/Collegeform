import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { 
  TextField, 
  Button, 
  FormControl, 
  InputLabel, 
  Select, 
  MenuItem, 
  Checkbox, 
  ListItemText, 
  Grid, 
  Typography,
  Box,
  Rating,
  FormControlLabel,
  OutlinedInput,
  InputAdornment,
  ListSubheader,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Card,
  CardContent,
  IconButton,
  Snackbar,
  Alert,
  Chip
} from "@mui/material";
import { 
  Search, 
  ExpandMore, 
  Add, 
  Delete, 
  CalendarToday,
  School,
  Work,
  AttachMoney,
  Description,
  Highlight,
  CloudUpload
} from "@mui/icons-material";

  const API_URL = "https://collegeforms.in";

// Searchable Select Component
const SearchableSelect = ({ 
  label, 
  options, 
  selectedValues, 
  onChange, 
  required = false,
  placeholder = "Search..."
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
      <InputLabel>{label}</InputLabel>
      <Select
        multiple
        value={selectedValues}
        onChange={onChange}
        input={<OutlinedInput label={label} />}
        renderValue={(selected) => selected.join(", ")}
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
                  <Search />
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
            <Checkbox checked={selectedValues.includes(option)} />
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
const ImportantDatesSection = ({ importantDates, setImportantDates }) => {
  const addImportantDate = () => {
    setImportantDates([
      ...importantDates,
      {
        event: "",
        date: "",
        description: ""
      }
    ]);
  };

  const updateImportantDate = (index, field, value) => {
    const updated = [...importantDates];
    updated[index][field] = value;
    setImportantDates(updated);
  };

  const removeImportantDate = (index) => {
    setImportantDates(importantDates.filter((_, i) => i !== index));
  };

  return (
    <Card variant="outlined" sx={{ mb: 2 }}>
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <CalendarToday /> Important Dates
          </Typography>
          <Button startIcon={<Add />} onClick={addImportantDate} size="small">
            Add Date
          </Button>
        </Box>

        {importantDates.map((date, index) => (
          <Box key={index} sx={{ mb: 2, p: 2, border: '1px solid #e0e0e0', borderRadius: 1 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="subtitle1">Date #{index + 1}</Typography>
              <IconButton 
                size="small" 
                color="error" 
                onClick={() => removeImportantDate(index)}
              >
                <Delete />
              </IconButton>
            </Box>

            <Grid container spacing={2}>
              <Grid item xs={12} md={4}>
                <TextField
                  label="Event Name"
                  value={date.event}
                  onChange={(e) => updateImportantDate(index, 'event', e.target.value)}
                  fullWidth
                  size="small"
                  placeholder="e.g., Application Start"
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField
                  label="Date"
                  type="date"
                  value={date.date}
                  onChange={(e) => updateImportantDate(index, 'date', e.target.value)}
                  fullWidth
                  size="small"
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField
                  label="Description"
                  value={date.description}
                  onChange={(e) => updateImportantDate(index, 'description', e.target.value)}
                  fullWidth
                  size="small"
                  placeholder="Additional details"
                />
              </Grid>
            </Grid>
          </Box>
        ))}

        {importantDates.length === 0 && (
          <Typography variant="body2" color="text.secondary" textAlign="center">
            No important dates added. Click "Add Date" to add important events.
          </Typography>
        )}
      </CardContent>
    </Card>
  );
};

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

const EditCollege = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });

  const [college, setCollege] = useState({
    name: "",
    location: "",
    description: "",
    shortDescription: "",
    minFees: "",
    maxFees: "",
    avgPackage: "",
    exams: [],
    courses: [],
    specializations: [],
    rating: 0,
    image: "",
    additionalImages: [],
    imagePublicId: "",
    collegeType: [],
    category: "",
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

  const [availableExams, setAvailableExams] = useState([]);
  const [availableCourses, setAvailableCourses] = useState([]);
  const [availableSpecializations, setAvailableSpecializations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [additionalImageFiles, setAdditionalImageFiles] = useState([]);
  const [previewAdditionalImages, setPreviewAdditionalImages] = useState([]);

  // State for new sections
  const [coursePricing, setCoursePricing] = useState([]);
  const [admissionProcess, setAdmissionProcess] = useState([]);
  const [importantDates, setImportantDates] = useState([]);
  const [placementCompanies, setPlacementCompanies] = useState([]);
  const [placementHighlights, setPlacementHighlights] = useState([""]);
  const [keyHighlights, setKeyHighlights] = useState([]);
  const [requiredDocuments, setRequiredDocuments] = useState([]);

  const categories = [
    "Default",
    "OnlineEducation",
    "OverseasEducation",
    "vocational-institutes",
    "ScholarshipBasedEducation",
    "government-colleges"
  ];

  const collegeTypes = ["UG", "PG", "Certification/Diploma"];

  // Fetch college details by ID
  useEffect(() => {
    fetch(`${API_URL}/api/colleges/id/${id}`)
      .then((res) => res.json())
      .then((data) => {
        console.log("Fetched college data:", data);
        const collegeData = data.college || data;
        
        setCollege({
          ...collegeData,
          exams: collegeData.exams || [],
          courses: collegeData.courses || [],
          specializations: collegeData.specializations || [],
          collegeType: collegeData.collegeType || [],
          category: collegeData.category || "",
          isTopCollege: collegeData.isTopCollege || false,
          isRequestcallback: collegeData.isRequestcallback || false,

          shortDescription: collegeData.shortDescription || "",
          additionalImages: collegeData.additionalImages || [],
          coursePricing: collegeData.coursePricing || [],
          admissionProcess: collegeData.admissionProcess || [],
          importantDates: collegeData.importantDates || [],
          applicationDeadline: collegeData.applicationDeadline || "",
          entranceExams: collegeData.entranceExams || [],
          placementStats: collegeData.placementStats || [],
          placementCompanies: collegeData.placementCompanies || [],
          placementHighlights: collegeData.placementHighlights || [""],
          keyHighlights: collegeData.keyHighlights || [],
          requiredDocuments: collegeData.requiredDocuments || []
        });

        // Set state for new sections
        setCoursePricing(collegeData.coursePricing || []);
        setAdmissionProcess(collegeData.admissionProcess || []);
        setImportantDates(collegeData.importantDates || []);
        setPlacementCompanies(collegeData.placementCompanies || []);
        setPlacementHighlights(collegeData.placementHighlights || [""]);
        setKeyHighlights(collegeData.keyHighlights || []);
        setRequiredDocuments(collegeData.requiredDocuments || []);
        setPreviewAdditionalImages(collegeData.additionalImages || []);
      })
      .catch((err) => console.error("Error fetching college:", err));
  }, [id]);

  // Fetch available options
  useEffect(() => {
    const availableExams = ["JEE", "NEET", "CAT", "GATE", "SAT", "GMAT","MAT","XAT","ATMA","CUET","MHCET","CMAT","NMAT",
      "SNAP","GMAT","NAT","CLAT","NATA",'CEED'
    ];
    setAvailableExams(availableExams);
    
    fetch(`${API_URL}/courses`)
      .then((res) => res.json())
      .then((data) => setAvailableCourses(data.map(course => course.name || course)))
      .catch((err) => console.error("Error fetching courses:", err));

    fetch(`${API_URL}/specializations`)
      .then((res) => res.json())
      .then((data) => setAvailableSpecializations(data.map(spec => spec.name || spec)))
      .catch((err) => console.error("Error fetching specializations:", err));
  }, []);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setCollege((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleArrayChange = (name, value) => {
    setCollege((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleRatingChange = (event, newValue) => {
    setCollege((prev) => ({
      ...prev,
      rating: newValue,
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
    }
  };

  const handleAdditionalImagesUpload = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 0) {
      const filesToUpload = files.slice(0, 3 - previewAdditionalImages.length);
      
      setAdditionalImageFiles(prev => [...prev, ...filesToUpload]);

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
    const updatedFiles = [...additionalImageFiles];
    const updatedPreviews = [...previewAdditionalImages];
    
    updatedFiles.splice(index, 1);
    updatedPreviews.splice(index, 1);
    
    setAdditionalImageFiles(updatedFiles);
    setPreviewAdditionalImages(updatedPreviews);
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
  
    try {
      const formData = new FormData();
      
      // Append all fields to formData
      formData.append("name", college.name);
      formData.append("location", college.location);
      formData.append("description", college.description);
      formData.append("shortDescription", college.shortDescription || "");
      formData.append("minFees", college.minFees || "0");
      formData.append("maxFees", college.maxFees || "0");
      formData.append("avgPackage", college.avgPackage || "0");
      formData.append("rating", college.rating.toString());
      formData.append("category", college.category);
      formData.append("isTopCollege", college.isTopCollege.toString());
      formData.append("isRequestcallback", college.isRequestcallback.toString());

      
      // Append arrays as JSON strings
      formData.append("exams", JSON.stringify(college.exams));
      formData.append("courses", JSON.stringify(college.courses));
      formData.append("specializations", JSON.stringify(college.specializations));
      formData.append("collegeType", JSON.stringify(college.collegeType));
      
      // Append new fields
      formData.append("coursePricing", JSON.stringify(coursePricing));
      formData.append("admissionProcess", JSON.stringify(admissionProcess));
      formData.append("importantDates", JSON.stringify(importantDates));
      formData.append("applicationDeadline", college.applicationDeadline || "");
      formData.append("entranceExams", JSON.stringify(college.entranceExams || []));
      formData.append("placementCompanies", JSON.stringify(placementCompanies));
      formData.append("placementHighlights", JSON.stringify(placementHighlights.filter(h => h.trim() !== "")));
      formData.append("keyHighlights", JSON.stringify(keyHighlights));
      formData.append("requiredDocuments", JSON.stringify(requiredDocuments));
      
      // Append main image file if selected
      if (imageFile) {
        formData.append("image", imageFile);
      }

      // Append additional images
      additionalImageFiles.forEach((file) => {
        formData.append("additionalImages", file);
      });
  
      const response = await fetch(`${API_URL}/api/colleges/${id}`, {
        method: "PUT",
        body: formData
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to update college");
      }

      const result = await response.json();
      console.log("Update response:", result);
  
      setSnackbar({ open: true, message: "College updated successfully!", severity: "success" });
      
      // Navigate after successful update
      setTimeout(() => {
        navigate("/admin/colleges");
      }, 1500);
      
    } catch (error) {
      console.error("Error updating college:", error);
      setSnackbar({ open: true, message: `Error: ${error.message}`, severity: "error" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ p: 3 }} encType="multipart/form-data">
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Typography variant="h4" gutterBottom>Edit College</Typography>
        </Grid>

        {/* Basic Information Accordion */}
        <Grid item xs={12}>
          <Accordion defaultExpanded>
            <AccordionSummary expandIcon={<ExpandMore />}>
              <Typography variant="h6">Basic Information</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <TextField
                    label="College Name"
                    name="name"
                    fullWidth
                    required
                    value={college.name}
                    onChange={handleInputChange}
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <TextField
                    label="Location"
                    name="location"
                    fullWidth
                    required
                    value={college.location}
                    onChange={handleInputChange}
                  />
                </Grid>

                <Grid item xs={12}>
                  <TextField
                    label="Short Description"
                    name="shortDescription"
                    fullWidth
                    multiline
                    rows={2}
                    value={college.shortDescription}
                    onChange={handleInputChange}
                    placeholder="Brief description (max 200 characters)"
                    inputProps={{ maxLength: 200 }}
                    helperText={`${college.shortDescription?.length || 0}/200 characters`}
                  />
                </Grid>

                <Grid item xs={12}>
                  <TextField
                    label="Full Description"
                    name="description"
                    fullWidth
                    multiline
                    rows={4}
                    value={college.description}
                    onChange={handleInputChange}
                  />
                </Grid>

                {/* Category */}
                <Grid item xs={12} md={6}>
                  <FormControl fullWidth>
                    <InputLabel>Category</InputLabel>
                    <Select
                      name="category"
                      value={college.category}
                      onChange={handleInputChange}
                      required
                    >
                      {categories.map((category) => (
                        <MenuItem key={category} value={category}>
                          {category}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>

                {/* Financial Information */}
                <Grid item xs={12} md={4}>
                  <TextField
                    label="Minimum Fees (₹)"
                    name="minFees"
                    type="number"
                    fullWidth
                    value={college.minFees}
                    onChange={handleInputChange}
                  />
                </Grid>

                <Grid item xs={12} md={4}>
                  <TextField
                    label="Maximum Fees (₹)"
                    name="maxFees"
                    type="number"
                    fullWidth
                    value={college.maxFees}
                    onChange={handleInputChange}
                  />
                </Grid>

                <Grid item xs={12} md={4}>
                  <TextField
                    label="Average Package (₹)"
                    name="avgPackage"
                    type="number"
                    fullWidth
                    value={college.avgPackage}
                    onChange={handleInputChange}
                  />
                </Grid>

                {/* Rating */}
                <Grid item xs={12}>
                  <Typography component="legend">Rating</Typography>
                  <Rating
                    name="rating"
                    value={parseFloat(college.rating) || 0}
                    onChange={handleRatingChange}
                    precision={0.5}
                  />
                </Grid>

                {/* College Type */}
                <Grid item xs={12} md={6}>
                  <FormControl fullWidth>
                    <InputLabel>College Type</InputLabel>
                    <Select
                      multiple
                      name="collegeType"
                      value={Array.isArray(college.collegeType) ? college.collegeType : []}
                      onChange={(e) => handleArrayChange("collegeType", e.target.value)}
                      renderValue={(selected) => selected.join(", ")}
                    >
                      {collegeTypes.map((type) => (
                        <MenuItem key={type} value={type}>
                          <Checkbox checked={Array.isArray(college.collegeType) && college.collegeType.includes(type)} />
                          <ListItemText primary={type} />
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>

                {/* Searchable Multi-select Fields */}
                <Grid item xs={12} md={6}>
                  <SearchableSelect
                    label="Courses Offered"
                    options={availableCourses}
                    selectedValues={college.courses}
                    onChange={(e) => handleArrayChange("courses", e.target.value)}
                    required={true}
                    placeholder="Search courses..."
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <SearchableSelect
                    label="Accepted Exams"
                    options={availableExams}
                    selectedValues={college.exams}
                    onChange={(e) => handleArrayChange("exams", e.target.value)}
                    placeholder="Search exams..."
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <SearchableSelect
                    label="Specializations"
                    options={availableSpecializations}
                    selectedValues={college.specializations}
                    onChange={(e) => handleArrayChange("specializations", e.target.value)}
                    required={true}
                    placeholder="Search specializations..."
                  />
                </Grid>

                {/* Top College Checkbox */}
                <Grid item xs={12}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={college.isTopCollege}
                        onChange={handleInputChange}
                        name="isTopCollege"
                        color="primary"
                      />
                    }
                    label="Mark as Top College"
                  />
                </Grid>
                 <Grid item xs={12}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={college.isRequestcallback}
                        onChange={handleInputChange}
                        name="isRequestcallback"
                        color="primary"
                      />
                    }
                    label="Mark As Request Callback"
                  />
                </Grid>

                {/* Main Image Upload */}
                <Grid item xs={12}>
                  <Typography variant="subtitle1" gutterBottom>
                    Main College Image
                  </Typography>
                  <input
                    accept="image/*"
                    type="file"
                    onChange={handleImageChange}
                    style={{ display: 'none' }}
                    id="main-image-upload"
                  />
                  <label htmlFor="main-image-upload">
                    <Button 
                      component="span" 
                      variant="outlined" 
                      startIcon={<CloudUpload />}
                      size="small"
                    >
                      {imageFile ? "Change Main Image" : "Upload Main Image"}
                    </Button>
                  </label>
                  {college.image && !imageFile && (
                    <Box mt={2}>
                      <Typography variant="caption">Current Image:</Typography>
                      <img 
                        src={college.image} 
                        alt="College" 
                        style={{ 
                          maxWidth: '200px', 
                          maxHeight: '200px',
                          display: 'block', 
                          marginTop: '8px',
                          borderRadius: '8px'
                        }}
                      />
                    </Box>
                  )}
                </Grid>

                {/* Additional Images Upload */}
                <Grid item xs={12}>
                  <Typography variant="subtitle1" gutterBottom>
                    Additional Images (Max 3)
                  </Typography>
                  <input
                    accept="image/*"
                    type="file"
                    multiple
                    onChange={handleAdditionalImagesUpload}
                    style={{ display: 'none' }}
                    id="additional-images-upload"
                    disabled={previewAdditionalImages.length >= 3}
                  />
                  <label htmlFor="additional-images-upload">
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
                  
                  <Box sx={{ display: 'flex', gap: 1, mt: 2, flexWrap: 'wrap' }}>
                    {previewAdditionalImages.map((preview, index) => (
                      <Box key={index} sx={{ position: 'relative' }}>
                        <img
                          src={preview}
                          style={{
                            width: "100px",
                            height: "100px",
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
                </Grid>
              </Grid>
            </AccordionDetails>
          </Accordion>
        </Grid>

        {/* Key Highlights Accordion */}
        <Grid item xs={12}>
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
        </Grid>

        {/* Course Pricing Accordion */}
        <Grid item xs={12}>
          <Accordion>
            <AccordionSummary expandIcon={<ExpandMore />}>
              <Typography variant="h6">Course Pricing & Discounts</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <CoursePricingSection 
                courses={college.courses}
                coursePricing={coursePricing}
                setCoursePricing={setCoursePricing}
              />
            </AccordionDetails>
          </Accordion>
        </Grid>

        {/* Admission Process Accordion */}
        <Grid item xs={12}>
          <Accordion>
            <AccordionSummary expandIcon={<ExpandMore />}>
              <Typography variant="h6">Admission Process & Dates</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <AdmissionProcessSection 
                admissionProcess={admissionProcess}
                setAdmissionProcess={setAdmissionProcess}
              />
              
              <ImportantDatesSection 
                importantDates={importantDates}
                setImportantDates={setImportantDates}
              />

              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <TextField
                    label="Application Deadline"
                    type="date"
                    fullWidth
                    name="applicationDeadline"
                    value={college.applicationDeadline}
                    onChange={handleInputChange}
                    InputLabelProps={{ shrink: true }}
                  />
                </Grid>
              </Grid>
            </AccordionDetails>
          </Accordion>
        </Grid>

        {/* Required Documents Accordion */}
        <Grid item xs={12}>
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
        </Grid>

        {/* Placement Information Accordion */}
        <Grid item xs={12}>
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
        </Grid>

        {/* Submit Button */}
        <Grid item xs={12}>
          <Button 
            type="submit" 
            variant="contained" 
            color="primary" 
            size="large"
            disabled={loading}
            sx={{ mt: 2 }}
          >
            {loading ? "Updating..." : "Update College"}
          </Button>
        </Grid>
      </Grid>

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

export default EditCollege;