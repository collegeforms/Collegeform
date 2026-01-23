import express from "express";
import { uploadBlogImage } from '../config/cloudinary.js';
import { 
  createBlog, 
  getAllBlogs, 
  getBlogById, 
  updateBlog, 
  deleteBlog,
  getFeaturedBlogs,
  getBlogBySlug,
  saveDraft,
  getDraftBlogs,
  getPublishedBlogs,
  publishBlog,
  unpublishBlog,
  getBlogStats
} from "../controllers/blogController.js";

const router = express.Router();

// Create a new blog
router.post("/", uploadBlogImage.single("image"), createBlog);

// Save draft (auto-save)
router.post("/draft", uploadBlogImage.single("image"), saveDraft);

// Get all blogs
router.get("/", getAllBlogs);

// Get blog statistics
router.get("/stats", getBlogStats);

// Get draft blogs
router.get("/drafts", getDraftBlogs);

// Get published blogs
router.get("/published", getPublishedBlogs);

// Get featured blogs
router.get("/featured", getFeaturedBlogs);

// Get a single blog by slug (only published)
router.get("/:slug", getBlogBySlug);

// Get a single blog by ID
router.get("/id/:id", getBlogById);

// Update a blog
router.put("/:id", uploadBlogImage.single("image"), updateBlog);

// Publish a draft blog
router.put("/:id/publish", publishBlog);

// Move published blog to draft
router.put("/:id/unpublish", unpublishBlog);

// Delete a blog
router.delete("/:id", deleteBlog);

export default router;