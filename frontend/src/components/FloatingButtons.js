import React from "react";
import "../css/font-awesome.min.css";
import "./FloatingButtons.css";

export default function FloatingButtons() {
  return (
    <>
      <ul className="floating-social" aria-label="Social links">
        <li>
          <a
            href="https://www.facebook.com/collegeforms.in"
            target="_blank"
            rel="noopener noreferrer"
            className="social-facebook"
            aria-label="Facebook"
          >
            <i className="fa fa-facebook"></i>
          </a>
        </li>

        <li>
          <a
            href="https://www.instagram.com/collegeforms_official"
            target="_blank"
            rel="noopener noreferrer"
            className="social-instagram"
            aria-label="Instagram"
          >
            <i className="fa fa-instagram"></i>
          </a>
        </li>

              <li>
          <a
            href="https://www.youtube.com/@CollegeForms"
            target="_blank"
            rel="noopener noreferrer"
            className="social-youtube"
            aria-label="Youtube"
          >
            <i className="fa fa-youtube"></i>
          </a>
        </li>

        <li>
          <a
            href="https://wa.me/message/SZZ4HG2V6RF7K1"
            target="_blank"
            rel="noopener noreferrer"
            className="social-whatsapp"
            aria-label="Chat on WhatsApp"
          >
            <i className="fa fa-whatsapp"></i>
          </a>
        </li>
      </ul>
    </>
  );
}


