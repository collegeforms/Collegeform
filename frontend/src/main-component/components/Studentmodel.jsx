import React from 'react';

const Studentmodel = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h2>Application Form</h2>
        <p>Fill out the form to apply now!</p>
        <form>
          {/* Form fields for applying */}
          <input type="text" placeholder="Your Name" />
          <input type="email" placeholder="Your Email" />
          <textarea placeholder="Why do you want to apply?" />
          <button type="submit">Submit Application</button>
        </form>
        <button className="btn close-btn" onClick={onClose}>Close</button>
      </div>
    </div>
  );
};

export default Studentmodel;
