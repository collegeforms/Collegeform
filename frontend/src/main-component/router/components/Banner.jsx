import React, { useEffect,useState } from "react";
import $ from "jquery";
import axios from "axios";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "slick-carousel"; // Import Slick JS
const Banner = () => {
  const API_URL = "https://collegeform-production.up.railway.app" || "https://collegeforms.in";



    useEffect(() => {
        // Initialize Slick slider when the component is mounted
        $(".banner-slider").slick({
          autoplay: true,
          autoplaySpeed: 3000, // 3 seconds
          arrows: true,
          dots: true,
          infinite: true,
          speed: 600,
          fade: true, // Smooth fade effect
          cssEase: "linear",
          prevArrow:
            '<button type="button" class="slick-prev"><i class="fa fa-chevron-left"></i></button>',
          nextArrow:
            '<button type="button" class="slick-next"><i class="fa fa-chevron-right"></i></button>',
        });
    
        // Cleanup Slick slider when component is unmounted
        return () => {
          $(".banner-slider").slick("unslick");
        };
      }, []); // Empty dependency array to run once when the component mounts
    
    
    
      const [banners, setBanners] = useState([]);
    
      useEffect(() => {
        // Fetch banners from the API
        const fetchBanners = async () => {
          try {
            const response = await axios.get("https://collegeform-production.up.railway.app/api/banners");
            setBanners(response.data); // Set banners in state
          } catch (error) {
            console.error("Error fetching banners:", error);
          }
        };
    
        fetchBanners();
      }, []);



  return (
    <div>
        <div className="banner-slider">
          {banners.map((banner) => (
            <div key={banner.id}>
              <img src={`${API_URL}${banner.image}`} alt="img" />
            </div>
          ))}
        </div>
    </div>
  )
}

export default Banner
