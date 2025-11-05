import React, { Fragment, useState, useEffect } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from '../../components/Navbar/Navbar';
import Scrollbar from '../../components/scrollbar/scrollbar';
import { useParams } from 'react-router-dom';
import Footer from '../../components/footer/Footer';
import { useNavigate } from "react-router-dom";
import { 
  FiCheckCircle, 
  FiAward, 
  FiBook, 
  FiMapPin, 
  FiFileText,
  FiDollarSign,
  FiBarChart2,
  FiCalendar,
  FiChevronLeft,
  FiChevronRight,
  FiStar,
  FiClock,
  FiUsers,
  FiGlobe,
  FiPlay
} from 'react-icons/fi';
import "./collegeSingle.css";

const CollegeSinglePage = (props) => {
    const { id } = useParams();
    const [college, setCollege] = useState(null);
    const [allCourses, setAllCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('overview');
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const navigate = useNavigate();
const API_URL = "https://collegeforms.in";

    const authToken = localStorage.getItem('userToken');

    useEffect(() => {
        const fetchCollege = async () => {
            try {
                const response = await axios.get(`${API_URL}/api/colleges/${id}`);
                const coursesResponse = await axios.get(`${API_URL}/api/courses`);
                
                setCollege(response.data.college || response.data);
                setAllCourses(coursesResponse.data);

            } catch (error) {
                console.error("Error fetching college:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchCollege();
    }, [id]);

    // Get all images including main image and additional images
    const getAllImages = () => {
        if (!college) return [];
        
        const images = [];
        if (college.image) {
            images.push(college.image);
        }
        if (college.additionalImages && college.additionalImages.length > 0) {
            images.push(...college.additionalImages);
        }
        return images;
    };

    const images = getAllImages();

    // Image slider functions
    const nextImage = () => {
        setCurrentImageIndex((prev) => (prev + 1) % images.length);
    };

    const prevImage = () => {
        setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
    };

    const goToImage = (index) => {
        setCurrentImageIndex(index);
    };

    const openModal = (index = 0) => {
        setCurrentImageIndex(index);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
    };

    // Auto slide functionality
    useEffect(() => {
        if (images.length > 1) {
            const interval = setInterval(() => {
                nextImage();
            }, 5000); // Change image every 5 seconds

            return () => clearInterval(interval);
        }
    }, [images.length, currentImageIndex]);

    if (loading) {
        return (
            <div className="college-loading-screen">
                <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    className="college-loading-spinner"
                ></motion.div>
            </div>
        );
    }

    if (!college) {
        return (
            <div className="college-not-found">
                <h2 className="college-not-found-text">College not found</h2>
            </div>
        );
    }

    const handleApplyClick = () => {
        if (authToken) {
            navigate("/step", { state: { college } });
        } else {
            navigate("/user/signup");
        }
    };

    // Animation variants
    const fadeIn = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
    };

    const staggerContainer = {
        visible: {
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    return (
        <Fragment>
            <Navbar hclass={'wpo-header-style-4'} />
            <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="college-detail-page"
            >
                {/* Main Layout Grid */}
                <div className="college-layout-grid">
                    {/* Left Column - Content */}
                    <div className="college-content-column">
                        {/* College Header */}
                        <motion.div 
                            variants={fadeIn}
                            initial="hidden"
                            animate="visible"
                            className="college-header-card"
                        >
                            {/* <div className="college-badge">TOP RATED</div> */}

                            <div className='row' >
                                <div className='col-md-5 order-md-1 order-2'>
                                    <h1 className="college-main-title">{college.name || 'College Name Not Available'}</h1>
                                    
                                    <div className="college-meta-stack">
                                        {college.location && (
                                            <div className="college-meta-chip">
                                                <FiMapPin className="college-meta-icon" />
                                                <span className="college-meta-text">{college.location}</span>
                                            </div>
                                        )}
                                        
                                        {college.rating && (
                                            <div className="college-meta-chip">
                                                <FiStar className="college-meta-icon" />
                                                <span className="college-meta-text">{college.rating}/5 Rating</span>
                                            </div>
                                        )}
                                        
                                        {college.collegeType && college.collegeType.length > 0 && (
                                            <div className="college-meta-chip">
                                                <FiUsers className="college-meta-icon" />
                                                <span className="college-meta-text">
                                                    {Array.isArray(college.collegeType) ? college.collegeType.join(', ') : college.collegeType}
                                                </span>
                                            </div>
                                        )}
                                    </div>

                                    {(college.tagline || college.shortDescription) && (
                                        <p className="college-subtitle">
                                            {college.tagline || college.shortDescription}
                                        </p>
                                    )}

                                    <div className="cta-section-2">
                                        <motion.button
                                            whileHover={{ scale: 1.02 }}
                                            whileTap={{ scale: 0.98 }}
                                            onClick={handleApplyClick}
                                            className="apply-cta-btn"
                                        >
                                            Apply Now
                                        </motion.button>
                                        <p className="cta-note">Secure your seat for the upcoming academic year</p>
                                    </div>
                                </div>

                                <div className='col-md-7  order-md-2 order-1'>
                                    <div className="main-gallery">
                                        <motion.img 
                                            key={currentImageIndex}
                                            src={images[currentImageIndex]}
                                            alt={`${college.name} - Image ${currentImageIndex + 1}`}
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            transition={{ duration: 0.5 }}
                                            className="gallery-main-image"
                                            onClick={() => openModal(currentImageIndex)}
                                        />
                                        
                                        {images.length > 1 && (
                                            <>
                                                <button className="gallery-nav-btn prev-btn" onClick={prevImage}>
                                                    <FiChevronLeft />
                                                </button>
                                                <button className="gallery-nav-btn next-btn" onClick={nextImage}>
                                                    <FiChevronRight />
                                                </button>
                                                
                                                <div className="gallery-counter">
                                                    {currentImageIndex + 1} / {images.length}
                                                </div>

                                                {/* Auto-slide indicator dots */}
                                                <div className="auto-slide-dots">
                                                    {images.map((_, index) => (
                                                        <div 
                                                            key={index}
                                                            className={`auto-slide-dot ${index === currentImageIndex ? 'active' : ''}`}
                                                            onClick={() => goToImage(index)}
                                                        />
                                                    ))}
                                                </div>
                                            </>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </motion.div>

                        {/* Quick Stats */}
                        <motion.div 
                            variants={staggerContainer}
                            initial="hidden"
                            animate="visible"
                            className="college-stats-grid"
                        >
                            {(college.minFees || college.maxFees) && (
                                <motion.div variants={fadeIn} className="college-stat-item">
                                    <div className="stat-icon-wrapper text-light">
                                        ₹
                                    </div>
                                    <div className="stat-content">
                                        <div className="stat-label">Fees Range</div>
                                        <div className="stat-value">₹{college.minFees || 'N/A'} - ₹{college.maxFees || 'N/A'} L</div>
                                    </div>
                                </motion.div>
                            )}

                            {college.avgPackage && (
                                <motion.div variants={fadeIn} className="college-stat-item">
                                    <div className="stat-icon-wrapper">
                                        <FiBarChart2 className="stat-icon" />
                                    </div>
                                    <div className="stat-content">
                                        <div className="stat-label">Avg Package</div>
                                        <div className="stat-value">₹{college.avgPackage} LPA</div>
                                    </div>
                                </motion.div>
                            )}

                            {college.courses && college.courses.length > 0 && (
                                <motion.div variants={fadeIn} className="college-stat-item">
                                    <div className="stat-icon-wrapper">
                                        <FiBook className="stat-icon" />
                                    </div>
                                    <div className="stat-content">
                                        <div className="stat-label">Courses</div>
                                        <div className="stat-value">{college.courses.length}+ Programs</div>
                                    </div>
                                </motion.div>
                            )}
                        </motion.div>

                        {/* Tabs Navigation */}
                        <div className="college-tabs-nav">
                            <button 
                                className={`college-tab-btn ${activeTab === 'overview' ? 'college-tab-active' : ''}`}
                                onClick={() => setActiveTab('overview')}
                            >
                                <FiGlobe className="tab-icon" />
                                Overview
                            </button>
                            <button 
                                className={`college-tab-btn ${activeTab === 'courses' ? 'college-tab-active' : ''}`}
                                onClick={() => setActiveTab('courses')}
                            >
                                <FiBook className="tab-icon" />
                                Courses
                            </button>
                            <button 
                                className={`college-tab-btn ${activeTab === 'admission' ? 'college-tab-active' : ''}`}
                                onClick={() => setActiveTab('admission')}
                            >
                                <FiPlay className="tab-icon" />
                                Admission
                            </button>
                            <button 
                                className={`college-tab-btn ${activeTab === 'placement' ? 'college-tab-active' : ''}`}
                                onClick={() => setActiveTab('placement')}
                            >
                                <FiAward className="tab-icon" />
                                Placement
                            </button>
                        </div>

                        {/* Tab Content */}
                        <div className="college-tab-content">
                            <AnimatePresence mode="wait">
                                {activeTab === 'overview' && (
                                    <motion.div
                                        key="overview"
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                        className="college-tab-panel"
                                    >
                                        <h2 className="tab-panel-title">About {college.name}</h2>
                                        <p className="college-description">
                                            {college.description || college.shortDescription || 'No description available.'}
                                        </p>
                                        
                                        {/* Key Highlights */}
                                        {college.keyHighlights && college.keyHighlights.length > 0 && (
                                            <div className="college-section">
                                                <h3 className="section-title-2">Key Highlights</h3>
                                                <div className="highlights-container">
                                                    {college.keyHighlights.map((highlight, index) => (
                                                        <div key={index} className="highlight-card">
                                                            <FiCheckCircle className="highlight-icon" />
                                                            <div className="highlight-content">
                                                                <div className="highlight-title">{highlight.title}</div>
                                                                <div className="highlight-desc">{highlight.description}</div>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}

                                        {/* Exams */}
                                        {college.exams && college.exams.length > 0 && (
                                            <div className="college-section">
                                                <h3 className="section-title-2">Accepted Exams</h3>
                                                <div className="tags-flex">
                                                    {college.exams.map((exam, index) => (
                                                        <span key={index} className="exam-tag">{exam}</span>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </motion.div>
                                )}

                                {activeTab === 'courses' && (
                                    <motion.div
                                        key="courses"
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                        className="college-tab-panel"
                                    >
                                        <h2 className="tab-panel-title">Courses Offered</h2>
                                        
                                        {college.courses && college.courses.length > 0 ? (
                                            <div className="courses-container">
                                                {college.courses.map((course, i) => {
                                                    const coursePricing = college.coursePricing?.find(cp => 
                                                        cp.courseName === course
                                                    );
                                                    
                                                    return (
                                                        <motion.div 
                                                            whileHover={{ y: -4 }}
                                                            key={i} 
                                                            className="course-card-new"
                                                        >
                                                            <div className="course-card-header">
                                                                <div className="course-icon-bg">
                                                                    <FiBook className="course-card-icon" />
                                                                </div>
                                                                <div className="course-title-section">
                                                                    <h3 className="course-name">{course}</h3>
                                                                    {coursePricing?.duration && (
                                                                        <div className="course-duration">
                                                                            <FiClock className="duration-icon" />
                                                                            {coursePricing.duration} years
                                                                        </div>
                                                                    )}
                                                                </div>
                                                            </div>
                                                            <div className="course-card-body">
                                                                {coursePricing && (
                                                                    <div className="course-pricing-section">
                                                                        <div className="pricing-main">
                                                                            <span className="original-price">₹{coursePricing.originalFees}</span>
                                                                            {coursePricing.discountedFees && (
                                                                                <span className="discounted-price">₹{coursePricing.discountedFees}</span>
                                                                            )}
                                                                        </div>
                                                                        {coursePricing.discountPercentage && (
                                                                            <div className="discount-badge-new">
                                                                                {coursePricing.discountPercentage}% OFF
                                                                            </div>
                                                                        )}
                                                                    </div>
                                                                )}
                                                                
                                                                {coursePricing?.seatsAvailable && (
                                                                    <div className="seats-info">
                                                                        <FiUsers className="seats-icon" />
                                                                        {coursePricing.seatsAvailable} seats available
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </motion.div>
                                                    );
                                                })}
                                            </div>
                                        ) : (
                                            <div className="no-data-state">
                                                <FiBook className="no-data-icon" />
                                                <p>No courses information available</p>
                                            </div>
                                        )}
                                    </motion.div>
                                )}

                                {activeTab === 'admission' && (
                                    <motion.div
                                        key="admission"
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                        className="college-tab-panel"
                                    >
                                        {/* Admission Process */}
                                        {college.admissionProcess && college.admissionProcess.length > 0 && (
                                            <div className="college-section">
                                                <h3 className="section-title-2">Admission Process</h3>
                                                <div className="process-flow">
                                                    {college.admissionProcess.map((step, index) => (
                                                        <div key={index} className="process-step-new">
                                                            <div className="step-indicator">
                                                                <div className="step-number">{step.step}</div>
                                                                {index < college.admissionProcess.length - 1 && (
                                                                    <div className="step-connector"></div>
                                                                )}
                                                            </div>
                                                            <div className="step-details">
                                                                <h4 className="step-title">{step.title}</h4>
                                                                <p className="step-description">{step.description}</p>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}

                                        {/* Important Dates */}
                                        <div className="college-section">
                                            <h3 className="section-title-2">Important Dates</h3>
                                            {(college.importantDates && college.importantDates.length > 0) || college.applicationDeadline ? (
                                                <div className="dates-container">
                                                    {college.applicationDeadline && (
                                                        <div className="date-card-new primary">
                                                            <FiCalendar className="date-card-icon" />
                                                            <div className="date-card-content">
                                                                <div className="date-title">Application Deadline</div>
                                                                <div className="date-value">
                                                                    {new Date(college.applicationDeadline).toLocaleDateString()}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    )}
                                                    {college.importantDates?.map((date, index) => (
                                                        <div key={index} className="date-card-new">
                                                            <FiCalendar className="date-card-icon" />
                                                            <div className="date-card-content">
                                                                <div className="date-title">{date.title || `Important Date ${index + 1}`}</div>
                                                                <div className="date-value">
                                                                    {new Date(date.date).toLocaleDateString()}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            ) : (
                                                <div className="no-data-state">
                                                    <FiCalendar className="no-data-icon" />
                                                    <p>No important dates available</p>
                                                </div>
                                            )}
                                        </div>

                                        {/* Required Documents */}
                                        {college.requiredDocuments && college.requiredDocuments.length > 0 && (
                                            <div className="college-section">
                                                <h3 className="section-title-2">Required Documents</h3>
                                                <div className="documents-grid-new">
                                                    {college.requiredDocuments.map((doc, index) => (
                                                        <div key={index} className="document-item-new">
                                                            <FiFileText className="doc-item-icon" />
                                                            <span className="doc-name">{doc.name}</span>
                                                            {!doc.isRequired && (
                                                                <span className="optional-tag">Optional</span>
                                                            )}
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </motion.div>
                                )}

                                {activeTab === 'placement' && (
                                    <motion.div
                                        key="placement"
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                        className="college-tab-panel"
                                    >
                                        <h2 className="tab-panel-title">Placement Statistics</h2>
                                        
                                        {/* Placement Stats */}
                                        <div className="placement-stats-new">
                                            <div className="placement-stat-card">
                                                <div className="placement-stat-value">₹{college.avgPackage || 'N/A'} LPA</div>
                                                <div className="placement-stat-label">Average Package</div>
                                            </div>
                                            <div className="placement-stat-card">
                                                <div className="placement-stat-value">₹{(college.avgPackage || 0) + 4} LPA</div>
                                                <div className="placement-stat-label">Highest Package</div>
                                            </div>
                                            <div className="placement-stat-card">
                                                <div className="placement-stat-value">92%</div>
                                                <div className="placement-stat-label">Placement Rate</div>
                                            </div>
                                        </div>

                                        {/* Placement Companies */}
                                        {college.placementCompanies && college.placementCompanies.length > 0 && (
                                            <div className="college-section">
                                                <h3 className="section-title-2">Top Recruiters</h3>
                                                <div className="companies-grid-new">
                                                    {college.placementCompanies.map((company, index) => (
                                                        <div key={index} className="company-card-new">
                                                            <div className="company-logo-placeholder">
                                                                {company.name.charAt(0)}
                                                            </div>
                                                            <div className="company-info">
                                                                <div className="company-name">{company.name}</div>
                                                                {company.avgPackage && (
                                                                    <div className="company-package-new">₹{company.avgPackage}L</div>
                                                                )}
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}

                                        {/* Placement Highlights */}
                                        <div className="college-section">
                                            <h3 className="section-title-2">Placement Highlights</h3>
                                            {college.placementHighlights && college.placementHighlights.length > 0 ? (
                                                <div className="highlights-list-new">
                                                    {college.placementHighlights.map((highlight, index) => (
                                                        <div key={index} className="highlight-item-new">
                                                            <FiCheckCircle className="highlight-bullet" />
                                                            <span>{highlight}</span>
                                                        </div>
                                                    ))}
                                                </div>
                                            ) : (
                                                <div className="highlights-list-new">
                                                    <div className="highlight-item-new">
                                                        <FiCheckCircle className="highlight-bullet" />
                                                        <span>100+ companies visited campus</span>
                                                    </div>
                                                    <div className="highlight-item-new">
                                                        <FiCheckCircle className="highlight-bullet" />
                                                        <span>50% students received multiple offers</span>
                                                    </div>
                                                    <div className="highlight-item-new">
                                                        <FiCheckCircle className="highlight-bullet" />
                                                        <span>Dedicated placement cell</span>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </div>
                </div>
            </motion.div>
            <Footer />
            <Scrollbar />
        </Fragment>
    )
};

export default CollegeSinglePage;