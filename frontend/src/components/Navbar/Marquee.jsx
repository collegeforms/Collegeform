import { useState, useEffect } from "react";
import "./Marquee.css"; // Import the CSS file

const messages = [
  "Welcome to Our College Admission Portal! ✅",
  "Admissions Open for 2025 - Apply Now!",
  "Check Out Our Colleges",
  "Scholarships Available for Eligible Students!",
  "Contact Us for More Information."
];

const Marquee = () => {
  const [currentMessage, setCurrentMessage] = useState(0);
  const [slide, setSlide] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setSlide(true); // Start sliding effect
      setTimeout(() => {
        setCurrentMessage((prev) => (prev + 1) % messages.length);
        setSlide(false); // Reset animation after text changes
      }, 500); // Match the animation duration (0.5s)
    }, 3000); // Change text every 2 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="marquee-container">
      <div className={`marquee-text ${slide ? "slide-up" : ""}`}>
        {messages[currentMessage]}
      </div>
    </div>
  );
};

export default Marquee;
