import React, { useEffect } from 'react';
import { Link } from 'react-router-dom'
import VideoModal from "../ModalVideo/VideoModal";

import hero1 from '../../images/slider/2.png'
import shape1 from '../../images/slider/shape-1.svg'
import shape2 from '../../images/slider/shape-2.svg'
import shape3 from '../../images/slider/shape-3.svg'
import shape4 from '../../images/slider/shape-4.svg'


const ClickHandler = () => {
    window.scrollTo(10, 0);
}


const Hero2 = () => {

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
        <section className="static-hero-s2">
            <div className="hero-container">
                <div className="hero-inner">
                    <div className="container-fluid">
                        <div className="hero-content">
                            <div data-swiper-parallax="300" className="slide-title">
                                <h2>Build Your First Step Of 
                                    <span>
                                        <small id='changing'>Experience</small>
                                    </span> 
                                    with Eduko.
                                </h2>
                            </div>
                            <div data-swiper-parallax="400" className="slide-text">
                                <p>We are providing you the best tutor to enhance your knowledge and skill. Lets get
                                    started and get a relaxing learning.</p>
                            </div>
                            <div className="clearfix"></div>
                            <div data-swiper-parallax="500" className="slide-btns">
                                <Link onClick={ClickHandler} to="/about" className="theme-btn">Get Started</Link>
                                <ul>
                                    <li className="video-holder">
                                        <VideoModal />
                                    </li>
                                    <li className="video-text">
                                        Watch Our Video
                                    </li>
                                </ul>
                            </div>
                            <div className="student-pic">
                                <img src={hero1} alt="" />
                                <div className="wp-shape-1"><img src={shape1} alt="" /></div>
                                <div className="wp-shape-2"><img src={shape2} alt="" /></div>
                                <div className="wp-shape-3"><img src={shape3} alt="" /></div>
                                <div className="wp-shape-4"><img src={shape4} alt="" /></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="bottom-shape">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1920 941" fill="none">
                    <path
                        d="M317 623C193.8 533.4 85 408 -7 537V941H1951V256C1831 63.2001 1577 5.66657 1465 0.999772C1137 -10.2002 959 258 755 453C551 648 389.667 675.666 317 623Z"
                        fill="url(#paint0_linear_245_1456)" />
                    <defs>
                        <linearGradient id="paint0_linear_245_1456" x1="972" y1="0.702148" x2="972" y2="811"
                            gradientUnits="userSpaceOnUse">
                            <stop offset="0" stopColor="#F6F5FF" />
                            <stop offset="1" stopColor="#EEEDFA" />
                        </linearGradient>
                    </defs>
                </svg>
            </div>
        </section>
    )
}

export default Hero2;