import React from "react";
import StepForm from "./StepForm";
import { Divider, useMediaQuery } from "@mui/material";
import { Link } from "react-router";
import CarouselSection from "./CarouselSection";

const Bigform = () => {
  const isMobile = useMediaQuery("(max-width: 768px)");

  return (
    <div
      style={{
        display: "flex",
        flexDirection: isMobile ? "column" : "row",
        height: isMobile ? "auto" : "100vh",
        padding: isMobile ? "0" : "15px",
        paddingTop: isMobile ? "30px" : "0",
      }}
    >
      {/* Back Button */}
      <Link 
        to="/" 
        style={{
          position: "absolute",
          top: isMobile ? "15px" : "20px",
          left: isMobile ? "15px" : "20px",
          display: "flex",
          alignItems: "center",
          textDecoration: "none",
          color: "#1976d2",
          fontWeight: "500",
          fontSize: isMobile ? "14px" : "16px",
          zIndex: 1000,
          backgroundColor: "white",
          padding: isMobile ? "6px 12px" : "8px 16px",
          borderRadius: "8px",
          boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
          border: "1px solid #e0e0e0"
        }}
      >
        <svg 
          width={isMobile ? "16" : "20"} 
          height={isMobile ? "16" : "20"} 
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="currentColor" 
          style={{ marginRight: "8px" }}
        >
          <path d="M19 12H5M12 19l-7-7 7-7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
        Back to Home
      </Link>

      {/* Carousel Section */}
      <div
        style={{
          width: isMobile ? "100%" : "50%",
          padding: "0px",
          display: isMobile ? "none" : "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          color: "black",
          borderRadius: "20px",
          marginBottom: isMobile ? "20px" : "0",
        }}
      >
        <CarouselSection />
      </div>

      {/* Form Section */}
      <div
        style={{
          width: isMobile ? "100%" : "65%",
          paddingTop: isMobile ? "40px" : "0px",
          backgroundColor: "white",
          position: "relative",
        }}
      >
        <div style={{ textAlign: "center" }}>
          <StepForm />
        </div>
      </div>
    </div>
  );
};

export default Bigform;