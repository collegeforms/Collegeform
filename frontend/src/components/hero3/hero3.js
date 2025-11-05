import React, { useEffect } from 'react';
import { Link } from 'react-router-dom'
import hero1 from '../../images/slider/3.png'


const ClickHandler = () => {
    window.scrollTo(10, 0);
}


const Hero3 = () => {

    useEffect(() => {
        const changingElement = document.getElementById('changing');

        if (changingElement) {
            const startChangingText = (texts, interval) => {
                let index = 0;
                setInterval(() => {
                    changingElement.textContent = texts[index];
                    index = (index + 1) % texts.length;
                }, interval);
            };

            startChangingText(['Knowledge', 'Education', 'Experience', 'Improved', 'Free Class'], 3000);
        }
    }, []);

    return (
        <section className="static-hero-s3">
            <div className="hero-container">
                <div className="hero-inner">
                    <div className="container-fluid">
                        <div className="hero-content">
                            <div data-swiper-parallax="300" className="slide-title">
                                <h2>Grow Your Career With Best Quality
                                    <span>
                                        <small id='changing'>Experience</small>
                                        <i className="s1"></i>
                                        <i className="s2"></i>
                                        <i className="s3"></i>
                                        <i className="s4"></i>
                                    </span>
                                </h2>
                            </div>
                            <div data-swiper-parallax="400" className="slide-text">
                                <p>We are providing you the best tutor to enhance your knowledge and skill. Lets get
                                    started and get a relaxing learning.</p>
                            </div>
                            <div className="clearfix"></div>
                            <div data-swiper-parallax="500" className="slide-btns">
                                <Link onClick={ClickHandler} to="/about" className="theme-btn">Get Started</Link>
                            </div>
                            <div className="student-pic">
                                <img src={hero1} alt=""/>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default Hero3;