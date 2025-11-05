import React from "react";
import StepForm from "./StepForm";
import { Divider, useMediaQuery } from "@mui/material";


import { Link } from "react-router";
const Bigform = () => {
  const isMobile = useMediaQuery("(max-width: 768px)");

  return (
    <div
      style={{
        display: "flex",
        flexDirection: isMobile ? "column" : "row",
        height: "100vh",
        height: isMobile ? "auto" : "100vh",
        padding: isMobile ? "0" : "15px",
        paddingTop: isMobile ? "30px" : "0",

      }}
    >
    <div
  style={{
    width: isMobile ? "100%" : "35%",
    padding: "30px",
    backgroundColor: "#F5F5F5",
    display: isMobile ? "none" :"flex",
    
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    color: "black",
    borderRadius: "20px",
    marginBottom: isMobile ? "20px" : "0",
    backgroundImage: "url('./img/form.jpg')", // Background image
    backgroundSize: "cover", // Cover entire div
    backgroundRepeat: "no-repeat",
    backgroundPosition: "center",
    opacity: 0.9, // Slight transparency for a faded effect
  }}
>

</div>


      <div
        style={{
          width: isMobile ? "100%" : "65%",

          paddingTop: isMobile ? "0px" : "0px",
          backgroundColor: "white",
        }}
      >
        <div style={{ textAlign: "center" }}>
        {/* <Link to="/">
    <img
      src="./img/college-logo-2.png"
      width={isMobile ? "180px" : "240px"}
      alt="Logo"
      style={{marginLeft:"auto"}}
    />
  </Link> */}
          <StepForm />
        </div>
      </div>
    </div>
  );
};

export default Bigform;
