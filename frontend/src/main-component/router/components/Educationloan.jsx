import React from 'react';
import './EducationLoan.css';

// Import images
import loanHero from './new-assets/education-1.jpg';
import whyLoan from './new-assets/education-2.jpg';
import loanProcess from './new-assets/education-3.jpg';
import loanSupport from './new-assets/education-4.jpg';
import Navbar from '../../../components/Navbar/Navbar';
import Footer from '../../../components/footer/Footer';
import PersonalisedSection from '../../../components/PersonalisedSection/PersonalisedSection';
import BannerRow from './SimpleBannerRow';

const Educationloan = () => {


  const category= "education-loan"

  return (
    <>
    <Navbar/>
      <BannerRow category={category} />
      
      
      <div className="edu-loan-container">
        
        {/* Hero Section */}
        <section className="edu-loan-hero">
          <div className="edu-hero-content">
            <h1>Fund Your Future: Student Education Loans Made Simple with CollegeForms</h1>
            <p>
              You located the college and you submitted the application. The biggest question now becomes, how will you pay for it? At CollegeForms we do not just help you get in — we help you get ahead. Our education loan support system was developed specifically for Indian students pursuing high education in India or abroad.
            </p>
          </div>
          <div className="edu-hero-image">
            <img src={loanHero} alt="Student with graduation cap celebrating success" />
          </div>
        </section>

        {/* Why Take Education Loan Section */}
        <section className="edu-section edu-why-section">
          <div className="edu-section-image">
            <img src={whyLoan} alt="Student studying with laptop and books" />
          </div>
          <div className="edu-section-content">
            <h2>Why Take an Education Loan</h2>
            <p>
              The costs for higher education are increasing rapidly. An education loan helps fill the gap, so you can enroll in your desired higher education program without delay. Education loans do not only help with tuition costs, they may also include books, equipment, travel, and living costs as well. Payment options generally allow an absence of payment during the time of enrollment and an additional moratorium prior to the commencement of empowering EMI.  
            </p>
            <p>
              On our platform, you will be assisted with a wide range of things like personalized counseling, loan comparison, and guide in a step-by-step approach that will help you cut through the usual confusing financial language.
            </p>
          </div>
        </section>

        {/* Services Section */}
        <section className="edu-section edu-services-section">
          <div className="edu-section-content">
            <h2>Our Services – How We Help</h2>
            <p><strong>Loan Support:</strong> We will help you examine different loans from public and private banks, and talk about criteria for eligibility, collateral and the maximum loan amount.</p>
            <p><strong>Application Support:</strong> We will provide thorough support with documentation, completing forms, and provide proper submission tips.</p>
            <p><strong>Full Process:</strong> You will be guided through the entire loan process, from interest rates to timelines around the disbursement of the loan. You will not feel left in the dark at any point.</p>
            <p><strong>Post Loan Support:</strong> We will help you learn about managing EMIs, tracking repayment calendars, and adjust through changes in interest rates.</p>
          </div>
        </section>

        {/* Key Features Section */}
        <section className="edu-section edu-features-section">
          <div className="edu-section-content">
            <h2>Key Features to Know</h2>
            <p>Loan amounts depend on your educational course and institute - professional course have a higher loan amount.</p>
            <p>Collateral-free options are available with lower amounts.</p>
            <p>Subsidies by government-backed schemes for eligible students are available.</p>
            <p>Flexible repayment options extend to 10-15 years on average.</p>
            <p>Support for loan will be provided for education at home and overseas.</p>
          </div>
        </section>

        {/* Eligibility Section */}
        <section className="edu-section edu-eligibility-section">
          <div className="edu-section-content">
            <h2>Eligibility Snapshot</h2>
            <p>Here's a quick checklist before you apply:</p>
            <p>You must be an Indian national with admission in a recognized institution.</p>
            <p>You must have a parent or guardian as co-applicant for most loans.</p>
            <p>Documents required include admission letter, fee structure, academic documents, ID proof, and income evidence.</p>
            <p>Also, some banks may impose specific academic or income criteria.</p>
          </div>
        </section>

        {/* Process Section */}
        <section className="edu-section edu-process-section">
          <div className="edu-section-image">
            <img src={loanProcess} alt="Step by step loan application process" />
          </div>
          <div className="edu-section-content">
            <h2>Step-by-Step Application Process</h2>
            <p>Identify the loan product that fits your course and budget.</p>
            <p>Gather and prepare documentation for verification purposes.</p>
            <p>Complete the application and submit it through a partner channel.</p>
            <p>The bank or financial institution will assess your eligibility and any collateral requirements.</p>
            <p>If approved, disbursement will occur directly to your college or university.</p>
            <p>Commencement of EMI repayment will start after course completion and the end of the moratorium.</p>
          </div>
        </section>

        {/* Tips Section */}
        <section className="edu-section edu-tips-section">
          <div className="edu-section-content">
            <h2>Tips & Pitfalls to Avoid</h2>
            <p>Do not borrow more money than you believe you can comfortably return.</p>
            <p>Always read the fine print to verify if there are any hidden or extra charges.</p>
            <p>Choose lending institutions that have clear and transparent language.</p>
            <p>Continue to make satisfactory academic progress to remain eligible for future loans.</p>
            <p>Consider repayment in relation to your work opportunities for the future.</p>
          </div>
        </section>

        {/* Why Partner Section */}
        <section className="edu-section edu-partner-section">
          <div className="edu-section-image">
            <img src={loanSupport} alt="CollegeForms support team helping students" />
          </div>
          <div className="edu-section-content">
            <h2>Why Partner with CollegeForms</h2>
            <p>We are much more than just college application forms — we are your total education ecosystem.</p>
            <p>Trusted by thousands of students and parents in India.</p>
            <p>Comprehensive guidance for applications, loans, and accommodation.</p>
            <p>Transparent processes with a team of advisors.</p>
            <p>Single point of contact from start to finish.</p>
          </div>
        </section>

   

      </div>
      <PersonalisedSection/>
      <Footer/>
    </>
  );
};

export default Educationloan;