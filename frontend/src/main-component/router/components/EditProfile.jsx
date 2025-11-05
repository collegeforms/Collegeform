import React, { useState } from 'react';
import axios from 'axios';

const EditProfile = ({ user, token, onCancel, onSuccess, API_URL }) => {
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    address: user?.address || '',
    education: user?.education || '',
    dob: user?.dob ? new Date(user.dob).toISOString().split('T')[0] : ''
  });
  
  const [errors, setErrors] = useState({});
  const [isUpdating, setIsUpdating] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: null
      }));
    }
  };

  const validateForm = () => {
    const errors = {};
    let isValid = true;

    if (!formData.name.trim()) {
      errors.name = 'Name is required';
      isValid = false;
    }

    if (!formData.email.trim()) {
      errors.email = 'Email is required';
      isValid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = 'Invalid email format';
      isValid = false;
    }

    setErrors(errors);
    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsUpdating(true);

    try {
      const response = await axios.put(`${API_URL}/api/edit-profile`, {
        name: formData.name,
        phone: formData.phone,
        dob: formData.dob,
        address: formData.address,
        education: formData.education
      }, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      onSuccess(response.data);
      setIsUpdating(false);
      
    } catch (error) {
      console.error('Profile update failed:', error);
      
      if (error.response) {
        setErrors({
          ...errors,
          serverError: error.response.data.message || 'Profile update failed'
        });
      } else {
        setErrors({
          ...errors,
          serverError: 'Network error. Please try again.'
        });
      }
      setIsUpdating(false);
    }
  };

  return (
    <form className="profile-form" onSubmit={handleSubmit}>
      {errors.serverError && (
        <div className="error-message">
          <span className="material-icons">error</span>
          {errors.serverError}
        </div>
      )}

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
          {errors.name && (
            <span className="error-text">{errors.name}</span>
          )}
        </div>
        <div className="form-group">
          <label>Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            disabled
          />
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
          onClick={onCancel}
          disabled={isUpdating}
        >
          Cancel
        </button>
        <button 
          type="submit" 
          className="save-button"
          disabled={isUpdating}
        >
          {isUpdating ? (
            <>
              <span className="material-icons spin">autorenew</span> Saving...
            </>
          ) : (
            'Save Changes'
          )}
        </button>
      </div>
    </form>
  );
};

export default EditProfile;