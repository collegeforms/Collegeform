import React, { useState, useEffect, useRef } from "react";
import "./FloatingButtons.css";

// React Remix Icons
import { 
  RiWhatsappFill,
  RiFacebookFill,
  RiInstagramFill,
  RiYoutubeFill,
  RiLinkedinFill
} from "react-icons/ri";

export default function FloatingButtons() {
  const [isVisible, setIsVisible] = useState(false);
  const [isScrolling, setIsScrolling] = useState(false);
  const timeoutRef = useRef(null);
  const hasAnimatedRef = useRef(false);

  useEffect(() => {
    // Initial show animation after page load
    const initialTimeout = setTimeout(() => {
      setIsVisible(true);
      hasAnimatedRef.current = true;
    }, 1000);

    return () => clearTimeout(initialTimeout);
  }, []);

  useEffect(() => {
    let lastScrollY = window.scrollY;
    let ticking = false;

    const handleScroll = () => {
      lastScrollY = window.scrollY;

      if (!ticking) {
        window.requestAnimationFrame(() => {
          // Hide buttons when scrolling
          setIsVisible(false);
          setIsScrolling(true);

          // Clear existing timeout
          if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
          }

          // Show buttons after scrolling stops
          timeoutRef.current = setTimeout(() => {
            setIsScrolling(false);
            setIsVisible(true);
          }, 500); // 500ms delay after scrolling stops

          ticking = false;
        });

        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  // Handle click - hide temporarily then show again
  const handleButtonClick = (e) => {
    // Prevent hiding if user clicks the button
    e.stopPropagation();
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setIsVisible(true);
  };

  return (
    <>
      {/* WhatsApp Floating Button (Left Side) */}
      <a
        href="https://wa.me/message/SZZ4HG2V6RF7K1"
        target="_blank"
        rel="noopener noreferrer"
        className={`floating-whatsapp ${isVisible ? 'visible' : 'hidden'}`}
        aria-label="WhatsApp"
        onClick={handleButtonClick}
      >
        <RiWhatsappFill className="ri-icon" />
      </a>

      {/* Social Media Floating Buttons (Right Side) */}
      <ul className={`floating-social ${isVisible ? 'visible' : 'hidden'}`}>
        <li>
          <a
            href="https://www.facebook.com/collegeforms.in"
            target="_blank"
            rel="noopener noreferrer"
            className="social-facebook"
            aria-label="Facebook"
            onClick={handleButtonClick}
          >
            <RiFacebookFill className="ri-icon" />
          </a>
        </li>

        <li>
          <a
            href="https://www.instagram.com/collegeforms_official"
            target="_blank"
            rel="noopener noreferrer"
            className="social-instagram"
            aria-label="Instagram"
            onClick={handleButtonClick}
          >
            <RiInstagramFill className="ri-icon" />
          </a>
        </li>

        <li>
          <a
            href="https://www.linkedin.com/company/collegeformsin/"
            target="_blank"
            rel="noopener noreferrer"
            className="social-linkedin"
            aria-label="LinkedIn"
            onClick={handleButtonClick}
          >
            <RiLinkedinFill className="ri-icon" />
          </a>
        </li>

        <li>
          <a
            href="https://www.youtube.com/@CollegeForms"
            target="_blank"
            rel="noopener noreferrer"
            className="social-youtube"
            aria-label="YouTube"
            onClick={handleButtonClick}
          >
            <RiYoutubeFill className="ri-icon" />
          </a>
        </li>
      </ul>

      {/* Optional: Show scroll status for debugging */}
      {/* <div style={{ 
        position: 'fixed', 
        top: '10px', 
        right: '10px', 
        background: '#333', 
        color: '#fff', 
        padding: '5px',
        fontSize: '12px',
        zIndex: 10000 
      }}>
        {isVisible ? 'Visible' : 'Hidden'} | {isScrolling ? 'Scrolling' : 'Stopped'}
      </div> */}
    </>
  );
}