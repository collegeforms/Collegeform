import React from 'react';
import './Accommodation.css';

// Import images
import accommodationHero from './new-assets/Accommodations-1.jpg';
import accommodationServices from './new-assets/Accommodations-2.jpg';
import accommodationChecklist from './new-assets/Accommodations-3.jpg';
import Navbar from '../../../components/Navbar/Navbar';
import Footer from '../../../components/footer/Footer';
import PersonalisedSection from '../../../components/PersonalisedSection/PersonalisedSection';

const Accommodation = () => {
  return (
    <>
      <Navbar/>
      <div className="acco-container">
        
        {/* Hero Section */}
        <section className="acco-hero">
          <div className="acco-hero-content">
            <h1>Find Your Ideal Student Living Space – Smart, Safe & Student-Friendly</h1>
            <p>
              The first step is getting into school. The next step is making sure that where you live helps you succeed.  
              At CollegeForms, we won't just help you with applying to college, we can also identify the right place for you to live, learn and thrive.
            </p>
          </div>
          <div className="acco-hero-image">
            <img src={accommodationHero} alt="Modern student accommodation building" />
          </div>
        </section>

        {/* Why Accommodation Matters Section */}
        <section className="acco-section acco-why-section">
          <div className="acco-section-content">
            <h2>Why Student Accommodation Matters</h2>
            <p>
              While considering where to live, you want to be in a space that promotes your wellbeing, study habits and overall college experience. 
              Living too far from campus or moving into an unsafe living space could take away from your time and commitment to your studies. Regardless of your moving away to a new city or country we will help find you safe, affordable and convenient accommodation. 
            </p>
            <p>
              Our team will help you secure accommodation even before the start of your semester and alleviate the stress of looking for accommodation at the last minute.
            </p>
          </div>
        </section>

        {/* Services Section */}
        <section className="acco-section acco-services-section">
          <div className="acco-section-image">
            <img src={accommodationServices} alt="Student accommodation services and amenities" />
          </div>
          <div className="acco-section-content">
            <h2>Our Accommodation Services</h2>
            <div className="acco-services-list">
              <div className="acco-service-item">
                <div className="acco-service-content">
                  <h3>University-Related Housing</h3>
                  <p>Dormitories, hostels, or student living spaces with verified amenities</p>
                </div>
              </div>
              <div className="acco-service-item">
                <div className="acco-service-content">
                  <h3>Budget Consideration</h3>
                  <p>Options within your budget range and near campus</p>
                </div>
              </div>
              <div className="acco-service-item">
                <div className="acco-service-content">
                  <h3>Safety & Verification</h3>
                  <p>All listings are verified for student safety and area quality verification</p>
                </div>
              </div>
              <div className="acco-service-item">
                <div className="acco-service-content">
                  <h3>International Students</h3>
                  <p>Support, leases, deposit, and local government requirements</p>
                </div>
              </div>
              <div className="acco-service-item">
                <div className="acco-service-content">
                  <h3>Move-In Orientation</h3>
                  <p>Check-in, agreements, and budgeting assistance</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* What to Consider Section */}
        <section className="acco-section acco-consider-section">
          <div className="acco-section-content">
            <h2>What to Consider Before Choosing</h2>
            <div className="acco-consideration-grid">
              <div className="acco-consideration-card">
                <h3>Location</h3>
                <p>Choose a location that is near campus or public transport</p>
              </div>
              <div className="acco-consideration-card">
                <h3>Budget</h3>
                <p>Rent amount, what the deposit is, what monthly utility costs are, etc.</p>
              </div>
              <div className="acco-consideration-card">
                <h3>Amenities</h3>
                <p>Wifi, security, study area, laundry</p>
              </div>
              <div className="acco-consideration-card">
                <h3>Contract Limits</h3>
                <p>How long is the lease for, are there policies for Sub-Leasing and, if terminated, if agreed.</p>
              </div>
              <div className="acco-consideration-card">
                <h3>Local Connection</h3>
                <p>Will you have a local connection or support if there is an emergency issue or maintenance?</p>
              </div>
            </div>
          </div>
        </section>

        {/* Smart Move-In Checklist Section */}
        <section className="acco-section acco-checklist-section">
          <div className="acco-section-image">
            <img src={accommodationChecklist} alt="Student moving into accommodation checklist" />
          </div>
          <div className="acco-section-content">
            <h2>Smart Move-In Checklist</h2>
            <div className="acco-checklist">
              <div className="acco-checklist-item">
                <div className="acco-check-content">
                  <h3>Visit the Property</h3>
                  <p>Visit the property or take a virtual tour prior to booking.</p>
                </div>
              </div>
              <div className="acco-checklist-item">
                <div className="acco-check-content">
                  <h3>Review Lease Thoroughly</h3>
                  <p>Review the lease thoroughly - understand what is included in the rent.</p>
                </div>
              </div>
              <div className="acco-checklist-item">
                <div className="acco-check-content">
                  <h3>Confirm Deposit Details</h3>
                  <p>Confirm the deposit amount as well as refund conditions or terms.</p>
                </div>
              </div>
              <div className="acco-checklist-item">
                <div className="acco-check-content">
                  <h3>Document Property Condition</h3>
                  <p>Walk through the property and document the condition.</p>
                </div>
              </div>
              <div className="acco-checklist-item">
                <div className="acco-check-content">
                  <h3>Understand Maintenance Process</h3>
                  <p>Understand how to notify someone if something needs to be fixed.</p>
                </div>
              </div>
              <div className="acco-checklist-item">
                <div className="acco-check-content">
                  <h3>Confirm Mail Address</h3>
                  <p>If planning to stay long-term, confirm your mail address.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Why Choose CollegeForms Section */}
        <section className="acco-section acco-choose-section">
          <div className="acco-section-content">
            <h2>Why Choose CollegeForms Accommodation</h2>
            <div className="acco-benefits-grid">
              <div className="acco-benefit-card">
                <i className="ri-verified-badge-line"></i>
                <p>Lists that are verified and acceptable for students.</p>
              </div>
              <div className="acco-benefit-card">
                <i className="ri-calendar-check-line"></i>
                <p>Clear options to pick relevant to start date of course and location.</p>
              </div>
              <div className="acco-benefit-card">
                <i className="ri-team-line"></i>
                <p>Full coordination between you as a tenant, the landlord, and your college.</p>
              </div>
              <div className="acco-benefit-card">
                <i className="ri-git-repository-line"></i>
                <p>Complete ecosystem: College Application + Education Loans + Accommodation.</p>
              </div>
            </div>
          </div>
        </section>

      </div>

      <PersonalisedSection/>
      <Footer/>
    </>
  );
};

export default Accommodation;