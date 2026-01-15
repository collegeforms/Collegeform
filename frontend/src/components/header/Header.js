import React, { useState, useEffect, useContext } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Menu, MenuItem, IconButton, Typography } from "@mui/material";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import SearchIcon from "@mui/icons-material/Search";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import MobileMenu from "../MobileMenu/MobileMenu";
import CartIcon from "./CartIcon";
import HeaderTopbar from "../HeaderTopbar/HeaderTopbar";
import "./Header.css";
import logo from "./collegeLogo.png";
import AuthContext from "../../main-component/router/context/AuthContext";

const Header = (props) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [authToken, setAuthToken] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);
  const [searchCategory, setSearchCategory] = useState("colleges");
  const [searchDropdownAnchor, setSearchDropdownAnchor] = useState(null);
  const [coursesAnchorEl, setCoursesAnchorEl] = useState(null);
  const [isMegaMenuOpen, setIsMegaMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const { user, logout, updateToken } = useContext(AuthContext);

  // Search categories configuration
  const searchCategories = [
    { key: "colleges", label: "Colleges", path: "/colleges" },
    {
      key: "online-education",
      label: "Online Education",
      path: "/education/OnlineEducation",
    },
    {
      key: "overseas-education",
      label: "Study Abroad",
      path: "/StudyAbroad",
    },
    {
      key: "vocational-institutes",
      label: "Vocational Institutes",
      path: "/education/vocational-institutes",
    },
    {
      key: "CompetitiveExams",
      label: "Competitive Exams",
      path: "/CompetitiveExams",
    },
    {
      key: "government-colleges",
      label: "Government Colleges",
      path: "/education/government-colleges",
    },
  ];

  // Indian UG and PG courses data
  const ugCourses = [
    { name: "BBA", query: "BBA" },
    { name: "BBA LLB", query: "BBA LLB" },
    { name: "B.Com", query: "B.Com" },
    { name: "BCA", query: "BCA" },
    { name: "B.Tech", query: "B.Tech" },
  ];

  const pgCourses = [
    { name: "MBA", query: "MBA" },
    { name: "PGDM", query: "PGDM" },
    { name: "LLB", query: "LLB" },
    { name: "M.Com", query: "M.Com" },
    { name: "MCA", query: "MCA" },
  ];



  useEffect(() => {
    const token = localStorage.getItem("userToken");
    setAuthToken(token);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const getCurrentCategory = () => {
    return (
      searchCategories.find((cat) => cat.key === searchCategory) ||
      searchCategories[0]
    );
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const currentCategory = getCurrentCategory();

    if (searchTerm.trim()) {
      navigate(
        `${currentCategory.path}?search=${encodeURIComponent(searchTerm)}`
      );
    } else {
      navigate(currentCategory.path);
    }
    setIsMobileSearchOpen(false);
  };

  const handleSearchCategoryChange = (categoryKey) => {
    setSearchCategory(categoryKey);
    setSearchDropdownAnchor(null);
  };

  const handleSearchDropdownOpen = (event) => {
    setSearchDropdownAnchor(event.currentTarget);
  };

  const handleSearchDropdownClose = () => {
    setSearchDropdownAnchor(null);
  };

  const handleCoursesMouseEnter = (event) => {
    setCoursesAnchorEl(event.currentTarget);
    setIsMegaMenuOpen(true);
  };

  const handleCoursesMouseLeave = () => {
    // Add delay to prevent immediate close when moving to mega menu
    setTimeout(() => {
      setIsMegaMenuOpen(false);
      setCoursesAnchorEl(null);
    }, 300);
  };

  const handleMegaMenuMouseEnter = () => {
    setIsMegaMenuOpen(true);
  };

  const handleMegaMenuMouseLeave = () => {
    setIsMegaMenuOpen(false);
    setCoursesAnchorEl(null);
  };

  const handleCourseClick = (courseName, level) => {
    navigate(`/colleges/?course=${encodeURIComponent(courseName)}&level=${level}`);
    setIsMegaMenuOpen(false);
    setCoursesAnchorEl(null);
  };

  const handleViewMoreCourses = () => {
    navigate("/colleges");
    setIsMegaMenuOpen(false);
    setCoursesAnchorEl(null);
  };

  const handleLogout = () => {
    localStorage.removeItem("userToken");
    setAuthToken(null);
    navigate("/");
  };

  const handleMouseEnter = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMouseLeave = () => {
    setAnchorEl(null);
  };

  const toggleMobileSearch = () => {
    setIsMobileSearchOpen(!isMobileSearchOpen);
  };

  return (
    <header id="header" className={`${isScrolled ? "header-scrolled" : ""}`}>
      {/* Mobile Search Overlay */}
      <div
        className={`mobile-search-overlay ${
          isMobileSearchOpen ? "active" : ""
        }`}
      >
        <div className="mobile-search-container">
          <form onSubmit={handleSearchSubmit} className="mobile-search-form">
            <div className="mobile-search-input-group">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="mobile-search-field-input"
                placeholder="Search college or course..."
                autoFocus
              />
              <button type="submit" className="mobile-search-submit-button">
                <SearchIcon />
              </button>
              <button
                type="button"
                className="mobile-search-close-button"
                onClick={toggleMobileSearch}
              >
                ×
              </button>
            </div>
            {/* Mobile Search Category Selector */}
            <div className="mobile-search-category">
              <select
                value={searchCategory}
                onChange={(e) => setSearchCategory(e.target.value)}
                className="mobile-search-category-select"
              >
                {searchCategories.map((category) => (
                  <option key={category.key} value={category.key}>
                    {category.label}
                  </option>
                ))}
              </select>
            </div>
          </form>
        </div>
      </div>

      <div className={`wpo-site-header ${props.hclass}`}>
        <nav className="navigation navbar navbar-expand-lg navbar-light">
          <div className="container-fluid">
            <div className="row align-items-center w-100 mx-0">
              {/* Mobile Menu Button */}
              <div className="col-auto d-lg-none">
                <MobileMenu />
              </div>

              {/* Logo */}
              <div className="col-lg-2 col-md-4 col-6">
                <div className="navbar-brand-container">
                  <Link className="navbar-brand" to="/">
                    <img src={logo} alt="logo" className="logo-img" />
                  </Link>
                </div>
              </div>

              <div className="col-lg-5 d-none d-lg-block">
                <div className="collapse navbar-collapse navigation-holder">
                  <ul className="nav navbar-nav mb-2 mb-lg-0">



    <li>
                      <Link to={"https://thecounselingcafe.in/student/career-counseling/"}>
                        Course Counseling
                      </Link>
                    </li>


                    <li 
                      className="menu-item-has-children mega-menu-wrapper"
                      onMouseEnter={handleCoursesMouseEnter}
                      onMouseLeave={handleCoursesMouseLeave}
                    >
                      <Link to="#">Courses</Link>
                      
                      {/* Mega Menu Dropdown with Animation */}
                      <div 
                        className={`mega-menu ${isMegaMenuOpen ? "mega-menu-open" : ""}`}
                        onMouseEnter={handleMegaMenuMouseEnter}
                        onMouseLeave={handleMegaMenuMouseLeave}
                      >
                        <div className="mega-menu-content">
                          {/* UG Courses Section */}
                          <div className="mega-menu-column">
                            <h4 className="mega-menu-heading">UG Courses (Bachelor's)</h4>
                            <ul className="mega-menu-list">
                              {ugCourses.map((course, index) => (
                                <li key={index}>
                                  <button 
                                    onClick={() => handleCourseClick(course.query, "UG")}
                                    className="mega-menu-link"
                                  >
                                    {course.name}
                                  </button>
                                </li>
                              ))}
                            </ul>
                          </div>
                          
                          {/* PG Courses Section */}
                          <div className="mega-menu-column">
                            <h4 className="mega-menu-heading">PG Courses (Master's)</h4>
                            <ul className="mega-menu-list">
                              {pgCourses.map((course, index) => (
                                <li key={index}>
                                  <button 
                                    onClick={() => handleCourseClick(course.query, "PG")}
                                    className="mega-menu-link"
                                  >
                                    {course.name}
                                  </button>
                                </li>
                              ))}
                            </ul>
                          </div>

                          {/* Diploma Courses Section */}
                      
                          
                          {/* View More Section */}
                          <div className="mega-menu-column view-more-column">
                            <div className="view-more-content">
                              <h4 className="mega-menu-heading">Explore More</h4>
                              <p>Discover all available courses and find the perfect fit for your career goals

<br/>
<br/>

  <Link 
                                className="view-more-butto pt-5 mt-5"
                                onClick={handleViewMoreCourses}
                              >
                                View All Courses
                              </Link>
                                
                              </p>
                            
                            </div>
                          </div>
                        </div>
                      </div>
                    </li>

                    <li className="menu-item-has-children">
                      <Link to="/colleges">Colleges</Link>
                      <ul className="sub-menu">
                        <li>
                          <Link to="/colleges/?course=&specialization=&currentCity=&preferredCity=&exam=&level=UG&mode=&fees=&payment=">
                            UG Colleges
                          </Link>
                        </li>
                        <li>
                          <Link to="/colleges/?course=&specialization=&currentCity=&preferredCity=&exam=&level=PG&mode=&fees=&payment=">
                            PG Colleges
                          </Link>
                        </li>
                        <li>
                          <Link to="/education/vocational-institutes">
                            Diploma Colleges
                          </Link>
                        </li>
                      </ul>
                    </li>
                 
                <li>

      <Link className="signup-button-primary" to="/education/Top-B-Schools">
                        <Typography className="text-light" variant="button">Top B Schools</Typography>
                      </Link>
</li>
                    {/* <li>
                      <Link to="/studyabroad">Study Abroad</Link>
                    </li> */}

                       {/* <li>
                      <Link to="/students/tests">Test Series</Link>
                    </li> */}
                  </ul>
                </div>
              </div>

              {/* Right Section */}
              <div className="col-lg-5 col-md-8 col-auto">
                <div className="header-right-section">
                  {/* Desktop Search - Hidden on mobile */}
                  <div className="desktop-search-container d-none d-lg-block">
                    <form
                      onSubmit={handleSearchSubmit}
                      className="search-form-permanent"
                    >
                      <div className="search-input-group">
                        <div
                          className="search-category-selector"
                          onClick={handleSearchDropdownOpen}
                        >
                          <span className="search-category-label">
                            {getCurrentCategory().label}
                          </span>
                          <ArrowDropDownIcon className="search-dropdown-arrow" />
                        </div>
                        <input
                          type="text"
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          className="search-field-input"
                          placeholder="Search colleges"
                        />
                        <button type="submit" className="search-submit-button">
                          <SearchIcon />
                        </button>
                      </div>
                    </form>

                    {/* Search Category Dropdown */}
                    <Menu
                      anchorEl={searchDropdownAnchor}
                      open={Boolean(searchDropdownAnchor)}
                      onClose={handleSearchDropdownClose}
                      className="search-category-menu"
                      PaperProps={{
                        style: {
                          marginTop: "8px",
                          minWidth: "160px",
                        },
                      }}
                    >
                      {searchCategories.map((category) => (
                        <MenuItem
                          key={category.key}
                          onClick={() =>
                            handleSearchCategoryChange(category.key)
                          }
                          selected={searchCategory === category.key}
                          className="search-category-menu-item"
                          style={{
                            fontSize: "14px",
                            padding: "8px 16px",
                            backgroundColor:
                              searchCategory === category.key
                                ? "#f0f0f0"
                                : "transparent",
                            fontWeight:
                              searchCategory === category.key ? "500" : "400",
                          }}
                        >
                          {category.label}
                        </MenuItem>
                      ))}
                    </Menu>
                  </div>

                  {/* Mobile Icons */}
                  <div className="mobile-icons-container d-lg-none">
                    <IconButton
                      className="mobile-search-icon"
                      onClick={toggleMobileSearch}
                    >
                      <SearchIcon />
                    </IconButton>

                    {!authToken && (
                      <IconButton
                        className="mobile-signup-icon"
                        component={Link}
                        to="/user/signup"
                      >
                        <PersonAddIcon />
                      </IconButton>
                    )}
                  </div>

                  {/* Cart Icon - Only show when user is logged in */}
                  {authToken && <CartIcon />}

                  {/* Desktop Auth Section */}
                  <div className="user-auth-container d-none d-lg-block">
                    {authToken ? (
                      <div
                        onMouseEnter={handleMouseEnter}
                        onMouseLeave={handleMouseLeave}
                        className="user-profile-wrapper"
                      >
                        <Link to="/myaccount">
                          <IconButton className="user-profile-icon">
                            <AccountCircleIcon fontSize="large" />
                          </IconButton>
                        </Link>
                        <Typography
                          component={Link}
                          to="/myaccount"
                          variant="body2"
                          className="user-name-text"
                        >
                          {user?.info?.name?.split(" ")[0]}
                        </Typography>
                      </div>
                    ) : (
                      <Link className="signup-button-primary" to="/user/signup">
                        <Typography variant="button">Sign Up</Typography>
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </nav>
      </div>
    </header>
  );
};

export default Header;
