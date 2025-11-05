import React from "react";
import { Link } from 'react-router-dom'
import hero from '../../images/slider/5.png'
import crown from '../../images/slider/crown.svg'
import shape1 from '../../images/shape/vector-1.svg'
import shape2 from '../../images/shape/vector-2.svg'
import shape3 from '../../images/shape/vector-3.svg'
import shape4 from '../../images/shape/vector-4.svg'
import shape5 from '../../images/shape/vector-5.svg'
import shape6 from '../../images/shape/vector-6.svg'
import shape7 from '../../images/shape/vector-7.svg'
import shape8 from '../../images/shape/vector-8.svg'
import shape9 from '../../images/shape/vector-9.svg'

const ClickHandler = () => {
    window.scrollTo(10, 0);
}

const Hero5 = () => {
    return (
        <section className="static-hero-s5">
            <div className="hero-container">
                <div className="hero-inner">
                    <div className="container-fluid">
                        <div className="hero-content">
                            <div data-swiper-parallax="200" className="slide-title">
                                <img src={crown} alt=""/>
                            </div>
                            <div data-swiper-parallax="300" className="slide-title">
                                <h2>Better Future For Your <span>Kids</span></h2>
                            </div>
                            <div data-swiper-parallax="400" className="slide-text">
                                <p>We are providing your kids the best tutor to enhance their knowledge and skill.</p>
                            </div>
                            <div className="clearfix"></div>
                            <div data-swiper-parallax="500" className="slide-btns">
                                <Link onClick={ClickHandler} to="/about" className="theme-btn-s4">Get Started Today</Link>
                            </div>
                            <div className="student-pic">
                                <img src={hero} alt="" />
                                <div className="vector-1"><img src={shape1} alt="" /></div>
                                <div className="vector-2"><img src={shape2} alt="" /></div>
                                <div className="vector-3"><img src={shape3} alt="" /></div>
                                <div className="vector-4"><img src={shape4} alt="" /></div>
                                <div className="vector-5"><img src={shape5} alt="" /></div>
                                <div className="vector-6"><img src={shape6} alt="" /></div>
                                <div className="vector-7"><img src={shape7} alt="" /></div>
                                <div className="vector-8"><img src={shape8} alt="" /></div>
                                <div className="vector-9"><img src={shape9} alt="" /></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default Hero5;