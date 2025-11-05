import React, { useState, useEffect } from 'react';
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import axios from 'axios';
import ts1 from '../../images/testimonial/thumb1.png'
import ts2 from '../../images/testimonial/thumb2.png'
import ts3 from '../../images/testimonial/thumb3.png'
import shape1 from '../../images/testimonial/shape-1.png'
import shape2 from '../../images/testimonial/shape-2.png'
import "./test.css"
// Default testimonial data as fallback
const defaultTestimonials = [
    {
        id: '01',
        tImg: "https://i.pinimg.com/736x/26/1a/54/261a547bce7c810ebaa5a2291edb1571.jpg",
        Des: "This college provided me with all the resources I needed to succeed. The faculty is highly supportive, and I received excellent guidance throughout my journey.",
        Title: 'Aarav Kumar',
        Sub: "B.Tech, Computer Science",
    },
    {
        id: '02',
        tImg: "https://th.bing.com/th/id/OIP.P5AxzXq-SHXftXPPF1D6tgHaJ4?rs=1&pid=ImgDetMain",
        Des: "I had an incredible experience here. The facilities are top-notch, and the college fosters a culture of innovation and excellence. I'm proud to be an alumna!",
        Title: 'Priya Sharma',
        Sub: "MBA, Marketing",
    },
    {
        id: '03',
        tImg: "https://th.bing.com/th/id/R.5e17860f56449aa49b86f08b3ceb6138?rik=tZFtUfuwfxuOPA&riu=http%3a%2f%2fwww.theeasyconcepts.com%2fwp-content%2fuploads%2f2017%2f11%2fzoom.jpg&ehk=SiAb0GAfxiyO8Y9iPf%2bGbee0oyzHUaDEer1dMqczaY8%3d&risl=&pid=ImgRaw&r=0",
        Des: "The infrastructure and learning environment at this college are absolutely outstanding. It allowed me to grow as an individual and gain confidence in my skills.",
        Title: 'Ravi Deshmukh',
        Sub: "M.Sc, Environmental Science",
    }
];

// Default profile image URL
const defaultProfileImg = "https://cdn.pixabay.com/photo/2023/02/18/11/00/icon-7797704_640.png";

const Testimonial = (props) => {
    const [testimonials, setTestimonials] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchReviews = async () => {
            try {
                setLoading(true);
                // Replace with your actual API endpoint
  const API_URL = "https://collegeform.onrender.com" || "https://collegeform-production.up.railway.app" || "http://localhost:5000";

                const response = await axios.get(`${API_URL}/api/reviews`);
                console.log(response.data);
                
                
                // Transform API data to match our component structure
                const formattedReviews = response.data.map((review, index) => ({
                    id: index + 1,
                    tImg: review.userImage || defaultProfileImg,
                    Des: review.review || "No review text available",
                    Title: review.name || "Anonymous",
                    Sub: review.course || "Student",
                    rating: review.rating || 5
                }));
                
                setTestimonials(formattedReviews);
                setLoading(false);
            } catch (err) {
                console.error("Error fetching reviews:", err);
                setError("Failed to load testimonials");
                setTestimonials(defaultTestimonials); // Use default data as fallback
                setLoading(false);
            }
        };

        fetchReviews();
    }, []);

    const settings = {
        dots: false,
        arrows: false,
        speed: 1000,
        slidesToShow: 3,
        slidesToScroll: 1,
        autoplay: true,
        responsive: [
            {
                breakpoint: 1400,
                settings: {
                    slidesToShow: 3,
                    slidesToScroll: 1,
                    infinite: true,
                }
            },
            {
                breakpoint: 1200,
                settings: {
                    slidesToShow: 2,
                    slidesToScroll: 1,
                    centerPadding: '0',
                    infinite: true,
                }
            },
            {
                breakpoint: 991,
                settings: {
                    slidesToShow: 2,
                    slidesToScroll: 1,
                }
            },
            {
                breakpoint: 767,
                settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1,
                    dots: true,
                }
            },
            {
                breakpoint: 480,
                settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1,
                    dots: true,
                }
            }
        ]
    };

    // Function to render star ratings
    const renderStars = (rating) => {
        const stars = [];
        const fullStars = Math.floor(rating);
        const hasHalfStar = rating % 1 !== 0;
        
        for (let i = 0; i < fullStars; i++) {
            stars.push(<li key={i}><i className="fi flaticon-star"></i></li>);
        }
        
        if (hasHalfStar) {
            stars.push(<li key="half"><i className="fi flaticon-star-half-empty"></i></li>);
        }
        
        const emptyStars = 5 - Math.ceil(rating);
        for (let i = 0; i < emptyStars; i++) {
            stars.push(<li key={`empty-${i}`}><i className="fi flaticon-star-empty"></i></li>);
        }
        
        stars.push(<li key="rating-text">({rating.toFixed(1)})</li>);
        return stars;
    };

    return (
        <section className={`wpo-testimonial-section section-padding ${props.tsClass}`}>
            <div className="container">
                <div className="wpo-section-title-s2">
                    <small>Testimonials</small>
                    <h2>What Our Students Say About Us</h2>
                </div>
                
                {loading && (
                    <div className="loading-container">
                        <p>Loading testimonials...</p>
                    </div>
                )}
                
                {error && (
                    <div className="error-container">
                        <p>{error}</p>
                    </div>
                )}
                
                <div className="wpo-testimonial-wrap mt-2">
                    <div className="row align-items-center">
                        <div className="wpo-testimonial-items wpo-testimonial-active">
                            <Slider {...settings}>
                                {testimonials.map((tesmnl) => (
                                    <div className="wpo-testimonial-item" key={tesmnl.id}>
                                        <div className="wpo-testimonial-text">
                                            <div className="wpo-testimonial-text-btm">
                                                <div className="wpo-testimonial-text-btm-img">
                                                  <img 
                                                        src={tesmnl.tImg} 
                                                        height={"70px"} 
                                                        width={"70px"} 
                                                        style={{objectFit:"cover"}} 
                                                        alt={tesmnl.Title} 
                                                        onError={(e) => {
                                                            e.target.src = defaultProfileImg;
                                                        }}
                                                    />
                                                </div>
                                                <div className="wpo-testimonial-text-btm-info">
                                                    <h3>{tesmnl.Title}</h3>
                                                    <span>{tesmnl.Sub}</span>
                                                </div>
                                            </div>
                                            <ul>
                                                {renderStars(tesmnl.rating || 5)}
                                            </ul>
                                            <i className="quote fi flaticon-right-quote-sign"></i>
                                            <p>“{tesmnl.Des}”</p>
                                        </div>
                                    </div>
                                ))}
                            </Slider>
                        </div>
                    </div>
                </div>
            </div>
            <div className="shape-1"><img src={shape1} alt="" /></div>
            <div className="shape-2"><img src={shape2} alt="" /></div>
        </section>
    );
}

export default Testimonial;