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
  getBlogByCleanSlug,
  getDraftBlogs,
  getPublishedBlogs,
  publishBlog,
  unpublishBlog,
  getBlogStats,
  checkSlug,
  cleanBlogSlug
} from "../controllers/blogController.js";

const router = express.Router();

// Create a new blog
router.post("/", uploadBlogImage.single("image"), createBlog);

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

// Check if slug exists
router.get("/check-slug/:slug", checkSlug);

// Get a single blog by slug
router.get("/:slug", getBlogBySlug);

// Get a single blog by clean slug
router.get("/slug/:slug", getBlogByCleanSlug);

// Get a single blog by ID
router.get("/id/:id", getBlogById);

// Update a blog (for admin edits)
router.put("/:id", uploadBlogImage.single("image"), updateBlog);

// Publish a draft blog
router.put("/:id/publish", publishBlog);

// Clean blog slug
router.put("/:id/clean-slug", cleanBlogSlug);

// Move published blog to draft
router.put("/:id/unpublish", unpublishBlog);

// Delete a blog
router.delete("/:id", deleteBlog);

export default router;