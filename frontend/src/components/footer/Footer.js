import React from 'react'
import { Link } from 'react-router-dom'
import Logo from '../../images/logo-s2.svg'
import "./foot.css"
const ClickHandler = () => {
    window.scrollTo(10, 0);
}

const Footer = (props) => {
    return (
        <footer className="wpo-site-footer">
        
            <div className="wpo-upper-footer">
                <div className="container-fluid">
                    <div className="row">
                        <div className="col col-lg-3 mb-5 pb-5   col-md-6 col-12 col-md-6 col-sm-12 col-12">
                            <div className="widget about-widget">
                                <div className="logo widget-title">
                                    <Link onClick={ClickHandler} className="navbar-brand bg-light p-4 rounded-5 shadow" to="/home"><img src="/img/collegeLogo.png"
                                            alt=""/></Link>
                                </div>
                                <div className="social ms-4">
       <ul class="social-icons">
  <li>
    <a href="https://www.facebook.com/collegeforms.in" target="_blank" rel="noopener noreferrer" onClick={ClickHandler}>
      <i className="ti-facebook"></i>
    </a>
  </li>
  <li>
    <a href="https://www.linkedin.com/in/college-forms-909606376/" target="_blank" rel="noopener noreferrer" onClick={ClickHandler}>
      <i className="ti-linkedin"></i>
    </a>
  </li>
  <li>
    <a href="https://www.youtube.com/@CollegeForms" target="_blank" rel="noopener noreferrer" onClick={ClickHandler}>
      <i className="ti-youtube"></i>
    </a>
  </li>
  <li>
    <a href="https://www.instagram.com/collegeforms.in/" target="_blank" rel="noopener noreferrer" onClick={ClickHandler}>
      <i className="ti-instagram"></i>
    </a>
  </li>
</ul>

                                </div>
                            </div>
                        </div>
                        
                        <div className="col col-lg-2 col-md-6 col-12 col-md-6 col-sm-12 col-12">
                            <div className="widget link-widget">
                                <div className="widget-title text-light ">
                                    <h4 className='text-light'>Quick Links</h4>
                                </div>
                                <ul>
                                    <li><Link onClick={ClickHandler} to="/">Home</Link></li>
                                    <li><Link onClick={ClickHandler} to="/FAQ">FAQ</Link></li>

                                    <li><Link onClick={ClickHandler} to="/blogs">Blogs</Link></li>
                                    <li><Link onClick={ClickHandler} to="/contactus">Contact us</Link></li>
                                    <li><Link onClick={ClickHandler} to="/events">Educational Events</Link></li>
                                    {/* <li><Link onClick={ClickHandler} to="/counseling">Need Counseling</Link></li> */}
                                </ul>
                            </div>
                        </div>
                        <div className="col col-lg-2 col-md-6 col-12 col-md-6 col-sm-12 col-12 mb-0">
                            <div className="widget link-widget s2">
                                <div className="widget-title text-light ">
                                    <h4 className='text-light'>Explore Categories</h4>
                                </div>
                                <ul>
                                    <li><Link onClick={ClickHandler} to="/step"> Universal Form</Link></li>
                                    <li><Link onClick={ClickHandler} to="/colleges"> On-Campus Education</Link></li>
                                    <li><Link onClick={ClickHandler} to="/colleges/OnlineEducation">Online Education</Link></li>
                                    <li><Link onClick={ClickHandler} to="/StudyAbroad">Study Abroad</Link></li>
                                    <li><Link onClick={ClickHandler} to="/education/vocational-institutes">Vocational Education</Link></li>
                               
                                </ul>
                            </div>
                        </div>
                        <div className="col col-lg-2 col-md-6 col-12 col-md-6 col-sm-12 col-12">
                            <div className="widget link-widget s2">
                                <div className="widget-title text-light  ">
                                    <h4 className='d-lg-block d-none' style={{color:"#211E30"}}>Explore Categories</h4>
                                </div>
                                <ul>
                                    <li><Link onClick={ClickHandler} to="/CompetitiveExams">Competitive Exams</Link></li>
                                    <li><Link onClick={ClickHandler} to="/education/government-colleges">Government Colleges</Link></li>
                                    <li><Link onClick={ClickHandler} to="/education/Top-B-Schools">Career Assesments</Link></li>
                                    <li><Link onClick={ClickHandler} to="/education/education-loan">Education Loan</Link></li>
                                    <li><Link onClick={ClickHandler} to="/education/students/tests">Test Series</Link></li>
                               
                                </ul>
                            </div>
                        </div>
                  
                        <div className="col col-lg-3 col-md-6 col-12 col-md-6 col-sm-12 col-12">
                            <div className="widget wpo-contact-widget">
                                <div className="widget-title text-light ">
                                    <h4 className='text-light'>Contact Us</h4>
                                </div>
                                <ul>
                                    <li>
  Email:{" "}
  <a href="mailto:hello@collegeforms.in" style={{ color: "inherit", textDecoration: "none" }}>
    hello@collegeforms.in
  </a>
</li>
<li className="mt-3">
  Phone:{" "}
  <a href="tel:+919826667279" style={{ color: "inherit", textDecoration: "none" }}>
    +91-9826667279
  </a>
</li>

                                </ul>
                            </div>  
                        </div>
                    </div>
                </div>
            </div>
            <div className="wpo-lower-footer">
                <div className="container">
                    <div className="row align-items-center">
                        <div className="col col-lg-6 col-md-12 col-12">
                            <ul>
                                <li>&copy; 2022 <Link onClick={ClickHandler} to="/">CollegeForms.in</Link>. All rights reserved to <a href='https://thecounselingcafe.in/'>Thecounselingcafe
</a></li>
                            </ul>
                        </div>
                        <div className="col col-lg-6 col-md-12 col-12">
                            <div className="link">
                                <ul>
                                    <li><Link onClick={ClickHandler} to="/privacy">Privacy Policy</Link></li>
                                    <li><Link onClick={ClickHandler} to="/terms">Terms</Link></li>
                                    <li><Link onClick={ClickHandler} to="/faq">FAQ</Link></li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    )
}

export default Footer;