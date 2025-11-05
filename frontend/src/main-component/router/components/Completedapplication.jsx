import React, { useState, useEffect, useRef } from 'react';
import './CompletedApplication.css';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

const CompletedApplication = () => {
      const API_URL = "https://collegeform.onrender.com" || "https://collegeform-production.up.railway.app" || "http://localhost:5000";


  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedCard, setExpandedCard] = useState(null);
  const cardRefs = useRef({});

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      const userString = localStorage.getItem('userInfo');
      const token = localStorage.getItem('userToken');
      
      if (!userString) {
        setError('Please log in to view applications');
        setLoading(false);
        return;
      }

      const user = JSON.parse(userString);
      
      const response = await fetch(`${API_URL}/api/students/my-applications`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch applications');
      }
      
      const data = await response.json();
      console.log('Fetched applications:', data);
      
      setApplications(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const toggleCardExpansion = (id) => {
    if (expandedCard === id) {
      setExpandedCard(null);
    } else {
      setExpandedCard(id);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Not provided';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch (error) {
      return 'Invalid date';
    }
  };

  // Helper function to safely get college name
  const getCollegeName = (college) => {
    if (!college) return 'Not available';
    if (typeof college === 'string') return college;
    if (college.name) return college.name;
    if (college.collegeName) return college.collegeName;
    return 'College name not available';
  };

  // Helper function to safely get college slug
  const getCollegeSlug = (college) => {
    if (!college) return 'Not available';
    if (typeof college === 'string') return college;
    if (college.slug) return college.slug;
    if (college.collegeSlug) return college.collegeSlug;
    return 'Slug not available';
  };

  // Helper function to get college status
  const getCollegeStatus = (application, collegeIndex) => {
    if (!application.collegeStatuses || !application.collegeStatuses[collegeIndex]) {
      return { status: 'pending', remarks: '' };
    }
    return {
      status: application.collegeStatuses[collegeIndex].status || 'pending',
      remarks: application.collegeStatuses[collegeIndex].remarks || ''
    };
  };

  // Helper function to safely access nested properties
  const getSafeValue = (obj, path, defaultValue = 'Not provided') => {
    if (!obj) return defaultValue;
    const keys = path.split('.');
    let result = obj;
    
    for (const key of keys) {
      if (result === null || result === undefined) return defaultValue;
      result = result[key];
    }
    
    return result !== undefined && result !== null ? result : defaultValue;
  };

  // Function to generate PDF from application data
  const generatePDF = async (application) => {
    try {
      // Create a temporary div to hold the content for PDF generation
      const content = document.createElement('div');
      content.style.padding = '20px';
      content.style.fontFamily = 'Arial, sans-serif';
      content.style.color = '#333';
      content.style.width = '800px';
      content.style.backgroundColor = 'white';
      
      // Safely get application data
      const appId = getSafeValue(application, 'applicationId') || 
                   getSafeValue(application, '_id', '').slice(-8).toUpperCase();
      const appName = getSafeValue(application, 'name');
      const appEmail = getSafeValue(application, 'email');
      const appCourse = getSafeValue(application, 'course');
      
      // Build colleges HTML
      const collegesHTML = application.selectedColleges && application.selectedColleges.length > 0 
        ? application.selectedColleges.map((college, index) => {
            const collegeStatus = getCollegeStatus(application, index);
            const collegeName = getCollegeName(college);
            return `
              <div style="padding: 8px; border: 1px solid #ddd; margin-bottom: 8px; border-radius: 4px;">
                <div><strong>${collegeName}</strong></div>
                <div style="display: inline-block; padding: 3px 8px; border-radius: 12px; font-size: 12px; margin-top: 5px; 
                  background-color: ${collegeStatus.status === 'approved' ? '#a3e4d7' : collegeStatus.status === 'rejected' ? '#f5b7b1' : '#ffeaa7'}; 
                  color: ${collegeStatus.status === 'approved' ? '#1d8348' : collegeStatus.status === 'rejected' ? '#c0392b' : '#d35400'}">
                  ${collegeStatus.status.toUpperCase()}
                </div>
                ${collegeStatus.remarks ? `<div style="margin-top: 5px;"><em>Remarks: ${collegeStatus.remarks}</em></div>` : ''}
              </div>
            `;
          }).join('')
        : '<div>No colleges selected</div>';

      // Add application content to the temporary div
      content.innerHTML = `
        <div style="text-align: center; margin-bottom: 20px; border-bottom: 2px solid #4285f4; padding-bottom: 10px;">
          <h1 style="color: #4285f4; margin-bottom: 5px;">Application Details</h1>
          <p>ID: ${appId} | Submitted: ${formatDate(getSafeValue(application, 'createdAt'))}</p>
        </div>
        
        <div style="margin-bottom: 15px;">
          <div style="font-weight: bold; color: #4285f4; margin-bottom: 8px; font-size: 16px;">Personal Information</div>
          <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 10px; margin-bottom: 10px;">
            <div><strong>Name:</strong> ${appName}</div>
            <div><strong>Email:</strong> ${appEmail}</div>
            <div><strong>Phone:</strong> ${getSafeValue(application, 'number')}</div>
            <div><strong>Date of Birth:</strong> ${formatDate(getSafeValue(application, 'dob'))}</div>
            <div><strong>Gender:</strong> ${getSafeValue(application, 'gender')}</div>
            <div><strong>Aadhar:</strong> ${getSafeValue(application, 'aadhar')}</div>
            <div><strong>Course:</strong> ${appCourse}</div>
          </div>
        </div>
        
        <div style="margin-bottom: 15px;">
          <div style="font-weight: bold; color: #4285f4; margin-bottom: 8px; font-size: 16px;">Selected Colleges</div>
          ${collegesHTML}
        </div>
        
        <div style="margin-bottom: 15px;">
          <div style="font-weight: bold; color: #4285f4; margin-bottom: 8px; font-size: 16px;">Parent Information</div>
          <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 10px; margin-bottom: 10px;">
            <div><strong>Father's Name:</strong> ${getSafeValue(application, 'fatherName')}</div>
            <div><strong>Father's Number:</strong> ${getSafeValue(application, 'fatherNumber')}</div>
            <div><strong>Mother's Name:</strong> ${getSafeValue(application, 'motherName')}</div>
            <div><strong>Mother's Number:</strong> ${getSafeValue(application, 'motherNumber')}</div>
            <div><strong>Occupation:</strong> ${getSafeValue(application, 'occupation')}</div>
          </div>
        </div>
        
        <div style="margin-bottom: 15px;">
          <div style="font-weight: bold; color: #4285f4; margin-bottom: 8px; font-size: 16px;">Educational Background</div>
          <div style="margin-bottom: 10px;">
            <div><strong>10th Grade</strong></div>
            <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 10px; margin-bottom: 10px;">
              <div><strong>School:</strong> ${getSafeValue(application, 'schoolName10')}</div>
              <div><strong>Board:</strong> ${getSafeValue(application, 'board10')}</div>
              <div><strong>Passing Year:</strong> ${getSafeValue(application, 'passingYear10')}</div>
              <div><strong>Percentage/CGPA:</strong> ${getSafeValue(application, 'percentage10') ? `${getSafeValue(application, 'percentage10')}%` : getSafeValue(application, 'cgpa10')}</div>
            </div>
          </div>
          
          <div style="margin-bottom: 10px;">
            <div><strong>12th Grade</strong></div>
            <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 10px; margin-bottom: 10px;">
              <div><strong>School:</strong> ${getSafeValue(application, 'schoolName12')}</div>
              <div><strong>Board:</strong> ${getSafeValue(application, 'board12')}</div>
              <div><strong>Passing Year:</strong> ${getSafeValue(application, 'passingYear12')}</div>
              <div><strong>Percentage/CGPA:</strong> ${getSafeValue(application, 'percentage12') ? `${getSafeValue(application, 'percentage12')}%` : getSafeValue(application, 'cgpa12')}</div>
            </div>
          </div>
          
          ${getSafeValue(application, 'isGraduation') ? `
          <div style="margin-bottom: 10px;">
            <div><strong>Graduation</strong></div>
            <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 10px; margin-bottom: 10px;">
              <div><strong>University:</strong> ${getSafeValue(application, 'graduationUniversity')}</div>
              <div><strong>Course:</strong> ${getSafeValue(application, 'graduationCourse')}</div>
              <div><strong>Passing Year:</strong> ${getSafeValue(application, 'passingYearGraduation')}</div>
              <div><strong>Percentage/CGPA:</strong> ${getSafeValue(application, 'percentageGraduation') ? `${getSafeValue(application, 'percentageGraduation')}%` : getSafeValue(application, 'cgpaGraduation')}</div>
            </div>
          </div>
          ` : ''}
        </div>
        
        ${getSafeValue(application, 'remarks') ? `
        <div style="margin-bottom: 15px;">
          <div style="font-weight: bold; color: #4285f4; margin-bottom: 8px; font-size: 16px;">Remarks</div>
          <p>${getSafeValue(application, 'remarks')}</p>
        </div>
        ` : ''}
      `;

      // Append the content to the body temporarily
      document.body.appendChild(content);

      // Create PDF from the content
      const canvas = await html2canvas(content);
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const imgWidth = 210; // A4 width in mm
      const pageHeight = 295; // A4 height in mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      
      let heightLeft = imgHeight;
      let position = 0;

      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      // Add additional pages if needed
      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      // Remove the temporary content
      document.body.removeChild(content);

      // Download the PDF
      pdf.save(`application_${appId}.pdf`);
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Error generating PDF. Please try again.');
    }
  };

  // Function to print application
  const printApplication = (application) => {
    const appId = getSafeValue(application, 'applicationId') || 
                 getSafeValue(application, '_id', '').slice(-8).toUpperCase();
    
    const printContent = `
      <html>
        <head>
          <title>Application ${appId}</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 20px; color: #333; }
            .header { text-align: center; margin-bottom: 20px; border-bottom: 2px solid #4285f4; padding-bottom: 10px; }
            .section { margin-bottom: 15px; }
            .section-title { font-weight: bold; color: #4285f4; margin-bottom: 8px; font-size: 16px; }
            .info-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 10px; margin-bottom: 10px; }
            .info-item { margin-bottom: 5px; }
            .label { font-weight: bold; }
            .college-item { padding: 8px; border: 1px solid #ddd; margin-bottom: 8px; border-radius: 4px; }
            .status { display: inline-block; padding: 3px 8px; border-radius: 12px; font-size: 12px; margin-top: 5px; }
            .status.pending { background-color: #ffeaa7; color: #d35400; }
            .status.approved { background-color: #a3e4d7; color: #1d8348; }
            .status.rejected { background-color: #f5b7b1; color: #c0392b; }
            @media print { 
              body { padding: 0; margin: 0; }
              .header { margin-top: 0; }
            }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>Application Details</h1>
            <p>ID: ${appId} | Submitted: ${formatDate(getSafeValue(application, 'createdAt'))}</p>
          </div>
          
          <div class="section">
            <div class="section-title">Personal Information</div>
            <div class="info-grid">
              <div class="info-item"><span class="label">Name:</span> ${getSafeValue(application, 'name')}</div>
              <div class="info-item"><span class="label">Email:</span> ${getSafeValue(application, 'email')}</div>
              <div class="info-item"><span class="label">Phone:</span> ${getSafeValue(application, 'number')}</div>
              <div class="info-item"><span class="label">Date of Birth:</span> ${formatDate(getSafeValue(application, 'dob'))}</div>
              <div class="info-item"><span class="label">Gender:</span> ${getSafeValue(application, 'gender')}</div>
              <div class="info-item"><span class="label">Aadhar:</span> ${getSafeValue(application, 'aadhar')}</div>
              <div class="info-item"><span class="label">Course:</span> ${getSafeValue(application, 'course')}</div>
            </div>
          </div>
          
          <div class="section">
            <div class="section-title">Selected Colleges</div>
            ${application.selectedColleges && application.selectedColleges.length > 0 
              ? application.selectedColleges.map((college, index) => {
                  const collegeStatus = getCollegeStatus(application, index);
                  const collegeName = getCollegeName(college);
                  return `
                    <div class="college-item">
                      <div><strong>${collegeName}</strong></div>
                      <div class="status ${collegeStatus.status}">${collegeStatus.status.toUpperCase()}</div>
                      ${collegeStatus.remarks ? `<div><em>Remarks: ${collegeStatus.remarks}</em></div>` : ''}
                    </div>
                  `;
                }).join('')
              : '<div>No colleges selected</div>'
            }
          </div>
          
          <div class="section">
            <div class="section-title">Parent Information</div>
            <div class="info-grid">
              <div class="info-item"><span class="label">Father's Name:</span> ${getSafeValue(application, 'fatherName')}</div>
              <div class="info-item"><span class="label">Father's Number:</span> ${getSafeValue(application, 'fatherNumber')}</div>
              <div class="info-item"><span class="label">Mother's Name:</span> ${getSafeValue(application, 'motherName')}</div>
              <div class="info-item"><span class="label">Mother's Number:</span> ${getSafeValue(application, 'motherNumber')}</div>
              <div class="info-item"><span class="label">Occupation:</span> ${getSafeValue(application, 'occupation')}</div>
            </div>
          </div>
          
          <div class="section">
            <div class="section-title">Educational Background</div>
            <div style="margin-bottom: 10px;">
              <div><strong>10th Grade</strong></div>
              <div class="info-grid">
                <div class="info-item"><span class="label">School:</span> ${getSafeValue(application, 'schoolName10')}</div>
                <div class="info-item"><span class="label">Board:</span> ${getSafeValue(application, 'board10')}</div>
                <div class="info-item"><span class="label">Passing Year:</span> ${getSafeValue(application, 'passingYear10')}</div>
                <div class="info-item"><span class="label">Percentage/CGPA:</span> ${getSafeValue(application, 'percentage10') ? `${getSafeValue(application, 'percentage10')}%` : getSafeValue(application, 'cgpa10')}</div>
              </div>
            </div>
            
            <div style="margin-bottom: 10px;">
              <div><strong>12th Grade</strong></div>
              <div class="info-grid">
                <div class="info-item"><span class="label">School:</span> ${getSafeValue(application, 'schoolName12')}</div>
                <div class="info-item"><span class="label">Board:</span> ${getSafeValue(application, 'board12')}</div>
                <div class="info-item"><span class="label">Passing Year:</span> ${getSafeValue(application, 'passingYear12')}</div>
                <div class="info-item"><span class="label">Percentage/CGPA:</span> ${getSafeValue(application, 'percentage12') ? `${getSafeValue(application, 'percentage12')}%` : getSafeValue(application, 'cgpa12')}</div>
              </div>
            </div>
            
            ${getSafeValue(application, 'isGraduation') ? `
            <div style="margin-bottom: 10px;">
              <div><strong>Graduation</strong></div>
              <div class="info-grid">
                <div class="info-item"><span class="label">University:</span> ${getSafeValue(application, 'graduationUniversity')}</div>
                <div class="info-item"><span class="label">Course:</span> ${getSafeValue(application, 'graduationCourse')}</div>
                <div class="info-item"><span class="label">Passing Year:</span> ${getSafeValue(application, 'passingYearGraduation')}</div>
                <div class="info-item"><span class="label">Percentage/CGPA:</span> ${getSafeValue(application, 'percentageGraduation') ? `${getSafeValue(application, 'percentageGraduation')}%` : getSafeValue(application, 'cgpaGraduation')}</div>
              </div>
            </div>
            ` : ''}
          </div>
          
          ${getSafeValue(application, 'remarks') ? `
          <div class="section">
            <div class="section-title">Remarks</div>
            <p>${getSafeValue(application, 'remarks')}</p>
          </div>
          ` : ''}
        </body>
      </html>
    `;

    // Create a new window for printing
    const printWindow = window.open('', '_blank');
    printWindow.document.write(printContent);
    printWindow.document.close();
    
    // Wait for content to load then print
    printWindow.onload = function() {
      printWindow.print();
      // printWindow.close(); // Uncomment to automatically close after printing
    };
  };

  if (loading) {
    return <div className="loading">Loading applications...</div>;
  }

  if (error) {
    return <div className="error">Error: {error}</div>;
  }

  return (
    <div className="completed-applications">
      <div className="applications-header">
        <h2>My Applications</h2>
        <p className="applications-count">{applications.length} application{applications.length !== 1 ? 's' : ''} submitted</p>
      </div>
      
      {applications.length === 0 ? (
        <div className="no-applications">
          <div className="no-applications-icon">📝</div>
          <h3>No applications yet</h3>
          <p>You haven't submitted any applications yet.</p>
          <button className="cta-button">Start Application</button>
        </div>
      ) : (
        <div className="applications-grid">
          {applications.map((app) => {
            const appId = getSafeValue(app, 'applicationId') || 
                         getSafeValue(app, '_id', '').slice(-8).toUpperCase();
            const appName = getSafeValue(app, 'name');
            const appEmail = getSafeValue(app, 'email');
            const appCourse = getSafeValue(app, 'course');
            
            return (
              <div 
                key={app._id} 
                className={`application-card ${expandedCard === app._id ? 'expanded' : ''}`}
                ref={el => cardRefs.current[app._id] = el}
              >
                <div className="card-content">
                  <div className="card-main-info">
                    <div className="main-info-left">
                      <h3 className="applicant-name">{appName}</h3>
                      <p className="applicant-email">{appEmail}</p>
                      <div className="compact-info">
                        <span className="info-pill">{appCourse}</span>
                        <span className="info-pill">{getSafeValue(app, 'number', 'No phone')}</span>
                        <span className="info-pill">{formatDate(getSafeValue(app, 'dob'))}</span>
                      </div>
                    </div>
                    
                    <div className="main-info-right">
                      <div className="application-badge">
                        <span className="application-id">ID: {appId}</span>
                      </div>
                      <div className="applied-date">Applied: {formatDate(getSafeValue(app, 'createdAt'))}</div>
                    </div>
                  </div>
                  
                  {expandedCard === app._id && (
                    <div className="expanded-details">
                      <div className="details-grid-3">
                        <div className="detail-section">
                          <h4>Selected Colleges</h4>
                          <div className="colleges-list">
                            {app.selectedColleges && app.selectedColleges.length > 0 ? (
                              app.selectedColleges.map((college, index) => {
                                const collegeStatus = getCollegeStatus(app, index);
                                const collegeName = getCollegeName(college);
                                return (
                                  <div key={index} className="college-item-3">
                                    <div className="college-name-3">{collegeName}</div>
                                    <div className={`college-status ${collegeStatus.status}`}>
                                      {collegeStatus.status.toUpperCase()}
                                    </div>
                                    {collegeStatus.remarks && (
                                      <div className="college-remarks">Remarks: {collegeStatus.remarks}</div>
                                    )}
                                  </div>
                                );
                              })
                            ) : (
                              <div className="no-data">No colleges selected</div>
                            )}
                          </div>
                        </div>
                        
                        <div className="detail-section">
                          <h4>Education</h4>
                          <div className="education-item">
                            <strong>10th:</strong> {getSafeValue(app, 'schoolName10')} | {getSafeValue(app, 'board10')} | {getSafeValue(app, 'passingYear10')} | {getSafeValue(app, 'percentage10') ? `${getSafeValue(app, 'percentage10')}%` : getSafeValue(app, 'cgpa10')}
                          </div>
                          <div className="education-item">
                            <strong>12th:</strong> {getSafeValue(app, 'schoolName12')} | {getSafeValue(app, 'board12')} | {getSafeValue(app, 'passingYear12')} | {getSafeValue(app, 'percentage12') ? `${getSafeValue(app, 'percentage12')}%` : getSafeValue(app, 'cgpa12')}
                          </div>
                          {getSafeValue(app, 'isGraduation') && (
                            <div className="education-item">
                              <strong>Graduation:</strong> {getSafeValue(app, 'graduationUniversity')} | {getSafeValue(app, 'graduationCourse')} | {getSafeValue(app, 'passingYearGraduation')} | {getSafeValue(app, 'percentageGraduation') ? `${getSafeValue(app, 'percentageGraduation')}%` : getSafeValue(app, 'cgpaGraduation')}
                            </div>
                          )}
                        </div>
                        
                        <div className="detail-section">
                          <h4>Parent Information</h4>
                          <div className="info-pairs">
                            <div className="info-pair">
                              <span className="label">Father:</span>
                              <span className="value">{getSafeValue(app, 'fatherName')}</span>
                            </div>
                            <div className="info-pair">
                              <span className="label">Father's No:</span>
                              <span className="value">{getSafeValue(app, 'fatherNumber')}</span>
                            </div>
                            <div className="info-pair">
                              <span className="label">Mother:</span>
                              <span className="value">{getSafeValue(app, 'motherName')}</span>
                            </div>
                            <div className="info-pair">
                              <span className="label">Mother's No:</span>
                              <span className="value">{getSafeValue(app, 'motherNumber')}</span>
                            </div>
                            <div className="info-pair">
                              <span className="label">Occupation:</span>
                              <span className="value">{getSafeValue(app, 'occupation')}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      {getSafeValue(app, 'remarks') && (
                        <div className="remarks">
                          <span className="label">Remarks:</span>
                          <p className="value">{getSafeValue(app, 'remarks')}</p>
                        </div>
                      )}
                    </div>
                  )}
                  
                  <div className="progress-container">
                    <div className="progress-labels">
                      <span>Application Progress</span>
                      <span>In Review</span>
                    </div>
                    <div className="progress-bar">
                      <div className="progress-fill in-progress" style={{width: '60%'}}></div>
                    </div>
                  </div>
                </div>
                
                <div className="card-actions">
                  <button 
                    className="action-btn view-btn"
                    onClick={() => toggleCardExpansion(app._id)}
                  >
                    {expandedCard === app._id ? 'Show Less' : 'View Details'}
                  </button>
                  <button 
                    className="action-btn download-btn"
                    onClick={() => generatePDF(app)}
                  >
                    Download PDF
                  </button>
                  <button 
                    className="action-btn print-btn"
                    onClick={() => printApplication(app)}
                  >
                    Print
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default CompletedApplication;