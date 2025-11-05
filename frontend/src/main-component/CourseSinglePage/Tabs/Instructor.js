import React from 'react'
import tsImg from '../../../images/at-single.jpg'
import cImg1 from '../../../images/certificates/1.jpg'
import cImg2 from '../../../images/certificates/2.jpg'
import cImg3 from '../../../images/certificates/3.jpg'
import cImg4 from '../../../images/certificates/4.jpg'

const Instructor = () => {
    return (
        <div className="team-info-wrap">
            <div className="row align-items-center">
                <div className="col-lg-5">
                    <div className="team-info-img">
                        <img src={tsImg} alt="" />
                    </div>
                </div>
                <div className="col-lg-7">
                    <div className="team-info-text">
                        <h2>Courtney Henry</h2>
                        <ul>
                            <li>Position: <span>Web Developer</span></li>
                            <li>Experience:<span>12 Years</span></li>
                            <li>Address:<span>6391 Elgin St. Celina, Delaware 10299</span></li>
                            <li>Phone:<span>+00 568 746 987</span></li>
                            <li>Email:<span>youremail@gmail.com</span></li>
                        </ul>

                        <div className="certificates-wrap">
                            <h2>Certificates</h2>

                            <div className="certificates-items">
                                <div className="certificates-item">
                                    <img src={cImg1} alt="" />
                                </div>
                                <div className="certificates-item">
                                    <img src={cImg2} alt="" />
                                </div>
                                <div className="certificates-item">
                                    <img src={cImg3} alt="" />
                                </div>
                                <div className="certificates-item">
                                    <img src={cImg4} alt="" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Instructor;