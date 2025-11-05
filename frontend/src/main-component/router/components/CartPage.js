import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import "./CartPage.css";
import Navbar from "../../../components/Navbar/Navbar";
import Footer from "../../../components/footer/Footer";

const CartPage = () => {
  const { 
    cartItems, 
    cartCount, 
    loading, 
    removeFromCart, 
    clearCart, 
    getCartTotal 
  } = useCart();
  
  const navigate = useNavigate();
  const [processing, setProcessing] = useState(false);
  const [promoCode, setPromoCode] = useState("");
  const [appliedPromo, setAppliedPromo] = useState(null);
  const [showPromoInput, setShowPromoInput] = useState(false);

  const handleRemoveItem = async (itemId) => {
    await removeFromCart(itemId);
  };

  const handleClearCart = async () => {
    if (window.confirm("Are you sure you want to clear your cart?")) {
      await clearCart();
    }
  };

  const handleProceedToPayment = async () => {
    setProcessing(true);
    try {
      // Simulate payment processing
      setTimeout(() => {
        alert("Payment functionality would be implemented here!");
      }, 1000);
    } catch (error) {
      console.error("Payment error:", error);
    } finally {
      setProcessing(false);
    }
  };

  const handleContinueShopping = () => {
    navigate("/colleges");
  };

  const handleApplyPromo = () => {
    if (!promoCode.trim()) return;
    
    // Simulate promo validation
    const validPromos = {
      "STUDENT10": 0.1,
      "WELCOME15": 0.15,
      "EARLYBIRD": 0.2
    };
    
    if (validPromos[promoCode.toUpperCase()]) {
      setAppliedPromo({
        code: promoCode.toUpperCase(),
        discount: validPromos[promoCode.toUpperCase()]
      });
      setPromoCode("");
      setShowPromoInput(false);
    } else {
      alert("Invalid promo code. Please try again.");
    }
  };

  const handleRemovePromo = () => {
    setAppliedPromo(null);
  };

  const calculateDiscount = () => {
    if (!appliedPromo) return 0;
    return getCartTotal() * appliedPromo.discount;
  };

  const calculateFinalTotal = () => {
    return getCartTotal() - calculateDiscount();
  };

  const totalAmount = getCartTotal();
  const discountAmount = calculateDiscount();
  const finalTotal = calculateFinalTotal();

  if (loading) {
    return (
      <div className="cart-loading">
        <div className="spinner"></div>
        <p>Loading your cart...</p>
      </div>
    );
  }

  if (cartCount === 0) {
    return (
      <div className="cart-empty">
        <div className="empty-icon">🛒</div>
        <h2>Your cart is empty</h2>
        <p>Add courses to get started</p>
        <button className="btn-primary" onClick={handleContinueShopping}>
          Browse Courses
        </button>
      </div>
    );
  }

  return (
    <>
          <Navbar/>

    <div className="cart-page">
      {/* Header */}
<br/>

      <div className="cart-content">
        {/* Cart Items */}
        <div className="cart-items">
          {cartItems.map((item, index) => (
            <div key={item._id || index} className="cart-item">
              <img
                src={item.collegeImage || "/default-college-image.jpg"}
                alt={item.collegeName}
                className="item-image"
              />
              
              <div className="item-info">
                <h3 className="college-name">{item.collegeName}</h3>
                <p className="course-name">{item.courseName}</p>
                <p className="college-location">{item.collegeLocation}</p>
                
                <div className="item-pricing">
                  <span className="price">₹{(item.discountedFees || 0).toLocaleString('en-IN')}</span>
                  {item.originalFees > item.discountedFees && (
                    <span className="original-price">
                      ₹{(item.originalFees || 0).toLocaleString('en-IN')}
                    </span>
                  )}
                </div>
              </div>

              <div className="item-actions">
                <button 
                  className="btn-remove"
                  onClick={() => handleRemoveItem(item._id)}
                  title="Remove item"
                >
                  ×
                </button>
                <Link 
                  to={`/college/${item.slug}`}
                  className="btn-view"
                >
                  View Details
                </Link>
              </div>
            </div>
          ))}
          
          <div className="continue-shopping">
            <button className="btn-continue-shopping" onClick={handleContinueShopping}>
              ← Continue Browsing Colleges
            </button>
          </div>
        </div>

        {/* Order Summary */}
        <div className="order-summary">
          <div className="summary-card">
            <h3>Order Summary</h3>
            
            <div className="summary-row">
              <span>Subtotal ({cartCount} {cartCount === 1 ? 'college' : 'colleges'})</span>
              <span>₹{totalAmount.toLocaleString('en-IN')}</span>
            </div>
            
            {/* Promo Code Section */}
            {appliedPromo ? (
              <div className="promo-applied">
                <div className="summary-row">
                  <span>Promo Code: {appliedPromo.code}</span>
                  <span className="discount">-₹{discountAmount.toLocaleString('en-IN')}</span>
                </div>
                <button className="btn-remove-promo" onClick={handleRemovePromo}>
                  Remove
                </button>
              </div>
            ) : (
              <div className="promo-section">
                {showPromoInput ? (
                  <div className="promo-input-group">
                    <input
                      type="text"
                      placeholder="Enter promo code"
                      value={promoCode}
                      onChange={(e) => setPromoCode(e.target.value)}
                      className="promo-input"
                    />
                    <button className="btn-apply-promo" onClick={handleApplyPromo}>
                      Apply
                    </button>
                  </div>
                ) : (
                  <button 
                    className="btn-add-promo" 
                    onClick={() => setShowPromoInput(true)}
                  >
                    + Add Promo Code
                  </button>
                )}
              </div>
            )}
            
       
            <div className="summary-row total-row">
              <span>Total Amount</span>
              <span className="total-amount">₹{finalTotal.toLocaleString('en-IN')}</span>
            </div>

            <button
              className="btn-checkout"
              onClick={handleProceedToPayment}
              disabled={processing}
            >
              {processing ? (
                <>
                  <div className="spinner-small"></div>
                  Processing...
                </>
              ) : (
                `Pay ₹${finalTotal.toLocaleString('en-IN')}`
              )}
            </button>

            <div className="security-note">
              🔒 Secure payment · Instant confirmation
            </div>
          </div>
        </div>
      </div>
    </div>

      <Footer/>


    </>

  );
};

export default CartPage;