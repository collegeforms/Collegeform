import React from "react";
import { Link } from 'react-router-dom'
import Courses from "../../api/Courses";
import cImg1 from '../../images/popular/shape-1.png'
import cImg2 from '../../images/popular/shape-2.png'

import vImg1 from '../../images/shape/vector-1.svg'
import vImg2 from '../../images/shape/vector-2.svg'
import vImg3 from '../../images/shape/vector-3.svg'
import vImg4 from '../../images/shape/vector-4.svg'
import vImg5 from '../../images/shape/vector-5.svg'
import vImg6 from '../../images/shape/vector-6.svg'
import vImg7 from '../../images/shape/vector-7.svg'
import vImg8 from '../../images/shape/vector-10.svg'
import vImg9 from '../../images/shape/vector-9.svg'
import vImg10 from '../../images/shape/vector-11.svg'
import vImg11 from '../../images/shape/vector-12.svg'


const ClickHandler = () => {
    window.scrollTo(10, 0);
}

const CourseSectionS2 = (props) => {
    return (
        <div className={`wpo-popular-area-s4 section-padding ${props.pClass}`}>
            <div className="container">
                <div className="wpo-section-title-s2">
                    <small>Popular Courses</small>
                    <h2>Discover Your Favorite
                        <span>
                            Courses
                            <i className="shape">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 206 53" fill="none">
                                    <path
                                        d="M152.182 2.58319C107.878 0.889793 54.8748 6.13932 21.2281 18.6943C14.2699 21.4407 7.93951 24.7738 5.70192 28.7128C4.27488 31.2398 5.03121 33.954 7.69121 36.2925C14.8835 42.3911 31.9822 45.4011 46.8006 47.3115C78.3067 51.0179 113.672 51.7406 145.489 48.3204C167.194 46.0009 200.667 39.5923 199.399 28.5709C198.543 20.0621 180.437 14.5729 162.979 11.6178C138.219 7.469 111.131 6.00576 84.5743 5.86862C71.32 5.85789 58.0913 6.85723 45.6675 8.78436C33.512 10.7186 21.2709 13.4317 12.6602 17.5817C11.2246 18.2877 8.62449 17.4553 9.9973 16.6813C20.7486 11.2493 38.0215 7.73493 53.9558 5.76368C77.1194 2.90994 101.75 3.75426 125.339 5.14356C158.167 7.2615 207.554 13.5139 204.928 30.7413C203.629 36.0898 194.762 40.5057 184.681 43.5503C156.563 51.768 119.114 53.6844 85.6331 52.5265C65.1694 51.7477 44.4831 50.1855 25.9972 46.2442C11.4129 43.1186 -1.0337 37.8297 0.0679738 30.5063C2.14003 19.9035 31.4913 12.0006 52.6201 7.98775C71.2971 4.45904 91.3384 2.2302 111.674 1.24636C125.228 0.595237 138.962 0.539188 152.536 1.15931C153.475 1.20224 154.154 1.55523 154.051 1.94876C153.951 2.33872 153.115 2.62135 152.182 2.58319Z" />
                                </svg>
                            </i>
                        </span>
                    </h2>
                </div>
                <div className="wpo-popular-wrap">
                    <div className="row">
                        {Courses.slice(3, 6).map((course, aitem) => (
                            <div className="col col-lg-4 col-md-6 col-12" key={aitem}>
                                <div className="wpo-popular-single">
                                    <div className="wpo-popular-item">
                                        <div className="wpo-popular-img">
                                            <img src={course.cImg} alt=""/>
                                                <div className="thumb">
                                                    <span>${course.fee}</span>
                                                </div>
                                        </div>
                                        <div className="wpo-popular-content">
                                            <div className="wpo-popular-text-top">
                                                <ul>
                                                    <li><img src={course.author} alt=""/></li>
                                                    <li><Link onClick={ClickHandler} to={`/course-single/${course.slug}`}>{course.authortitle}</Link></li>
                                                </ul>
                                                <ul>
                                                    <li><i className="fi flaticon-star"></i></li>
                                                    <li>({course.ratting})</li>
                                                </ul>
                                            </div>
                                            <h2><Link onClick={ClickHandler} to={`/course-single/${course.slug}`}>{course.title}</Link>
                                            </h2>

                                            <div className="wpo-popular-text-bottom">
                                                <ul>
                                                    <li><i className="fi flaticon-reading-book"></i> {course.student} Students</li>
                                                    <li><i className="fi flaticon-agenda"></i> {course.lesson} Lesson</li>
                                                </ul>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}

                    </div>
                </div>
                <div className="more-btn text-center">
                    <Link onClick={ClickHandler} to="/course" className="theme-btn-s2">View All Courses</Link>
                </div>
            </div>
            <div className="shape-wrap">
                <div className="vector-1"><img src={vImg1} alt=""/></div>
                <div className="vector-2"><img src={vImg2} alt=""/></div>
                <div className="vector-3"><img src={vImg3} alt=""/></div>
                <div className="vector-4"><img src={vImg4} alt=""/></div>
                <div className="vector-5"><img src={vImg5} alt=""/></div>
                <div className="vector-6"><img src={vImg6} alt=""/></div>
                <div className="vector-7"><img src={vImg7} alt=""/></div>
                <div className="vector-8"><img src={vImg8} alt=""/></div>
                <div className="vector-9"><img src={vImg9} alt=""/></div>
                <div className="vector-10"><img src={vImg10} alt=""/></div>
                <div className="vector-11"><img src={vImg11} alt=""/></div>
            </div>
            <div className="shape-1"><img src={cImg1} alt=""/></div>
            <div className="shape-2"><img src={cImg2} alt=""/></div>
        </div>
    );
}

export default CourseSectionS2;