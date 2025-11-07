import React from 'react';
import './Privacy.css';
import Navbar from '../../../components/Navbar/Navbar';
import Footer from '../../../components/footer/Footer';
import PersonalisedSection from '../../../components/PersonalisedSection/PersonalisedSection';

const Privacy = () => {
  return (
    <>
      <Navbar/>
      
      <div className="clg-privacy-container ">


        <div className="container">

        {/* Header Section */}
        <div className="clg-privacy-header">
          <h1 className="clg-privacy-title">Privacy Policy</h1>
          <p className="clg-privacy-update">Last updated: 6 November 2025</p>
        </div>

        {/* Introduction */}
        <div className="clg-privacy-intro-section">
          <p className="clg-privacy-intro-text">
            At CollegeForms.in, we respect your privacy and are committed to protecting your personal information. 
            By submitting forms or using any part of our platform, you consent to the collection and use of your data 
            as described in this notice. We follow India's Information Technology Act and SPDI Rules, which require 
            express consent before collecting or sharing sensitive personal data privacypolicies.com.
          </p>
        </div>

        {/* Policy Sections */}
        <div className="clg-privacy-sections-wrapper">
          {/* Section 1 */}
          <div className="clg-policy-section-card">
            <div className="clg-section-header-container">
              <span className="clg-section-number-badge">1</span>
              <h2 className="clg-section-title-heading">Information we collect</h2>
            </div>
            <div className="clg-section-content-wrapper">
              <p>We only collect data that is necessary for our services. This may include:</p>
              <ul className="clg-bullet-point-list">
                <li><strong>Personal details</strong> – your name, email address, phone number, postal address and date of birth.</li>
                <li><strong>Academic data</strong> – course preferences, educational background, admission test scores and college choices.</li>
                <li><strong>Financial data</strong> – when you apply for education loans we may collect income details, bank information or other financial records.</li>
                <li><strong>Technical data</strong> – device identifiers, IP address, browser type and cookies.</li>
              </ul>
              <p>We do not knowingly collect data from children under 13. If a minor uses our services, a parent or guardian must provide the information on their behalf.</p>
            </div>
          </div>

          {/* Section 2 */}
          <div className="clg-policy-section-card">
            <div className="clg-section-header-container">
              <span className="clg-section-number-badge">2</span>
              <h2 className="clg-section-title-heading">How we use your information</h2>
            </div>
            <div className="clg-section-content-wrapper">
              <p>Your information helps us to:</p>
              <ul className="clg-bullet-point-list">
                <li><strong>Process applications</strong> – to prepare college applications, eligibility checks and scholarship recommendations.</li>
                <li><strong>Provide loan and accommodation assistance</strong> – to connect you with banks, financial institutions and housing providers.</li>
                <li><strong>Improve our services</strong> – to analyse usage, troubleshoot problems, develop new features and personalise content.</li>
                <li><strong>Communicate with you</strong> – to send confirmations, respond to queries, provide updates about your applications and, if you opt in, promotional material.</li>
              </ul>
              <p>We do not sell your personal information. We share it only with trusted partners (colleges, banks, accommodation providers) to fulfil your request and as required by law privacypolicies.com.</p>
            </div>
          </div>

          {/* Section 3 */}
          <div className="clg-policy-section-card">
            <div className="clg-section-header-container">
              <span className="clg-section-number-badge">3</span>
              <h2 className="clg-section-title-heading">Consent and control</h2>
            </div>
            <div className="clg-section-content-wrapper">
              <p>Under India's IT Rules you must provide written consent (through our forms) before we collect or share sensitive personal data privacypolicies.com. By filling out our forms you agree to this policy and to the processing of your data. You have the right to:</p>
              <ul className="clg-bullet-point-list">
                <li>Access or update your personal data by contacting us.</li>
                <li>Withdraw consent for marketing communications at any time.</li>
                <li>Request deletion of your data, subject to legal or contractual obligations.</li>
              </ul>
            </div>
          </div>

          {/* Section 4 */}
          <div className="clg-policy-section-card">
            <div className="clg-section-header-container">
              <span className="clg-section-number-badge">4</span>
              <h2 className="clg-section-title-heading">Data security</h2>
            </div>
            <div className="clg-section-content-wrapper">
              <p>We employ industry‑standard security measures to safeguard your data, including encryption, secure servers and restricted access. We follow a "Privacy by Design" approach by implementing controls such as de‑identification, encryption and multi‑layered network protection privacypolicies.com. While we strive to protect your data, no online transmission is completely secure; you should take your own precautions when sharing information online.</p>
            </div>
          </div>

          {/* Section 5 */}
          <div className="clg-policy-section-card">
            <div className="clg-section-header-container">
              <span className="clg-section-number-badge">5</span>
              <h2 className="clg-section-title-heading">Cookies and tracking technologies</h2>
            </div>
            <div className="clg-section-content-wrapper">
              <p>Our site uses cookies and similar technologies to enhance your experience. Cookies help us remember your preferences, analyse site usage and improve our services. You can control cookies through your browser settings, though disabling them may affect certain features.</p>
            </div>
          </div>

          {/* Section 6 */}
          <div className="clg-policy-section-card">
            <div className="clg-section-header-container">
              <span className="clg-section-number-badge">6</span>
              <h2 className="clg-section-title-heading">Data retention</h2>
            </div>
            <div className="clg-section-content-wrapper">
              <p>We retain your information only as long as necessary to provide our services or as required by law. When data is no longer needed it is securely deleted or anonymised.</p>
            </div>
          </div>

          {/* Section 7 */}
          <div className="clg-policy-section-card">
            <div className="clg-section-header-container">
              <span className="clg-section-number-badge">7</span>
              <h2 className="clg-section-title-heading">Third‑party links</h2>
            </div>
            <div className="clg-section-content-wrapper">
              <p>The website may contain links to external websites or services. We do not control these third parties and are not responsible for their privacy practices. We encourage you to review their privacy policies before sharing information.</p>
            </div>
          </div>

          {/* Section 8 */}
          <div className="clg-policy-section-card">
            <div className="clg-section-header-container">
              <span className="clg-section-number-badge">8</span>
              <h2 className="clg-section-title-heading">Changes to this policy</h2>
            </div>
            <div className="clg-section-content-wrapper">
              <p>We may update this Privacy Policy occasionally to reflect legal or operational changes. The updated version will be posted on this page with a new "Last updated" date. Continued use of the site after changes means you accept the updated policy.</p>
            </div>
          </div>

          {/* Section 9 - New Section */}
          <div className="clg-policy-section-card">
            <div className="clg-section-header-container">
              <span className="clg-section-number-badge">9</span>
              <h2 className="clg-section-title-heading">Contact us</h2>
            </div>
            <div className="clg-section-content-wrapper">
              <p>If you have any questions about this policy or wish to exercise your rights, contact us at:</p>
              <p><strong>Email:</strong> hello@collegeforms.in</p>
            </div>
          </div>
        </div>

        {/* Footer Note */}
        <div className="clg-privacy-footer-note">
          <p className="clg-footer-text text-light">Proceeding with our forms means you accept our Terms and Privacy Policy collegeforms.in.</p>
        </div>



        </div>






      </div>
<PersonalisedSection/>
      <Footer/>
    </>
  );
};

export default Privacy;