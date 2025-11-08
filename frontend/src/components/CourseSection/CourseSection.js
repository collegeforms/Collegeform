import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { FiStar, FiChevronRight, FiChevronDown } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";

const ClickHandler = () => {
  window.scrollTo(10, 0);
};

const CourseSection = (props) => {
  const [colleges, setColleges] = useState([]);
  const [courses, setCourses] = useState([]);
  const [activeTab, setActiveTab] = useState("All");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedCards, setExpandedCards] = useState({});
 const API_URL = "https://collegeforms.in";  
  const navigate = useNavigate();

  const toggleExpand = (id) => {
    setExpandedCards(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const onsendClick = (college) => {
    const userToken = localStorage.getItem("userToken");
    if (userToken) {
      navigate("/step", { state: { college } });
    } else {
      navigate("/user/signup");
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [collegesRes, coursesRes] = await Promise.all([
          axios.get(`${API_URL}/api/colleges`),
          axios.get(`${API_URL}/api/courses`)
        ]);
        
        console.log(collegesRes);
        
        // Process colleges data - filter for isTopCollege = true and category = "Default" or not available
        const processedColleges = collegesRes.data
          .filter(college => 
            college.isTopCollege === true && 
            (college.category === "Default" || !college.category || college.category === "")
          )
          .map(college => ({
            ...college,
            courses: Array.isArray(college.courses) 
              ? college.courses.map(c => typeof c === 'object' ? c.name : c)
              : []
          }));
        
        setColleges(processedColleges);
        
        // Process courses data
        const popularCourses = [
          "BCA", "B.Tech", "B.Com", "M.Com", "MBA", 
          "PGDM", "BA", "MA", "B.Des", "BBA", "MCA", 
          "M.Tech", "B.Sc", "M.Sc", "B.Arch"
        ];
        
        const apiCourses = coursesRes.data.map(course => 
          typeof course === 'object' ? course.name : course
        );
        
        const allCourses = [...new Set([...popularCourses, ...apiCourses])];
        setCourses(allCourses);
        setLoading(false);
      } catch (err) {
        setError("Failed to load data.");
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const filteredColleges = activeTab === "All" 
    ? colleges.slice(0, 9)
    : colleges.filter(college => 
        college.courses?.some(course => course === activeTab)
      ).slice(0, 9);

  const formatFees = (min, max) => {
    return `${min?.toLocaleString("en-IN") || 'N/A'} - ${max?.toLocaleString("en-IN") || 'N/A'} Lakh`;
  };

  if (loading) return (
    <div className="text-center py-5">
      <div className="spinner-border text-primary" role="status">
        <span className="visually-hidden">Loading...</span>
      </div>
    </div>
  );

  if (error) return <div className="alert alert-danger">{error}</div>;

  return (
<div className={`popular-colleges-section ${props.pClass}`}>
  <div className="container">
    <div className="section-header text-left mb-1">
      <h3 className="display-5 fw-bold">Explore Top Colleges</h3>
      <p className="text-muted">Find the best institutions for your preferred course</p>
    </div>

    {/* Enhanced Animated Tabs */}
    <div className="custom-tabs-container mb-4">
      <div className="custom-tabs-scroller">
        <motion.div className="custom-tabs" layout>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`custom-tab ${activeTab === "All" ? "active" : ""}`}
            onClick={() => setActiveTab("All")}
          >
            All Courses
          </motion.button>
          {courses.slice(0, 13).map((course) => (
            <motion.button
              key={course}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`custom-tab ${activeTab === course ? "active" : ""}`}
              onClick={() => setActiveTab(course)}
            >
              {course}
            </motion.button>
          ))}
          {courses.length > 8 && (
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link
                to="/colleges"
                className="custom-tab more-courses"
                onClick={ClickHandler}
              >
                More <FiChevronDown className="ms-1" />
              </Link>
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>

    {/* Animated College Cards */}
    <AnimatePresence mode="wait">
      <motion.div
        className="row g-4"
        key={activeTab}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
      >
        {filteredColleges.length > 0 ? (
          filteredColleges.map((college) => (
            <motion.div
              className="col-lg-4 col-md-6"
              key={college._id}
              layout
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="college-card card border border-1 h-100 border-0 shadow-sm">
                <div className="card-img-top position-relative overflow-hidden">
                  <Link to={`/college/${college.slug}`}>
                    <img
                      src={college.image || "https://via.placeholder.com/300x200"}
                      className="img-fluid w-100 h-100 object-cover"
                      alt={college.name}
                    />
                  </Link>
                  <div className="rating-badge">
                    <span className="badge bg-warning text-dark d-flex align-items-center">
                      {college.rating} <FiStar className="ms-1" size={14} />
                    </span>
                  </div>
                </div>
                <div className="card-body d-flex flex-column">
                  <Link
                    to={`/college/${college.slug}`}
                    className="text-decoration-none text-dark"
                  >
                    <h5
                      className="card-title fw-bold mb-2 text-truncate"
                      title={college.name}
                    >
                      {college.name}
                    </h5>
                  </Link>

                  <p className="text-muted small mb-1 d-flex align-items-center">
                    <i className="fa-solid fa-location-dot"></i>
                    <span className="text-truncate ms-2">{college.location}</span>
                  </p>

                  <div className="flex-grow-1">
                    <p
                      className={`card-text mb-0 ${
                        expandedCards[college._id] ? "" : "text-truncate-3"
                      }`}
                    >
                      {college.description}
                    </p>
                    {college.description?.length > 150 && (
                      <Link
                        className="btn btn-link p-0 text-primary small"
                        to={`/college/${college.slug}`}
                      >
                        {expandedCards[college._id] ? "Read Less" : "Read More"}
                      </Link>
                    )}
                  </div>

                  <div className="college-meta d-flex justify-content-between mb-3">
                    <div className="text-nowrap">
                      <span className="d-block text-muted small">Avg. Fees</span>
                      <strong className="d-block">
                        {formatFees(college.minFees, college.maxFees)}
                      </strong>
                    </div>
                    <div className="text-end text-nowrap">
                      <span className="d-block text-muted small">Avg. Package</span>
                      <strong className="d-block">
                        {college.avgPackage || "N/A"} LPA
                      </strong>
                    </div>
                  </div>

                  <div className="specializations mb-0">
                    {college.specializations?.length > 0 ? (
                      <div className="d-flex flex-wrap gap-1">
                        {college.specializations.slice(0, 1).map((spec) => (
                          <span key={spec} className="badge bg-light text-dark">
                            {spec}
                          </span>
                        ))}
                        {college.specializations.length > 2 && (
                          <span className="badge bg-dark text-white cursor-pointer">
                            +{college.specializations.length - 2}
                          </span>
                        )}
                      </div>
                    ) : (
                      <span className="badge bg-light text-dark">General</span>
                    )}
                  </div>
                </div>
                <div className="card-footer bg-white border-0 d-flex justify-content-between pt-0">
                  <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    className="btn btn-sm btn-primary rounded-pill px-3 flex-grow-1 me-2"
                    onClick={() => onsendClick(college)}
                    style={{
                      backgroundColor: "#002147",
                      borderColor: "#002147",
                      boxShadow: "0 4px 6px rgba(0, 33, 71, 0.2)",
                    }}
                  >
                    Apply Now
                  </motion.button>
                </div>
              </div>
            </motion.div>
          ))
        ) : (
          <motion.div
            className="col-12 text-center py-5"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            <h5>No colleges found for {activeTab}</h5>
            <button
              className="btn btn-link text-primary"
              onClick={() => setActiveTab("All")}
            >
              View all colleges
            </button>
          </motion.div>
        )}
      </motion.div>
    </AnimatePresence>

    {/* Attractive View All Button */}
    <div className="text-center mt-5">
      <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
        <Link
          to="/colleges"
          className="btn btn-primary px-4 py-3 rounded-pill d-inline-flex align-items-center"
          onClick={ClickHandler}
          style={{
            backgroundColor: "#002147",
            borderColor: "#002147",
            boxShadow: "0 4px 15px rgba(0, 33, 71, 0.3)",
            fontSize: "1.1rem",
            fontWeight: "500",
          }}
        >
          View All Colleges
          <FiChevronRight className="ms-2" size={20} />
        </Link>
      </motion.div>
    </div>
  </div>

  <style jsx>{`
    .popular-colleges-section {
      padding: 80px 0;
      background-color: white;
    }

    .section-header h3 {
      color: #2c3e50;
      margin-bottom: 15px;
    }

    /* Enhanced Animated Tabs */
    .custom-tabs-container {
      position: relative;
      margin-bottom: 2rem;
    }

    .custom-tabs-scroller {
      overflow-x: auto;
      -webkit-overflow-scrolling: touch;
      scrollbar-width: none;
      padding-bottom: 5px;
    }

    .custom-tabs-scroller::-webkit-scrollbar {
      display: none;
    }

    .custom-tabs {
      display: flex;
      gap: 8px;
      padding-bottom: 1rem;
      width: max-content;
      min-width: 100%;
    }

    .custom-tab {
      flex: 0 0 auto;
      color: #6c757d;
      border-radius: 30px;
      padding: 8px 20px;
      transition: all 0.3s;
      border: none;
      font-size: 0.9rem;
      white-space: nowrap;
      background-color: #f8f9fa;
      font-weight: 500;
      cursor: pointer;
      outline: none;
    }

    .custom-tab:hover {
      background-color: #e9ecef;
      color: #495057;
    }

    .custom-tab.active {
      background-color: #002147;
      color: white;
      box-shadow: 0 4px 12px rgba(0, 33, 71, 0.25);
      font-weight: 600;
    }

    .more-courses {
      display: flex;
      align-items: center;
      background-color: white;
      color: #002147;
      border: 1px solid #002147 !important;
      font-weight: 500;
    }

    .more-courses:hover {
      background-color: #002147;
      color: white;
    }

    /* College Card Styles */
    .college-card {
      transition: all 0.3s ease;
      border-radius: 12px;
      overflow: hidden;
      border: 1px solid rgba(0, 0, 0, 0.1);
    }

    .college-card:hover {
      transform: translateY(-5px);
      box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
      border-color: rgba(0, 0, 0, 0.15);
    }

    .card-img-top {
      height: 180px;
      background-color: #f5f5f5;
    }

    .rating-badge {
      position: absolute;
      top: 12px;
      right: 12px;
    }

    .rating-badge .badge {
      padding: 5px 10px;
      font-size: 0.8rem;
      border-radius: 12px;
    }

    .card-body {
      padding: 1.25rem;
    }

    .card-title {
      font-size: 1.1rem;
      color: #2c3e50;
    }

    .text-truncate-3 {
      display: -webkit-box;
      -webkit-line-clamp: 2;
      font-size: 0.9rem;
      letter-spacing: 0.5px;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }

    @media (max-width: 768px) {
      .popular-colleges-section {
        padding: 50px 0;
      }

      .custom-tab {
        padding: 6px 15px;
        font-size: 0.8rem;
      }

      .college-card {
        margin-bottom: 20px;
      }

      .card-img-top {
        height: 160px;
      }
    }

    @media (max-width: 576px) {
      .card-footer {
        flex-direction: column;
        gap: 10px;
      }

      .card-footer .btn {
        width: 100%;
      }
    }
  `}</style>
</div>

  );
};

export default CourseSection;