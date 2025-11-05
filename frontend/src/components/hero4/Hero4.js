import React from "react";
import { Link } from 'react-router-dom'
import hero from '../../images/slider/4.png'

const ClickHandler = () => {
    window.scrollTo(10, 0);
}

const Hero4 = () => {
    return (
        <section className="static-hero-s4">
            <div className="hero-container">
                <div className="hero-inner">
                    <div className="container-fluid">
                        <div className="hero-content">
                            <div data-swiper-parallax="300" className="slide-title">
                                <h2>Start Better Learning Future From Here</h2>
                            </div>
                            <div data-swiper-parallax="400" className="slide-text">
                                <p>We are providing you the best tutor to enhance your knowledge and skill. Lets get
                                    started and get a relaxing learning.</p>
                            </div>
                            <div className="clearfix"></div>
                            <div data-swiper-parallax="500" className="slide-btns">
                                <Link onClick={ClickHandler} to="/about" className="theme-btn-s4">Get Started Today</Link>
                            </div>
                            <div className="student-pic">
                                <img src={hero} alt="" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default Hero4;