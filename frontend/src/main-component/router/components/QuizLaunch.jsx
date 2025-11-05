import React, { useState } from 'react';
import './QuizLaunch.css';

const QuizLaunch = () => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div className="quiz-launch-container">
      <div className="quiz-card">
        <div className="quiz-content">
          <h2 className="quiz-title">Test Your Knowledge!</h2>
          <p className="quiz-description">
            Take our quick quiz and stand a chance to win an exclusive discount coupon 
            for your next semester. It's fun, easy, and rewarding!
          </p>
          
          <div className="features-list">
            <div className="feature">
              <span className="feature-icon">🎯</span>
              <span>Only 5 questions</span>
            </div>
            <div className="feature">
              <span className="feature-icon">⏱️</span>
              <span>Takes just 2 minutes</span>
            </div>
            <div className="feature">
              <span className="feature-icon">🎁</span>
              <span>Instant coupon reveal</span>
            </div>
          </div>
          
          <button 
            className={`quiz-button ${isHovered ? 'pulse' : ''}`}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            Start Quiz & Win Discount
            <span className="button-arrow">→</span>
          </button>
          
          <div className="coupon-visual">
            <div className="coupon-shape"></div>
            <div className="coupon-shape"></div>
            <div className="coupon-shape"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuizLaunch;