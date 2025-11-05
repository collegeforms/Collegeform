import React from "react";
import { Link } from 'react-router-dom'
import Courses from "../../api/Courses";


const ClickHandler = () => {
    window.scrollTo(10, 0);
}

const CourseSectionS3 = (props) => {
    return (
        <div className={`wpo-popular-area section-padding ${props.pClass}`}>
            <div className="container">
                <div className="wpo-popular-wrap">
                    <div className="row">
                        {Courses.slice(0, 6).map((course, aitem) => (
                            <div className="col col-lg-4 col-md-6 col-12" key={aitem}>
                                <div className="wpo-popular-single">
                                    <div className="wpo-popular-item">
                                        <div className="wpo-popular-img">
                                            <img src={course.cImg} alt="" />
                                            <div className="thumb">
                                                <span>${course.fee}</span>
                                            </div>
                                        </div>
                                        <div className="wpo-popular-content">
                                            <div className="wpo-popular-text-top">
                                                <ul>
                                                    <li><img src={course.author} alt="" /></li>
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
                    <div className="pagination-wrapper">
                        <ul className="pg-pagination">
                            <li>
                                <Link to="/blog-left-sidebar" aria-label="Previous">
                                    <i className="fi ti-angle-left"></i>
                                </Link>
                            </li>
                            <li className="active"><Link to="/blog-left-sidebar">1</Link></li>
                            <li><Link to="/blog-left-sidebar">2</Link></li>
                            <li><Link to="/blog-left-sidebar">3</Link></li>
                            <li>
                                <Link to="/blog-left-sidebar" aria-label="Next">
                                    <i className="fi ti-angle-right"></i>
                                </Link>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default CourseSectionS3;