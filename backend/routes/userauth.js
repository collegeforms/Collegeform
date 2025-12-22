import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import User from "../models/User.js";
import authMiddleware from "../middleware/authMiddleware.js";
import { sendSmsOtp } from "../utils/smsService.js";

const router = express.Router();

// Generate OTP
const generateOtp = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// Check if phone exists
router.post("/check-phone", async (req, res) => {
  try {
    const { phone } = req.body;

    if (!phone) {
      return res.status(400).json({ message: "Phone number is required" });
    }

    // Check if user exists with this phone
    const existingUser = await User.findOne({ phone });

    res.status(200).json({
      exists: !!existingUser,
      message: existingUser ? "Phone number exists" : "Phone number not found"
    });
  } catch (error) {
    console.error("Check Phone Error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Send OTP for login (only for existing users)
router.post("/send-login-otp", async (req, res) => {
  try {
    const { phone } = req.body;
    console.log("Send login OTP for phone:", phone);

    if (!phone) {
      return res.status(400).json({ message: "Phone number is required" });
    }

    // Check if user exists with this phone
    const existingUser = await User.findOne({ phone });

    if (!existingUser) {
      return res.status(404).json({ 
        message: "Phone number not registered. Please sign up first." 
      });
    }

    // Check if OTP was sent recently (prevent spam)
    const recentOtpUser = await User.findOne({ 
      phone, 
      lastOtpSent: { $gt: new Date(Date.now() - 2 * 60 * 1000) } // 2 minutes cooldown
    });

    if (recentOtpUser) {
      return res.status(429).json({ 
        message: "Please wait before requesting another OTP" 
      });
    }

    // Generate OTP
    const otp = generateOtp();
    const otpExpires = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes

    // Update OTP details
    await User.findOneAndUpdate(
      { phone },
      { 
        otp, 
        otpExpires, 
        lastOtpSent: new Date()
      }
    );

    // Send OTP via SMS
    const smsSent = await sendSmsOtp(phone, otp);
    
    if (!smsSent.success) {
      return res.status(500).json({ message: "Failed to send OTP via SMS" });
    }

    res.status(200).json({ 
      message: "OTP sent successfully to your registered phone number",
      phone: phone 
    });
  } catch (error) {
    console.error("Send Login OTP Error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Send OTP for signup (save all data immediately)
router.post("/send-signup-otp", async (req, res) => {
  try {
    console.log("Received signup OTP request body:", req.body);
    
    const { 
      phone, 
      name, 
      email 
    } = req.body;
    
    console.log("Send signup OTP with data:", { phone, name, email });

    if (!phone) {
      return res.status(400).json({ message: "Phone number is required" });
    }

    if (!name) {
      return res.status(400).json({ message: "Name is required" });
    }

    // Check if user already exists (with completed registration)
    const existingUser = await User.findOne({ phone });
    if (existingUser && existingUser.name && existingUser.name.trim() !== '') {
      return res.status(400).json({ 
        message: "Phone number already registered. Please login instead." 
      });
    }

    // Check if OTP was sent recently (prevent spam)
    const recentOtpUser = await User.findOne({ 
      phone, 
      lastOtpSent: { $gt: new Date(Date.now() - 2 * 60 * 1000) } // 2 minutes cooldown
    });

    if (recentOtpUser) {
      return res.status(429).json({ 
        message: "Please wait before requesting another OTP" 
      });
    }

    // Generate OTP
    const otp = generateOtp();
    const otpExpires = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes

    // Create or update user with ALL data
    const updateData = {
      name: name.trim(),
      otp,
      otpExpires,
      lastOtpSent: new Date(),
      isVerified: false
    };

    // Add email if provided
    if (email && email.trim() !== '') {
      updateData.email = email.trim().toLowerCase();
    }

    await User.findOneAndUpdate(
      { phone },
      updateData,
      { 
        upsert: true, 
        new: true,
        setDefaultsOnInsert: true
      }
    );

    console.log("OTP generated and user data saved:", { phone, otp });

    // Send OTP via SMS
    const smsSent = await sendSmsOtp(phone, otp);
    
    if (!smsSent.success) {
      return res.status(500).json({ message: "Failed to send OTP via SMS" });
    }

    res.status(200).json({ 
      message: "OTP sent successfully for verification",
      phone: phone 
    });
  } catch (error) {
    console.error("Send Signup OTP Error:", error);
    
    // Handle duplicate key error specifically
    if (error.code === 11000) {
      if (error.keyPattern && error.keyPattern.email) {
        return res.status(400).json({ 
          message: "Email already registered. Please use a different email." 
        });
      }
      return res.status(500).json({ 
        message: "Database error. Please try again." 
      });
    }
    
    res.status(500).json({ message: "Server error" });
  }
});

// Verify OTP for login (only for existing users)
router.post("/verify-login-otp", async (req, res) => {
  try {
    const { phone, otp } = req.body;

    if (!phone || !otp) {
      return res.status(400).json({ message: "Phone and OTP are required" });
    }

    // Find user with matching OTP
    const user = await User.findOne({ 
      phone, 
      otp,
      otpExpires: { $gt: new Date() } // OTP not expired
    });

    if (!user) {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }

    // Update user - remove OTP and mark as verified
    user.otp = null;
    user.otpExpires = null;
    user.isVerified = true;
    await user.save();

    // Generate JWT
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1000d",
    });

    // Return user info
    res.status(200).json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email || '',
        phone: user.phone,
        city: user.city || '',
        course: user.course || '',
        dob: user.dob || '',
        address: user.address || '',
        education: user.education || '',
        levelOfEducation: user.levelOfEducation || '',
        coursePreferred: user.coursePreferred || '',
        citiesPreferred: user.citiesPreferred || '',
        collegeName: user.collegeName || '',
        location: user.location || ''
      },
    });
  } catch (error) {
    console.error("Verify Login OTP Error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Verify OTP for signup (just verify OTP, data already saved)
router.post("/verify-signup-otp", async (req, res) => {
  try {
    const { phone, otp } = req.body;

    if (!phone || !otp) {
      return res.status(400).json({ message: "Phone and OTP are required" });
    }

    // Find user with matching OTP
    const user = await User.findOne({ 
      phone, 
      otp,
      otpExpires: { $gt: new Date() } // OTP not expired
    });

    if (!user) {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }

    // Just verify and activate user (data already saved)
    user.otp = null;
    user.otpExpires = null;
    user.isVerified = true;
    await user.save();

    // Generate JWT
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1000d",
    });

    // Return user info
    res.status(200).json({
      message: "Registration successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email || '',
        phone: user.phone,
        levelOfEducation: user.levelOfEducation || '',
        coursePreferred: user.coursePreferred || '',
        citiesPreferred: user.citiesPreferred || '',
        collegeName: user.collegeName || '',
        location: user.location || ''
      },
    });
  } catch (error) {
    console.error("Verify Signup OTP Error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Resend OTP for login
router.post("/resend-login-otp", async (req, res) => {
  try {
    const { phone } = req.body;

    if (!phone) {
      return res.status(400).json({ message: "Phone number is required" });
    }

    // Check if user exists
    const existingUser = await User.findOne({ phone });
    if (!existingUser) {
      return res.status(404).json({ 
        message: "Phone number not registered" 
      });
    }

    // Check if OTP was sent recently
    const recentOtpUser = await User.findOne({ 
      phone, 
      lastOtpSent: { $gt: new Date(Date.now() - 2 * 60 * 1000) } // 2 minutes cooldown
    });

    if (recentOtpUser) {
      return res.status(429).json({ 
        message: "Please wait before requesting another OTP" 
      });
    }

    // Generate new OTP
    const otp = generateOtp();
    const otpExpires = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes

    // Update OTP details
    await User.findOneAndUpdate(
      { phone },
      { 
        otp, 
        otpExpires, 
        lastOtpSent: new Date() 
      }
    );

    // Send OTP via SMS
    const smsSent = await sendSmsOtp(phone, otp);
    
    if (!smsSent.success) {
      return res.status(500).json({ message: "Failed to send OTP via SMS" });
    }

    res.status(200).json({ message: "OTP resent successfully" });
  } catch (error) {
    console.error("Resend Login OTP Error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Resend OTP for signup
router.post("/resend-signup-otp", async (req, res) => {
  try {
    const { phone } = req.body;

    if (!phone) {
      return res.status(400).json({ message: "Phone number is required" });
    }

    // Check if user already exists (prevent signup OTP for existing users)
    const existingUser = await User.findOne({ phone });
    if (existingUser && existingUser.name && existingUser.name.trim() !== '') {
      return res.status(400).json({ 
        message: "Phone number already registered. Please login instead." 
      });
    }

    // Check if OTP was sent recently
    const recentOtpUser = await User.findOne({ 
      phone, 
      lastOtpSent: { $gt: new Date(Date.now() - 2 * 60 * 1000) } // 2 minutes cooldown
    });

    if (recentOtpUser) {
      return res.status(429).json({ 
        message: "Please wait before requesting another OTP" 
      });
    }

    // Generate new OTP
    const otp = generateOtp();
    const otpExpires = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes

    // Update OTP details (don't change name/email on resend)
    await User.findOneAndUpdate(
      { phone },
      { 
        otp, 
        otpExpires, 
        lastOtpSent: new Date() 
      }
    );

    // Send OTP via SMS
    const smsSent = await sendSmsOtp(phone, otp);
    
    if (!smsSent.success) {
      return res.status(500).json({ message: "Failed to send OTP via SMS" });
    }

    res.status(200).json({ message: "OTP resent successfully" });
  } catch (error) {
    console.error("Resend Signup OTP Error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Edit Profile
router.put('/edit-profile', authMiddleware, async (req, res) => {
    try {
        const { name, email, phone, dob, address, education, levelOfEducation, coursePreferred, citiesPreferred } = req.body;
        const userId = req.user.id;

        // Find user by ID
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Update user fields
        if (name) user.name = name;
        
        // Handle email update carefully
        if (email !== undefined) {
            if (email && email.trim() !== '') {
                user.email = email.trim().toLowerCase();
            } else {
                user.email = undefined;
            }
        }
        
        if (phone) user.phone = phone;
        if (dob) user.dob = new Date(dob);
        if (address) user.address = address;
        if (education) user.education = education;
        if (levelOfEducation) user.levelOfEducation = levelOfEducation;
        if (coursePreferred) user.coursePreferred = coursePreferred;
        if (citiesPreferred) user.citiesPreferred = citiesPreferred;

        // Save updated user
        await user.save();

        // Return updated user info
        res.status(200).json({
            message: "Profile updated successfully",
            user: {
                id: user._id,
                name: user.name,
                email: user.email || '',
                phone: user.phone,
                dob: user.dob,
                address: user.address,
                education: user.education,
                levelOfEducation: user.levelOfEducation,
                coursePreferred: user.coursePreferred,
                citiesPreferred: user.citiesPreferred
            }
        });
    } catch (error) {
        console.error("Profile update error:", error);
        
        // Handle duplicate key error
        if (error.code === 11000 && error.keyPattern && error.keyPattern.email) {
            return res.status(400).json({ 
                message: "Email already in use. Please use a different email." 
            });
        }
        
        res.status(500).json({ message: "Error updating profile" });
    }
});

// Get User Data
router.get('/get-user', authMiddleware, async (req, res) => {
    try {
          const userId = req.user.id || req.user._id;

        // Find user by ID
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Return user info
        res.status(200).json({
            message: "User data retrieved successfully",
            user: {
                id: user._id,
                name: user.name,
                email: user.email || '',
                phone: user.phone,
                dob: user.dob,
                address: user.address,
                education: user.education,
                levelOfEducation: user.levelOfEducation || '',
                coursePreferred: user.coursePreferred || '',
                citiesPreferred: user.citiesPreferred || '',
                collegeName: user.collegeName || '',
                location: user.location || ''
            }
        });
    } catch (error) {
        console.error("User data retrieval error:", error);
        res.status(500).json({ message: "Error retrieving user data" });
    }
});

// Cleanup expired OTPs
const cleanupExpiredOtps = async () => {
  try {
    const result = await User.updateMany(
      {
        otpExpires: { $lt: new Date() }
      },
      {
        $set: {
          otp: null,
          otpExpires: null
        }
      }
    );
    console.log(`Cleaned up expired OTPs for ${result.modifiedCount} users`);
  } catch (error) {
    console.error("Cleanup Error:", error);
  }
};

// Run cleanup every hour
setInterval(cleanupExpiredOtps, 60 * 60 * 1000);

export default router;