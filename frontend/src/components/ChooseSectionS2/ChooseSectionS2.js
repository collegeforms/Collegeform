import React from "react";
import wImg from '../../images/choose2.jpg'
import VideoModal from "../ModalVideo/VideoModal";

const ChooseSectionS2 = (props) => {
    return (
        <section className="wpo-choose-section-s2 section-padding">
            <div className="container">
                <div className="right-img">
                    <img src={wImg} alt="" />
                    <VideoModal />
                </div>
                <div className="wpo-choose-wrap">
                    <div className="wpo-choose-grids clearfix">
                        <div className="grid">
                            <div className="icon">
                                <i className="fi flaticon-training"></i>
                            </div>
                            <div className="info">
                                <h3>Experienced Mentor</h3>
                                <p>We have highly expert mentors for our student’s best support .</p>
                            </div>
                        </div>
                        <div className="grid">
                            <div className="icon">
                                <i className="fi flaticon-support"></i>
                            </div>
                            <div className="info">
                                <h3>Dedicated Support</h3>
                                <p>We are always here to help our students and solve problems 4/7.</p>
                            </div>
                        </div>
                        <div className="grid">
                            <div className="icon">
                                <i className="fi flaticon-e-learning"></i>
                            </div>
                            <div className="info">
                                <h3>Digital Learning</h3>
                                <p>We have highly expert mentors for our student’s best support .</p>
                            </div>
                        </div>
                        <div className="grid">
                            <div className="icon">
                                <i className="fi flaticon-medal-1"></i>
                            </div>
                            <div className="info">
                                <h3>Global Certificate</h3>
                                <p>We have highly expert mentors for our student’s best support .</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

export default ChooseSectionS2;