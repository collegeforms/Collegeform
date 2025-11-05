import React from "react";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import CoursesCategory from "../../api/CoursesCategory";
import cImag from "../../images/shape/1.svg";
import cImag2 from "../../images/shape/2.svg";
import cImag3 from "../../images/shape/3.svg";
import cImag4 from "../../images/shape/4.svg";
import { motion } from "framer-motion";
const ClickHandler = () => {
    window.scrollTo(10, 0);
};

const settings = {
    dots: false,
    arrows: false,
    infinite: true,
    speed: 3000,
    slidesToShow: 5,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 2000,
    cssEase: "linear",
    pauseOnHover: false,
    responsive: [
        {
            breakpoint: 1200,
            settings: { slidesToShow: 4 }
        },
        {
            breakpoint: 991,
            settings: { slidesToShow: 3 }
        },
        {
            breakpoint: 767,
            settings: { slidesToShow: 2 }
        },
        {
            breakpoint: 480,
            settings: { slidesToShow: 1 }
        }
    ]
};

const CategorySection = (props) => {
    const [logos, setLogos] = useState([]);
 const API_URL = "https://collegeforms.in";
    const fetchLogos = async () => {
        try {
            const response = await axios.get(`${API_URL}/api/logos`);
            setLogos(response.data);
            console.log(response.data);
            
        } catch (error) {
            console.log("Error fetching logos:", error);
        }
    };

    useEffect(() => {
        fetchLogos();
    }, []);

    return (
        <section className={`wpo-courses-section ${props.cClass}`}>
            <div className="container-fluid">
                <div className="how-it-works-section">
                    <h2 className="how-it-works-title">
                        Apply Now & Save! Limited-Time <span> Application Discounts </span>
                        <span className="arrow-svg">
                            <svg 
                                xmlns="http://www.w3.org/2000/svg" 
                                width="50" 
                                height="30" 
                                viewBox="0 0 38 15" 
                                fill="none"
                            >
                                <path d="M10 7.519l-.939-.344h0l.939.344zm14.386-1.205l-.981-.192.981.192zm1.276 5.509l.537.843.148-.094.107-.139-.792-.611zm4.819-4.304l-.385-.923h0l.385.923zm7.227.707a1 1 0 0 0 0-1.414L31.343.448a1 1 0 0 0-1.414 0 1 1 0 0 0 0 1.414l5.657 5.657-5.657 5.657a1 1 0 0 0 1.414 1.414l6.364-6.364zM1 7.519l.554.833.029-.019.094-.061.361-.23 1.277-.77c1.054-.609 2.397-1.32 3.629-1.787.617-.234 1.17-.392 1.623-.455.477-.066.707-.008.788.034.025.013.031.021.039.034a.56.56 0 0 1 .058.235c.029.327-.047.906-.39 1.842l1.878.689c.383-1.044.571-1.949.505-2.705-.072-.815-.45-1.493-1.16-1.865-.627-.329-1.358-.332-1.993-.244-.659.092-1.367.305-2.056.566-1.381.523-2.833 1.297-3.921 1.925l-1.341.808-.385.245-.104.068-.028.018c-.011.007-.011.007.543.84zm8.061-.344c-.198.54-.328 1.038-.36 1.484-.032.441.024.94.325 1.364.319.45.786.64 1.21.697.403.054.824-.001 1.21-.09.775-.179 1.694-.566 2.633-1.014l3.023-1.554c2.115-1.122 4.107-2.168 5.476-2.524.329-.086.573-.117.742-.115s.195.038.161.014c-.15-.105.085-.139-.076.685l1.963.384c.192-.98.152-2.083-.74-2.707-.405-.283-.868-.37-1.28-.376s-.849.069-1.274.179c-1.65.43-3.888 1.621-5.909 2.693l-2.948 1.517c-.92.439-1.673.743-2.221.87-.276.064-.429.065-.492.057-.043-.006.066.003.155.127.07.099.024.131.038-.063.014-.187.078-.49.243-.94l-1.878-.689zm14.343-1.053c-.361 1.844-.474 3.185-.413 4.161.059.95.294 1.72.811 2.215.567.544 1.242.546 1.664.459a2.34 2.34 0 0 0 .502-.167l.15-.076.049-.028.018-.011c.013-.008.013-.008-.524-.852l-.536-.844.019-.012c-.038.018-.064.027-.084.032-.037.008.053-.013.125.056.021.02-.151-.135-.198-.895-.046-.734.034-1.887.38-3.652l-1.963-.384zm2.257 5.701l.791.611.024-.031.08-.101.311-.377 1.093-1.213c.922-.954 2.005-1.894 2.904-2.27l-.771-1.846c-1.31.547-2.637 1.758-3.572 2.725l-1.184 1.314-.341.414-.093.117-.025.032c-.10.013-.10.013.781.624zm5.204-3.381c.989-.413 1.791-.42 2.697-.307.871.108 2.083.385 3.437.385v-2c-1.197 0-2.041-.226-3.19-.369-1.114-.139-2.297-.146-3.715.447l.771 1.846z" fill="#1B7AFF"></path>
                            </svg>
                        </span>
                    </h2>
                    <p className="how-it-works-description text-center m-auto">
                     Don't miss out! Grab exclusive application fee waivers and offers before they're gone.
                    </p>
                </div>

                <div className="wpo-courses-slider pt-0 gap-5">
                    <Slider {...settings}>
                        {logos.map((logo, index) => (
                            <div className="text-center px-2" key={index}>
                                <div className="category-card p-2 rounded-5 d-flex flex-column align-items-center position-relative" 
                                     style={{ width: "240px", height: "200px" }}>
                                    
                                    {/* Discount Badge */}
                                    {logo.discount && (
                     <motion.div
  style={{
    position: 'absolute',
    top: '10px',
    right: '10px',
    background: 'linear-gradient(to bottom, #695eff, #2534ff)',
    color: 'white',
    padding: '8px 12px',
    borderRadius: '4px',
    fontSize: '14px',
    fontWeight: 'bold',
    boxShadow: '3px 3px 0 rgba(0,0,0,0.2)',
    transform: 'rotate(5deg)',
    borderBottom: '3px solid rgba(0,0,0,0.1)',
    zIndex: 10
  }}
  initial={{ 
    scale: 0.8,
    opacity: 0,
    y: -20
  }}
  animate={{ 
    scale: 1,
    opacity: 1,
    y: 0,
    rotate: [5, -5, 5], // Gentle rocking
  }}
  transition={{
    duration: 0.5,
    rotate: {
      repeat: Infinity,
      duration: 2,
      ease: "easeInOut"
    },
    scale: {
      type: "spring",
      stiffness: 200,
      damping: 10
    }
  }}
  whileHover={{
    scale: 1.05,
    boxShadow: '5px 5px 0 rgba(0,0,0,0.2)',
    transition: { duration: 0.2 }
  }}
  whileTap={{
    scale: 0.95,
    boxShadow: '1px 1px 0 rgba(0,0,0,0.2)'
  }}
>
  UP TO {logo.discount}% OFF
</motion.div>
                                    )}
                                    
                                    <Link 
                                        to={`/college/${logo.slug}`} 
                                        onClick={ClickHandler}
                                        style={{ textDecoration: 'none', color: 'inherit' }}
                                    >
                                        <img 
                                            style={{ 
                                                width: "200px", 
                                                height: "180px", 
                                                objectFit: "contain",
                                                cursor: 'pointer'
                                            }} 
                                            src={logo.image} 
                                            alt={logo.collegeName} 
                                        />
                                      
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </Slider>
                </div>
            </div>
        </section>
    );
};

export default CategorySection;