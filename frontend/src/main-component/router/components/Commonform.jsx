import React from 'react';
import { Link } from 'react-router-dom';
import "./commonform.css"
const Commonform = () => {
  return (
    <div className="common-form-container">
      <div className="application-hero-2">
        <div className="hero-content-2">
          <h1>Apply to 500+ Colleges with One Form</h1>
          <p className="hero-subtitle">
            Streamline your college application process with our unified platform. 
            Apply to thousands of partner institutions in just 5 minutes.
          </p>
          
          <div className="benefits-grid">
            <div className="benefit-item">
              <div className="benefit-icon">✓</div>
              <h3>Single Application</h3>
              <p>One form for all partner colleges</p>
            </div>
            
            <div className="benefit-item">
              <div className="benefit-icon">⏱</div>
              <h3>5-Minute Apply</h3>
              <p>Complete your application quickly</p>
            </div>
            
            <div className="benefit-item">
              <div className="benefit-icon">🎯</div>
              <h3>Wide Acceptance</h3>
              <p>500+ partner institutions</p>
            </div>
          </div>
          
          <Link to="/step" className="cta-button-2">
            Start Your Application
          </Link>
          
       
        </div>
        
        <div className="hero-visual ">
      <img src="/gifs/8.gif" alt="" />
        </div>
      </div>
    </div>
  );
};

export default Commonform;