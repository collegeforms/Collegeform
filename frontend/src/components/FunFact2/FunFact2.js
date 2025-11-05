import React from 'react'
import CountUp from 'react-countup';
import shape1 from '../../images/funfact-shape-1.png'
import shape2 from '../../images/funfact-shape-2.png'

const FunFact2 = (props) => {

    return (
        <section className="wpo-fun-fact-section-s2 section-padding">
            <div className="container">
                <div className="row">
                    <div className="col col-xs-12">
                        <div className="wpo-fun-fact-grids clearfix">
                            <div className="grid">
                                <div className="info">
                                    <h3><span><CountUp end={985} enableScrollSpy /></span>+</h3>
                                    <p>Student Enrolled</p>
                                </div>
                            </div>
                            <div className="grid">
                                <div className="info">
                                    <h3><span><CountUp end={25} enableScrollSpy /></span>+</h3>
                                    <p>Winning Award</p>
                                </div>
                            </div>
                            <div className="grid">
                                <div className="info">
                                    <h3><span><CountUp end={35} enableScrollSpy /></span>+</h3>
                                    <p>Event Organized</p>
                                </div>
                            </div>
                            <div className="grid">
                                <div className="info">
                                    <h3><span><CountUp end={355} enableScrollSpy /></span>+</h3>
                                    <p>Expert Mentor</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="shape"><img src={shape1} alt=""/></div>
            <div className="shape-2"><img src={shape2} alt=""/></div>
        </section>
    )
}

export default FunFact2;