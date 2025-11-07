import express from "express";
import Callback from "../models/Callback.js";

const router = express.Router();

// Create new callback request
router.post("/", async (req, res) => {
  try {
    const { name, mobile, email, course, collegeName } = req.body;

    const callback = new Callback({
      name,
      mobile,
      email,
      course,
      collegeName
    });

    await callback.save();

    res.status(201).json({
      success: true,
      message: "Callback request submitted successfully",
      data: callback
    });
  } catch (error) {
    console.error("Error creating callback request:", error);
    res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
});

// Get all callback requests
router.get("/", async (req, res) => {
  try {
    const callbacks = await Callback.find().sort({ createdAt: -1 });
    res.json(callbacks);
  } catch (error) {
    console.error("Error fetching callbacks:", error);
    res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
});

// Update callback status
router.put("/:id", async (req, res) => {
  try {
    const { status } = req.body;
    const callback = await Callback.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    if (!callback) {
      return res.status(404).json({
        success: false,
        message: "Callback request not found"
      });
    }

    res.json({
      success: true,
      data: callback
    });
  } catch (error) {
    console.error("Error updating callback:", error);
    res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
});

// Delete callback request
router.delete("/:id", async (req, res) => {
  try {
    const callback = await Callback.findByIdAndDelete(req.params.id);

    if (!callback) {
      return res.status(404).json({
        success: false,
        message: "Callback request not found"
      });
    }

    res.json({
      success: true,
      message: "Callback request deleted successfully"
    });
  } catch (error) {
    console.error("Error deleting callback:", error);
    res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
});

export default router;