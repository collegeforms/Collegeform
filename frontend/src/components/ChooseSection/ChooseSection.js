import React from "react";
import wImg from '../../images/choose.jpg'
// import  from "../ModalVideo/VideoModal";

const ChooseSection = (props) => {
    return (
        <section className="wpo-choose-section">
            <div className="container">
                <div className="row">
                    <div className="col col-lg-12">
                        <div className="wpo-choose-wrap">
                            <div className="wpo-section-title-s2">
                                <small>Why Choose Us</small>
                                <h2>What Make Us
                                        Different
                                      
                                </h2>
                            </div>
                            <div className="wpo-choose-grids clearfix">
                                <div className="grid">
                                    <div className="icon">
                                        <i className="fi text-light flaticon-training"></i>
                                    </div>
                                    <div className="info">
                                        <h3> Comprehensive Solutions :</h3>
                                        <p>From career testing to final application submission, we cover every aspect of the admission process.</p>
                                    </div>
                                </div>
                                <div className="grid">
                                    <div className="icon">
                                        <i className="fi text-light flaticon-support"></i>
                                    </div>
                                    <div className="info">
                                        <h3> Expert Guidance</h3>
                                        <p>Get advice from experienced academic consultants who understand the intricacies of the education system.</p>
                                    </div>
                                </div>
                                <div className="grid">
                                    <div className="icon">
                                        <i className="fi text-light flaticon-e-learning"></i>
                                    </div>
                                    <div className="info">
                                        <h3>Time and Cost-Efficiency</h3>
                                        <p>Save time and money by applying to multiple colleges with our Common Application Form, all while enjoying exclusive discounts.</p>
                                    </div>
                                </div>
                                <div className="grid">
                                    <div className="icon">
                                        <i className="fi text-light flaticon-medal-1 text-light"></i>
                                    </div>
                                    <div className="info">
                                        <h3>Real-Time Information</h3>
                                        <p>Make informed decisions with up-to-date student reviews, ratings, and comparisons between institutions.</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                  
                </div>
            </div>
        </section>
    );
}

export default ChooseSection;