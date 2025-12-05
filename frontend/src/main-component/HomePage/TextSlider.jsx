import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import "./home.css";

  const API_URL = "https://www.collegeforms.in";

const TextSlider = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSliderItems = async () => {
      try {
        const response = await axios.get(`${API_URL}/api/slider`);
        setMessages(response.data.map(item => item.content));
        setLoading(false);
      } catch (err) {
        console.error("Error fetching slider items:", err);
        setError("Failed to load slider content");
        setLoading(false);
      }
    };

    fetchSliderItems();
  }, []);

  if (loading) {
    return (
      <div className="slider-container">
        <div className="slider-content"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="slider-container">
        <div className="slider-content">{error}</div>
      </div>
    );
  }

  if (messages.length === 0) {
    return (
      <div className="slider-container">
        <div className="slider-content">No slider content available</div>
      </div>
    );
  }

  // Repeat messages to create seamless infinite scroll effect
  const repeatedMessages = [...messages, ...messages, ...messages];

  return (
    <div className="slider-container">
      <motion.div
        className="slider-content"
        animate={{ x: ["0%", "-100%"] }}
        transition={{ 
          repeat: Infinity, 
          duration: messages.length * 25, // Adjust duration based on content length
          ease: "linear" 
        }}
      >
        {repeatedMessages.map((msg, index) => (
          <span key={index} className="slider-item">
            {msg}
          </span>
        ))}
      </motion.div>
    </div>
  );
};

export default TextSlider;