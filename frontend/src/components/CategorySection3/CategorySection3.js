import React from "react";
import { Link } from 'react-router-dom'
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import CoursesCategory from '../../api/CoursesCategory'


const ClickHandler = () => {
    window.scrollTo(10, 0);
}

const settings = {
    dots: false,
    arrows: true,
    speed: 1000,
    slidesToShow: 4,
    slidesToScroll: 1,
    autoplay: true,
    responsive: [
        {
            breakpoint: 1400,
            settings: {
                slidesToShow: 4,
                slidesToScroll: 1,
                infinite: true,
            }
        },
        {
            breakpoint: 1200,
            settings: {
                slidesToShow: 3,
                slidesToScroll: 1,
                centerPadding: '0',
                infinite: true,
                centerMode: false,
            }
        },
        {
            breakpoint: 991,
            settings: {
                slidesToShow: 2,
                slidesToScroll: 1,
                centerMode: false,
            }
        },
        {
            breakpoint: 767,
            settings: {
                slidesToShow: 1,
                slidesToScroll: 1,
                centerMode: false,
            }
        },
        {
            breakpoint: 480,
            settings: {
                slidesToShow: 1,
                slidesToScroll: 1,
                centerMode: false,
            }
        }
    ]
};

const CategorySection3 = (props) => {
    return (
        <section className="wpo-courses-section-s3 section-padding pt-0">
            <div className="container">
                <div className="row">
                    <div className="col-12">
                        <div className="wpo-section-title-s2">
                            <small>Our Courses</small>
                            <h2>Explore
                                <span>
                                    Courses
                                    <i className="shape">
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 206 53" fill="none">
                                            <path
                                                d="M152.182 2.58319C107.878 0.889793 54.8748 6.13932 21.2281 18.6943C14.2699 21.4407 7.93951 24.7738 5.70192 28.7128C4.27488 31.2398 5.03121 33.954 7.69121 36.2925C14.8835 42.3911 31.9822 45.4011 46.8006 47.3115C78.3067 51.0179 113.672 51.7406 145.489 48.3204C167.194 46.0009 200.667 39.5923 199.399 28.5709C198.543 20.0621 180.437 14.5729 162.979 11.6178C138.219 7.469 111.131 6.00576 84.5743 5.86862C71.32 5.85789 58.0913 6.85723 45.6675 8.78436C33.512 10.7186 21.2709 13.4317 12.6602 17.5817C11.2246 18.2877 8.62449 17.4553 9.9973 16.6813C20.7486 11.2493 38.0215 7.73493 53.9558 5.76368C77.1194 2.90994 101.75 3.75426 125.339 5.14356C158.167 7.2615 207.554 13.5139 204.928 30.7413C203.629 36.0898 194.762 40.5057 184.681 43.5503C156.563 51.768 119.114 53.6844 85.6331 52.5265C65.1694 51.7477 44.4831 50.1855 25.9972 46.2442C11.4129 43.1186 -1.0337 37.8297 0.0679738 30.5063C2.14003 19.9035 31.4913 12.0006 52.6201 7.98775C71.2971 4.45904 91.3384 2.2302 111.674 1.24636C125.228 0.595237 138.962 0.539188 152.536 1.15931C153.475 1.20224 154.154 1.55523 154.051 1.94876C153.951 2.33872 153.115 2.62135 152.182 2.58319Z" />
                                        </svg>
                                    </i>
                                </span>
                                By Category
                            </h2>
                        </div>
                    </div>
                </div>
                <div className="row wpo-courses-wrap">
                    <Slider {...settings}>
                        {CoursesCategory.map((category, aitem) => (
                            <div className={`grid s${category.Id}`} key={aitem}>
                                <div className="wpo-courses-item">
                                    <div className="courses-img">
                                        <img src={category.cImg} alt="" />
                                    </div>
                                    <div className="wpo-courses-text">
                                        <h2><Link onClick={ClickHandler} to={`/category-single/${category.slug}`}>{category.title}</Link></h2>
                                        <p>{category.description}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </Slider>
                </div>
            </div>
        </section>
    );
}

export default CategorySection3;