import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { 
  Slider, 
  CircularProgress, 
  Button, 
  Accordion, 
  AccordionSummary, 
  AccordionDetails, 
  useMediaQuery, 
  useTheme,
  Chip,
  Breadcrumbs,
  Link,
  Typography,
  TextField,
  InputAdornment
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import SearchIcon from "@mui/icons-material/Search";
import ApplyNowModal from "./ApplyNowModal";
import CollegeCard from "./CollegeCard";
import Navbar from "../../../components/Navbar/Navbar";
import Footer from "../../../components/footer/Footer";
import "./filters.css";
import { Helmet } from "react-helmet";
import BannerRow from "./SimpleBannerRow";

const Collegespage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCollege, setSelectedCollege] = useState(null);
  const [colleges, setColleges] = useState([]);
  const [filteredColleges, setFilteredColleges] = useState([]);
  const [visibleColleges, setVisibleColleges] = useState(7);
  const [loading, setLoading] = useState(true);
  const [priceRange, setPriceRange] = useState([0, 40]);
  const [minMaxRange, setMinMaxRange] = useState([0, 40]);
  const [filters, setFilters] = useState({
    courses: "", // Single course selection
    locations: [],
    specialization: [],
    levels: [],
  });
  const [filterOptions, setFilterOptions] = useState({
    courses: [],
    locations: [],
    allSpecializations: [],
    filteredSpecializations: [],
  });
  const [searchTerms, setSearchTerms] = useState({
    courses: "",
    locations: "",
    specialization: "",
  });
  const [cartItems, setCartItems] = useState([]);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const API_URL = "https://collegeforms.in";  

  const { city, collegeType } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const searchParams = new URLSearchParams(location.search);
  const searchTerm = searchParams.get('search');
  
  const courseFilter = searchParams.get('course');
  const specializationFilter = searchParams.get('specialization');
  const preferredCityFilter = searchParams.get('preferredCity');
  const examFilter = searchParams.get('exam');
  const levelFilter = searchParams.get('level');
  const levelTypeFilter = searchParams.get('levelType');

  const handleApplyNowClick = (college) => {
    setSelectedCollege(college);
    setIsModalOpen(true);
  };

  const handleAddToCart = (college, courseName) => {
    if (!filters.courses) {
      alert("Please select a course first to add to cart");
      return;
    }

    const coursePricing = college.coursePricing?.find(course => course.courseName === courseName);
    
    if (!coursePricing) return;

    const cartItem = {
      id: `${college._id}-${courseName}`,
      collegeId: college._id,
      collegeName: college.name,
      collegeLocation: college.location,
      courseName: courseName,
      originalFees: coursePricing.originalFees,
      discountedFees: coursePricing.discountedFees,
      discountPercentage: coursePricing.discountPercentage,
      duration: coursePricing.duration,
      image: college.image
    };

    setCartItems(prev => {
      const existingItemIndex = prev.findIndex(item => item.id === cartItem.id);
      if (existingItemIndex >= 0) {
        const updatedCart = [...prev];
        updatedCart[existingItemIndex] = cartItem;
        return updatedCart;
      } else {
        return [...prev, cartItem];
      }
    });

    alert(`${courseName} at ${college.name} added to cart!`);
  };

  const loadMoreColleges = () => {
    setVisibleColleges(prev => prev + 7);
  };

  const formatPrice = (lakhs) => {
    return `₹${lakhs} Lakh${lakhs !== 1 ? 's' : ''}`;
  };

  const handlePriceChange = (event, newValue) => {
    setPriceRange(newValue);
  };

  const handleFilterChange = (filterType, value) => {
    if (filterType === "courses") {
      // For courses, set single value (toggle behavior)
      const newCourseValue = prev => prev.courses === value ? "" : value;
      setFilters(prev => ({
        ...prev,
        courses: newCourseValue(prev)
      }));
      
      // Update specializations based on selected course
      updateFilteredSpecializations(newCourseValue(filters) ? [newCourseValue(filters)] : []);
    } else {
      // For other filters, keep array behavior
      const newFilters = {
        ...filters,
        [filterType]: filters[filterType].includes(value)
          ? filters[filterType].filter(item => item !== value)
          : [...filters[filterType], value]
      };
      setFilters(newFilters);
    }
  };

  const updateFilteredSpecializations = (selectedCourses) => {
    if (!selectedCourses || selectedCourses.length === 0) {
      setFilterOptions(prev => ({
        ...prev,
        filteredSpecializations: prev.allSpecializations
      }));
      return;
    }

    const newFilteredSpecializations = [];
    filterOptions.courses.forEach(course => {
      if (selectedCourses.includes(course.name) && course.specializations) {
        course.specializations.forEach(spec => {
          const specName = typeof spec === 'object' ? spec.name : spec;
          if (specName && !newFilteredSpecializations.includes(specName)) {
            newFilteredSpecializations.push(specName);
          }
        });
      }
    });

    setFilterOptions(prev => ({
      ...prev,
      filteredSpecializations: newFilteredSpecializations
    }));
  };

  const clearFilters = () => {
    setFilters({
      courses: "", // Reset to empty string
      locations: [],
      specialization: [],
      levels: [],
    });
    setPriceRange([0, 40]);
    setSearchTerms({
      courses: "",
      locations: "",
      specialization: "",
    });
    setFilterOptions(prev => ({
      ...prev,
      filteredSpecializations: prev.allSpecializations
    }));
    navigate(`/colleges${city || ''}/${collegeType || ''}`);
  };

  const clearSearch = () => {
    navigate(`/colleges${city || ''}/${collegeType || ''}`);
  };

  const removeFilter = (filterType, value) => {
    if (filterType === "courses") {
      setFilters(prev => ({
        ...prev,
        courses: ""
      }));
      setFilterOptions(prev => ({
        ...prev,
        filteredSpecializations: prev.allSpecializations
      }));
    } else {
      handleFilterChange(filterType, value);
    }
  };

  const handleSearchChange = (filterType, value) => {
    setSearchTerms(prev => ({
      ...prev,
      [filterType]: value
    }));
  };

  const filterByExam = (colleges) => {
    if (!examFilter) return colleges;
    
    return colleges.filter(college => {
      if (!college.examsAccepted) return false;
      
      const exams = college.examsAccepted.split(',').map(e => e.trim().toLowerCase());
      const examMap = {
        'jee': 'jee',
        'neet': 'neet',
        'cat': 'cat',
        'other': 'other'
      };
      
      const searchExam = examMap[examFilter.toLowerCase()] || examFilter.toLowerCase();
      return exams.some(e => e.includes(searchExam));
    });
  };

  const filterByLevel = (colleges) => {
    if (!levelFilter && !levelTypeFilter) return colleges;
    
    const levelToFilter = levelTypeFilter || levelFilter;
    
    return colleges.filter(college => {
      if (!college.collegeType) return false;
      
      const levels = Array.isArray(college.collegeType) 
        ? college.collegeType 
        : college.collegeType.split(',').map(l => l.trim().toUpperCase());
      
      return levels.includes(levelToFilter.toUpperCase());
    });
  };

  const filterByPreferredCity = (colleges) => {
    if (!preferredCityFilter) return colleges;
    
    return colleges.filter(college => {
      if (!college.location) return false;
      
      const collegeLocation = college.location.toLowerCase();
      const searchLocation = preferredCityFilter.toLowerCase();
      
      return collegeLocation.includes(searchLocation);
    });
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        const [collegesRes, coursesRes] = await Promise.all([
          axios.get(`${API_URL}/api/colleges`),
          axios.get(`${API_URL}/api/courses`)
        ]);

        let collegesData = collegesRes.data;
        console.log(collegesData);
        
        let coursesData = coursesRes.data;

        if (collegeType && collegeType !== "all") {
          collegesData = collegesData.filter(college => 
            college.collegeType?.split(",").includes(collegeType)
          );
          
          coursesData = coursesData.filter(course => 
            course.type === collegeType.toUpperCase()
          );
        }

        if (city && city !== "all") {
          collegesData = collegesData.filter(college => 
            college.location?.toLowerCase() === city.toLowerCase()
          );
        }

        if (courseFilter) {
          setFilters(prev => ({
            ...prev,
            courses: courseFilter
          }));
        }

        if (specializationFilter) {
          setFilters(prev => ({
            ...prev,
            specialization: [specializationFilter]
          }));
        }

        if (preferredCityFilter) {
          setFilters(prev => ({
            ...prev,
            locations: [preferredCityFilter]
          }));
        }

        if (levelFilter || levelTypeFilter) {
          const levelToSet = levelTypeFilter || levelFilter;
          setFilters(prev => ({
            ...prev,
            levels: [levelToSet.toUpperCase()]
          }));
        }

        const fees = collegesData
          .map(college => college.minFees)
          .filter(fee => fee !== undefined && fee !== null && !isNaN(fee));

        if (fees.length > 0) {
          const min = Math.max(0, Math.min(...fees));
          const max = Math.min(40, Math.max(...fees));
          setMinMaxRange([min, max]);
          setPriceRange([min, max]);
        } else {
          setMinMaxRange([0, 40]);
          setPriceRange([0, 40]);
        }

        setColleges(collegesData);
        setFilteredColleges(collegesData);

        const locationsRes = await axios.get(`${API_URL}/api/locations`);
        
        const allSpecializations = [];
        coursesData.forEach(course => {
          if (course.specializations && Array.isArray(course.specializations)) {
            course.specializations.forEach(spec => {
              const specName = typeof spec === 'object' ? spec.name : spec;
              if (specName && !allSpecializations.includes(specName)) {
                allSpecializations.push(specName);
              }
            });
          }
        });

        setFilterOptions({
          courses: coursesData,
          locations: locationsRes.data,
          allSpecializations: allSpecializations,
          filteredSpecializations: allSpecializations,
        });

        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setLoading(false);
      }
    };

    fetchData();
  }, [collegeType, city, courseFilter, specializationFilter, preferredCityFilter, examFilter, levelFilter, levelTypeFilter]);

  useEffect(() => {
    let results = [...colleges];

    results = filterByExam(results);
    results = filterByLevel(results);
    results = filterByPreferredCity(results);

    if (searchTerm) {
      const searchTermLower = searchTerm.toLowerCase();
      results = results.filter(college => {
        const collegeNameMatch = college.name?.toLowerCase().includes(searchTermLower);
        return collegeNameMatch;
      });
    }

    // Updated course filtering for single selection
    if (filters.courses) {
      results = results.filter(college =>
        college.courses?.some(course => course === filters.courses)
      );
    }

    if (filters.locations.length > 0) {
      results = results.filter(college =>
        filters.locations.some(loc => 
          college.location?.toLowerCase().includes(loc.toLowerCase())
        )
      );
    }

    if (filters.specialization.length > 0) {
      results = results.filter(college =>
        college.specializations?.some(spec => {
          const specName = typeof spec === 'object' ? spec.name : spec;
          return filters.specialization.includes(specName);
        })
      );
    }

    if (filters.levels.length > 0) {
      results = results.filter(college => {
        if (!college.collegeType) return false;
        
        const collegeLevels = Array.isArray(college.collegeType) 
          ? college.collegeType 
          : college.collegeType.split(',').map(l => l.trim().toUpperCase());
        
        return filters.levels.some(level => collegeLevels.includes(level));
      });
    }

    results = results.filter(college => {
      const collegeFee = college.minFees || 0;
      return collegeFee >= priceRange[0] && collegeFee <= priceRange[1];
    });

    setFilteredColleges(results);
  }, [filters, colleges, priceRange, searchTerm, examFilter, levelFilter, levelTypeFilter, preferredCityFilter]);

  const renderCheckboxes = (type) => {
    let items = [];
    
    if (type === "specialization") {
      items = filterOptions.filteredSpecializations;
    } else {
      items = filterOptions[type] || [];
    }
    
    const filteredItems = items.filter(item => {
      const itemName = (item.name || item).replace(/\./g, '');
      const searchTerm = searchTerms[type].replace(/\./g, '');
      return itemName.toLowerCase().includes(searchTerm.toLowerCase());
    });

    filteredItems.sort((a, b) => {
      const aName = (a.name || a).replace(/\./g, '');
      const bName = (b.name || b).replace(/\./g, '');
      const searchTerm = searchTerms[type].replace(/\./g, '');

      const aStartsWith = aName.toLowerCase().startsWith(searchTerm.toLowerCase());
      const bStartsWith = bName.toLowerCase().startsWith(searchTerm.toLowerCase());

      if (aStartsWith && !bStartsWith) return -1;
      if (!aStartsWith && bStartsWith) return 1;
      return aName.localeCompare(bName);
    });

    return filteredItems.map((item) => {
      const itemName = item.name || item;
      if (!itemName) return null;

      // For courses, use radio button behavior (single selection)
      if (type === "courses") {
        return (
          <div className="col-12" key={item._id || itemName}>
            <div className="form-check">
              <input
                className="form-check-input"
                id={`${type}-${itemName}`}
                type="radio" // Changed to radio for single selection
                name="course-selection" // Same name for radio group
                checked={filters.courses === itemName}
                onChange={() => handleFilterChange(type, itemName)}
              />
              <label className="form-check-label pt-1" htmlFor={`${type}-${itemName}`}>
                {itemName}
              </label>
            </div>
          </div>
        );
      } else {
        // For other filters, keep checkbox behavior
        return (
          <div className="col-12" key={item._id || itemName}>
            <div className="form-check">
              <input
                className="form-check-input"
                id={`${type}-${itemName}`}
                type="checkbox"
                checked={filters[type].includes(itemName)}
                onChange={() => handleFilterChange(type, itemName)}
              />
              <label className="form-check-label pt-1" htmlFor={`${type}-${itemName}`}>
                {itemName}
              </label>
            </div>
          </div>
        );
      }
    }).filter(Boolean);
  };

  const getActiveFiltersCount = () => {
    let count = 0;
    if (priceRange[0] !== minMaxRange[0] || priceRange[1] !== minMaxRange[1]) count++;
    count += (filters.courses ? 1 : 0) + filters.locations.length + filters.specialization.length + filters.levels.length;
    return count;
  };

  return (
    <><Helmet>
      <title>Top Colleges in India – Compare & Apply | College Search Made Easy</title>
      <meta name="description" content="Find the best colleges across India for BBA, MBA, PGDM, and more. Use our college finder, explore college lists, and apply with discounts and scholarships on tuition fees." />
      <meta name="keywords" content="top colleges list, BBA MBA colleges, college finder tool, best PGDM institutes, compare colleges India, admission application help, common application form, universal form" />
      
      <meta property="og:type" content="website" />
      <meta property="og:url" content="https://www.collegeforms.in/colleges" />
      <meta property="og:title" content="Top Colleges in India – Compare & Apply | College Search Made Easy" />
      <meta property="og:description" content="Find and compare top colleges for BBA, MBA, PGDM in India. Apply with discounts using our universal application form." />
      <meta property="og:image" content="https://www.collegeforms.in/images/college-guidance-og.jpg" />
      
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content="https://www.collegeforms.in/colleges" />
      <meta name="twitter:title" content="Top Colleges in India – Compare & Apply | College Search Made Easy" />
      <meta name="twitter:description" content="Use our college finder to discover and apply to top BBA, MBA, PGDM colleges in India with exclusive discounts." />
      <meta name="twitter:image" content="https://www.collegeforms.in/images/college-guidance-twitter.jpg" />
      
      <link rel="canonical" href="https://www.collegeforms.in/colleges" />
    </Helmet>

      <Navbar />
<BannerRow category={'Default'} />
      <div  className="colleges-page">
        <div className="container">
          <div className="breadcrumb-section mb-4">
            <Breadcrumbs aria-label="breadcrumb" className="py-3">
              <Link color="inherit" href="/">
                Home
              </Link>
              <Link color="inherit" href="/colleges">
                Colleges
              </Link>
              {city && city !== "all" && (
                <Link color="inherit" href={`/colleges/${city}`}>
                  {city.charAt(0).toUpperCase() + city.slice(1)}
                </Link>
              )}
              {collegeType && collegeType !== "all" && (
                <Typography color="textPrimary">
                  {collegeType.toUpperCase()}
                </Typography>
              )}
            </Breadcrumbs>
            <Typography variant="h5" component="h1" className="mb-2">
              {collegeType ? `${collegeType.toUpperCase()} Colleges` : "All Colleges"}
              {city && city !== "all" && ` in ${city.charAt(0).toUpperCase() + city.slice(1)}`}
              {preferredCityFilter && ` near ${preferredCityFilter}`}
              {levelFilter && ` (${levelFilter.toUpperCase()})`}
            </Typography>
            <Typography variant="subtitle1" color="textSecondary">
              List of Top Colleges based on 2024 Ranking
            </Typography>
          </div>

          <div className="row">
            <div className="col-md-3">
              <div className="px-0 pb-2 rounded-2 " >
                <Accordion 
                  className="d-none"
                  defaultExpanded={!isMobile}
                  sx={{ mb: 2, borderRadius: 3, boxShadow: 3 }}
                >
                  <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <div className="d-flex justify-content-between w-100">
                      <h6 className="mt-3">Level</h6>
                    </div>
                  </AccordionSummary>
                  <AccordionDetails>
                    <div className="row">
                      <div className="col-12">
                        <div className="form-check">
                          <input
                            className="form-check-input"
                            id="level-ug"
                            type="checkbox"
                            checked={filters.levels.includes("UG")}
                            onChange={() => handleFilterChange("levels", "UG")}
                          />
                          <label className="form-check-label pt-1" htmlFor="level-ug">
                            Undergraduate (UG)
                          </label>
                        </div>
                      </div>
                      <div className="col-12">
                        <div className="form-check">
                          <input
                            className="form-check-input"
                            id="level-pg"
                            type="checkbox"
                            checked={filters.levels.includes("PG")}
                            onChange={() => handleFilterChange("levels", "PG")}
                          />
                          <label className="form-check-label pt-1" htmlFor="level-pg">
                            Postgraduate (PG)
                          </label>
                        </div>
                      </div>
                    </div>
                  </AccordionDetails>
                </Accordion>

                <Accordion 
                  defaultExpanded={!isMobile}
                  sx={{ mb: 2, borderRadius: 3, boxShadow: 3 }}
                >
                  <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <div className="d-flex justify-content-between w-100">
                      <h6 className="mt-3">Location</h6>
                    </div>
                  </AccordionSummary>
                  <AccordionDetails>
                    <TextField
                      fullWidth
                      size="small"
                      placeholder="Search locations..."
                      value={searchTerms.locations}
                      onChange={(e) => handleSearchChange("locations", e.target.value)}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <SearchIcon fontSize="small" />
                          </InputAdornment>
                        ),
                      }}
                      sx={{ mb: 2 }}
                    />
                    <div className="row" style={{ maxHeight: 300, overflowY: "auto" }}>
                      {renderCheckboxes("locations")}
                    </div>
                  </AccordionDetails>
                </Accordion>

                <Accordion 
                  defaultExpanded={!isMobile}
                  sx={{ mb: 2, borderRadius: 3, boxShadow: 3 }}
                >
                  <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <div className="d-flex justify-content-between w-100">
                      <h6 className="pt-2">Course</h6>
                    </div>
                  </AccordionSummary>
                  <AccordionDetails>
                    <TextField
                      fullWidth
                      size="small"
                      placeholder="Search courses..."
                      value={searchTerms.courses}
                      onChange={(e) => handleSearchChange("courses", e.target.value)}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <SearchIcon fontSize="small" />
                          </InputAdornment>
                        ),
                      }}
                      sx={{ mb: 2 }}
                    />
                    <div className="row" style={{ maxHeight: 300, overflowY: "auto" }}>
                      {renderCheckboxes("courses")}
                    </div>
                  </AccordionDetails>
                </Accordion>

                <Accordion 
                  defaultExpanded={!isMobile}
                  sx={{ mb: 2, borderRadius: 3, boxShadow: 3 }}
                >
                  <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <div className="d-flex justify-content-between w-100">
                      <h6 className="mt-3">Specialization</h6>
                    </div>
                  </AccordionSummary>
                  <AccordionDetails>
                    <TextField
                      fullWidth
                      size="small"
                      placeholder="Search specializations..."
                      value={searchTerms.specialization}
                      onChange={(e) => handleSearchChange("specialization", e.target.value)}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <SearchIcon fontSize="small" />
                          </InputAdornment>
                        ),
                      }}
                      sx={{ mb: 2 }}
                    />
                    <div className="row" style={{ maxHeight: 300, overflowY: "auto" }}>
                      {renderCheckboxes("specialization")}
                    </div>
                  </AccordionDetails>
                </Accordion>

                <Accordion 
                  defaultExpanded={!isMobile}
                  sx={{ mb: 2, borderRadius: 3, boxShadow: 3 }}
                >
                  <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <h6 className="mt-3">Fees Range (in Lakhs)</h6>
                  </AccordionSummary>
                  <AccordionDetails>
                    <div className="px-3">
                      <Slider
                        value={priceRange}
                        onChange={handlePriceChange}
                        valueLabelDisplay="auto"
                        min={minMaxRange[0]}
                        max={minMaxRange[1]}
                        step={0.5}
                        marks={[
                          { value: minMaxRange[0], label: formatPrice(minMaxRange[0]) },
                          { value: minMaxRange[1], label: formatPrice(minMaxRange[1]) }
                        ]}
                        sx={{
                          color: '#1976d2',
                          height: 8,
                          '& .MuiSlider-thumb': {
                            height: 24,
                            width: 24,
                            backgroundColor: '#fff',
                            border: '2px solid currentColor',
                          },
                          '& .MuiSlider-valueLabel': {
                            backgroundColor: '#1976d2',
                            borderRadius: '4px',
                            '&:before': {
                              display: 'none',
                            },
                          },
                        }}
                      />
                      <div className="d-flex justify-content-between mt-2">
                        <small>{formatPrice(priceRange[0])}</small>
                        <small>{formatPrice(priceRange[1])}</small>
                      </div>
                    </div>
                  </AccordionDetails>
                </Accordion>

                <Button
                  variant="contained"
                  color="error"
                  fullWidth
                  className="mt-3"
                  onClick={clearFilters}
                  sx={{
                    fontWeight: 'bold',
                    textTransform: 'uppercase'
                  }}
                >
                  Clear All Filters
                </Button>
              </div>
            </div>

            <div className="col-md-9">
              <div className="d-flex align-items-center mb-4">
                <p style={{ fontWeight: '500', fontSize: '1.1rem', margin: 0, display: "flex", flexDirection: "column", alignItems: "flex-start" }}>
                  {searchTerm 
                    ? `Found ${filteredColleges.length} colleges matching "${searchTerm}"`
                    : `Found ${filteredColleges.length} colleges`}

                  {getActiveFiltersCount() > 0 && (
                    <div className="active-filters mt-2">
                      <div className="d-flex flex-wrap align-items-center">
                        {filters.courses && (
                          <Chip
                            key={`course-${filters.courses}`}
                            label={filters.courses}
                            onDelete={() => removeFilter("courses", filters.courses)}
                            color="primary"
                            size="small"
                            className="me-2 mb-2"
                          />
                        )}
                        {filters.levels.map(level => (
                          <Chip
                            key={`level-${level}`}
                            label={level}
                            onDelete={() => removeFilter("levels", level)}
                            color="primary"
                            size="small"
                            className="me-2 mb-2"
                          />
                        ))}
                        {filters.locations.map(location => (
                          <Chip
                            key={`location-${location}`}
                            label={location}
                            onDelete={() => removeFilter("locations", location)}
                            color="primary"
                            size="small"
                            className="me-2 mb-2"
                          />
                        ))}
                        {filters.specialization.map(spec => (
                          <Chip
                            key={`spec-${spec}`}
                            label={spec}
                            onDelete={() => removeFilter("specialization", spec)}
                            color="primary"
                            size="small"
                            className="me-2 mb-2"
                          />
                        ))}
                        {(priceRange[0] !== minMaxRange[0] || priceRange[1] !== minMaxRange[1]) && (
                          <Chip
                            label={`Price: ${formatPrice(priceRange[0])} - ${formatPrice(priceRange[1])}`}
                            onDelete={() => setPriceRange([0, 40])}
                            color="primary"
                            size="small"
                            className="me-2 mb-2"
                          />
                        )}
                        <Button
                          variant="text"
                          size="small"
                          onClick={clearFilters}
                          className="mb-2"
                        >
                          Clear All
                        </Button>
                      </div>
                    </div>
                  )}
                </p>
                {searchTerm && (
                  <Button 
                    variant="outlined" 
                    size="small" 
                    onClick={clearSearch}
                    sx={{ ml: 2 }}
                  >
                    Clear Search
                  </Button>
                )}
              </div>

              {loading ? (
                <div className="text-center py-5">
                  <CircularProgress />
                </div>
              ) : (
                <>
                  {filteredColleges.length === 0 ? (
                    <div className="text-center py-5">
                      <h5>No colleges found matching your criteria</h5>
                      <Button 
                        variant="contained" 
                        onClick={clearFilters}
                        className="mt-3"
                      >
                        Clear Filters
                      </Button>
                    </div>
                  ) : (
                    <>
                      {filteredColleges.slice(0, visibleColleges).map((college) => (
                        <CollegeCard 
                          key={college._id} 
                          college={college} 
                          onApplyClick={handleApplyNowClick}
                          onAddToCart={(courseName) => handleAddToCart(college, courseName)}
                          selectedCourse={filters.courses} // Pass selected course to CollegeCard
                        />
                      ))}

                      {filteredColleges.length > visibleColleges && (
                        <div className="row justify-content-center mt-4">
                          <div className="col-md-3 mb-5">
                            <Button
                              variant="contained"
                              fullWidth
                              onClick={loadMoreColleges}
                              sx={{
                                backgroundColor: '#1976d2',
                                '&:hover': {
                                  backgroundColor: '#1565c0'
                                }
                              }}
                            >
                              Load More
                            </Button>
                          </div>
                        </div>
                      )}
                    </>
                  )}
                </>
              )}
            </div>
          </div>
        </div>

        {selectedCollege && (
          <ApplyNowModal
            open={isModalOpen}
            handleClose={() => setIsModalOpen(false)}
            collegeName={selectedCollege.name}
            collegeLocation={selectedCollege.location}
          />
        )}
      </div>

      <Footer />
    </>
  );
};

export default Collegespage;