import React, { useState, useEffect } from "react";
import axios from "axios";
import Header from "./Header";
import Sticky from "react-stickynode";
import { useParams } from "react-router-dom";
import ApplyNowModal from "./ApplyNowModal";
import "./filters.css";
import BreadcrumbWithBg from "./BreadcrumbWithBg";
import CollegeCard from "./CollegeCard";
import { Accordion, AccordionSummary, AccordionDetails, FormControlLabel, Checkbox, Button, useMediaQuery, useTheme } from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Navbar from "../../components/Navbar/Navbar";
const Collegespage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCollege, setSelectedCollege] = useState(null);
  const [colleges, setColleges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    courses: [],
    locations: [],
    specialization: [],
    range: [],
  });

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm")); // 'sm' breakpoint for mobile view


  const handleApplyNowClick = (college) => {
    setSelectedCollege(college);
    setIsModalOpen(true);
  };
  const [filterOptions, setFilterOptions] = useState({
    courses: [],
    locations: [],
    specialization: [],
    range: [],
  });

  const [filteredColleges, setFilteredColleges] = useState([]);
  const { city } = useParams();

  useEffect(() => {
    if (city) {
      setFilters((prevFilters) => ({
        ...prevFilters,
        locations: [city],
      }));
    } else {
      setFilters((prevFilters) => ({
        ...prevFilters,
        locations: [],
      }));
    }
  }, [city]);

  useEffect(() => {
    const fetchFilterOptions = async () => {
      try {
        const coursesResponse = await axios.get(
          "https://www.collegeforms.in/courses"
        );
        const locationsResponse = await axios.get(
          "https://www.collegeforms.in/locations"
        );
        const specializationResponse = await axios.get(
          "https://www.collegeforms.in/specializations"
        );
        const rangeResponse = await axios.get(
          "https://www.collegeforms.in/priceRanges"
        );

        setFilterOptions({
          courses: coursesResponse.data,
          locations: locationsResponse.data,
          specialization: specializationResponse.data,
          range: rangeResponse.data,
        });
      } catch (error) {
        console.error("Error fetching filter options:", error);
      }
    };

    fetchFilterOptions();
  }, []);

  useEffect(() => {
    axios
      .get("https://www.collegeforms.in/api/colleges")
      .then((response) => {
        setColleges(response.data);
        setFilteredColleges(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching colleges:", error);
        setLoading(false);
      });
  }, []);

  const handleFilterChange = (filterType, value) => {
    setFilters((prevFilters) => {
      const updatedFilters = { ...prevFilters };

      if (filterType === "range") {
        const exists = updatedFilters.range.some(
          (r) => r.min === value.min && r.max === value.max
        );

        if (exists) {
          updatedFilters.range = updatedFilters.range.filter(
            (r) => !(r.min === value.min && r.max === value.max)
          );
        } else {
          updatedFilters.range = [...updatedFilters.range, value];
        }
      } else {
        if (updatedFilters[filterType].includes(value)) {
          updatedFilters[filterType] = updatedFilters[filterType].filter(
            (item) => item !== value
          );
        } else {
          updatedFilters[filterType] = [...updatedFilters[filterType], value];
        }
      }

      return updatedFilters;
    });
  };

  const clearFilters = () => {
    setFilters({
      courses: [],
      locations: [],
      specialization: [],
      range: [],
    });
    setFilteredColleges(colleges);
  };

  useEffect(() => {
    let filtered = colleges;

    if (filters.courses.length > 0) {
      filtered = filtered.filter((college) =>
        college.courses.some((course) => filters.courses.includes(course))
      );
    }

    if (filters.locations.length > 0) {
      filtered = filtered.filter((college) =>
        filters.locations.includes(college.location)
      );
    }

    if (filters.specialization.length > 0) {
      filtered = filtered.filter((college) =>
        college.specializations.some((spec) =>
          filters.specialization.includes(spec)
        )
      );
    }

    if (filters.range.length > 0) {
      filtered = filtered.filter((college) => {
        const { min, max } = filters.range[0];
        return college.minFees >= min && college.maxFees <= max;
      });
    }

    setFilteredColleges(filtered);
  }, [filters, colleges]);

  const renderCheckboxes = (type) => {
    return filterOptions[type].map((item) => (
      <div className="col-12" key={item._id || item}>
        <div className="form-check">
          <input
            className="form-check-input"
            id={item.name}
            type="checkbox"
            value={item.name || item}
            checked={filters[type].includes(item.name || item)}
            onChange={() => handleFilterChange(type, item.name || item)}
          />
          <label className="form-check-label pt-1" htmlFor={item.name}>
            {item.name || item}
          </label>
        </div>
      </div>
    ));
  };

  return (
    <div>
      <Navbar />
      <BreadcrumbWithBg
        title="Explore Top Colleges"
        backgroundImage="https://img.freepik.com/free-vector/outline-graduation-cap-with-book-pencil-with-paintbrush-background_24640-45259.jpg?t=st=1739867929~exp=1739871529~hmac=c31c0e3b00df9bd2a2cb49b7c1df2e295915a2a0601ca73ff12b80eb03aefc82&w=740"
      />
      <div style={{ backgroundColor: "#F4F4F7" }}>
        <div className="container">
          <div className="bread">
      
            <h1 className="header-title pt-4 pb-3 ">
              List of Top Colleges In {city && city} , based on 2024 Ranking
            </h1>
          </div>
        </div>
        <div className="container pt-2">
          <div className="row">
          <div className="col-md-3">
      <div className=" px-0 pb-2 rounded-2 ">
        {/* Course Section */}
        <Accordion 
        sx={{ 
marginBottom:1,
          borderRadius: 3,
          boxShadow: '0px 6px 9px rgba(0, 0, 0, 0.1)',

        }}
        defaultExpanded={!isMobile}>
          <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls="course-content" id="course-header">
            <h6 className="pt-2">Course</h6>
          </AccordionSummary>
          <AccordionDetails sx={{ maxHeight: 300, overflowY: "auto", scrollbarWidth: "thin", msOverflowStyle: "none" }}>
            <div>{renderCheckboxes("courses")}</div>
          </AccordionDetails>
        </Accordion>

        {/* Location Section */}
        <Accordion 
           sx={{ 
            marginBottom:1,

            borderRadius: 3,
            boxShadow: '0px 6px 9px rgba(0, 0, 0, 0.1)',
  
          }} defaultExpanded={!isMobile}>
          <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls="location-content" id="location-header">
            <h6 className="mt-3">Location</h6>
          </AccordionSummary>
          <AccordionDetails sx={{ maxHeight: 300, overflowY: "auto", scrollbarWidth: "thin", msOverflowStyle: "none" }}>
            <div>{renderCheckboxes("locations")}</div>
          </AccordionDetails>
        </Accordion>

        {/* Specialization Section */}
        <Accordion 
            sx={{ 
              marginBottom:1,

              borderRadius: 3,
              boxShadow: '0px 6px 9px rgba(0, 0, 0, 0.1)',
    
            }} defaultExpanded={!isMobile}>
          <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls="specialization-content" id="specialization-header">
            <h6 className="mt-3">Specialization</h6>
          </AccordionSummary>
          <AccordionDetails sx={{ maxHeight: 300, overflowY: "auto", scrollbarWidth: "thin", msOverflowStyle: "none" }}>
            <div className="row">{renderCheckboxes("specialization")}</div>
          </AccordionDetails>
        </Accordion>

        {/* Price Range Section */}
        <Accordion 
        
        sx={{ 
          marginBottom:1,

          borderRadius: 3,
          boxShadow: '0px 6px 9px rgba(0, 0, 0, 0.1)',

        }}
        defaultExpanded={!isMobile}>
          <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls="price-range-content" id="price-range-header">
            <h6 className="mt-3">Price Range</h6>
          </AccordionSummary>
          <AccordionDetails sx={{ maxHeight: 300, overflowY: "auto", scrollbarWidth: "thin", msOverflowStyle: "none" }}>
            <div className="row">
              {filterOptions.range.map((range, index) => (
                <div className="col-12" key={index}>
                  <div className="form-check">
                    <input
                      className="form-check-input"
                      id={`range-${index}`}
                      type="checkbox"
                      value={range}
                      checked={filters.range.some(
                        (r) =>
                          r.min === range.min && r.max === range.max
                      )}
                      onChange={() => handleFilterChange("range", range)}
                    />
                    <label
                      className="form-check-label w-100 pt-1"
                      htmlFor={`range-${index}`}
                    >
                      ₹{range.min} - ₹{range.max}
                    </label>
                  </div>
                </div>
              ))}
            </div>
          </AccordionDetails>
        </Accordion>

        {/* Clear Filters Button */}
        <Button
          variant="contained"
          color="error"
          fullWidth
          className="mt-3"
          onClick={clearFilters}
        >
          Clear all filters
        </Button>
      </div>
    </div>

            <div className="col-md-9">
              <p>Top colleges</p>

              {loading ? (
                <div>Loading...</div>
              ) : (
                filteredColleges.map((college) => (
                  <CollegeCard key={college.id} college={college} onApplyClick={handleApplyNowClick} />
                ))
          
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
    </div>
  );
};

export default Collegespage;
