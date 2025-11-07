import React from 'react';
import './Terms.css';
import Footer from '../../../components/footer/Footer';
import Navbar from '../../../components/Navbar/Navbar';
import PersonalisedSection from '../../../components/PersonalisedSection/PersonalisedSection';

const Terms = () => {
  return (
    <>
    
    
    <Navbar/>
    
        <div className="clg-terms-container">
      {/* Header Section */}
 <div className="container">
       <div className="clg-terms-header">
        <h1 className="clg-terms-title">Terms & Conditions</h1>
        <p className="clg-terms-update">Last updated: 6 November 2025</p>
      </div>

      {/* Introduction */}
      <div className="clg-terms-intro-section">
        <p className="clg-terms-intro-text">
          These Terms & Conditions ("Terms") govern your use of CollegeForms.in. 
          By accessing or using the Site, you agree to be bound by these Terms. If you do not agree, you must not use the Site.
        </p>
      </div>

      {/* Terms Sections */}
      <div className="clg-terms-sections-wrapper">
        {/* Section 1 */}
        <div className="clg-terms-section-card">
          <div className="clg-terms-header-container">
            <span className="clg-terms-number-badge">1</span>
            <h2 className="clg-terms-title-heading">Services and role</h2>
          </div>
          <div className="clg-terms-content-wrapper">
            <p>We provide an online platform that allows users to:</p>
            <ul className="clg-terms-bullet-list">
              <li>Search and apply to colleges using a universal application form.</li>
              <li>Access information on courses, career counselling, education loans and accommodation.</li>
              <li>Connect with third‑party service providers such as colleges, banks and housing providers.</li>
            </ul>
            <p>We are an intermediary. We facilitate the submission of applications and connect you with third parties, but we do not guarantee admission, loan approval or housing availability. Decisions rest solely with the respective institutions.</p>
          </div>
        </div>

        {/* Section 2 */}
        <div className="clg-terms-section-card">
          <div className="clg-terms-header-container">
            <span className="clg-terms-number-badge">2</span>
            <h2 className="clg-terms-title-heading">Eligibility and user obligations</h2>
          </div>
          <div className="clg-terms-content-wrapper">
            <p>By using the Site you warrant that:</p>
            <ul className="clg-terms-bullet-list">
              <li>You are at least 18 years old or have consent from a parent/guardian.</li>
              <li>All information you provide is accurate, complete and current.</li>
              <li>You will use the Site only for lawful purposes and not to misrepresent yourself or others.</li>
              <li>You are responsible for maintaining the confidentiality of any account credentials and for all activities conducted under your account.</li>
            </ul>
          </div>
        </div>

        {/* Section 3 */}
        <div className="clg-terms-section-card">
          <div className="clg-terms-header-container">
            <span className="clg-terms-number-badge">3</span>
            <h2 className="clg-terms-title-heading">User‑generated content</h2>
          </div>
          <div className="clg-terms-content-wrapper">
            <p>If the Site allows you to post reviews, comments or other content, you must ensure your contributions are lawful and do not infringe on any rights. Under India's IT Rules we must control user‑generated content, and we may remove or block content that is obscene, defamatory, infringing or illegal privacypolicies.com. We reserve the right to ban or block users who abuse the platform privacypolicies.com.</p>
          </div>
        </div>

        {/* Section 4 */}
        <div className="clg-terms-section-card">
          <div className="clg-terms-header-container">
            <span className="clg-terms-number-badge">4</span>
            <h2 className="clg-terms-title-heading">Intellectual property</h2>
          </div>
          <div className="clg-terms-content-wrapper">
            <p>All content on the Site, including text, graphics, logos, icons, images and software, is owned by CollegeForms or its licensors and is protected by intellectual property laws. You may view or download materials for personal, non‑commercial use only. You must not reproduce, modify or distribute any content without our written permission.</p>
          </div>
        </div>

        {/* Section 5 */}
        <div className="clg-terms-section-card">
          <div className="clg-terms-header-container">
            <span className="clg-terms-number-badge">5</span>
            <h2 className="clg-terms-title-heading">Third‑party links and services</h2>
          </div>
          <div className="clg-terms-content-wrapper">
            <p>The Site may contain links, Photos or Videos to websites or services operated by third parties or of third parties. These links, photos and videos are provided for convenience only. We have no control over third‑party content and accept no responsibility for their accuracy, policies or practices. Accessing these sites is at your own risk.</p>
          </div>
        </div>

        {/* Section 6 */}
        <div className="clg-terms-section-card">
          <div className="clg-terms-header-container">
            <span className="clg-terms-number-badge">6</span>
            <h2 className="clg-terms-title-heading">Disclaimers</h2>
          </div>
          <div className="clg-terms-content-wrapper">
            <p>The Site and services are provided on an "as‑is" and "as‑available" basis. We make no warranties, express or implied, regarding accuracy, completeness, reliability or suitability.</p>
            <ul className="clg-terms-bullet-list">
              <li>While we strive to ensure the timeliness of college application deadlines, course details and prices, we do not guarantee that all information is always up to date.</li>
              <li>We are not responsible for decisions made by colleges, universities, banks or housing providers.</li>
            </ul>
          </div>
        </div>

        {/* Section 7 */}
        <div className="clg-terms-section-card">
          <div className="clg-terms-header-container">
            <span className="clg-terms-number-badge">7</span>
            <h2 className="clg-terms-title-heading">Limitation of liability</h2>
          </div>
          <div className="clg-terms-content-wrapper">
            <p>To the fullest extent permitted by law, we shall not be liable for any indirect, incidental or consequential damages arising out of your use of the Site. Our total liability to you for any claim arising out of or relating to the Site is limited to the amount you have paid us for access to the service (if any).</p>
          </div>
        </div>

        {/* Section 8 */}
        <div className="clg-terms-section-card">
          <div className="clg-terms-header-container">
            <span className="clg-terms-number-badge">8</span>
            <h2 className="clg-terms-title-heading">Indemnification</h2>
          </div>
          <div className="clg-terms-content-wrapper">
            <p>You agree to indemnify and hold us and our affiliates harmless from any losses, liabilities, claims or expenses (including reasonable legal fees) arising out of your misuse of the Site, your breach of these Terms or your violation of any law or rights of a third party.</p>
          </div>
        </div>

        {/* Section 9 */}
        <div className="clg-terms-section-card">
          <div className="clg-terms-header-container">
            <span className="clg-terms-number-badge">9</span>
            <h2 className="clg-terms-title-heading">Termination and modification</h2>
          </div>
          <div className="clg-terms-content-wrapper">
            <p>We may suspend or terminate your access to the Site at any time, without prior notice, if we believe you have violated these Terms or applicable laws. All provisions that by their nature should survive termination (such as intellectual property rights, limitation of liability and indemnification) shall survive.</p>
            <p>We may modify these Terms at any time. Changes will take effect when posted on the Site with a new "Last updated" date. Your continued use of the Site after changes means you accept the revised Terms.</p>
          </div>
        </div>

        {/* Section 10 */}
        <div className="clg-terms-section-card">
          <div className="clg-terms-header-container">
            <span className="clg-terms-number-badge">10</span>
            <h2 className="clg-terms-title-heading">Governing law and dispute resolution</h2>
          </div>
          <div className="clg-terms-content-wrapper">
            <p>These Terms are governed by the laws of India. Any disputes arising under or in connection with these Terms shall be subject to the exclusive jurisdiction of the courts of Indore, Madhya Pradesh, India. Before initiating formal proceedings, you and CollegeForms agree to attempt to resolve disputes through good‑faith negotiations.</p>
          </div>
        </div>

        {/* Section 11 */}
        <div className="clg-terms-section-card">
          <div className="clg-terms-header-container">
            <span className="clg-terms-number-badge">11</span>
            <h2 className="clg-terms-title-heading">Contact information</h2>
          </div>
          <div className="clg-terms-content-wrapper">
            <p>For questions about these Terms, contact us at:</p>
            <div className="clg-terms-contact-box">
              <p className="clg-terms-contact-detail"><strong>Email:</strong> hello@collegeforms.in</p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Note */}
      <div className="clg-terms-footer-note">
        <p className="clg-terms-footer-text text-light">Proceeding with our forms means you accept our Terms and Privacy Policy.</p>
      </div>
 </div>
    </div>

    <PersonalisedSection/>
    <Footer/>
    </>

  );
};

export default Terms;