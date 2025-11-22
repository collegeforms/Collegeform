// routes/bannerEnquiries.js
import express from "express";
import BannerEnquiry from "../models/BannerEnquiry.js";

const router = express.Router();

// Create new banner enquiry
router.post("/", async (req, res) => {
  try {
    const {
      name,
      phone,
      email,
      inquiry,
      category
    } = req.body;

    // Create enquiry with all optional fields
    const enquiry = new BannerEnquiry({
      name: name || null,
      phone: phone || null,
      email: email || null,
      inquiry: inquiry || null,
      category: category || null
    });

    await enquiry.save();

    res.status(201).json({
      success: true,
      message: "Enquiry submitted successfully",
      data: enquiry
    });
  } catch (error) {
    console.error("Error creating banner enquiry:", error);
    res.status(500).json({
      success: false,
      message: "Server error while submitting enquiry"
    });
  }
});

// Get all banner enquiries
router.get("/", async (req, res) => {
  try {
    const enquiries = await BannerEnquiry.find().sort({ createdAt: -1 });
    
    res.json({
      success: true,
      data: enquiries,
      count: enquiries.length
    });
  } catch (error) {
    console.error("Error fetching banner enquiries:", error);
    res.status(500).json({
      success: false,
      message: "Server error while fetching enquiries"
    });
  }
});

// Get single banner enquiry by ID
router.get("/:id", async (req, res) => {
  try {
    const enquiry = await BannerEnquiry.findById(req.params.id);
    
    if (!enquiry) {
      return res.status(404).json({
        success: false,
        message: "Enquiry not found"
      });
    }

    res.json({
      success: true,
      data: enquiry
    });
  } catch (error) {
    console.error("Error fetching banner enquiry:", error);
    res.status(500).json({
      success: false,
      message: "Server error while fetching enquiry"
    });
  }
});

// Update banner enquiry status
router.put("/:id", async (req, res) => {
  try {
    const { status } = req.body;

    const enquiry = await BannerEnquiry.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    if (!enquiry) {
      return res.status(404).json({
        success: false,
        message: "Enquiry not found"
      });
    }

    res.json({
      success: true,
      message: "Enquiry status updated successfully",
      data: enquiry
    });
  } catch (error) {
    console.error("Error updating banner enquiry:", error);
    res.status(500).json({
      success: false,
      message: "Server error while updating enquiry"
    });
  }
});

// Delete banner enquiry
router.delete("/:id", async (req, res) => {
  try {
    const enquiry = await BannerEnquiry.findByIdAndDelete(req.params.id);

    if (!enquiry) {
      return res.status(404).json({
        success: false,
        message: "Enquiry not found"
      });
    }

    res.json({
      success: true,
      message: "Enquiry deleted successfully"
    });
  } catch (error) {
    console.error("Error deleting banner enquiry:", error);
    res.status(500).json({
      success: false,
      message: "Server error while deleting enquiry"
    });
  }
});

export default router;