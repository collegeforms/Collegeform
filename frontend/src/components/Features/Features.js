import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';

const ClickHandler = () => {
    window.scrollTo(10, 0);
};

const Features = () => {
    useEffect(() => {
        const items = document.querySelectorAll('.wpo-features-area .features-wrap .feature-item-wrap');
        const handleHover = (el) => {
            items.forEach(item => {
                item.classList.remove('active');
                item.classList.add('item');
            });

            el.classList.add('active');
        };
        items.forEach(item => item.addEventListener('mouseenter', () => handleHover(item)));
        return () => {
            items.forEach(item => item.removeEventListener('mouseenter', () => handleHover(item)));
        };
    }, []);

    return (
        <section className="wpo-features-area py-5 mt-4">
            <div className="container-fluid">
                <div className="features-wrap">
                    <div className="row">
                        <div className="col col-lg-3 col-md-6 col-12">
                            <div className="feature-item-wrap">
                                <div className="feature-item">
                                    <div className="icon">
                                    <i className="fi flaticon-training-1"></i>

                                    </div>
                                    <div className="feature-text">
                                        <h2><Link onClick={ClickHandler} to="/courses">100+ Programs</Link></h2>
                                        <p>Explore our wide range of undergraduate and postgraduate programs.</p>
                                    </div>
                                </div>
                                <div className="feature-item-hidden">
                                    <div className="icon">
                                    <i className="fi flaticon-training-1"></i>

                                    </div>
                                    <div className="feature-text">
                                        <h2><Link onClick={ClickHandler} to="/courses">100+ Programs</Link></h2>
                                        <p>Choose from a variety of courses tailored for your career goals.</p>
                                    </div>
                                 </div>
                            </div>
                        </div>

                        <div className="col col-lg-3 col-md-6 col-12">
                            <div className="feature-item-wrap active">
                                <div className="feature-item">
                                    <div className="icon">
                                    <i className="fi flaticon-team"></i>

                                    </div>
                                    <div className="feature-text">
                                        <h2><Link onClick={ClickHandler} to="/scholarships">Scholarships & Aid</Link></h2>
                                        <p>We offer merit-based and need-based scholarships for students.</p>
                                    </div>
                                </div>
                                <div className="feature-item-hidden">
                                    <div className="icon">
                                    <i className="fi flaticon-team"></i>

                                    </div>
                                    <div className="feature-text">
                                        <h2><Link onClick={ClickHandler} to="/scholarships">Scholarships & Aid</Link></h2>
                                        <p>Find financial aid opportunities to support your education.</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="col col-lg-3 col-md-6 col-12">
                            <div className="feature-item-wrap">
                                <div className="feature-item">
                                    <div className="icon">
                                    <i className="fi flaticon-team"></i>

                                    </div>
                                    <div className="feature-text">
                                        <h2><Link onClick={ClickHandler} to="/campus">State-of-the-Art Campus</Link></h2>
                                        <p>Experience world-class infrastructure and student facilities.</p>
                                    </div>
                                </div>
                                <div className="feature-item-hidden">
                                    <div className="icon">
                                    <i className="fi flaticon-team"></i>


                                    </div>
                                    <div className="feature-text">
                                        <h2><Link onClick={ClickHandler} to="/campus">State-of-the-Art Campus</Link></h2>
                                        <p>Enjoy modern classrooms, labs, libraries, and sports facilities.</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="col col-lg-3 col-md-6 col-12">
                            <div className="feature-item-wrap">
                                <div className="feature-item">
                                    <div className="icon">
                                    <i className="fi flaticon-video-lesson"></i>


                                    </div>
                                    <div className="feature-text">
                                        <h2><Link onClick={ClickHandler} to="/faculty">Expert Faculty</Link></h2>
                                        <p>Learn from experienced professors and industry professionals.</p>
                                    </div>
                                </div>
                                <div className="feature-item-hidden">
                                    <div className="icon">
                                    <i className="fi flaticon-video-lesson"></i>


                                    </div>
                                    <div className="feature-text">
                                        <h2><Link onClick={ClickHandler} to="/faculty">Expert Faculty</Link></h2>
                                        <p>Our faculty members are dedicated to student success.</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </section>
    );
};

export default Features;
