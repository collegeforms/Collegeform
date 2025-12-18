import React, { createContext, useState, useEffect, useContext } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const API_URL = "https://www.collegeforms.in";
  
  const [user, setUser] = useState(null);
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [otpSent, setOtpSent] = useState(false);
  const [otpPhone, setOtpPhone] = useState("");
  const [otpPurpose, setOtpPurpose] = useState("");
  const [resendTimer, setResendTimer] = useState(0);

  // Load user from localStorage on component mount
  useEffect(() => {
    const userToken = localStorage.getItem("userToken");
    const userInfo = localStorage.getItem("userInfo");
    const adminToken = localStorage.getItem("adminToken");

    if (userToken && userInfo) {
      try {
        const parsedInfo = JSON.parse(userInfo);
        setUser({ 
          token: userToken, 
          info: parsedInfo 
        });
      } catch (e) {
        console.error("Error parsing user info:", e);
        localStorage.removeItem("userToken");
        localStorage.removeItem("userInfo");
      }
    }

    if (adminToken) {
      setAdmin({ token: adminToken });
    }
  }, []);

  // Start resend timer
  const startResendTimer = () => {
    setResendTimer(30); // 30 seconds timer
    const timerInterval = setInterval(() => {
      setResendTimer(prev => {
        if (prev <= 1) {
          clearInterval(timerInterval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  // Send OTP for login (for existing users)
  const sendLoginOtp = async (phone) => {
    setLoading(true);
    setError(null);
    try {
      console.log("Sending login OTP to:", phone);
      
      const response = await fetch(`${API_URL}/api/auth/send-login-otp`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ phone }),
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || "Failed to send OTP");
      }

      setOtpSent(true);
      setOtpPhone(phone);
      setOtpPurpose("login");
      startResendTimer();
      
      console.log("Login OTP sent successfully");
      return { success: true, message: data.message };
    } catch (error) {
      console.error("Error sending login OTP:", error);
      setError(error.message);
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  // Verify OTP for login
  const verifyLoginOtp = async (otp) => {
    setLoading(true);
    setError(null);
    try {
      console.log("Verifying login OTP:", { phone: otpPhone, otp });
      
      const response = await fetch(`${API_URL}/api/auth/verify-login-otp`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ 
          phone: otpPhone,
          otp: otp
        }),
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || "OTP verification failed");
      }

      // Save user data to localStorage
      localStorage.setItem("userToken", data.token);
      localStorage.setItem("userInfo", JSON.stringify(data.user));
      
      // Update state
      setUser({ token: data.token, info: data.user });
      setOtpSent(false);
      setOtpPhone("");
      setOtpPurpose("");
      setResendTimer(0);
      
      console.log("Login OTP verified successfully, user logged in:", data.user);
      return { success: true, user: data.user };
    } catch (error) {
      console.error("Error verifying login OTP:", error);
      setError(error.message);
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  // Send OTP for signup - FIXED VERSION
// Send OTP for signup - UPDATED VERSION
const sendSignupOtp = async (formData) => {
  setLoading(true);
  setError(null);
  try {
    console.log("Sending signup OTP with form data:", formData);
    
    const response = await fetch(`${API_URL}/api/auth/send-signup-otp`, {
      method: "POST",
      headers: { 
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        phone: formData.phone,
        name: formData.name,
        email: formData.email,
        levelOfEducation: formData.levelOfEducation,
        coursePreferred: formData.coursePreferred,
        citiesPreferred: formData.citiesPreferred,
        collegeName: formData.collegeName,
        location: formData.location
      }),
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || "Failed to send OTP");
    }

    setOtpSent(true);
    setOtpPhone(formData.phone);
    setOtpPurpose("signup");
    startResendTimer();
    
    console.log("Signup OTP sent successfully");
    return { success: true, message: data.message };
  } catch (error) {
    console.error("Error sending signup OTP:", error);
    setError(error.message);
    return { success: false, error: error.message };
  } finally {
    setLoading(false);
  }
};

// Update verifySignupOtp to be simpler since name is already saved:
const verifySignupOtp = async (otp) => {
  setLoading(true);
  setError(null);
  try {
    console.log("Verifying OTP for signup:", { phone: otpPhone, otp });
    
    const response = await fetch(`${API_URL}/api/auth/verify-signup-otp`, {
      method: "POST",
      headers: { 
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ 
        phone: otpPhone,
        otp: otp
      }),
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || "OTP verification failed");
    }

    // Save user data to localStorage
    localStorage.setItem("userToken", data.token);
    localStorage.setItem("userInfo", JSON.stringify(data.user));
    
    // Update state
    setUser({ token: data.token, info: data.user });
    setOtpSent(false);
    setOtpPhone("");
    setOtpPurpose("");
    setResendTimer(0);
    
    console.log("OTP verified successfully, user logged in:", data.user);
    return { success: true, user: data.user };
  } catch (error) {
    console.error("Error verifying OTP:", error);
    setError(error.message);
    return { success: false, error: error.message };
  } finally {
    setLoading(false);
  }
};

  // Resend OTP - FIXED VERSION
  const resendOtp = async () => {
    if (resendTimer > 0) {
      const errorMsg = `Please wait ${resendTimer} seconds before resending OTP`;
      setError(errorMsg);
      return { success: false, error: errorMsg };
    }

    setLoading(true);
    setError(null);
    try {
      const endpoint = otpPurpose === "login" ? "resend-login-otp" : "resend-signup-otp";
      
      console.log(`Resending ${otpPurpose} OTP to ${otpPhone}`);
      
      const response = await fetch(`${API_URL}/api/auth/${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone: otpPhone }),
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || "Failed to resend OTP");
      }

      startResendTimer();
      return { success: true, message: data.message };
    } catch (error) {
      console.error("Error resending OTP:", error);
      setError(error.message);
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  // Save user preferences
  const saveUserPreferences = async (preferences) => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem("userToken");
      const response = await fetch(`${API_URL}/api/user/preferences`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          ...(token && { "Authorization": `Bearer ${token}` })
        },
        body: JSON.stringify(preferences),
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || "Failed to save preferences");
      }

      return { success: true, data };
    } catch (error) {
      console.error("Error saving preferences:", error);
      setError(error.message);
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  // Admin login
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

  // Search colleges
  const searchColleges = async (filters = {}) => {
    try {
      const params = new URLSearchParams(filters);
      const response = await fetch(`${API_URL}/colleges/?${params}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      return { success: true, colleges: data.colleges || data || [] };
    } catch (error) {
      console.error("Error searching colleges:", error);
      return { success: false, error: error.message };
    }
  };

  // Logout function
  const logout = () => {
    localStorage.removeItem("userToken");
    localStorage.removeItem("userInfo");
    localStorage.removeItem("adminToken");
    setUser(null);
    setAdmin(null);
    setOtpSent(false);
    setOtpPhone("");
    setOtpPurpose("");
    setResendTimer(0);
    setError(null);
  };

  // Clear error
  const clearError = () => setError(null);

  // Reset OTP state
  const resetOtpState = () => {
    setOtpSent(false);
    setOtpPhone("");
    setOtpPurpose("");
    setResendTimer(0);
    setError(null);
  };

  return (
    <AuthContext.Provider 
      value={{ 
        // State
        user, 
        admin, 
        loading, 
        error,
        otpSent,
        otpPhone,
        otpPurpose,
        resendTimer,
        
        // Actions - Login
        sendLoginOtp,
        verifyLoginOtp,
        
        // Actions - Signup
        sendSignupOtp,
        verifySignupOtp,
        loginAdmin,
        
        // Common Actions
        resendOtp,
        saveUserPreferences,
        searchColleges,
        logout,
        clearError,
        resetOtpState,
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