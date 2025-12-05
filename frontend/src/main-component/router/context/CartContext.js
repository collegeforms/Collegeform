import React, { createContext, useState, useContext, useEffect } from 'react';

const CartContext = createContext();

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [cartCount, setCartCount] = useState(0);
  const [loading, setLoading] = useState(false);

  // Base API URL - adjust according to your environment
const API_BASE_URL = "https://www.collegeforms.in";
  // Load cart items on component mount
  useEffect(() => {
    loadCartItems();
  }, []);

  // Update cart count whenever cart items change
  useEffect(() => {
    setCartCount(cartItems.length);
  }, [cartItems]);

  const loadCartItems = async () => {
    const token = localStorage.getItem('userToken');
    if (!token) {
      setCartItems([]);
      return;
    }

    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/api/cart/items`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const result = await response.json();
        setCartItems(result.data || []);
      } else {
        setCartItems([]);
      }
    } catch (error) {
      console.error('Error loading cart items:', error);
      setCartItems([]);
    } finally {
      setLoading(false);
    }
  };

  const addToCart = async (cartItemData) => {
    const token = localStorage.getItem('userToken');
    if (!token) {
      throw new Error('Please login to add items to cart');
    }

    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/api/cart/add`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(cartItemData)
      });

      const result = await response.json();

      if (response.ok) {
        // Refresh cart items after successful addition
        await loadCartItems();
        return result;
      } else {
        throw new Error(result.message || 'Failed to add item to cart');
      }
    } catch (error) {
      console.error('Add to cart error:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const removeFromCart = async (itemId) => {
    const token = localStorage.getItem('userToken');
    if (!token) return;

    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/api/cart/remove/${itemId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        await loadCartItems();
      }
    } catch (error) {
      console.error('Remove from cart error:', error);
    } finally {
      setLoading(false);
    }
  };

  const clearCart = async () => {
    const token = localStorage.getItem('userToken');
    if (!token) return;

    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/api/cart/clear`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        setCartItems([]);
      }
    } catch (error) {
      console.error('Clear cart error:', error);
    } finally {
      setLoading(false);
    }
  };

  const getCartTotal = () => {
    return cartItems.reduce((total, item) => total + item.discountedFees, 0);
  };

  const isItemInCart = (collegeId, courseName) => {
    return cartItems.some(item => 
      item.collegeId === collegeId && item.courseName === courseName
    );
  };

  const value = {
    cartItems,
    cartCount,
    loading,
    addToCart,
    removeFromCart,
    clearCart,
    loadCartItems,
    getCartTotal,
    isItemInCart
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};