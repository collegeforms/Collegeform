import React, { useState, useEffect } from 'react';
import { RiCoupon2Line, RiPercentLine, RiCalendarEventLine, RiCloseLine, RiArrowRightLine, RiFireLine, RiStarLine, RiGiftLine } from 'react-icons/ri';
import Confetti from 'react-confetti';
import { useWindowSize } from '@react-hook/window-size';
import { Modal, Box, IconButton } from '@mui/material';
import "./offer.css";
import Navbar from '../../../components/Navbar/Navbar';
import Footer from '../../../components/footer/Footer';

const OffersPage = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedOffer, setSelectedOffer] = useState(null);
  const [showConfetti, setShowConfetti] = useState(false);
  const [copiedCode, setCopiedCode] = useState(null);
  const [width, height] = useWindowSize();
  const [open, setOpen] = useState(false);

  // Show confetti when page first loads
  useEffect(() => {
    setShowConfetti(true);
    const timer = setTimeout(() => {
      setShowConfetti(false);
    }, 5000);
    
    return () => clearTimeout(timer);
  }, []);

  // Sample offer data
  const offers = [
    {
      id: 1,
      title: "Early Bird Registration",
      description: "Register before the deadline and get 15% off on all courses",
      discount: "15% OFF",
      category: "registration",
      expiry: "2023-12-15",
      code: "EARLYBIRD15",
      popular: true,
      limited: false,
      image: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1000&q=80"
    },
    {
      id: 2,
      title: "Refer a Friend",
      description: "Refer a friend and both get 10% discount on next semester",
      discount: "10% OFF",
      category: "referral",
      expiry: "2023-12-31",
      code: "FRIEND10",
      popular: false,
      limited: true,
      image: "https://images.unsplash.com/photo-1523580494863-6f3031224c94?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1000&q=80"
    },
    {
      id: 3,
      title: "Merit Scholarship",
      description: "Top 10% of applicants get 25% scholarship on tuition fees",
      discount: "25% OFF",
      category: "scholarship",
      expiry: "2024-01-15",
      code: "MERIT25",
      popular: true,
      limited: false,
      image: "https://images.unsplash.com/photo-1571260899304-425eee4c7efc?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1000&q=80"
    },
    {
      id: 4,
      title: "Alumni Discount",
      description: "Special 20% discount for our alumni on continuing education",
      discount: "20% OFF",
      category: "alumni",
      expiry: "2024-02-28",
      code: "ALUMNI20",
      popular: false,
      limited: false,
      image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1000&q=80"
    },
    {
      id: 5,
      title: "Group Enrollment",
      description: "Enroll with 3 or more friends and each gets 15% discount",
      discount: "15% OFF",
      category: "group",
      expiry: "2023-11-30",
      code: "GROUP15",
      popular: false,
      limited: true,
      image: "https://images.unsplash.com/photo-1584697964358-3e14ca57658b?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1000&q=80"
    },
    {
      id: 6,
      title: "Summer Program Special",
      description: "Exclusive 30% discount on all summer programs",
      discount: "30% OFF",
      category: "seasonal",
      expiry: "2023-11-20",
      code: "SUMMER30",
      popular: true,
      limited: true,
      image: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1000&q=80"
    }
  ];

  const categories = [
    { id: 'all', name: 'All Offers', icon: <RiGiftLine /> },
    { id: 'registration', name: 'Registration', icon: <RiCoupon2Line /> },
    { id: 'scholarship', name: 'Scholarships', icon: <RiStarLine /> },
    { id: 'referral', name: 'Referral', icon: <RiFireLine /> },
    { id: 'alumni', name: 'Alumni', icon: <RiPercentLine /> },
    { id: 'group', name: 'Group', icon: <RiCalendarEventLine /> },
    { id: 'seasonal', name: 'Seasonal', icon: <RiCalendarEventLine /> }
  ];

  const filteredOffers = selectedCategory === 'all' 
    ? offers 
    : offers.filter(offer => offer.category === selectedCategory);

  const handleOpen = (offer) => {
    setSelectedOffer(offer);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedOffer(null);
  };

  const handleCopyCode = (code) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setShowConfetti(true);
    setTimeout(() => {
      setShowConfetti(false);
      setCopiedCode(null);
    }, 3000);
  };

  const popularOffers = offers.filter(offer => offer.popular);
  const limitedOffers = offers.filter(offer => offer.limited);

  return (
    <>
    <Navbar/>
        <div className="offers-page">
      {showConfetti && <Confetti width={width} height={height} recycle={false} numberOfPieces={200} gravity={0.3} />}
      
      {/* Header Section */}
      <header className="offers-header">
        <h1>Special Offers & Discounts</h1>
        <p>Exclusive promotions and limited-time deals for our students and applicants</p>
      </header>

      {/* Stats Section */}
      <div className="stats-container">
        <div className="stat-card">
          <div className="number">{offers.length}+</div>
          <div className="label">Active Offers</div>
        </div>
        <div className="stat-card">
          <div className="number">{popularOffers.length}</div>
          <div className="label">Popular Deals</div>
        </div>
        <div className="stat-card">
          <div className="number">{limitedOffers.length}</div>
          <div className="label">Limited Time Offers</div>
        </div>
      </div>

      {/* Category Filter */}
      <div className="category-filter">
        {categories.map(category => (
          <button
            key={category.id}
            className={`category-button ${selectedCategory === category.id ? 'active' : ''}`}
            onClick={() => setSelectedCategory(category.id)}
          >
            <span>{category.icon}</span>
            {category.name}
          </button>
        ))}
      </div>

      {/* Offers Grid */}
      <div className="offers-grid">
        {filteredOffers.map(offer => (
          <div key={offer.id} className="offer-card">
            <div className="offer-image-container">
              {/* <img src={offer.image} alt={offer.title} className="offer-image" /> */}
              <div className="offer-badge">
                {offer.discount}
              </div>
              {offer.popular && (
                <div className="offer-popular">
                  <RiFireLine className="icon-spacing" /> Popular
                </div>
              )}
            </div>
            <div className="offer-content mt-5">
              <h3 className="offer-title">{offer.title}</h3>
              <p className="offer-description">{offer.description}</p>
              <div className="offer-expiry">
                <RiCalendarEventLine />
                <span>Expires: {new Date(offer.expiry).toLocaleDateString()}</span>
              </div>
              <button 
                onClick={() => handleOpen(offer)}
                className="offer-button"
              >
                View Details <RiArrowRightLine className="icon-spacing-right" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Additional Sections */}
      {limitedOffers.length > 0 && (
        <div className="limited-offers-section">
          <h2 className="section-title-2">
            <RiFireLine /> Limited Time Offers
          </h2>
          <div className="limited-offers-grid">
            {limitedOffers.map(offer => (
              <div key={offer.id} className="limited-offer-card">
                <div className="limited-offer-header">
                  <h3 className="limited-offer-title">{offer.title}</h3>
                  <span className="limited-offer-discount">
                    {offer.discount}
                  </span>
                </div>
                <p className="limited-offer-description">{offer.description}</p>
                <div className="limited-offer-footer">
                  <div className="limited-offer-expiry">
                    <RiCalendarEventLine />
                    <span>Expires: {new Date(offer.expiry).toLocaleDateString()}</span>
                  </div>
                  <button 
                    onClick={() => handleOpen(offer)}
                    className="limited-offer-button"
                  >
                    View Details
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* How to Use Section */}
      <div className="how-to-use">
        <h2>How to Use These Offers</h2>
        <div className="how-to-use-grid">
          <div className="how-to-step">
            <div className="step-number">1</div>
            <h3 className="step-title">Find an Offer</h3>
            <p className="step-description">Browse through our available offers and select one that suits your needs.</p>
          </div>
          <div className="how-to-step">
            <div className="step-number">2</div>
            <h3 className="step-title">Copy the Code</h3>
            <p className="step-description">Click on the offer to view details and copy the promotion code.</p>
          </div>
          <div className="how-to-step">
            <div className="step-number">3</div>
            <h3 className="step-title">Apply at Checkout</h3>
            <p className="step-description">Use the code during registration or payment to avail your discount.</p>
          </div>
        </div>
      </div>

      {/* MUI Modal */}
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="offer-modal-title"
        aria-describedby="offer-modal-description"
        className="modal-container"
      >
        <Box className="modal-content-wrapper">
          {selectedOffer && (
            <div className="modal-inner">
              <div className="modal-image-container mt-4">
                {/* <img src={selectedOffer.image} alt={selectedOffer.title} className="modal-image" /> */}
                <IconButton 
                  onClick={handleClose}
                  className="modal-close-btn-3"
                >
                  <RiCloseLine />
                </IconButton>
                <div className="modal-badge">
                  {selectedOffer.discount}
                </div>
              </div>
              <div className="modal-details">
                <h2 className="modal-title">{selectedOffer.title}</h2>
                <p className="modal-description">{selectedOffer.description}</p>
                
                <div className="promo-code-container">
                  <div className="promo-code-header">
                    <div className="promo-code-label">
                      <RiCoupon2Line />
                      <span>Promo Code:</span>
                    </div>
                    <button 
                      onClick={() => handleCopyCode(selectedOffer.code)}
                      className="copy-button"
                    >
                      {copiedCode === selectedOffer.code ? 'Copied!' : 'Copy Code'}
                    </button>
                  </div>
                  <div className="promo-code">
                    {selectedOffer.code}
                  </div>
                </div>
                
                <div className="modal-expiry">
                  <RiCalendarEventLine />
                  <span>Valid until: {new Date(selectedOffer.expiry).toLocaleDateString()}</span>
                </div>
                
                <button 
                  onClick={() => {
                    handleCopyCode(selectedOffer.code);
                    setTimeout(() => handleClose(), 2000);
                  }}
                  className="apply-button"
                >
                  Apply This Offer
                </button>
              </div>
            </div>
          )}
        </Box>
      </Modal>
    </div>
    <Footer/>
    </>

  );
};

export default OffersPage;