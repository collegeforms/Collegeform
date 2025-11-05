import React, { useEffect, useState } from "react";
import axios from "axios";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { Button } from "@mui/material";
import { RiSendPlaneFill } from "react-icons/ri";

const Bhome = () => {
  const [banners, setBanners] = useState([]);
  const [mbanners, setmBanners] = useState([]);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  const API_URL = "https://collegeforms.in";
  useEffect(() => {
    const fetchBanners = async () => {
      try {
        const response = await axios.get(`${API_URL}/api/banners`);
        setBanners(response.data);
      } catch (error) {
        console.error("Error fetching banners:", error);
      }
    };

    const fetchmBanners = async () => {
      try {
        const response = await axios.get(`${API_URL}/api/mbanner`);
        setmBanners(response.data.data);
      } catch (error) {
        console.error("Error fetching mobile banners:", error);
      }
    };

    fetchBanners();
    fetchmBanners();

    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const settings = {
    dots: false,
    arrows: false,
    infinite: true,
    speed: 3000,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 6000,
    fade: true,
    cssEase: "ease-in-out",
    pauseOnHover: false,
  };

  const handleApplyNow = () => {
    console.log("Apply Now clicked for special banner");
  };

  return (
    <div className="banner-slider w-100" style={{ position: "relative" }}>
      <style>
        {`
          @keyframes banner-wave-anim {
            0% { transform: translate(-50%, 0) scale(1); box-shadow: 0 0 0 0 rgba(252, 1, 0, 0.7); }
            70% { transform: translate(-50%, 0) scale(1.05); box-shadow: 0 0 0 15px rgba(252, 1, 0, 0); }
            100% { transform: translate(-50%, 0) scale(1); box-shadow: 0 0 0 0 rgba(252, 1, 0, 0); }
          }
          @keyframes banner-float-anim {
            0% { transform: translate(-50%, 0); }
            50% { transform: translate(-50%, -8px); }
            100% { transform: translate(-50%, 0); }
          }
          .banner-pulse-effect {
            position: relative;
            overflow: visible;
          }
          .banner-pulse-effect::after {
            content: '';
            position: absolute;
            width: 100%;
            height: 100%;
            top: 0;
            left: 50%;
            transform: translateX(-50%);
            background: rgba(255, 255, 255, 0.3);
            border-radius: 50px;
            animation: banner-pulse-anim 2s infinite;
            z-index: -1;
          }
          @keyframes banner-pulse-anim {
            0% { transform: translateX(-50%) scale(1); opacity: 0.7; }
            70% { transform: translateX(-50%) scale(1.3); opacity: 0; }
            100% { transform: translateX(-50%) scale(1.4); opacity: 0; }
          }
          .banner-icon-float {
            display: inline-block;
            animation: banner-icon-float-anim 1.5s ease-in-out infinite;
          }
          @keyframes banner-icon-float-anim {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-5px); }
          }
        `}
      </style>
      
      <Slider {...settings}>
        {(isMobile ? mbanners : banners).map((banner) => (
          <div key={banner._id} style={{ position: "relative" }}>
            <a target="_blank" href={banner.link} rel="noopener noreferrer">
              <img
                src={banner.image}
                alt="Banner"
                className="img-fluid"
                style={{
                  width: "100%",
                  height: isMobile ? "100%" : "100%",
                  maxHeight: isMobile ? "100%" : "100%",
                  objectFit: "cover",
                }}
              />
            </a>
            
            {(banner._id === "67e6a56dbef631522f58dedd" || banner._id === "67e7f14721970a70f5382370") && (
              <div style={{
                position: "absolute",
                bottom: isMobile ? "7%" : "20%",
                left: isMobile ? "30%" : "74%",
                transform: "translateX(-50%)",
                zIndex: 10,
                width: isMobile ? "90%" : "auto",
                textAlign: "center"
              }}>
                <a href={banner.link}>
                  <Button
                    variant="contained"
                    onClick={handleApplyNow}
                    sx={{
                      position: "relative",
                      backgroundColor: "#FC0100",
                      background: "linear-gradient(145deg, #FF2E2E, #D10000)",
                      color: "white",
                      fontWeight: "bold",
                      fontSize: isMobile ? "0.5rem" : "1.1rem",
                      padding: isMobile ? "6px 15px" : "14px 35px",
                      borderRadius: "50px",
                      boxShadow: "0 4px 20px rgba(252, 1, 0, 0.6)",
                      textTransform: "uppercase",
                      animation: "banner-wave-anim 2s infinite, banner-float-anim 3s ease-in-out infinite",
                      overflow: "visible",
                      whiteSpace: "nowrap",
                      minWidth: isMobile ? "70px" : "200px",
                      "&:hover": {
                        background: "linear-gradient(145deg, #D10000, #FF2E2E)",
                        boxShadow: "0 6px 25px rgba(252, 1, 0, 0.8)",
                        transform: "translate(-50%, 0) scale(1.02)",
                      },
                    }}
                    className="banner-pulse-effect"
                  >
                    <span className="banner-ico-float">
                      <RiSendPlaneFill style={{ 
                        marginRight: "8px",
                        fontSize: isMobile ? "0.9rem" : "1.4rem",
                      }} />
                    </span>
                    Apply Now
                  </Button>
                </a>
              </div>
            )}
          </div>
        ))}
      </Slider>
    </div>
  );
};

export default Bhome;