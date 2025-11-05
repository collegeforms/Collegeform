import React from 'react'
import CountUp from 'react-countup';

const FunFact = (props) => {

    return (
        <section className="wpo-fun-fact-section">
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
        </section>
    )
}

export default FunFact;