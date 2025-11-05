import React, { useState } from "react";
import "./Signup.css";
import { Link, useNavigate } from "react-router-dom";
import LockIcon from "@mui/icons-material/Lock";

const Signup = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
  });

  const [error, setError] = useState("");
  const navigate = useNavigate(); // For navigation after signup

  // Handle input change
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); // Clear previous errors

    try {
      const response = await fetch("c/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Signup failed");

      localStorage.setItem("userToken", data.token); // Store token in localStorage
      navigate("/"); // Redirect after successful signup
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="containers">
      <div className="signup-form text-start container">
        <div className="img-div">
          <img src="/img/college-logo-2.png" width={"200px"} alt="College Logo" />
        </div>
        <h1 className="text-start">Start Building Your Account</h1>
        {error && <p className="error">{error}</p>} {/* Display error if any */}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name">Full Name</label>
            <input
              type="text"
              id="name"
              name="name"
              placeholder="Enter your full name"
              required
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              placeholder="Enter your email"
              required
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label htmlFor="phone">Phone Number</label>
            <input
              type="number"
              id="phone"
              name="phone"
              placeholder="Enter your phone number"
              required
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              placeholder="Enter your password"
              required
              onChange={handleChange}
            />
          </div>

          <button type="submit" className="submit-btn">
            Sign Up <LockIcon className="ms-2" />
          </button>
        </form>
        <p className="mt-4">
          Already have an account? <Link to={"/user/login"}>Login</Link>
        </p>
      </div>
      <div className="image-section"></div>
    </div>
  );
};

export default Signup;
