import React from "react";
import "./PersonalisedSection.css";

export default function PersonalisedSection() {
  return (
    <div className="personalised-section">
      <h2>
        Personalised Guidance. <br />
        <span> Certified Experts.</span>
      </h2>
      <p>Get in touch with our college shortlisters</p>

      <form className="callback-form">
        <div className="input-row">
          <input type="text" placeholder="Name" required />
          <input type="tel" placeholder="Mobile" required />
          <input type="email" placeholder="Email" required />
          <select required>
            <option value="">Your Stream</option>
            <option value="science">Science</option>
            <option value="commerce">Commerce</option>
            <option value="arts">Arts</option>
          </select>
        </div>
        <button type="submit">Request a callback</button>
      </form>

      <p className="terms-text">
        Proceeding means you accept our <a href="#">Terms and Privacy Policy.</a>.
      </p>
    </div>
  );
}
