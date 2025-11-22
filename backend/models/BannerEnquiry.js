// models/BannerEnquiry.js
import mongoose from "mongoose";

const bannerEnquirySchema = new mongoose.Schema({
  name: {
    type: String,
    required: false,
    trim: true,
    default: null
  },
  phone: {
    type: String,
    required: false,
    trim: true,
    default: null
  },
  email: {
    type: String,
    required: false,
    trim: true,
    lowercase: true,
    default: null
  },
  inquiry: {
    type: String,
    required: false,
    trim: true,
    default: null
  },
  category: {
    type: String,
    required: false,
    trim: true,
    default: null
  },
  status: {
    type: String,
    enum: ["pending", "contacted", "completed"],
    default: "pending"
  }
}, {
  timestamps: true
});

// Index for better query performance
bannerEnquirySchema.index({ createdAt: -1 });
bannerEnquirySchema.index({ status: 1 });

const BannerEnquiry = mongoose.model("BannerEnquiry", bannerEnquirySchema);

export default BannerEnquiry;