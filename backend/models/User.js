// models/User.js
import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: false, // Make email optional
    },
    phone: {
        type: String,
        required: true,
        unique: true,
    },
    city: {
        type: String,
        required: false
    },
    course: {
        type: String,
        required: false
    },
    dob: {
        type: Date,
        required: false
    },
    address: {
        type: String,
        required: false
    },
    education: {
        type: String,
        required: false
    },
    status: {
        type: String,
        enum: ['Complete', 'Pending'],
        default: 'Pending',
    },
    remark: { 
        type: String, 
        default: "" 
    },
    // OTP verification fields
    otp: {
        type: String,
        default: null
    },
    otpExpires: {
        type: Date,
        default: null
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    lastOtpSent: {
        type: Date,
        default: null
    }
}, { timestamps: true });

// Add partial unique index for email to allow multiple null values
userSchema.index({ email: 1 }, { 
    unique: true, 
    partialFilterExpression: { 
        email: { $exists: true, $ne: null } 
    } 
});

const User = mongoose.model('User', userSchema);

export default User;