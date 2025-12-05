import React, { useState } from "react";
import "./PersonalisedSection.css";
import axios from "axios";
import Swal from "sweetalert2";

export default function PersonalisedSection() {
  const [formData, setFormData] = useState({
    name: "",
    mobile: "",
    email: "",
    course: "",
  });
  const [loading, setLoading] = useState(false);
  const API_URL = "https://www.collegeforms.in";


  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axios.post(`${API_URL}/api/callbacks`, formData);
      
      if (response.data.success) {
        Swal.fire({
          title: "Success!",
          text: "We've received your request. Our expert will call you shortly.",
          icon: "success",
          confirmButtonColor: "#564BD5"
        });
        
        // Reset form
        setFormData({
          name: "",
          mobile: "",
          email: "",
          course: "",
        });
      }
    } catch (error) {
      console.error("Error submitting callback request:", error);
      Swal.fire({
        title: "Error!",
        text: "Failed to submit your request. Please try again.",
        icon: "error",
        confirmButtonColor: "#d33"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="personalised-section">
      <h2>
        Personalised Guidance. <br />
        <span> Certified Experts.</span>
      </h2>
      <p>Get in touch with our college shortlisters</p>

      <form className="callback-form" onSubmit={handleSubmit}>
        <div className="input-row">
          <input 
            type="text" 
            name="name"
            placeholder="Name" 
            value={formData.name}
            onChange={handleChange}
            required 
          />
          <input 
            type="tel" 
            name="mobile"
            placeholder="Mobile" 
            value={formData.mobile}
            onChange={handleChange}
            required 
          />
          <input 
            type="email" 
            name="email"
            placeholder="Email" 
            value={formData.email}
            onChange={handleChange}
            required 
          />
          <input 
            type="text" 
            name="course"
            placeholder="Preferred Course" 
            value={formData.course}
            onChange={handleChange}
            required 
          />
     
        </div>
        <button type="submit" disabled={loading}>
          {loading ? "Submitting..." : "Request a callback"}
        </button>
      </form>

      <p className="terms-text">
        Proceeding means you accept our <a href="#">Terms and Privacy Policy</a>.
      </p>
    </div>
  );
}