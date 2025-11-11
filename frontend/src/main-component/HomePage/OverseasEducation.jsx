import React, { useState, useEffect } from "react";
import { Link, useNavigate, useParams, useLocation } from "react-router-dom";
import axios from "axios";
import { FiStar, FiChevronRight, FiSearch, FiFilter } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "../../components/Navbar/Navbar";
import Footer from "../../components/footer/Footer";
import { Helmet } from "react-helmet";
import BannerRow from "../router/components/SimpleBannerRow";

const ClickHandler = () => {
  window.scrollTo(10, 0);
};

const OverseasEducation = (props) => {
  const [colleges, setColleges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedCards, setExpandedCards] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    rating: null,
    fees: null,
    location: ""
  });
  
  const collegesPerPage = 9;
  const API_URL = "https://collegeforms.in";
  const navigate = useNavigate();
  const { category } = useParams();
  const location = useLocation();

  // Get search query from URL
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const urlSearchQuery = searchParams.get('search');
    
    if (urlSearchQuery) {
      setSearchQuery(urlSearchQuery);
    }
  }, [location.search]);

  // SEO Configuration based on route
  const getSeoConfig = () => {
    const path = window.location.pathname;
    
    const seoConfigs = {
      'OverseasEducationStudyAbroad': {
        title: 'Study Abroad – Top Colleges & Guidance for Study Abroad | CollegeForms',
        description: 'Dreaming of Study Abroad? Explore top international universities, MBA programs, scholarships, and expert admission help. Begin your global journey with CollegeForms.in.',
        keywords: 'Study Abroad guide, study abroad colleges, international MBA programs, global admission support, scholarships to study abroad, best countries for education',
        ogTitle: 'Study Abroad Programs – Scholarships & Admissions | CollegeForms',
        ogDescription: 'Looking to study abroad? Explore top international colleges, scholarships on tuition, and MBA programs. Get expert college guidance and application help with CollegeForms.in.',
        heroTitle: 'Discover Top Study Abroad Programs'
      },
      '/education/vocational-institutes': {
        title: 'Vocational Courses After 12th – Job-Ready Skills & Certifications | CollegeForms',
        description: 'Choose top vocational institutes offering in-demand courses. Get career guidance, scholarships, and help selecting the best course after 12th with CollegeForms.in.',
        keywords: 'vocational courses India, skill-based programs, job-ready education, diploma after 12th, technical course colleges, practical career options, certification courses',
        ogTitle: 'Vocational Training Programs – Skill Development Courses',
        ogDescription: 'Hands-on vocational training programs for immediate employment. Explore certification courses with placement assistance at CollegeForms.in.',
        heroTitle: 'Explore Vocational Training Programs'
      },
      '/education/government-colleges': {
        title: 'Top Government Colleges in India – Admission & Scholarships | CollegeForms',
        description: 'Explore the list of top government colleges for MBA, BBA & PGDM. Apply with ease, get form discounts, tuition scholarships, and expert college admission guidance.',
        keywords: 'top govt colleges India, BBA MBA govt colleges, affordable tuition colleges, government PGDM courses, admission guidance India, best public institutions',
        ogTitle: 'Government Colleges in India – Affordable Quality Education',
        ogDescription: 'Discover top-ranked government colleges with low tuition fees. Get admission guidance and scholarship information for public institutions.',
        heroTitle: 'Find Top Government Colleges'
      },
      '/education/ScholarshipBasedEducation': {
        title: 'Scholarship-Based Education – Study at Top Colleges Affordably | CollegeForms',
        description: 'Unlock your future with scholarship-based education! Apply to top BBA, MBA, PGDM colleges with tuition fee waivers and discounts. Find the right college with CollegeForms.in.',
        keywords: 'scholarships after 12th, tuition fee waivers, merit-based scholarships, affordable top colleges, MBA scholarships India, apply with discounts',
        ogTitle: 'Scholarship Opportunities – Study at Top Colleges for Less',
        ogDescription: 'Discover scholarship programs that make quality education affordable. Get help applying to top colleges with financial aid options.',
        heroTitle: 'Discover Scholarship Opportunities'
      },
      '/education/OnlineEducation': {
        title: 'Online Education – Top Online Colleges & Courses | CollegeForms',
        description: 'Explore top online education programs, distance learning courses, and virtual colleges. Get expert guidance on online MBA, BBA, PGDM and certification programs.',
        keywords: 'online education, distance learning, online colleges, virtual courses, online MBA, digital education, e-learning programs',
        ogTitle: 'Online Education Programs – Virtual Learning Courses',
        ogDescription: 'Discover top online education programs and distance learning courses. Get expert guidance on virtual colleges and certification programs.',
        heroTitle: 'Explore Online Education Programs'
      },
      // Default SEO
      default: {
        title: 'Discover Top Education Options | CollegeForms',
        description: 'Explore various education pathways including overseas, vocational, government colleges and scholarship-based programs with CollegeForms.in.',
        keywords: 'education options, college guidance, admission help, study programs',
        ogTitle: 'Education Pathways & College Guidance | CollegeForms',
        ogDescription: 'Find the right education path with expert guidance on various programs and colleges.',
        heroTitle: 'Discover Top Education Options'
      }
    };

    return seoConfigs[path] || seoConfigs.default;
  };

  const seoConfig = getSeoConfig();

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
        navigate('/user/login', { 
      state: { from: location } // This preserves the current URL
    });
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const collegesRes = await axios.get(`${API_URL}/api/colleges`);
        console.log(collegesRes.data);
        
        const normalize = str => str.toLowerCase().replace(/\s+/g, '');

        const filteredColleges = category 
          ? collegesRes.data.filter(college => 
              normalize(college.category) === normalize(decodeURIComponent(category))
            )
          : collegesRes.data;
        
        // Process colleges data
        const processedColleges = filteredColleges.map(college => ({
          ...college,
          courses: Array.isArray(college.courses) 
            ? college.courses.map(c => typeof c === 'object' ? c.name : c)
            : []
        }));
        
        setColleges(processedColleges);
        setLoading(false);
      } catch (err) {
        setError("Failed to load data.");
        setLoading(false);
      }
    };

    fetchData();
  }, [category]);

  // Filter colleges based on search query and filters
  const filteredColleges = colleges.filter(college => {
    // Search filter - search in name, location, and specializations
    const searchMatch = searchQuery 
      ? college.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
        college.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (college.specializations && college.specializations.some(spec => 
          spec.toLowerCase().includes(searchQuery.toLowerCase())
        )) ||
        (college.courses && college.courses.some(course => 
          course.toLowerCase().includes(searchQuery.toLowerCase())
        ))
      : true;
    
    // Rating filter
    const ratingMatch = filters.rating ? college.rating >= filters.rating : true;
    
    // Fees filter
    const feesMatch = filters.fees 
      ? (college.minFees <= filters.fees * 100000 && college.maxFees >= filters.fees * 100000)
      : true;
    
    // Location filter
    const locationMatch = filters.location 
      ? college.location.toLowerCase().includes(filters.location.toLowerCase())
      : true;
    
    return searchMatch && ratingMatch && feesMatch && locationMatch;
  });

  // Get current colleges for pagination
  const indexOfLastCollege = currentPage * collegesPerPage;
  const indexOfFirstCollege = indexOfLastCollege - collegesPerPage;
  const currentColleges = filteredColleges.slice(indexOfFirstCollege, indexOfLastCollege);

  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const formatFees = (min, max) => {
    return `${min?.toLocaleString("en-IN") || 'N/A'} - ${max?.toLocaleString("en-IN") || 'N/A'} Lakh`;
  };

  // Handle search input change and update URL
  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchQuery(value);
    setCurrentPage(1);
    
    // Update URL with search query
    const searchParams = new URLSearchParams(location.search);
    if (value) {
      searchParams.set('search', value);
    } else {
      searchParams.delete('search');
    }
    
    navigate(`${location.pathname}?${searchParams.toString()}`, { replace: true });
  };

  // Clear search and update URL
  const clearSearch = () => {
    setSearchQuery("");
    setCurrentPage(1);
    
    const searchParams = new URLSearchParams(location.search);
    searchParams.delete('search');
    navigate(`${location.pathname}?${searchParams.toString()}`, { replace: true });
  };

  if (loading) return (
    <div className="loading-screen">
      <div className="spinner">
        <div className="double-bounce1"></div>
        <div className="double-bounce2"></div>
      </div>
      <p>Loading colleges...</p>
    </div>
  );

  if (error) return (
    <div className="error-screen">
      <div className="error-icon">⚠️</div>
      <h3>Oops! Something went wrong</h3>
      <p>{error}</p>
      <button className="btn btn-primary" onClick={() => window.location.reload()}>
        Try Again
      </button>
    </div>
  );

  return (
    <>
      <Helmet>
        <title>{seoConfig.title}</title>
        <meta name="description" content={seoConfig.description} />
        <meta name="keywords" content={seoConfig.keywords} />
        
        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content={`https://www.collegeforms.in${window.location.pathname}${window.location.search}`} />
        <meta property="og:title" content={seoConfig.ogTitle || seoConfig.title} />
        <meta property="og:description" content={seoConfig.ogDescription || seoConfig.description} />
        <meta property="og:image" content="https://www.collegeforms.in/images/education-options-og.jpg" />
        
        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:url" content={`https://www.collegeforms.in${window.location.pathname}${window.location.search}`} />
        <meta name="twitter:title" content={seoConfig.ogTitle || seoConfig.title} />
        <meta name="twitter:description" content={seoConfig.ogDescription || seoConfig.description} />
        <meta name="twitter:image" content="https://www.collegeforms.in/images/education-options-twitter.jpg" />
        
        {/* Canonical URL */}
        <link rel="canonical" href={`https://www.collegeforms.in${window.location.pathname}${window.location.search}`} />
      </Helmet>
      
      <Navbar hclass={'wpo-header-style-4'}/>

<BannerRow category={category} />

      <div className={`overseas-education-section ${props.pClass}`}>
        {/* <div className="hero-section">
          <div className="container">
            <div className="hero-content text-light">
              <motion.h1 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                style={{ color: 'white' }}
              >
                {seoConfig.heroTitle}
              </motion.h1>
              {searchQuery && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                >
                  Search results for: <strong>"{searchQuery}"</strong>
                </motion.p>
              )}
            </div>
          </div>
        </div> */}

        {/* Main Content */}
        <div className="container pt-4">
          {/* Search and Filter Section */}
          <div className="search-filter-section">
            <div className="search-box">
              <FiSearch className="search-icon" />
              <input
                type="text"
                placeholder="Search colleges, locations, or courses..."
                value={searchQuery}
                onChange={handleSearchChange}
              />
              {searchQuery && (
                <button 
                  className="clear-search"
                  onClick={clearSearch}
                  title="Clear search"
                >
                  ×
                </button>
              )}
              <button 
                className="filter-toggle"
                onClick={() => setShowFilters(!showFilters)}
              >
                <FiFilter /> {showFilters ? 'Hide Filters' : 'Filters'}
              </button>
            </div>

            <AnimatePresence>
              {showFilters && (
                <motion.div 
                  className="filter-panel"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="filter-group">
                    <label>Minimum Rating</label>
                    <select 
                      value={filters.rating || ''}
                      onChange={(e) => setFilters({...filters, rating: e.target.value ? Number(e.target.value) : null})}
                    >
                      <option value="">Any Rating</option>
                      <option value="3">3+ Stars</option>
                      <option value="4">4+ Stars</option>
                      <option value="4.5">4.5+ Stars</option>
                    </select>
                  </div>
                  
                  <div className="filter-group">
                    <label>Max Fees (in Lakhs)</label>
                    <select 
                      value={filters.fees || ''}
                      onChange={(e) => setFilters({...filters, fees: e.target.value ? Number(e.target.value) : null})}
                    >
                      <option value="">Any Fees</option>
                      <option value="5">Up to 5 Lakhs</option>
                      <option value="10">Up to 10 Lakhs</option>
                      <option value="20">Up to 20 Lakhs</option>
                      <option value="50">Up to 50 Lakhs</option>
                    </select>
                  </div>
                  
                  <div className="filter-group">
                    <label>Location</label>
                    <input
                      type="text"
                      placeholder="City or Country"
                      value={filters.location}
                      onChange={(e) => setFilters({...filters, location: e.target.value})}
                    />
                  </div>
                  
                  <button 
                    className="clear-filters"
                    onClick={() => setFilters({
                      rating: null,
                      fees: null,
                      location: ""
                    })}
                  >
                    Clear Filters
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Results Count */}
          <div className="results-count">
            <p>
              Showing <strong>{currentColleges.length}</strong> of <strong>{filteredColleges.length}</strong> colleges
              {searchQuery && (
                <span> for "<strong>{searchQuery}</strong>"</span>
              )}
            </p>
          </div>

          {/* Colleges Grid */}
          <AnimatePresence mode="wait">
            <motion.div 
              className="row g-4"
              key={searchQuery + JSON.stringify(filters)}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              {currentColleges.length > 0 ? (
                currentColleges.map((college) => (
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
                        <Link 
                        
                            to={`/college/${college.slug}`}>
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
                        <h5 className="card-title fw-bold mb-2 text-truncate" title={college.name}
                      >

<Link  
className="
text-dark"
                            to={`/college/${college.slug}`}>


                          {college.name}
</Link>

                        </h5>
                        <p className="text-muted small mb-1 d-flex align-items-center">
                          <i className="fa-solid fa-location-dot"></i>
                          <span className="text-truncate ms-2">{college.location}</span>
                        </p>
                        
                        <div className="flex-grow-1">
                          <p className={`card-text mb-1 ${expandedCards[college._id] ? '' : 'text-truncate-3'}`}>
                            {college.description || "A prestigious institution offering quality education."}
                          </p>
                          {/* {college.description?.length > 150 && (
                            <button 
                              className="btn btn-link p-0 text-primary small"
                              onClick={() => toggleExpand(college._id)}
                            >
                              {expandedCards[college._id] ? 'Read Less' : 'Read More'}
                            </button>
                          )} */}
                        </div>
                        
                        <div className="college-meta d-flex justify-content-between mb-3">
                          <div className="text-nowrap">
                            <span className="d-block text-muted small">Avg. Fees</span>
                            <strong className="d-block">{formatFees(college.minFees, college.maxFees)}</strong>
                          </div>
                          <div className="text-end text-nowrap">
                            <span className="d-block text-muted small">Avg. Package</span>
                            <strong className="d-block">{college.avgPackage || 'N/A'} LPA</strong>
                          </div>
                        </div>
                        
                        <div className="specializations mb-0">
                          {college.specializations?.length > 0 ? (
                            <div className="d-flex flex-wrap gap-1">
                              {college.specializations.slice(0, 2).map(spec => (
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
                            backgroundColor: '#002147', 
                            borderColor: '#002147',
                            boxShadow: '0 4px 6px rgba(0, 33, 71, 0.2)'
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
                  className="no-results"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="no-results-content">
                    <img src="https://cdn-icons-png.flaticon.com/512/4076/4076478.png" alt="No results" />
                    <h4>No colleges found</h4>
                    <p>
                      {searchQuery 
                        ? `matching "${searchQuery}"`
                        : 'matching your search criteria'
                      }
                    </p>
                    <div className="d-flex gap-2 justify-content-center">
                      <button 
                        className="reset-btn"
                        onClick={() => {
                          clearSearch();
                          setFilters({
                            rating: null,
                            fees: null,
                            location: ""
                          });
                        }}
                      >
                        Reset All
                      </button>
                      {searchQuery && (
                        <button 
                          className="reset-btn secondary"
                          onClick={clearSearch}
                        >
                          Clear Search Only
                        </button>
                      )}
                    </div>
                  </div>
                </motion.div>
              )}
            </motion.div>
          </AnimatePresence>

          {/* Pagination */}
          {filteredColleges.length > collegesPerPage && (
            <div className="d-flex justify-content-center mt-5">
              <nav aria-label="College pagination">
                <ul className="pagination">
                  <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                    <button 
                      className="page-link" 
                      onClick={() => paginate(currentPage - 1)}
                      disabled={currentPage === 1}
                    >
                      Previous
                    </button>
                  </li>
                  
                  {Array.from({ length: Math.ceil(filteredColleges.length / collegesPerPage) }).map((_, index) => (
                    <li key={index} className={`page-item ${currentPage === index + 1 ? 'active' : ''}`}>
                      <button 
                        className="page-link" 
                        onClick={() => paginate(index + 1)}
                      >
                        {index + 1}
                      </button>
                    </li>
                  ))}
                  
                  <li className={`page-item ${currentPage === Math.ceil(filteredColleges.length / collegesPerPage) ? 'disabled' : ''}`}>
                    <button 
                      className="page-link" 
                      onClick={() => paginate(currentPage + 1)}
                      disabled={currentPage === Math.ceil(filteredColleges.length / collegesPerPage)}
                    >
                      Next
                    </button>
                  </li>
                </ul>
              </nav>
            </div>
          )}
        </div>
      </div>
      
      <Footer />
      
      <style jsx>{`
        .overseas-education-section {
          padding-bottom: 80px;
          background-color: #f9fbfd;
        }
        
        /* Hero Section */
        .hero-section {
          background: linear-gradient(135deg, #002147 0%, #1a4b8c 100%);
          color: white;
          padding: 80px 0;
          margin-bottom: 40px;
          position: relative;
          overflow: hidden;
        }
        
        .hero-section::before {
          content: '';
          position: absolute;
          top: 0;
          right: 0;
          bottom: 0;
          left: 0;
          background: url('https://images.unsplash.com/photo-1523050854058-8df90110c9f1?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80') no-repeat center center;
          background-size: cover;
          opacity: 0.1;
        }
        
        .hero-content {
          position: relative;
          z-index: 1;
          max-width: 800px;
          margin: 0 auto;
          text-align: center;
        }
        
        .hero-content h1 {
          font-size: 2.5rem;
          font-weight: 700;
          margin-bottom: 20px;
          text-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        
        .hero-content p {
          font-size: 1.2rem;
          opacity: 0.9;
          margin-bottom: 0;
        }
        
        /* Search and Filter */
        .search-filter-section {
          margin-bottom: 30px;
          position: relative;
          z-index: 10;
        }
        
        .search-box {
          display: flex;
          align-items: center;
          background: white;
          border-radius: 50px;
          padding: 8px 20px;
          box-shadow: 0 5px 15px rgba(0, 33, 71, 0.1);
          margin-bottom: 20px;
          border: 1px solid #e0e6ed;
          position: relative;
        }
        
        .search-icon {
          color: #7d879c;
          margin-right: 10px;
          font-size: 18px;
        }
        
        .search-box input {
          flex: 1;
          border: none;
          outline: none;
          padding: 10px 0;
          font-size: 16px;
          background: transparent;
        }
        
        .clear-search {
          background: none;
          border: none;
          font-size: 20px;
          color: #7d879c;
          cursor: pointer;
          padding: 0 8px;
          margin-right: 10px;
          transition: color 0.3s ease;
        }
        
        .clear-search:hover {
          color: #002147;
        }
        
        .filter-toggle {
          display: flex;
          align-items: center;
          gap: 8px;
          background: #f0f4f8;
          border: none;
          border-radius: 50px;
          padding: 8px 16px;
          font-size: 14px;
          color: #002147;
          cursor: pointer;
          transition: all 0.3s ease;
        }
        
        .filter-toggle:hover {
          background: #e0e6ed;
        }
        
        .filter-panel {
          background: white;
          border-radius: 12px;
          padding: 20px;
          box-shadow: 0 5px 15px rgba(0, 33, 71, 0.1);
          margin-bottom: 30px;
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
          gap: 20px;
          overflow: hidden;
        }
        
        .filter-group {
          margin-bottom: 0;
        }
        
        .filter-group label {
          display: block;
          margin-bottom: 8px;
          font-size: 14px;
          color: #5f6b7d;
          font-weight: 500;
        }
        
        .filter-group select, 
        .filter-group input {
          width: 100%;
          padding: 10px 12px;
          border: 1px solid #e0e6ed;
          border-radius: 8px;
          font-size: 14px;
          background: white;
          transition: border 0.3s ease;
        }
        
        .filter-group select:focus, 
        .filter-group input:focus {
          border-color: #002147;
          outline: none;
        }
        
        .clear-filters {
          grid-column: 1 / -1;
          background: none;
          border: none;
          color: #002147;
          text-decoration: underline;
          cursor: pointer;
          font-size: 14px;
          text-align: right;
          padding: 0;
        }
        
        /* Results Count */
        .results-count {
          margin-bottom: 20px;
          color: #5f6b7d;
          font-size: 14px;
        }
        
        .results-count strong {
          color: #002147;
        }
        
        /* College Card Styles from old design */
        .college-card {
          transition: all 0.3s ease;
          border-radius: 12px;
          overflow: hidden;
          border: 1px solid rgba(0,0,0,0.1);
        }

        .college-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 10px 25px rgba(0,0,0,0.1);
          border-color: rgba(0,0,0,0.15);
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

        .pagination {
          gap: 5px;
        }

        .page-item.active .page-link {
          background-color: #002147;
          border-color: #002147;
        }

        .page-link {
          color: #002147;
          border: 1px solid #dee2e6;
          padding: 0.5rem 0.9rem;
          border-radius: 8px !important;
        }

        .page-link:hover {
          background-color: #f0f4f8;
          color: #002147;
        }
        
        /* No Results */
        .no-results {
          grid-column: 1 / -1;
          text-align: center;
          padding: 50px 0;
        }
        
        .no-results-content {
          max-width: 400px;
          margin: 0 auto;
        }
        
        .no-results img {
          width: 100px;
          height: 100px;
          margin-bottom: 20px;
          opacity: 0.7;
        }
        
        .no-results h4 {
          color: #002147;
          margin-bottom: 10px;
        }
        
        .no-results p {
          color: #5f6b7d;
          margin-bottom: 20px;
        }
        
        .reset-btn {
          background: #002147;
          color: white;
          border: none;
          border-radius: 8px;
          padding: 10px 20px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.3s ease;
          margin: 0 5px;
        }
        
        .reset-btn:hover {
          background: #003366;
        }
        
        .reset-btn.secondary {
          background: #6c757d;
        }
        
        .reset-btn.secondary:hover {
          background: #5a6268;
        }
        
        /* Loading Screen */
        .loading-screen {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          height: 50vh;
        }
        
        .spinner {
          width: 70px;
          height: 70px;
          position: relative;
          margin-bottom: 20px;
        }
        
        .double-bounce1, .double-bounce2 {
          width: 100%;
          height: 100%;
          border-radius: 50%;
          background-color: #002147;
          opacity: 0.6;
          position: absolute;
          top: 0;
          left: 0;
          animation: sk-bounce 2.0s infinite ease-in-out;
        }
        
        .double-bounce2 {
          animation-delay: -1.0s;
        }
        
        @keyframes sk-bounce {
          0%, 100% { 
            transform: scale(0.0);
          } 50% { 
            transform: scale(1.0);
          }
        }
        
        .loading-screen p {
          color: #002147;
          font-size: 18px;
        }
        
        /* Error Screen */
        .error-screen {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          height: 50vh;
          text-align: center;
          padding: 0 20px;
        }
        
        .error-icon {
          font-size: 50px;
          margin-bottom: 20px;
        }
        
        .error-screen h3 {
          color: #002147;
          margin-bottom: 10px;
        }
        
        .error-screen p {
          color: #5f6b7d;
          margin-bottom: 20px;
          max-width: 500px;
        }
        
        /* Responsive */
        @media (max-width: 768px) {
          .hero-section {
            padding: 60px 0;
          }
          
          .filter-panel {
            grid-template-columns: 1fr;
          }
        }
        
        @media (max-width: 576px) {
          .hero-content h1 {
            font-size: 1.8rem;
          }
          
          .hero-content p {
            font-size: 1rem;
          }
          
          .search-box {
            flex-direction: column;
            align-items: stretch;
            border-radius: 12px;
          }
          
          .search-box input {
            padding: 12px 0;
          }
          
          .filter-toggle {
            justify-content: center;
            margin-top: 10px;
          }
        }
      `}</style>
    </>
  );
};

export default OverseasEducation