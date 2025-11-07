// contexts/AuthContext.js
import React, { createContext, useState, useEffect, useContext } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const API_URL = "https://collegeforms.in";
  // const API_URL = 'https://collegeforms.in1';
  
  const [user, setUser] = useState(null);
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [otpSent, setOtpSent] = useState(false);
  const [otpPhone, setOtpPhone] = useState("");
  const [otpPurpose, setOtpPurpose] = useState(""); // 'login' or 'signup'
  const [resendTimer, setResendTimer] = useState(0);

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

  // Start resend timer
  const startResendTimer = () => {
    setResendTimer(120);
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

  // Send OTP for login (only for existing users)
  const sendLoginOtp = async (phone) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_URL}/api/auth/send-login-otp`, {
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
      setOtpPurpose("login");
      startResendTimer();
      return { success: true, message: data.message };
    } catch (error) {
      setError(error.message);
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  // Send OTP for signup (for new users)
  const sendSignupOtp = async (phone) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_URL}/api/auth/send-signup-otp`, {
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
      setOtpPurpose("signup");
      startResendTimer();
      return { success: true, message: data.message };
    } catch (error) {
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
      const response = await fetch(`${API_URL}/api/auth/verify-login-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          phone: otpPhone,
          otp: otp
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
      setOtpPurpose("");
      setResendTimer(0);
      return { success: true, user: data.user };
    } catch (error) {
      setError(error.message);
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  // Verify OTP for signup and complete registration
  const verifySignupOtp = async (formData, otp) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_URL}/api/auth/verify-signup-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          phone: otpPhone,
          otp: otp,
          name: formData.name,
          email: formData.email
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
      setOtpPurpose("");
      setResendTimer(0);
      return { success: true, user: data.user };
    } catch (error) {
      setError(error.message);
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  // Resend OTP
  const resendOtp = async () => {
    if (resendTimer > 0) {
      setError(`Please wait ${resendTimer} seconds before resending OTP`);
      return { success: false, error: `Please wait ${resendTimer} seconds before resending OTP` };
    }

    setLoading(true);
    setError(null);
    try {
      const endpoint = otpPurpose === "login" ? "resend-login-otp" : "resend-signup-otp";
      
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
      return { success: true };
    } catch (error) {
      setError(error.message);
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  // Check if phone exists
  const checkPhoneExists = async (phone) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_URL}/api/auth/check-phone`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone }),
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || "Failed to check phone");
      }

      return { success: true, exists: data.exists, message: data.message };
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

  // Admin Login
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
    setOtpPurpose("");
    setResendTimer(0);
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
        otpPurpose,
        resendTimer,
        sendLoginOtp, 
        sendSignupOtp,
        verifyLoginOtp,
        verifySignupOtp,
        resendOtp,
        checkPhoneExists,
        editProfile,
        getUserData,
        loginAdmin, 
        logout,
        clearError: () => setError(null),
        resetOtpState: () => {
          setOtpSent(false);
          setOtpPhone("");
          setOtpPurpose("");
          setResendTimer(0);
        }
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export default AuthContext;