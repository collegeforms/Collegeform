import React, { Fragment, useState, useEffect } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from '../../components/Navbar/Navbar';
import Scrollbar from '../../components/scrollbar/scrollbar';
import { useParams } from 'react-router-dom';
import Footer from '../../components/footer/Footer';
import { useNavigate, useLocation } from "react-router-dom";
import { useCart } from '../router/context/CartContext';
import { 
  FiCheckCircle, 
  FiAward, 
  FiBook, 
  FiMapPin, 
  FiFileText,
  FiBarChart2,
  FiChevronLeft,
  FiChevronRight,
  FiStar,
  FiClock,
  FiUsers,
  FiGlobe,
  FiPlay,
  FiX,
  FiPhone,
  FiUser,
  FiMessageCircle,
  FiShoppingCart,
  FiCheck
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
    const [isCallbackModalOpen, setIsCallbackModalOpen] = useState(false);
    const [callbackForm, setCallbackForm] = useState({
        name: '',
        phone: '',
        courseInterest: ''
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitStatus, setSubmitStatus] = useState('');
    const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });
    const navigate = useNavigate();
    const location = useLocation();

    // Use cart context
    const { addToCart, isItemInCart, cartItems } = useCart();

    const API_URL = "https://collegeforms.in";
    const authToken = localStorage.getItem('userToken');

    useEffect(() => {
        const fetchCollege = async () => {
            try {
                const response = await axios.get(`${API_URL}/api/colleges/${id}`);
                const coursesResponse = await axios.get(`${API_URL}/api/courses`);
                console.log(response.data.college);
                
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

    const showSnackbar = (message, severity = "success") => {
        setSnackbar({ open: true, message, severity });
    };

    // Check if callback is enabled - using correct field name
    const isCallbackEnabled = college?.isRequestcallback || false;

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

    // Callback modal functions - UPDATED WITH REAL API CALL
    const openCallbackModal = () => {
        setIsCallbackModalOpen(true);
        setSubmitStatus('');
        setCallbackForm({
            name: '',
            phone: '',
            courseInterest: ''
        });
    };

    const closeCallbackModal = () => {
        setIsCallbackModalOpen(false);
        setSubmitStatus('');
    };

    const handleCallbackInputChange = (e) => {
        const { name, value } = e.target;
        setCallbackForm(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleCallbackSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setSubmitStatus('');

        try {
            // REAL API CALL - all fields are optional
            await axios.post(`${API_URL}/api/callbacks`, {
                name: callbackForm.name || null,
                mobile: callbackForm.phone || null,
                email: null, // You can add email field if needed
                course: callbackForm.courseInterest || null,
                collegeName: college?.name || null,
                collegeId: id || null
            });

            setSubmitStatus('success');
            showSnackbar("Callback request submitted successfully!");
            
            setTimeout(() => {
                closeCallbackModal();
            }, 2000);
        } catch (error) {
            console.error('Error submitting callback request:', error);
            setSubmitStatus('error');
            showSnackbar("Failed to submit callback request. Please try again.", "error");
        } finally {
            setIsSubmitting(false);
        }
    };

    // Add to cart function
    const handleAddToCart = async (course, coursePricing) => {
        if (!authToken) {
            showSnackbar("Please login to add items to cart", "warning");
            setTimeout(() => {
                navigate('/user/login', { 
                    state: { from: location }
                });
            }, 1500);
            return;
        }

        const cartItemData = {
            collegeId: college.id || college._id,
            collegeName: college.name,
            collegeLocation: college.location,
            collegeImage: college.image,
            courseName: course,
            originalFees: coursePricing?.originalFees || 0,
            discountedFees: coursePricing?.discountedFees || coursePricing?.originalFees || 0,
            slug: college.slug
        };

        try {
            await addToCart(cartItemData);
            showSnackbar("Course added to cart successfully!");
        } catch (error) {
            if (error.message.includes("login")) {
                showSnackbar("Please login to add items to cart", "warning");
                setTimeout(() => {
                    navigate('/user/login', { 
                        state: { from: location }
                    });
                }, 1500);
            } else if (error.message.includes("already in cart")) {
                showSnackbar("This course is already in your cart", "info");
            } else {
                showSnackbar("Failed to add course to cart", "error");
            }
        }
    };

    // Auto slide functionality
    useEffect(() => {
        if (images.length > 1) {
            const interval = setInterval(() => {
                nextImage();
            }, 5000);

            return () => clearInterval(interval);
        }
    }, [images.length, currentImageIndex]);

    const handleApplyClick = () => {
        if (authToken) {
            navigate("/step", { state: { college } });
        } else {
            navigate('/user/login', { 
                state: { from: location }
            });
        }
    };

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
                                        {isCallbackEnabled ? (
                                            <motion.button
                                                whileHover={{ scale: 1.02 }}
                                                whileTap={{ scale: 0.98 }}
                                                onClick={openCallbackModal}
                                                className="apply-cta-btn"
                                            >
                                                <FiPhone className="callback-btn-icon-3 me-2" />
                                                Request Callback
                                            </motion.button>
                                        ) : (
                                            <motion.button
                                                whileHover={{ scale: 1.02 }}
                                                whileTap={{ scale: 0.98 }}
                                                onClick={handleApplyClick}
                                                className="apply-cta-btn"
                                            >
                                                Apply Now
                                            </motion.button>
                                        )}
                                        <p className="cta-note">
                                            {isCallbackEnabled 
                                                ? "Get personalized guidance from our experts" 
                                                : "Secure your seat for the upcoming academic year"
                                            }
                                        </p>
                                    </div>
                                </div>

                                <div className='col-md-7  order-md-2 order-1'>
                                    <div className="main-gallery">
                                        {images.length > 0 ? (
                                            <>
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
                                            </>
                                        ) : (
                                            <div className="no-image-placeholder">
                                                <FiBook className="no-image-icon" />
                                                <p>No image available</p>
                                            </div>
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
                                        <div className="stat-value">
                                            ₹{college.minFees || 'N/A'} - ₹{college.maxFees || 'N/A'} {college.minFees || college.maxFees ? 'L' : ''}
                                        </div>
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
                                                                <div className="highlight-title">{highlight.title || `Highlight ${index + 1}`}</div>
                                                                <div className="highlight-desc">{highlight.description || 'No description available'}</div>
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
                                                    const isCourseInCart = isItemInCart(college.id || college._id, course);
                                                    
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
                                                                            <span className="original-price">₹{coursePricing.originalFees || 'N/A'}</span>
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
                                                            
                                                            {/* Add to Cart Button */}
                                                            <div style={{ 
                                                                padding: '16px', 
                                                                borderTop: '1px solid #f0f0f0', 
                                                                marginTop: '12px' 
                                                            }}>
                                                                {isCourseInCart ? (
                                                                    <motion.button
                                                                        initial={{ scale: 0.8 }}
                                                                        animate={{ scale: 1 }}
                                                                        style={{
                                                                            width: '50%',
                                                                            padding: '12px 24px',
                                                                            backgroundColor: '#10b981',
                                                                            color: 'white',
                                                                            border: 'none',
                                                                            borderRadius: '8px',
                                                                            fontWeight: '600',
                                                                            fontSize: '14px',
                                                                            display: 'flex',
                                                                            alignItems: 'center',
                                                                            justifyContent: 'center',
                                                                            gap: '8px',
                                                                            cursor: 'not-allowed',
                                                                            boxShadow: '0 2px 8px rgba(16, 185, 129, 0.3)'
                                                                        }}
                                                                        disabled
                                                                    >
                                                                        <FiCheck style={{ fontSize: '16px' }} />
                                                                        Added to Cart
                                                                    </motion.button>
                                                                ) : (
                                                                    <motion.button
                                                                        whileHover={{ 
                                                                            scale: 1.02,
                                                                            backgroundColor: '#002244',
                                                                            boxShadow: '0 4px 12px rgba(0, 51, 102, 0.4)'
                                                                        }}
                                                                        whileTap={{ scale: 0.98 }}
                                                                        onClick={() => handleAddToCart(course, coursePricing)}
                                                                        style={{
                                                                            width: '50%',
                                                                            padding: '12px 24px',
                                                                            backgroundColor: '#003366',
                                                                            color: 'white',
                                                                            border: 'none',
                                                                            borderRadius: '8px',
                                                                            fontWeight: '600',
                                                                            fontSize: '14px',
                                                                            display: 'flex',
                                                                            alignItems: 'center',
                                                                            justifyContent: 'center',
                                                                            gap: '8px',
                                                                            cursor: 'pointer',
                                                                            transition: 'all 0.3s ease',
                                                                            boxShadow: '0 2px 8px rgba(0, 51, 102, 0.3)'
                                                                        }}
                                                                    >
                                                                        <FiShoppingCart style={{ fontSize: '16px' }} />
                                                                        Add to Cart
                                                                    </motion.button>
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
                                                                <div className="step-number">{step.step || index + 1}</div>
                                                                {index < college.admissionProcess.length - 1 && (
                                                                    <div className="step-connector"></div>
                                                                )}
                                                            </div>
                                                            <div className="step-details">
                                                                <h4 className="step-title">{step.title || `Step ${index + 1}`}</h4>
                                                                <p className="step-description">{step.description || 'No description available'}</p>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}

                                        {/* Required Documents */}
                                        {college.requiredDocuments && college.requiredDocuments.length > 0 && (
                                            <div className="college-section">
                                                <h3 className="section-title-2">Required Documents</h3>
                                                <div className="documents-grid-new">
                                                    {college.requiredDocuments.map((doc, index) => (
                                                        <div key={index} className="document-item-new">
                                                            <FiFileText className="doc-item-icon" />
                                                            <span className="doc-name">{doc.name || `Document ${index + 1}`}</span>
                                                            {doc.isRequired === false && (
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
                                                                {company.name ? company.name.charAt(0) : 'C'}
                                                            </div>
                                                            <div className="company-info">
                                                                <div className="company-name">{company.name || `Company ${index + 1}`}</div>
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

            {/* Callback Modal */}
            <AnimatePresence>
                {isCallbackModalOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="callback-modal-overlay-3"
                        onClick={closeCallbackModal}
                    >
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            className="callback-modal-content-3"
                            onClick={(e) => e.stopPropagation()}
                        >
                            {/* Header */}
                            <div className="callback-modal-header-3">
                                <div className="callback-modal-icon-wrapper-3">
                                    <FiPhone className="callback-modal-main-icon-3" />
                                </div>
                                <button 
                                    className="callback-modal-close-btn-3"
                                    onClick={closeCallbackModal}
                                >
                                    <FiX size={18} />
                                </button>
                            </div>

                            {/* Body */}
                            <div className="callback-modal-body-3">
                                <h3 className="callback-modal-title-3">Request a Callback</h3>
                                <p className="callback-modal-subtitle-3">
                                    Share your details and we'll call you back within 30 minutes
                                </p>

                                {submitStatus === 'success' ? (
                                    <motion.div
                                        initial={{ opacity: 0, scale: 0.8 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        className="callback-success-message-3"
                                    >
                                        <FiCheckCircle className="success-icon-3" />
                                        <h4>Thank You!</h4>
                                        <p>We'll call you shortly</p>
                                    </motion.div>
                                ) : (
                                    <form onSubmit={handleCallbackSubmit} className="callback-form-3">
                                        <div className="callback-input-group-3">
                                            <FiUser className="callback-input-icon-3" />
                                            <input
                                                type="text"
                                                name="name"
                                                value={callbackForm.name}
                                                onChange={handleCallbackInputChange}
                                                className="callback-form-input-3"
                                                placeholder="Your Name (Optional)"
                                            />
                                        </div>

                                        <div className="callback-input-group-3">
                                            <FiPhone className="callback-input-icon-3" />
                                            <input
                                                type="tel"
                                                name="phone"
                                                value={callbackForm.phone}
                                                onChange={handleCallbackInputChange}
                                                className="callback-form-input-3"
                                                required
                                                placeholder="Phone Number *"
                                            />
                                        </div>

                                        <div className="callback-input-group-3">
                                            <FiBook className="callback-input-icon-3" />
                                            <select
                                                name="courseInterest"
                                                value={callbackForm.courseInterest}
                                                onChange={handleCallbackInputChange}
                                                className="callback-form-input-3"
                                            >
                                                <option value="">Select Course Interest (Optional)</option>
                                                {college.courses && college.courses.map((course, index) => (
                                                    <option key={index} value={course}>{course}</option>
                                                ))}
                                            </select>
                                        </div>

                                        {submitStatus === 'error' && (
                                            <div className="callback-error-message-3">
                                                Failed to submit. Please try again.
                                            </div>
                                        )}

                                        <motion.button
                                            type="submit"
                                            disabled={isSubmitting}
                                            whileHover={{ scale: 1.02 }}
                                            whileTap={{ scale: 0.98 }}
                                            className="callback-submit-btn-3"
                                        >
                                            {isSubmitting ? (
                                                <>
                                                    <div className="callback-submit-spinner-3"></div>
                                                    Processing...
                                                </>
                                            ) : (
                                                <>
                                                    <FiMessageCircle className="submit-btn-icon-3" />
                                                    Request Callback
                                                </>
                                            )}
                                        </motion.button>
                                    </form>
                                )}
                            </div>

                            {/* Footer */}
                            <div className="callback-modal-footer-3">
                                <p className="callback-modal-assurance-3">
                                    <FiCheckCircle className="assurance-icon-3" />
                                    Your information is secure and confidential
                                </p>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Custom Snackbar */}
            {snackbar.open && (
                <motion.div
                    initial={{ opacity: 0, x: -100 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -100 }}
                    style={{
                        position: 'fixed',
                        bottom: '20px',
                        left: '20px',
                        zIndex: 9999,
                        padding: '16px 24px',
                        borderRadius: '8px',
                        color: 'white',
                        fontWeight: '600',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                        backgroundColor: 
                            snackbar.severity === 'success' ? '#10b981' :
                            snackbar.severity === 'error' ? '#ef4444' :
                            snackbar.severity === 'warning' ? '#f59e0b' :
                            snackbar.severity === 'info' ? '#3b82f6' : '#003366',
                        minWidth: '300px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px'
                    }}
                >
                    {snackbar.severity === 'success' && <FiCheckCircle style={{ fontSize: '18px' }} />}
                    {snackbar.severity === 'error' && <FiX style={{ fontSize: '18px' }} />}
                    {snackbar.severity === 'warning' && <FiCheckCircle style={{ fontSize: '18px' }} />}
                    {snackbar.severity === 'info' && <FiCheckCircle style={{ fontSize: '18px' }} />}
                    {snackbar.message}
                    <button 
                        onClick={() => setSnackbar({ ...snackbar, open: false })}
                        style={{
                            background: 'none',
                            border: 'none',
                            color: 'white',
                            marginLeft: 'auto',
                            cursor: 'pointer',
                            fontSize: '16px'
                        }}
                    >
                        <FiX />
                    </button>
                </motion.div>
            )}

            <Footer />
            <Scrollbar />
        </Fragment>
    )
};

export default CollegeSinglePage;