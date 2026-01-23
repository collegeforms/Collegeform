import express from "express";
import { uploadDraftImage } from '../config/cloudinary.js';
import { 
  getAllDrafts,
  getDraftById,
  getDraftBySession,
  autoSaveDraft,
  saveDraft,
  deleteDraft,
  publishDraft
} from "../controllers/blogController.js";

const router = express.Router();

// Get all drafts
router.get("/", getAllDrafts);

// Get draft by session ID
router.get("/session/:sessionId", getDraftBySession);

// Get a single draft by ID
router.get("/:id", getDraftById);

// Auto-save draft
router.post("/auto-save", uploadDraftImage.single("image"), autoSaveDraft);

// Save draft manually
router.post("/save", uploadDraftImage.single("image"), saveDraft);

// Publish a draft
router.post("/:id/publish", publishDraft);

// Delete a draft
router.delete("/:id", deleteDraft);

export default router;