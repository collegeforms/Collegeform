// contexts/AuthContext.js
import React, { createContext, useState, useEffect, useContext } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const API_URL = "https://collegeform.onrender.com" || "https://collegeform-production.up.railway.app" || "http://localhost:5000";

  
  const [user, setUser] = useState(null);
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [otpSent, setOtpSent] = useState(false);
  const [otpPhone, setOtpPhone] = useState("");

  useEffect(() => {
    const userToken = localStorage.getItem("userToken");
    const userInfo = localStorage.getItem("userInfo");
    const adminToken = localStorage.getItem("adminToken");

    if (userToken && userInfo) {
      setUser({ token: userToken, info: JSON.parse(userInfo) });
    }

    if (adminToken) {
      setAdmin({ token: adminToken });
    }
  }, []);

  // Send OTP for login/registration
  const sendOtp = async (phone) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_URL}/api/auth/send-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone }),
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || "Failed to send OTP");
      }

      setOtpSent(true);
      setOtpPhone(phone);
      return { success: true };
    } catch (error) {
      setError(error.message);
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  // Verify OTP and complete registration/login
  const verifyOtp = async (formData, otp) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_URL}/api/auth/verify-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          phone: formData.phone || otpPhone,
          otp: otp,
          name: formData.name,
          email: formData.email,
          city: formData.city,
          course: formData.course
        }),
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || "OTP verification failed");
      }

      localStorage.setItem("userToken", data.token);
      localStorage.setItem("userInfo", JSON.stringify(data.user));
      setUser({ token: data.token, info: data.user });
      setOtpSent(false);
      setOtpPhone("");
      return { success: true };
    } catch (error) {
      setError(error.message);
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  // Resend OTP
  const resendOtp = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_URL}/api/auth/resend-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone: otpPhone }),
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || "Failed to resend OTP");
      }

      return { success: true };
    } catch (error) {
      setError(error.message);
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  // Edit Profile
  const editProfile = async (profileData) => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem("userToken");
      const response = await fetch(`${API_URL}/api/auth/edit-profile`, {
        method: "PUT",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(profileData),
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || "Failed to update profile");
      }

      // Update user info in state and localStorage
      localStorage.setItem("userInfo", JSON.stringify(data.user));
      setUser(prev => ({ ...prev, info: data.user }));
      
      return { success: true, user: data.user };
    } catch (error) {
      setError(error.message);
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  // Get User Data
  const getUserData = async () => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem("userToken");
      const response = await fetch(`${API_URL}/api/auth/get-user`, {
        method: "GET",
        headers: { 
          "Authorization": `Bearer ${token}`
        },
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || "Failed to get user data");
      }

      // Update user info in state and localStorage
      localStorage.setItem("userInfo", JSON.stringify(data.user));
      setUser(prev => ({ ...prev, info: data.user }));
      
      return { success: true, user: data.user };
    } catch (error) {
      setError(error.message);
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  // Admin Login (keep this if you still need admin login with password)
  const loginAdmin = async (username, password) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_URL}/api/auth/admin/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message);

      localStorage.setItem("adminToken", data.token);
      setAdmin({ token: data.token });
      return { success: true };
    } catch (error) {
      setError(error.message);
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  // Logout
  const logout = () => {
    localStorage.removeItem("userToken");
    localStorage.removeItem("userInfo");
    localStorage.removeItem("adminToken");
    setUser(null);
    setAdmin(null);
    setOtpSent(false);
    setOtpPhone("");
  };

  return (
    <AuthContext.Provider 
      value={{ 
        user, 
        admin, 
        loading, 
        error,
        otpSent,
        otpPhone,
        sendOtp, 
        verifyOtp,
        resendOtp,
        editProfile,
        getUserData,
        loginAdmin, 
        logout,
        clearError: () => setError(null),
        resetOtpState: () => {
          setOtpSent(false);
          setOtpPhone("");
        }
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export default AuthContext;