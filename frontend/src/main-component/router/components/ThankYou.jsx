import React from 'react';

const ThankYou = () => {
  return (
    <div style={styles.container}>
      <div style={styles.checkmarkContainer}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="100"
          height="100"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#4CAF50"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="12" cy="12" r="10" />
          <path d="M9 12l2 2 4-4" />
        </svg>
      </div>
      <h2 style={styles.title}>Thank you!</h2>
      <p style={styles.text}>Your submission has been sent.</p>
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100vh',
    textAlign: 'center',
    fontFamily: 'Arial, sans-serif',
    backgroundColor: '#f9f9f9',
  },
  checkmarkContainer: {
    marginBottom: '20px',
  },
  title: {
    fontSize: '24px',
    margin: '0 0 10px 0',
  },
  text: {
    fontSize: '16px',
    color: '#555',
  },
};

export default ThankYou;
