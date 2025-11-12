import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
import './CarouselSection.css';

const CarouselSection = () => {
  const [bannerData, setBannerData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const API_URL = "https://collegeforms.in";

  // Fetch banner data
  const fetchBannerData = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}/api/banners/category/home-page`);
      
      if (response.data && response.data.length > 0) {
        setBannerData(response.data);
      } else {
        setError("No banner found for home-page category");
      }
    } catch (error) {
      console.error("Error fetching banner data:", error);
      setError("Failed to load banner");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBannerData();
  }, []);

  // Process banner data into images
  const processBannerImages = () => {
    if (!bannerData || bannerData.length === 0) {
      // Fallback images if no banner data
      return {
        leftImages: [
          { id: 1, src: 'https://www.masterclass.com/cdn-cgi/image/width=384,quality=75,format=webp/https://static.masterclass.com/Carousel_Class_1.png', alt: 'Class 1' },
          { id: 2, src: 'https://www.masterclass.com/cdn-cgi/image/width=384,quality=75,format=webp/https://static.masterclass.com/Carousel_Class_2.png', alt: 'Class 2' },
          { id: 3, src: 'https://www.masterclass.com/cdn-cgi/image/width=384,quality=75,format=webp/https://static.masterclass.com/Carousel_Class_3.png', alt: 'Class 3' },
        ],
        rightImages: [
          { id: 4, src: 'https://www.masterclass.com/cdn-cgi/image/width=384,quality=75,format=webp/https://static.masterclass.com/Carousel_Subcat_3.png', alt: 'Subcategory 3' },
          { id: 5, src: 'https://www.masterclass.com/cdn-cgi/image/width=384,quality=75,format=webp/https://static.masterclass.com/Carousel_Class_7.png', alt: 'Class 7' },
          { id: 6, src: 'https://www.masterclass.com/cdn-cgi/image/width=384,quality=75,format=webp/https://static.masterclass.com/Carousel_Class_8.png', alt: 'Class 8' },
        ]
      };
    }

    // Split banner data into two columns
    const halfLength = Math.ceil(bannerData.length / 2);
    const leftImages = bannerData.slice(0, halfLength).map((banner, index) => ({
      id: banner.id || index + 1,
      src: banner.imageUrl || banner.image || banner.bannerImage,
      alt: banner.title || banner.name || `Banner ${index + 1}`,
      title: banner.title,
      description: banner.description
    }));

    const rightImages = bannerData.slice(halfLength).map((banner, index) => ({
      id: banner.id || index + halfLength + 1,
      src: banner.imageUrl || banner.image || banner.bannerImage,
      alt: banner.title || banner.name || `Banner ${index + halfLength + 1}`,
      title: banner.title,
      description: banner.description
    }));

    return { leftImages, rightImages };
  };

  const { leftImages, rightImages } = processBannerImages();

  // Duplicate for seamless loop
  const leftColumnImages = [...leftImages, ...leftImages, ...leftImages];
  const rightColumnImages = [...rightImages, ...rightImages, ...rightImages];

  const containerVariants = {
    animate: {
      y: [0, -1000],
      transition: {
        y: {
          repeat: Infinity,
          repeatType: "loop",
          duration: 40,
          ease: "linear",
        },
      },
    }
  };

  const reverseContainerVariants = {
    animate: {
      y: [-1000, 0],
      transition: {
        y: {
          repeat: Infinity,
          repeatType: "loop",
          duration: 40,
          ease: "linear",
        },
      },
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="fm-carousel-container">
        <div className="fm-loading-state">
          <div className="fm-loading-spinner"></div>
          <p>Loading banners...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="fm-carousel-container">
        <div className="fm-error-state">
          <p>Failed to load banners</p>
          <button onClick={fetchBannerData} className="fm-retry-button">
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fm-carousel-container">
      <div className="fm-fade-overlay">
        <div className="fm-columns-wrapper">
          {/* Left Column */}
          <div className="fm-column fm-left-column">
            <motion.div
              className="fm-scroll-container"
              variants={containerVariants}
              animate="animate"
            >
              {leftColumnImages.map((image, index) => (
                <div key={`left-${image.id}-${index}`} className="fm-image-item">
                  <div className="fm-image-frame">
                    <img 
                      src={image.src} 
                      alt={image.alt}
                      className="fm-carousel-image"
                      loading="lazy"
                      onError={(e) => {
                        // Fallback if image fails to load
                        e.target.src = 'https://via.placeholder.com/280x350/ffffff/666666?text=Image+Not+Found';
                      }}
                    />
                    {image.title && (
                      <div className="fm-image-overlay">
                        <h4>{image.title}</h4>
                        {image.description && <p>{image.description}</p>}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </motion.div>
          </div>

          {/* Right Column */}
          <div className="fm-column fm-right-column">
            <motion.div
              className="fm-scroll-container"
              variants={reverseContainerVariants}
              animate="animate"
            >
              {rightColumnImages.map((image, index) => (
                <div key={`right-${image.id}-${index}`} className="fm-image-item">
                  <div className="fm-image-frame">
                    <img 
                      src={image.src} 
                      alt={image.alt}
                      className="fm-carousel-image"
                      loading="lazy"
                      onError={(e) => {
                        // Fallback if image fails to load
                        e.target.src = 'https://via.placeholder.com/280x350/ffffff/666666?text=Image+Not+Found';
                      }}
                    />
                    {image.title && (
                      <div className="fm-image-overlay">
                        <h4>{image.title}</h4>
                        {image.description && <p>{image.description}</p>}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CarouselSection;