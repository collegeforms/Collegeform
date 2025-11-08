import React, { useState } from 'react';
import Navbar from '../../components/Navbar/Navbar';
import PageTitle from '../../components/pagetitle/PageTitle';
import Footer from '../../components/footer/Footer';
import Scrollbar from '../../components/scrollbar/scrollbar';
import { Helmet } from "react-helmet-async";
import './StudyAbroad.css'; // Create this CSS file

const Privacypage = (props) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedCountry, setSelectedCountry] = useState('');

    const handleOpenModal = (countryName) => {
        setSelectedCountry(countryName);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedCountry('');
    };

    // Country data with images
    const countries = [
        { 
            name: "United States", 
            image: "https://images.unsplash.com/photo-1483721310020-03333e577078?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
            description: "The United States offers high-quality universities, groundbreaking research and a wealth of cultural experiences. With programs that allow for flexibility and numerous scholarships available, the United States is a great destination for students interested in being cutting-edge and global in education."
        },
        { 
            name: "United Kingdom", 
            image: "https://images.unsplash.com/photo-1486299267070-83823f5448dd?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
            description: "Get a world-class degree, study at historic campuses and experience a variety of programs while abroad with the United Kingdom, where study programs are shorter than most places, the job market is more favorable, and international students are warmly welcomed."
        },
        { 
            name: "Canada", 
            image: "https://images.unsplash.com/photo-1501594907352-04cda38ebc29?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
            description: "Canada provides students with a high-quality education, a supportive environment, and the opportunity for work during and after their education. Low tuition rates and multicultural cities make Canada an ideal destination for international students."
        },
        { 
            name: "Australia", 
            image: "https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
            description: "Australia provides students a combination of reputable universities, a casual lifestyle, global recognition, and the opportunity for research, internships (informal and formal), and cosmopolitan cities and nightlife."
        },
        { 
            name: "Germany", 
            image: "https://images.unsplash.com/photo-1528728329032-2972f65dfb3f?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
            description: "Germany boasts universities that charge little or no money for tuition, excellent engineering and technology programs, and strong ties to industry, making it a great destination for students interested in studying at good institutions at a low cost."
        },
        { 
            name: "Singapore", 
            image: "https://images.unsplash.com/photo-1565967511849-76a60a516170?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
            description: "Singapore is home to some of the best schools in the world, some of the best business programs, and a safe modern city to study and live in. Being based in Asia opens doors for students to find employment opportunities everywhere."
        },
        { 
            name: "France", 
            image: "https://images.unsplash.com/photo-1431274172761-fca41d930114?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
            description: "Studying in France gives you world-class arts and culture as well as a world-class culinary education. Low tuition and unique programs make it an attractive destination for students in search of educational cultural experiences."
        },
        { 
            name: "Dubai (UAE)", 
            image: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
            description: "Dubai emerged rapidly as an important educational center, with international campuses, infrastructure to support learning, and employment opportunities in business, technology, and hospitality."
        },
        { 
            name: "Ireland", 
            image: "https://images.unsplash.com/photo-1549918864-48ac978761a4?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
            description: "Ireland has a wealthy cultural history in combination with superb universities with cutting-edge research. The English-speaking courses and welcoming culture create a unique opportunity for international students."
        },
        { 
            name: "New Zealand", 
            image: "https://images.unsplash.com/photo-1507699622108-4be3abd695ad?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
            description: "New Zealand is an academic pathway with leading programs, incredible landscapes, and student-friendly visas. It is ideal for a student looking for a balance of an active life, along with solid academic programs."
        }
    ];

    // Courses data
    const courses = [
        {
            name: "Data Science & AI",
            image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80"
        },
        {
            name: "Cybersecurity",
            image: "https://images.unsplash.com/photo-1563986768609-322da13575f3?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80"
        },
        {
            name: "Renewable Energy",
            image: "https://images.unsplash.com/photo-1508514177221-188b1cf16e9d?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80"
        },
        {
            name: "Robotics & Automation",
            image: "https://images.unsplash.com/photo-1593508512255-86ab42a8e620?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80"
        },
        {
            name: "Biomedical Engineering",
            image: "https://images.unsplash.com/photo-1579684385127-1ef15d508118?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80"
        },
        {
            name: "Digital Marketing",
            image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80"
        }
    ];

    // Exams data
    const exams = [
        {
            name: "GRE",
            description: "Graduate programs (USA)",
            cutoff: "300-330+",
            image: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80"
        },
        {
            name: "GMAT",
            description: "MBA programs",
            cutoff: "650-700+",
            image: "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80"
        },
        {
            name: "IELTS/TOEFL",
            description: "English proficiency",
            cutoff: "6.5-7.5/80-100",
            image: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80"
        },
        {
            name: "SAT",
            description: "Undergraduate (USA)",
            cutoff: "1400+",
            image: "https://images.unsplash.com/photo-1588072432836-e10032774350?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80"
        }
    ];

    // Study Abroad Inquiry Modal Component
    const StudyAbroadInquiryModal = ({ open, handleClose, country }) => {
        const [formData, setFormData] = useState({
            name: '',
            phone: '',
            email: '',
            message: ''
        });
        const [isLoading, setIsLoading] = useState(false);
        const [success, setSuccess] = useState(false);

        const handleChange = (e) => {
            setFormData({ ...formData, [e.target.name]: e.target.value });
        };

        const handleSubmit = async (e) => {
            e.preventDefault();
            setIsLoading(true);

            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            setSuccess(true);
            setIsLoading(false);
            
            setTimeout(() => {
                handleClose();
                setSuccess(false);
                setFormData({ name: '', phone: '', email: '', message: '' });
            }, 2000);
        };

        if (!open) return null;

        return (
            <div className="study-abroad-modal-overlay" onClick={handleClose}>
                <div className="study-abroad-modal-content" onClick={(e) => e.stopPropagation()}>
                    <div className="study-abroad-modal-header">
                        <h3 className='text-light'>Study Abroad Inquiry - {country}</h3>
                        <button className="study-abroad-modal-close" onClick={handleClose}>×</button>
                    </div>
                    
                    <div className="study-abroad-modal-body">
                        {success ? (
                            <div className="study-abroad-modal-success">
                                <div className="study-abroad-modal-success-icon">✓</div>
                                <h4>Thank You!</h4>
                                <p>Your inquiry has been submitted successfully. We'll get back to you soon.</p>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit} className="study-abroad-modal-form">
                                <div className="study-abroad-form-group">
                                    <label>Full Name *</label>
                                    <input
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        required
                                        placeholder="Enter your full name"
                                        className="study-abroad-form-input"
                                    />
                                </div>
                                
                                <div className="study-abroad-form-group">
                                    <label>Phone Number *</label>
                                    <input
                                        type="tel"
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleChange}
                                        required
                                        placeholder="Enter your phone number"
                                        className="study-abroad-form-input"
                                    />
                                </div>
                                
                                <div className="study-abroad-form-group">
                                    <label>Email Address *</label>
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        required
                                        placeholder="Enter your email address"
                                        className="study-abroad-form-input"
                                    />
                                </div>
                                
                                <div className="study-abroad-form-group">
                                    <label>Message</label>
                                    <textarea
                                        name="message"
                                        value={formData.message}
                                        onChange={handleChange}
                                        placeholder={`I'm interested in studying in ${country}. Please provide more information.`}
                                        rows="3"
                                        className="study-abroad-form-textarea"
                                    />
                                </div>
                                
                                <button type="submit" className="study-abroad-submit-btn" disabled={isLoading}>
                                    {isLoading ? 'Submitting...' : 'Submit Inquiry'}
                                </button>
                            </form>
                        )}
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div className="study-abroad-page">
            <Helmet>
                <title>Study Abroad Programs – Scholarships & Admissions | CollegeForms</title>
                <meta name="description" content="Looking to study abroad? Explore top international colleges, scholarships on tuition, and MBA programs. Get expert college guidance and application help with CollegeForms.in." />
                <meta name="keywords" content="study abroad programs, international colleges, MBA abroad options, tuition fee scholarships, overseas admission help, best global colleges, IELTS EXAMs, SAT Exam, GRE/GMAT Exam" />
                
                {/* Open Graph / Facebook */}
                <meta property="og:type" content="website" />
                <meta property="og:url" content="https://www.collegeforms.in/studyabroad" />
                <meta property="og:title" content="Study Abroad Programs – Scholarships & Admissions | CollegeForms" />
                <meta property="og:description" content="Explore international colleges with tuition scholarships. Get expert guidance for MBA abroad, IELTS, SAT, GRE/GMAT exams at CollegeForms.in" />
                <meta property="og:image" content="https://www.collegeforms.in/images/study-abroad-og.jpg" />
                
                {/* Twitter */}
                <meta name="twitter:card" content="summary_large_image" />
                <meta name="twitter:url" content="https://www.collegeforms.in/studyabroad" />
                <meta name="twitter:title" content="Study Abroad Programs – Scholarships & Admissions | CollegeForms" />
                <meta name="twitter:description" content="Get admission help for top global colleges with scholarship opportunities. Expert guidance for MBA abroad, IELTS, SAT, GRE/GMAT exams." />
                <meta name="twitter:image" content="https://www.collegeforms.in/images/study-abroad-twitter.jpg" />
                
                {/* Canonical URL */}
                <link rel="canonical" href="https://www.collegeforms.in/studyabroad" />
            </Helmet>
            
            <Navbar />
            
            <section className="hero-section-1">
                <div className="container">
                    <div className="hero-content-1">
                        <h1>Unlock Your Global Education Potential</h1>
                        <p>Discover world-class universities and programs tailored to your aspirations</p>
                    </div>
                </div>
            </section>

            <section className="destinations-section">
                <div className="container">
                    <h2 className="section-title">Top Study Destinations</h2>
                    <p className="section-subtitle">Explore the most popular countries for Indian students</p>
                    
                    <div className="countries-grid">
                        {countries.map((country, index) => (
                            <div className="country-card" key={index}>
                                <div className="country-image" style={{ backgroundImage: `url(${country.image})` }}>
                                    <div className="country-overlay">
                                        <h3 className='text-light fw-bold'>{country.name}</h3>
                                    </div>
                                </div>
                                <p>{country.description}</p>
                                <button 
                                    className="study-abroad-inquiry-btn"
                                    onClick={() => handleOpenModal(country.name)}
                                >
                                    Get More Information
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <section className="courses-section">
                <div className="container">
                    <h2 className="section-title">In-Demand & Futuristic Courses</h2>
                    <p className="section-subtitle">Prepare for the careers of tomorrow</p>
                    
                    <div className="courses-grid">
                        {courses.map((course, index) => (
                            <div className="course-card" key={index}>
                                <div className="course-image" style={{ backgroundImage: `url(${course.image})` }}></div>
                                <h3>{course.name}</h3>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <section className="exams-section">
                <div className="container">
                    <h2 className="section-title">Key Entrance Exams</h2>
                    <p className="section-subtitle">Your gateway to global universities</p>
                    
                    <div className="exams-grid">
                        {exams.map((exam, index) => (
                            <div className="exam-card" key={index}>
                                <div className="exam-image" style={{ backgroundImage: `url(${exam.image})` }}></div>
                                <div className="exam-content">
                                    <h3>{exam.name}</h3>
                                    <p>{exam.description}</p>
                                    <div className="exam-cutoff">
                                        <span>Top Universities Cut-off:</span>
                                        <strong>{exam.cutoff}</strong>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <Footer />
            <Scrollbar />

            {/* Study Abroad Inquiry Modal */}
            <StudyAbroadInquiryModal 
                open={isModalOpen}
                handleClose={handleCloseModal}
                country={selectedCountry}
            />
        </div>
    )
}

export default Privacypage;