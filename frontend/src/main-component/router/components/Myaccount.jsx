import React, { useState, useContext, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import axios from 'axios';
import './MyAccount.css';
import Navbar from '../../../components/Navbar/Navbar';
import Footer from '../../../components/footer/Footer';
import Completedapplication from './Completedapplication';
import Docs from './Docs';

const MyAccount = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  
  // User data state
  const [userData, setUserData] = useState({
    name: '',
    email: '',
    phone: '',
    dob: '',
    address: '',
    education: ''
  });

  // Profile state
  const [profileErrors, setProfileErrors] = useState({});
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);
  const [profileSuccess, setProfileSuccess] = useState(false);

  // Password change state
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [passwordErrors, setPasswordErrors] = useState({});
  const [passwordSuccess, setPasswordSuccess] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [showPassword, setShowPassword] = useState({
    current: false,
    new: false,
    confirm: false
  });

  // Form progress state
  const [allFormProgress, setAllFormProgress] = useState([]);
  const [loadingProgress, setLoadingProgress] = useState(false);
  const [progressError, setProgressError] = useState(null);
  const API_URL = "https://www.collegeforms.in";    


 

  // Tab management
  const [activeTab, setActiveTab] = useState('profile');
  const tabs = [
    { id: 'profile', icon: 'dashboard', label: 'Dashboard' },
    { id: 'completed', icon: 'school', label: 'Completed' },
    { id: 'applications', icon: 'school', label: 'Applications' },
    { id: 'docs', icon: 'lock', label: 'Docs' },
    { id: 'notifications', icon: 'notifications', label: 'Notifications' },
  ];

  // Loading state for user data
  const [loadingUserData, setLoadingUserData] = useState(true);

  // Fetch user data
  useEffect(() => {
    const fetchUserData = async () => {
      if (!user?.token) return;
      
      try {
        const response = await axios.get(`${API_URL}/api/auth/get-user`, {
          headers: {
            'Authorization': `Bearer ${user.token}`
          }
        });
        
        if (response.data.user) {
          setUserData(response.data.user);
          
          // Also update formData for the edit form
          setFormData({
            name: response.data.user.name || '',
            phone: response.data.user.phone || '',
            address: response.data.user.address || '',
            education: response.data.user.education || '',
            dob: response.data.user.dob ? new Date(response.data.user.dob).toISOString().split('T')[0] : ''
          });
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      } finally {
        setLoadingUserData(false);
      }
    };
    
    fetchUserData();
  }, [user?.token, API_URL]);

  // Profile state
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    name: userData.name || '',
    phone: userData.phone || '',
    address: userData.address || '',
    education: userData.education || '',
    dob: userData.dob ? new Date(userData.dob).toISOString().split('T')[0] : ''
  });
  
  // Fetch all form progress for multiple colleges
  useEffect(() => {
    const fetchAllFormProgress = async () => {
      if (!user?.token || activeTab !== 'profile') return;
      
      setLoadingProgress(true);
      setProgressError(null);
      
      try {
        const response = await axios.get(`${API_URL}/api/students/Allprogress`, {
          headers: {
            'Authorization': `Bearer ${user.token}`
          }
        });
        
        setAllFormProgress(response.data);
      } catch (error) {
        console.error('Error fetching form progress:', error);
        setProgressError('Failed to load form progress');
      } finally {
        setLoadingProgress(false);
      }
    };

    fetchAllFormProgress();
  }, [activeTab, user?.token, API_URL]);

  // Fetch applications data
  useEffect(() => {
    const fetchApplications = async () => {
      if (!user?.token || activeTab !== 'applications') return;
      
      try {
        const response = await axios.get(`${API_URL}/api/applications`, {
          headers: {
            'Authorization': `Bearer ${user.token}`
          }
        });
        setApplications(response.data);
      } catch (error) {
        console.error('Error fetching applications:', error);
        setApplications([]);
      }
    };

    fetchApplications();
  }, [activeTab, user?.token, API_URL]);

  // Calculate password strength
  useEffect(() => {
    let strength = 0;
    const requirements = {
      length: passwordData.newPassword.length >= 8,
      uppercase: /[A-Z]/.test(passwordData.newPassword),
      lowercase: /[a-z]/.test(passwordData.newPassword),
      number: /[0-9]/.test(passwordData.newPassword),
      specialChar: /[^A-Za-z0-9]/.test(passwordData.newPassword)
    };

    Object.values(requirements).forEach(met => {
      if (met) strength += 20;
    });

    setPasswordStrength(strength);
  }, [passwordData.newPassword]);

  // Applications state
  const [applications, setApplications] = useState([]);

  // Conditional return must come AFTER all hooks
  if (!user) {
    return (
      <div className="container mt-4">
        <div className="alert alert-warning">
          Please log in to view your account.
        </div>
      </div>
    );
  }

  const onsendClick = (clgid) => {
    const userToken = localStorage.getItem("userToken");
    console.log(clgid);
    
    if (userToken) {
      navigate("/step", { state: { clgid } });
    } else {
      navigate("/user/signup");
    }
  };

  // Function to determine step status for a specific progress
  const getStepStatus = (progress, stepNumber) => {
    if (!progress) return 'incomplete';
    
    // If the step is before the active step, it's complete
    if (stepNumber < progress.activeStep) return 'complete';
    
    // If the step is the active step, it's in progress
    if (stepNumber === progress.activeStep) return 'in-progress';
    
    // If the step is after the active step, it's incomplete
    return 'incomplete';
  };

  // Profile handlers
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    if (profileErrors[name]) {
      setProfileErrors(prev => ({
        ...prev,
        [name]: null
      }));
    }
  };

  const validateProfileForm = () => {
    const errors = {};
    let isValid = true;

    if (!formData.name.trim()) {
      errors.name = 'Name is required';
      isValid = false;
    }

    setProfileErrors(errors);
    return isValid;
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateProfileForm()) return;

    setIsUpdatingProfile(true);
    setProfileSuccess(false);

    try {
      const response = await axios.put(`${API_URL}/api/auth/edit-profile`, {
        name: formData.name,
        phone: formData.phone,
        dob: formData.dob,
        address: formData.address,
        education: formData.education
      }, {
        headers: {
          'Authorization': `Bearer ${user.token}`
        }
      });

      setProfileSuccess(true);
      setEditMode(false);
      
      // Update user data after successful edit
      setUserData(prev => ({
        ...prev,
        name: formData.name,
        phone: formData.phone,
        dob: formData.dob,
        address: formData.address,
        education: formData.education
      }));
      
      setTimeout(() => setProfileSuccess(false), 5000);
    } catch (error) {
      console.error('Profile update failed:', error);
      
      if (error.response) {
        setProfileErrors({
          ...profileErrors,
          serverError: error.response.data.message || 'Profile update failed'
        });
      } else {
        setProfileErrors({
          ...profileErrors,
          serverError: 'Network error. Please try again.'
        });
      }
    } finally {
      setIsUpdatingProfile(false);
    }
  };

  // Password handlers
  const validatePasswordForm = () => {
    const errors = {};
    let isValid = true;

    if (!passwordData.currentPassword) {
      errors.currentPassword = 'Current password is required';
      isValid = false;
    }

    if (!passwordData.newPassword) {
      errors.newPassword = 'New password is required';
      isValid = false;
    } else if (passwordData.newPassword.length < 8) {
      errors.newPassword = 'Password must be at least 8 characters';
      isValid = false;
    } else if (passwordStrength < 80) {
      errors.newPassword = 'Password is not strong enough';
      isValid = false;
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
      isValid = false;
    }

    setPasswordErrors(errors);
    return isValid;
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    
    if (!validatePasswordForm()) return;

    setIsChangingPassword(true);
    setPasswordSuccess(false);

    try {
      const response = await axios.post(`${API_URL}/api/change-password`, {
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword
      }, {
        headers: {
          'Authorization': `Bearer ${user.token}`
        }
      });

      setPasswordSuccess(true);
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
      
      setTimeout(() => setPasswordSuccess(false), 5000);
    } catch (error) {
      console.error('Password change failed:', error);
      
      if (error.response) {
        setPasswordErrors({
          ...passwordErrors,
          serverError: error.response.data.error || 'Password change failed'
        });
      } else {
        setPasswordErrors({
          ...passwordErrors,
          serverError: 'Network error. Please try again.'
        });
      }
    } finally {
      setIsChangingPassword(false);
    }
  };

  const handlePasswordInputChange = (e) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({
      ...prev,
      [name]: value
    }));
    
    if (passwordErrors[name]) {
      setPasswordErrors(prev => ({
        ...prev,
        [name]: null
      }));
    }
  };

  const togglePasswordVisibility = (field) => {
    setShowPassword(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const getInitials = (name) => {
    if (!name) return 'U';
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  console.log(allFormProgress);
  
  return (
    <>
      <Navbar />
      <div className="account-dashboard">
        <div className="dashboard-container">
          {/* Sidebar */}
          <div className="sidebar">
            <nav className="sidebar-nav">
              {tabs.map(tab => (
                <button
                  key={tab.id}
                  className={`nav-item ${activeTab === tab.id ? 'active' : ''}`}
                  onClick={() => setActiveTab(tab.id)}
                >
                  <span className="material-icons">{tab.icon}</span> {tab.label}
                </button>
              ))}
              <div className="top-bt ">
                <Link to={'/contactus'} className="nav-item d-md-block d-none">
                  <span className="material-icons">contacts</span> Contact Details
                </Link>
                <a href="tel:9826667279" className="nav-item d-md-block d-none">
                  <span className="material-icons">call</span> Call Us
                </a>
                <a href="mailto:Hello@collegeforms.in" className="nav-item d-md-block d-none">
                  <span className="material-icons">email</span> Email Us
                </a>
                <button className="nav-item  text-danger" onClick={handleLogout}>
                  <span className="material-icons">logout</span> Logout
                </button>
              </div>
            </nav>
          </div>

          {/* Main Content */}
          <div className="main-content">
            {/* Profile Tab */}
            {activeTab === 'profile' && (
              <div className="content-section">
                <div className="section-header">
                  <h2>Dashboard</h2>
                </div>

                {loadingUserData && (
                  <div className="loading-spinner">
                    <span className="material-icons spin">autorenew</span>
                    Loading user data...
                  </div>
                )}

                {profileSuccess && (
                  <div className="success-message">
                    <span className="material-icons">check_circle</span>
                    Profile updated successfully!
                  </div>
                )}

                {profileErrors.serverError && (
                  <div className="error-message">
                    <span className="material-icons">error</span>
                    {profileErrors.serverError}
                  </div>
                )}

                {editMode ? (
                  <form className="profile-form" onSubmit={handleProfileSubmit}>
                    <div className="form-row">
                      <div className="form-group">
                        <label>Full Name</label>
                        <input
                          type="text"
                          name="name"
                          value={formData.name}
                          onChange={handleInputChange}
                          required
                        />
                        {profileErrors.name && (
                          <span className="error-text">{profileErrors.name}</span>
                        )}
                      </div>
                    </div>
                    
                    <div className="form-row">
                      <div className="form-group">
                        <label>Phone</label>
                        <input
                          type="tel"
                          name="phone"
                          value={formData.phone}
                          onChange={handleInputChange}
                        />
                      </div>
                      <div className="form-group">
                        <label>Date of Birth</label>
                        <input
                          type="date"
                          name="dob"
                          value={formData.dob}
                          onChange={handleInputChange}
                        />
                      </div>
                    </div>
                    
                    <div className="form-group">
                      <label>Address</label>
                      <textarea
                        name="address"
                        value={formData.address}
                        onChange={handleInputChange}
                        rows={3}
                      />
                    </div>
                    
                    <div className="form-group">
                      <label>Education</label>
                      <input
                        type="text"
                        name="education"
                        value={formData.education}
                        onChange={handleInputChange}
                      />
                    </div>
                    
                    <div className="form-actions">
                      <button 
                        type="button" 
                        className="cancel-button" 
                        onClick={() => {
                          setEditMode(false);
                          setProfileErrors({});
                          setFormData({
                            name: userData.name || '',
                            phone: userData.phone || '',
                            address: userData.address || '',
                            education: userData.education || '',
                            dob: userData.dob ? new Date(userData.dob).toISOString().split('T')[0] : ''
                          });
                        }}
                      >
                        Cancel
                      </button>
                      <button 
                        type="submit" 
                        className="save-button"
                        disabled={isUpdatingProfile}
                      >
                        {isUpdatingProfile ? (
                          <>
                            <span className="material-icons spin">autorenew</span> Saving...
                          </>
                        ) : (
                          'Save Changes'
                        )}
                      </button>
                    </div>
                  </form>
                ) : (
                  <div className="profile-card">
                    <div className="profile-header">
                      <div className="profile-avatar">
                        {getInitials(userData.name)}
                      </div>
                      <div className="profile-info">
                        <h3>{userData.name || 'User'}</h3>
                        <p>{userData.email || 'No email provided'}</p>
                      </div>
                      <div className="edit ms-auto">
                        {!editMode && (
                          <button className="edit-button" onClick={() => setEditMode(true)}>
                            <span className="material-icons">edit</span> Edit Profile
                          </button>
                        )}
                      </div>
                    </div>
                    
                    <div className="profile-details-grid">
                      <div className="detail-item">
                        <span className="detail-label">Phone</span>
                        <span className="detail-value">{userData.phone || 'Not provided'}</span>
                      </div>
                      <div className="detail-item">
                        <span className="detail-label">Date of Birth</span>
                        <span className="detail-value">
                          {userData.dob ? new Date(userData.dob).toLocaleDateString() : 'Not provided'}
                        </span>
                      </div>
                      <div className="detail-item">
                        <span className="detail-label">Address</span>
                        <span className="detail-value">{userData.address || 'Not provided'}</span>
                      </div>
                      <div className="detail-item">
                        <span className="detail-label">Education</span>
                        <span className="detail-value">{userData.education || 'Not provided'}</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Application Progress Cards */}
                <div className="progress-section">
                  {progressError && (
                    <div className="error-message">
                      <span className="material-icons">error</span>
                      {progressError}
                    </div>
                  )}
                  
                  {allFormProgress.length === 0 && !loadingProgress && !progressError && (
                    <div className="empty-progress">
                      <span className="material-icons">assignment</span>
                      <p>No applications in progress</p>
                      <Link to={"/step"} className="start-application-btn">
                        Start New Application
                      </Link>
                    </div>
                  )}
                  
                  {allFormProgress.slice(0, 1).map((progress, index) => (
                    <div key={index} className="progress-card">
                      <div className="progress-info">
                      <div className="progress-info-item">
  <span className="label">College:</span>
  <span className="value">
    {progress?.formData?.selectedColleges?.length === 1
      ? progress.formData.selectedColleges[0].name
      : progress?.formData?.selectedColleges?.length > 1
        ? 'Universal form'
        : 'Universal form'}
  </span>
</div>

                        <div className="progress-info-item">
                          <span className="label">Stream:</span>
                          <span className="value">{progress.formData.course || 'Not specified'}</span>
                        </div>
                        <div className="progress-info-item">
                          <span className="label">Current Step:</span>
                          <span className="value">
                            {progress.activeStep === 0 && 'Personal Details'}
                            {progress.activeStep === 1 && 'Education Details'}
                            {progress.activeStep === 2 && 'Family Information'}
                            {progress.activeStep === 3 && 'Document Upload'}
                          </span>
                      </div>
                        <div className="progress-info-item">
                          <span className="label">Fees Status:</span>
                          <span className={`value ${progress.feesPaid ? 'text-success' : 'text-danger'}`}>
                            {progress.feesPaid ? 'Paid' : 'Not paid'}
                          </span>
                        </div>
                      </div>
                      
                      <div className="progress-tracker d-md-block d-none">
                        <div className="steps-container">
                          {[0, 1, 2, 3].map(step => (
                            <React.Fragment key={step}>
                              <div className={`step ${getStepStatus(progress, step)}`}>
                                <div className="step-number">
                                  {getStepStatus(progress, step) === 'complete' ? (
                                    <span className="material-icons">check</span>
                                  ) : (
                                    step + 1
                                  )}
                                </div>
                                <div className="step-label ">
                                  {step === 0 && 'Personal Info'}
                                  {step === 1 && 'Education'}
                                  {step === 2 && 'Family Info'}
                                  {step === 3 && 'Documents'}
                                </div>
                              </div>
                              {step < 3 && <div className="step-connector"></div>}
                            </React.Fragment>
                          ))}
                        </div>
                      </div>
                      
                      <div className="progress-actions">
                        <Link to={`/step`} className="continue-btn">
                          {progress.submitted ? 'View Application' : 'Continue Application'}
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Applications Tab */}
            {activeTab === 'applications' && (
              <div className="content-section">
                <div className="section-header">
                  <h2>College Applications</h2>
                </div>
                <div className="progress-section">
                  {progressError && (
                    <div className="error-message">
                      <span className="material-icons">error</span>
                      {progressError}
                    </div>
                  )}
                  
                  {allFormProgress.length === 0 && !loadingProgress && !progressError && (
                    <div className="empty-progress">
                      <span className="material-icons">assignment</span>
                      <p>No applications in progress</p>
                      <Link to={"/step"} className="start-application-btn">
                        Start New Application
                      </Link>
                    </div>
                  )}
                  
                  {allFormProgress.map((progress, index) => (
                    <div key={index} className="progress-card">
                      <div className="progress-info">
                     <div className="progress-info-item">
  <span className="label">College:</span>
  <span className="value">
    {progress?.formData?.selectedColleges?.length === 1
      ? progress.formData.selectedColleges[0].name
      : progress?.formData?.selectedColleges?.length > 1
        ? 'Universal form'
        : 'Not specified'}
  </span>
</div>

                        <div className="progress-info-item">
                          <span className="label">Stream:</span>
                          <span className="value">{progress.formData.course || 'Not specified'}</span>
                        </div>
                        <div className="progress-info-item">
                          <span className="label">Current Step:</span>
                          <span className="value">
                            {progress.activeStep === 0 && 'Personal Details'}
                            {progress.activeStep === 1 && 'Education Details'}
                            {progress.activeStep === 2 && 'Family Information'}
                            {progress.activeStep === 3 && 'Document Upload'}
                          </span>
                        </div>
                        <div className="progress-info-item">
                          <span className="label">Fees Status:</span>
                          <span className={`value ${progress.feesPaid ? 'text-success' : 'text-danger'}`}>
                            {progress.feesPaid ? 'Paid' : 'Not paid'}
                          </span>
                        </div>
                      </div>
                      
                      <div className="progress-tracker d-md-block d-none">
                        <div className="steps-container">
                          {[0, 1, 2, 3].map(step => (
                            <React.Fragment key={step}>
                              <div className={`step ${getStepStatus(progress, step)}`}>
                                <div className="step-number">
                                  {getStepStatus(progress, step) === 'complete' ? (
                                    <span className="material-icons">check</span>
                                  ) : (
                                    step + 1
                                  )}
                                </div>
                                <div className="step-label">
                                  {step === 0 && 'Personal Info'}
                                  {step === 1 && 'Education'}
                                  {step === 2 && 'Family Info'}
                                  {step === 3 && 'Documents'}
                                </div>
                              </div>
                              {step < 3 && <div className="step-connector"></div>}
                            </React.Fragment>
                          ))}
                        </div>
                      </div>
                      
                      <div className="progress-actions">
                        <Link to={`/colleges`} className="continue-btn">
                          {progress.submitted ? 'View Application' : 'Continue Application'}
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'completed' && (
              <Completedapplication />
            )}

            {activeTab === 'docs' && (
              <Docs />
            )}

            {/* Security Tab */}
            {activeTab === 'security' && (
              <div className="content-section">
                <div className="section-header">
                  <h2>Security Settings</h2>
                </div>
                
                <form className="security-form" onSubmit={handlePasswordChange}>
                  {passwordSuccess && (
                    <div className="success-message">
                      <span className="material-icons">check_circle</span>
                      Password changed successfully!
                    </div>
                  )}
                  
                  {passwordErrors.serverError && (
                    <div className="error-message">
                      <span className="material-icons">error</span>
                      {passwordErrors.serverError}
                    </div>
                  )}

                  <div className="form-group">
                    <label>Current Password</label>
                    <div className="password-input">
                      <input
                        type={showPassword.current ? "text" : "password"}
                        name="currentPassword"
                        value={passwordData.currentPassword}
                        onChange={handlePasswordInputChange}
                        required
                      />
                      <button 
                        type="button" 
                        className="toggle-password"
                        onClick={() => togglePasswordVisibility('current')}
                      >
                        <span className="material-icons">
                          {showPassword.current ? "visibility_off" : "visibility"}
                        </span>
                      </button>
                    </div>
                    {passwordErrors.currentPassword && (
                      <span className="error-text">{passwordErrors.currentPassword}</span>
                    )}
                  </div>

                  <div className="form-group">
                    <label>New Password</label>
                    <div className="password-input">
                      <input
                        type={showPassword.new ? "text" : "password"}
                        name="newPassword"
                        value={passwordData.newPassword}
                        onChange={handlePasswordInputChange}
                        required
                      />
                      <button 
                        type="button" 
                        className="toggle-password"
                        onClick={() => togglePasswordVisibility('new')}
                      >
                        <span className="material-icons">
                          {showPassword.new ? "visibility_off" : "visibility"}
                        </span>
                      </button>
                    </div>
                    {passwordErrors.newPassword && (
                      <span className="error-text">{passwordErrors.newPassword}</span>
                    )}
                    
                    {passwordData.newPassword && (
                      <div className="password-strength">
                        <div className="strength-meter">
                          <div 
                            className={`strength-bar ${passwordStrength >= 20 ? 'weak' : ''} ${passwordStrength >= 60 ? 'medium' : ''} ${passwordStrength >= 80 ? 'strong' : ''}`}
                            style={{ width: `${passwordStrength}%` }}
                          ></div>
                        </div>
                        <div className="strength-labels">
                          <span className={passwordStrength >= 20 ? 'active' : ''}>Weak</span>
                          <span className={passwordStrength >= 60 ? 'active' : ''}>Medium</span>
                          <span className={passwordStrength >= 80 ? 'active' : ''}>Strong</span>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="form-group">
                    <label>Confirm Password</label>
                    <div className="password-input">
                      <input
                        type={showPassword.confirm ? "text" : "password"}
                        name="confirmPassword"
                        value={passwordData.confirmPassword}
                        onChange={handlePasswordInputChange}
                        required
                      />
                      <button 
                        type="button" 
                        className="toggle-password"
                        onClick={() => togglePasswordVisibility('confirm')}
                      >
                        <span className="material-icons">
                          {showPassword.confirm ? "visibility_off" : "visibility"}
                        </span>
                      </button>
                    </div>
                    {passwordErrors.confirmPassword && (
                      <span className="error-text">{passwordErrors.confirmPassword}</span>
                    )}
                  </div>

                  <button 
                    type="submit" 
                    className="update-button"
                    disabled={isChangingPassword}
                  >
                    {isChangingPassword ? (
                      <>
                        <span className="material-icons spin">autorenew</span> Updating...
                      </>
                    ) : (
                      'Update Password'
                    )}
                  </button>
                </form>
              </div>
            )}

            {/* Notifications Tab */}
            {activeTab === 'notifications' && (
              <div className="content-section">
                <h2>Notification Settings</h2>
                <div className="empty-state">
                  <span className="material-icons">notifications</span>
                  <p>Notification settings will be available soon</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default MyAccount;