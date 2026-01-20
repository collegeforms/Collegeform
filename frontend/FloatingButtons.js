import React from "react";
import "../css/font-awesome.min.css";
import "./FloatingButtons.css";

const WHATSAPP_NUMBER = "917049688510"; // update this to your number (country code + number)
const WHATSAPP_TEXT = encodeURIComponent(
  "Hello! I would like to get in touch.",
);

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
            href="https://www.instagram.com/collegeforms_official?igsh=NmxmaTFudHV3cHFv"
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
            href={`https://wa.me/${WHATSAPP_NUMBER}?text=${WHATSAPP_TEXT}`}
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
