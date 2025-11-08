import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./MerittoLogin.css";
import { Link } from "react-router-dom";
import chatbot from "./side-img-1.gif";
import axios from "axios";
import logo from "./collegeLogo.png";
import ApplyNowModal from "./ApplyNowModal";
import {
  RiGraduationCapLine,
  RiBookOpenLine,
  RiMapPinLine,
  RiMoneyDollarCircleLine,
  RiBankCardLine,
  RiFileListLine,
  RiSparkling2Fill,
} from "react-icons/ri";
import EmailIcon from "@mui/icons-material/Email";
import LockIcon from "@mui/icons-material/Lock";

// TypingText Component for animated typing effect
const TypingText = () => {
  const texts = [
    "Explore Discounts, Cashbacks & Scholarships on College Applications & Fees",
    "Save Big on College Forms",
    "Unlock Personalized Coupons based on your Profile",
    "Apply to 100+ Colleges with One Universal Form",
    "Complete Universal Form & Enjoy Big Discounts"
  ];
  
  const [currentIndex, setCurrentIndex] = useState(0);
  const [displayText, setDisplayText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [typingSpeed, setTypingSpeed] = useState(50);

  useEffect(() => {
    const currentText = texts[currentIndex];
    
    const timer = setTimeout(() => {
      if (!isDeleting) {
        // Typing forward
        if (displayText.length < currentText.length) {
          setDisplayText(currentText.slice(0, displayText.length + 1));
        } else {
          // Pause at the end
          setTimeout(() => setIsDeleting(true), 2000);
        }
      } else {
        // Deleting
        if (displayText.length > 0) {
          setDisplayText(currentText.slice(0, displayText.length - 1));
        } else {
          setIsDeleting(false);
          setCurrentIndex((prev) => (prev + 1) % texts.length);
        }
      }
    }, isDeleting ? 30 : typingSpeed);

    return () => clearTimeout(timer);
  }, [displayText, isDeleting, currentIndex, texts, typingSpeed]);

  return (
    <div className="typing-container">
      <div className="typing-text">
        {displayText}
        <span className="cursor">|</span>
      </div>
    </div>
  );
};

// FeatureCard Component for individual feature items
const FeatureCard = ({ icon: Icon, title, description, delay }) => (
  <div className="feature-card" style={{ animationDelay: `${delay}ms` }}>
    <div className="feature-icon">
      <Icon />
    </div>
    <div className="feature-content">
      <h4>{title}</h4>
      <p>{description}</p>
    </div>
  </div>
);

// Login Popup Component
const LoginPopup = ({ isOpen, onClose, onLogin }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      // Simple validation
      if (!email || !password) {
        setError("Please fill in all fields");
        setLoading(false);
        return;
      }

      // Login API call
      const response = await axios.post(
        "https://collegeforms.in/api/auth/login",
        {
          email,
          password,
        }
      );

      if (response.data.token) {
        localStorage.setItem("userToken", response.data.token);
        localStorage.setItem("user", JSON.stringify(response.data.user));
        onLogin(response.data.token);
        onClose();
      }
    } catch (err) {
      setError(err.response?.data?.message || "Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="login-popup-overlay">
      <div className="login-popup">
        <button className="popup-close-btn" onClick={onClose}>
          ×
        </button>

        <div className="popup-header">
          <img src={logo} width="120px" alt="College Logo" />
          <h3>Login to Continue</h3>
          <p>Please login to search colleges</p>
        </div>

        {error && <div className="popup-error">{error}</div>}

        <form onSubmit={handleSubmit} className="popup-form">
          <div className="form-group">
            <div className="input-container">
              <EmailIcon className="input-icon" />
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="popup-input"
              />
            </div>
          </div>

          <div className="form-group">
            <div className="input-container">
              <LockIcon className="input-icon" />
              <input
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="popup-input"
              />
            </div>
          </div>

          <button type="submit" className="popup-login-btn" disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <div className="popup-footer">
          <p>
            Don't have an account?{" "}
            <Link to="/user/signup" onClick={onClose}>
              Sign Up
            </Link>
          </p>
          <p>
            <Link to="/user/forgot-password" onClick={onClose}>
              Forgot Password?
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

const MerittoLogin = () => {
      const [isModalOpen, setIsModalOpen] = useState(false);
  
  const [authToken, setAuthToken] = useState(null);
  const [showWelcome, setShowWelcome] = useState(false);
  const [showLoginPopup, setShowLoginPopup] = useState(false);
  const navigate = useNavigate();
const API_URL = "https://collegeforms.in";
  // State for filters and dropdown options
  const [filters, setFilters] = useState({
    course: "",
    specialization: "",
    currentCity: "",
    preferredCity: "",
    examAccepted: "",
    educationLevel: "",
    educationMode: "",
  });

  const [dropdownOptions, setDropdownOptions] = useState({
    courses: [],
    allCourses: [],
    specializations: [],
    allSpecializations: [],
    educationLevels: [
      "Under Graduation",
      "Post Graduation",
      "Certification / Diploma",
    ],
    educationModes: [
      "On-Campus Education",
      "Online Education",
      "Study Abroad",
      "Vocational Education",
      "Government Colleges",
    ],
    exams: [],
  });

  useEffect(() => {
    if (authToken) {
      setShowWelcome(true);
      const timer = setTimeout(() => {
        setShowWelcome(false);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [authToken]);

  const [loading, setLoading] = useState({
    courses: true,
    specializations: true,
    exams: true,
  });

  useEffect(() => {
    const token = localStorage.getItem("userToken");
    setAuthToken(token);
    fetchDropdownData();
  }, []);

  const fetchDropdownData = async () => {
    try {
      const coursesRes = await axios.get(`${API_URL}/api/courses`);
      const allCourses = coursesRes.data;
      console.log("Courses API Response:", coursesRes.data);

      const allSpecializations = [];
      const specializationMap = {};

      allCourses.forEach((course) => {
        if (course.specializations && Array.isArray(course.specializations)) {
          course.specializations.forEach((spec) => {
            if (spec.name && !allSpecializations.includes(spec.name)) {
              allSpecializations.push(spec.name);
            }
            if (!specializationMap[spec.name]) {
              specializationMap[spec.name] = [];
            }
            if (!specializationMap[spec.name].includes(course.name)) {
              specializationMap[spec.name].push(course.name);
            }
          });
        }
      });

      const examsRes = await axios.get(`${API_URL}/api/exams`);
      const exams = examsRes.data.map((exam) => exam.name || exam);

      setDropdownOptions((prev) => ({
        ...prev,
        courses: [],
        allCourses,
        specializations: [],
        allSpecializations,
        specializationMap,
        exams:
          exams.length > 0
            ? exams
            : ["JEE Main/Advanced", "NEET", "CAT", "Other"],
      }));

      setLoading({
        courses: false,
        specializations: false,
        exams: false,
      });
    } catch (error) {
      console.error("Error fetching dropdown data:", error);
      setDropdownOptions((prev) => ({
        ...prev,
        courses: [],
        allCourses: [
          {
            name: "BBA",
            type: "UG",
            specializations: [{ name: "Marketing" }, { name: "Finance" }],
          },
          {
            name: "MBA",
            type: "PG",
            specializations: [
              { name: "Marketing" },
              { name: "Finance" },
              { name: "HR" },
            ],
          },
          {
            name: "B.Tech",
            type: "UG",
            specializations: [
              { name: "Computer Science" },
              { name: "Mechanical" },
            ],
          },
          {
            name: "M.Tech",
            type: "PG",
            specializations: [
              { name: "Computer Science" },
              { name: "Mechanical" },
            ],
          },
        ],
        specializations: [],
        allSpecializations: [
          "Marketing",
          "Finance",
          "HR",
          "Computer Science",
          "Mechanical",
        ],
        specializationMap: {
          Marketing: ["BBA", "MBA"],
          Finance: ["BBA", "MBA"],
          HR: ["MBA"],
          "Computer Science": ["B.Tech", "M.Tech"],
          Mechanical: ["B.Tech", "M.Tech"],
        },
        exams: ["JEE Main/Advanced", "NEET", "CAT", "Other"],
      }));
      setLoading({
        courses: false,
        specializations: false,
        exams: false,
      });
    }
  };

  const mapEducationLevelToCourseType = (educationLevel) => {
    switch (educationLevel) {
      case "Under Graduation":
        return "UG";
      case "Post Graduation":
        return "PG";
      case "Certification / Diploma":
        return ["Diploma", "Certificate"];
      default:
        return "";
    }
  };

  const mapEducationLevelToLevelType = (educationLevel) => {
    switch (educationLevel) {
      case "Under Graduation":
        return "UG";
      case "Post Graduation":
        return "PG";
      case "Certification / Diploma":
        return "Diploma";
      default:
        return "";
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;

    if (name === "educationLevel") {
      let filteredCourses = [];
      if (value) {
        const courseType = mapEducationLevelToCourseType(value);
        if (Array.isArray(courseType)) {
          filteredCourses = dropdownOptions.allCourses.filter((course) =>
            courseType.includes(course.type)
          );
        } else {
          filteredCourses = dropdownOptions.allCourses.filter(
            (course) => course.type === courseType
          );
        }
      }

      setDropdownOptions((prev) => ({
        ...prev,
        courses: filteredCourses,
      }));

      setFilters((prev) => ({
        ...prev,
        course: "",
        specialization: "",
        [name]: value,
      }));
      return;
    }

    if (name === "course") {
      let filteredSpecializations = [];
      if (value) {
        const selectedCourse = dropdownOptions.allCourses.find(
          (course) => course.name === value
        );
        if (selectedCourse && selectedCourse.specializations) {
          filteredSpecializations = selectedCourse.specializations.map(
            (spec) => spec.name
          );
        }
      }

      setDropdownOptions((prev) => ({
        ...prev,
        specializations: filteredSpecializations,
      }));

      setFilters((prev) => ({
        ...prev,
        specialization: "",
        [name]: value,
      }));
      return;
    }

    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const saveSearchHistory = async () => {
    try {
      const searchData = {
        course: filters.course,
        specialization: filters.specialization,
        currentCity: filters.currentCity,
        preferredCity: filters.preferredCity,
        examAccepted: filters.examAccepted,
        educationLevel: filters.educationLevel,
        educationMode: filters.educationMode,
      };

      const response = await axios.post(
        `${API_URL}/api/search/save-filters`,
        {
          filters: searchData,
        },
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
            "Content-Type": "application/json",
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error("Error saving search history:", error);
      throw error;
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!authToken) {
      setShowLoginPopup(true);
      return;
    }

    try {
      await saveSearchHistory();
      const levelType = mapEducationLevelToLevelType(filters.educationLevel);
      const queryParams = new URLSearchParams({
        course: filters.course,
        specialization: filters.specialization,
        preferredCity: filters.preferredCity,
        exam: filters.examAccepted,
        level: levelType,
        mode: filters.educationMode,
      }).toString();
      navigate(`/colleges/?${queryParams}`);
    } catch (error) {
      console.error("Error during search:", error);
      if (error.response?.status === 401) {
        localStorage.removeItem("userToken");
        localStorage.removeItem("user");
        setAuthToken(null);
        setShowLoginPopup(true);
      } else {
        alert(
          "An error occurred while processing your search. Please try again."
        );
      }
    }
  };

  const handleLoginSuccess = (token) => {
    setAuthToken(token);
    setShowLoginPopup(false);
  };

  const closeLoginPopup = () => {
    setShowLoginPopup(false);
  };


  const modelopened =()=>{
                setIsModalOpen(true);

  }



  return (
    <div className="meritto-container">
      {/* Login Popup */}
      <LoginPopup
        isOpen={showLoginPopup}
        onClose={closeLoginPopup}
        onLogin={handleLoginSuccess}
      />

      {/* Welcome Message */}
  

      {/* Left Section */}
      <div className="meritto-left">
        <img src={chatbot} alt="College Finder AI" className="mio-image" />
        <h2 className="fw-bolder">
          College Applications Simplified with our UFO <br /> (Universal Form){" "}
        </h2>
        <p>
          Fill out One Universal Application Form. Instantly get matched with
          the colleges that fit your profile and preferences.{" "}
        </p>
        <div className="container justify-content-center text-center d-flex">
          <div className="Explore-clg-3">
            <button onClick={modelopened}>Start Your Application</button>
          </div>
        </div>
      </div>

      {/* Right Section with Typography Effects */}
      <div className="meritto-right">
        <div className="typography-section">
          {/* Logo on top */}
          <div className="logo-container">
            <img src={logo} alt="College Logo" className="top-logo" />
          </div>

          {/* Main Typography Text */}
          <div className="main-typography">
          
            
            <TypingText />
            
  

          </div>
        </div>
      </div>

        <ApplyNowModal
                open={isModalOpen}
                handleClose={() => setIsModalOpen(false)}
                collegeName="Direct Inquiry"
                collegeLocation="Direct Inquiry"
            />
    </div>
  );
};

export default MerittoLogin;