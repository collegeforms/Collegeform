import Blog from "../models/Blog.js";
import { v2 as cloudinary } from "cloudinary";

// @desc    Create a new blog (draft by default)
// @route   POST /api/blogs
export const createBlog = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ 
        success: false,
        message: "No image uploaded" 
      });
    }

    // Parse FAQs from request body
    let faqs = [];
    if (req.body.faqs) {
      try {
        faqs = typeof req.body.faqs === 'string' ? JSON.parse(req.body.faqs) : req.body.faqs;
      } catch (error) {
        console.error("Error parsing FAQs:", error);
        return res.status(400).json({ 
          success: false,
          message: "Invalid FAQs format" 
        });
      }
    }

    // Determine status (draft or published)
    const status = req.body.status === 'published' ? 'published' : 'draft';

    const newBlog = new Blog({
      title: req.body.title || "Untitled Draft",
      content: req.body.content || "",
      image: req.file.path, // Cloudinary URL
      publicId: req.file.filename, // Cloudinary public_id
      category: req.body.category || "Technology",
      author: req.body.author || "",
      isFeatured: req.body.isFeatured === 'true',
      status: status,
      faqs: faqs
    });

    const savedBlog = await newBlog.save();
    
    res.status(201).json({
      success: true,
      message: status === 'published' ? "Blog published successfully" : "Draft saved successfully",
      blog: savedBlog
    });
  } catch (error) {
    console.error("Error creating blog:", error);
    res.status(500).json({ 
      success: false,
      message: "Error creating blog", 
      error: error.message 
    });
  }
};

// @desc    Save draft (auto-save)
// @route   POST /api/blogs/draft
export const saveDraft = async (req, res) => {
  try {
    const { id, ...blogData } = req.body;
    
    // If id exists, update existing draft
    if (id) {
      const blog = await Blog.findById(id);
      if (!blog) {
        return res.status(404).json({ 
          success: false,
          message: "Blog not found" 
        });
      }
      
      // Only allow updating drafts
      if (blog.status !== 'draft') {
        return res.status(400).json({ 
          success: false,
          message: "Only drafts can be auto-saved" 
        });
      }
      
      const updateData = {
        updatedAt: Date.now()
      };
      
      // Update fields only if they exist in request
      if (blogData.title !== undefined) updateData.title = blogData.title;
      if (blogData.content !== undefined) updateData.content = blogData.content;
      if (blogData.category !== undefined) updateData.category = blogData.category;
      if (blogData.author !== undefined) updateData.author = blogData.author;
      if (blogData.isFeatured !== undefined) updateData.isFeatured = blogData.isFeatured === 'true';
      
      // Parse FAQs
      if (blogData.faqs !== undefined) {
        try {
          updateData.faqs = typeof blogData.faqs === 'string' ? JSON.parse(blogData.faqs) : blogData.faqs;
        } catch (error) {
          console.error("Error parsing FAQs:", error);
          return res.status(400).json({
            success: false,
            message: "Invalid FAQs format"
          });
        }
      }
      
      // If new image is uploaded
      if (req.file) {
        try {
          // Delete old image from Cloudinary if exists
          if (blog.publicId) {
            await cloudinary.uploader.destroy(blog.publicId).catch(err => {
              console.error("Error deleting old image:", err);
              // Continue even if deletion fails
            });
          }
          
          // Use Cloudinary URL and public_id from multer-storage-cloudinary
          updateData.image = req.file.path;
          updateData.publicId = req.file.filename;
        } catch (cloudinaryError) {
          console.error("Cloudinary error:", cloudinaryError);
          // Continue without updating image if upload fails
        }
      }
      
      const updatedBlog = await Blog.findByIdAndUpdate(
        id, 
        { $set: updateData }, 
        { 
          new: true,
          runValidators: true 
        }
      );
      
      return res.json({ 
        success: true,
        message: "Draft saved successfully",
        blog: updatedBlog
      });
    } 
    // Create new draft
    else {
      // Parse FAQs
      let faqs = [];
      if (blogData.faqs) {
        try {
          faqs = typeof blogData.faqs === 'string' ? JSON.parse(blogData.faqs) : blogData.faqs;
        } catch (error) {
          console.error("Error parsing FAQs:", error);
          // Continue with empty FAQs if parsing fails
        }
      }
      
      const newDraft = new Blog({
        title: blogData.title || "Untitled Draft",
        content: blogData.content || "",
        image: req.file ? req.file.path : "",
        publicId: req.file ? req.file.filename : "",
        category: blogData.category || "Technology",
        author: blogData.author || "",
        isFeatured: blogData.isFeatured === 'true',
        status: 'draft',
        faqs: faqs
      });
      
      const savedDraft = await newDraft.save();
      
      return res.status(201).json({
        success: true,
        message: "Draft created successfully",
        blog: savedDraft
      });
    }
  } catch (error) {
    console.error("Error saving draft:", error);
    
    // Handle specific errors
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        message: "Validation error",
        errors: errors
      });
    }
    
    res.status(500).json({ 
      success: false,
      message: "Error saving draft", 
      error: error.message 
    });
  }
};

// @desc    Get all blogs with optional filters
// @route   GET /api/blogs
export const getAllBlogs = async (req, res) => {
  try {
    const { category, featured, status, search } = req.query;
    let query = {};
    
    if (category && category !== 'all') {
      query.category = category;
    }
    
    if (featured === 'true') {
      query.isFeatured = true;
    }
    
    if (status && status !== 'all') {
      query.status = status;
    }
    
    // Search functionality
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { content: { $regex: search, $options: 'i' } },
        { category: { $regex: search, $options: 'i' } },
        { author: { $regex: search, $options: 'i' } }
      ];
    }
    
    const blogs = await Blog.find(query).sort({ updatedAt: -1 });
    
    res.json({
      success: true,
      count: blogs.length,
      blogs: blogs
    });
  } catch (error) {
    console.error("Error fetching blogs:", error);
    res.status(500).json({ 
      success: false,
      message: "Error fetching blogs", 
      error: error.message 
    });
  }
};

// @desc    Get draft blogs
// @route   GET /api/blogs/drafts
export const getDraftBlogs = async (req, res) => {
  try {
    const drafts = await Blog.find({ status: 'draft' }).sort({ updatedAt: -1 });
    
    res.json({
      success: true,
      count: drafts.length,
      blogs: drafts
    });
  } catch (error) {
    console.error("Error fetching drafts:", error);
    res.status(500).json({ 
      success: false,
      message: "Error fetching drafts", 
      error: error.message 
    });
  }
};

// @desc    Get published blogs
// @route   GET /api/blogs/published
export const getPublishedBlogs = async (req, res) => {
  try {
    const blogs = await Blog.find({ status: 'published' }).sort({ publishedAt: -1 });
    
    res.json({
      success: true,
      count: blogs.length,
      blogs: blogs
    });
  } catch (error) {
    console.error("Error fetching published blogs:", error);
    res.status(500).json({ 
      success: false,
      message: "Error fetching published blogs", 
      error: error.message 
    });
  }
};

// @desc    Publish a draft blog
// @route   PUT /api/blogs/:id/publish
export const publishBlog = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) {
      return res.status(404).json({ 
        success: false,
        message: "Blog not found" 
      });
    }
    
    if (blog.status === 'published') {
      return res.status(400).json({ 
        success: false,
        message: "Blog is already published" 
      });
    }
    
    // Generate slug for published blog
    const slug = blog.title
      .toLowerCase()
      .replace(/[^a-zA-Z0-9]/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '');
    
    blog.status = 'published';
    blog.publishedAt = new Date();
    blog.slug = `${slug}-${Date.now().toString(36)}`;
    
    const publishedBlog = await blog.save();
    
    res.json({ 
      success: true,
      message: "Blog published successfully",
      blog: publishedBlog
    });
  } catch (error) {
    console.error("Error publishing blog:", error);
    
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: "A blog with similar title already exists"
      });
    }
    
    res.status(500).json({ 
      success: false,
      message: "Error publishing blog", 
      error: error.message 
    });
  }
};

// @desc    Move published blog back to draft
// @route   PUT /api/blogs/:id/unpublish
export const unpublishBlog = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) {
      return res.status(404).json({ 
        success: false,
        message: "Blog not found" 
      });
    }
    
    if (blog.status === 'draft') {
      return res.status(400).json({ 
        success: false,
        message: "Blog is already a draft" 
      });
    }
    
    blog.status = 'draft';
    blog.publishedAt = null;
    blog.slug = null;
    
    const unpublishedBlog = await blog.save();
    
    res.json({ 
      success: true,
      message: "Blog moved to drafts",
      blog: unpublishedBlog
    });
  } catch (error) {
    console.error("Error unpublishing blog:", error);
    res.status(500).json({ 
      success: false,
      message: "Error unpublishing blog", 
      error: error.message 
    });
  }
};

// @desc    Get a single blog by slug (only published)
// @route   GET /api/blogs/:slug
export const getBlogBySlug = async (req, res) => {
  try {
    const blog = await Blog.findOne({ 
      slug: req.params.slug,
      status: 'published' 
    });
    
    if (!blog) {
      return res.status(404).json({ 
        success: false,
        message: "Blog not found" 
      });
    }
    
    res.json({
      success: true,
      blog: blog
    });
  } catch (error) {
    console.error("Error fetching blog:", error);
    res.status(500).json({ 
      success: false,
      message: "Error fetching blog", 
      error: error.message 
    });
  }
};

// @desc    Update a blog
// @route   PUT /api/blogs/:id
export const updateBlog = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) {
      return res.status(404).json({ 
        success: false,
        message: "Blog not found" 
      });
    }

    // Parse FAQs from request body
    let faqs = blog.faqs;
    if (req.body.faqs) {
      try {
        faqs = typeof req.body.faqs === 'string' ? JSON.parse(req.body.faqs) : req.body.faqs;
      } catch (error) {
        console.error("Error parsing FAQs:", error);
        return res.status(400).json({
          success: false,
          message: "Invalid FAQs format"
        });
      }
    }

    const updateData = {
      title: req.body.title || blog.title,
      content: req.body.content || blog.content,
      category: req.body.category || blog.category,
      author: req.body.author || blog.author,
      isFeatured: req.body.isFeatured ? req.body.isFeatured === 'true' : blog.isFeatured,
      faqs: faqs,
      status: req.body.status || blog.status,
      updatedAt: Date.now()
    };

    // If status is changed to published, set publishedAt and generate slug
    if (req.body.status === 'published' && blog.status === 'draft') {
      updateData.publishedAt = new Date();
      const slug = (req.body.title || blog.title)
        .toLowerCase()
        .replace(/[^a-zA-Z0-9]/g, '-')
        .replace(/-+/g, '-')
        .replace(/^-|-$/g, '');
      updateData.slug = `${slug}-${Date.now().toString(36)}`;
    }
    // If status is changed to draft, remove publishedAt and slug
    else if (req.body.status === 'draft' && blog.status === 'published') {
      updateData.publishedAt = null;
      updateData.slug = null;
    }

    // If new image is uploaded
    if (req.file) {
      // Delete old image from Cloudinary
      if (blog.publicId) {
        await cloudinary.uploader.destroy(blog.publicId).catch(err => {
          console.error("Error deleting old image:", err);
        });
      }

      updateData.image = req.file.path;
      updateData.publicId = req.file.filename;
    }

    const updatedBlog = await Blog.findByIdAndUpdate(
      req.params.id, 
      { $set: updateData }, 
      { 
        new: true,
        runValidators: true 
      }
    );
    
    res.json({
      success: true,
      message: "Blog updated successfully",
      blog: updatedBlog
    });
  } catch (error) {
    console.error("Error updating blog:", error);
    
    if (error.code === 11000 && error.keyPattern.slug) {
      return res.status(400).json({ 
        success: false,
        message: "A blog with this title already exists" 
      });
    }
    
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        message: "Validation error",
        errors: errors
      });
    }
    
    res.status(500).json({ 
      success: false,
      message: "Error updating blog", 
      error: error.message 
    });
  }
};

// @desc    Get featured blogs (only published)
// @route   GET /api/blogs/featured
export const getFeaturedBlogs = async (req, res) => {
  try {
    const blogs = await Blog.find({ 
      isFeatured: true,
      status: 'published' 
    }).sort({ publishedAt: -1 }).limit(3);
    
    res.json({
      success: true,
      count: blogs.length,
      blogs: blogs
    });
  } catch (error) {
    console.error("Error fetching featured blogs:", error);
    res.status(500).json({ 
      success: false,
      message: "Error fetching featured blogs", 
      error: error.message 
    });
  }
};

// @desc    Get a single blog by ID
// @route   GET /api/blogs/id/:id
export const getBlogById = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) {
      return res.status(404).json({ 
        success: false,
        message: "Blog not found" 
      });
    }
    
    res.json({
      success: true,
      blog: blog
    });
  } catch (error) {
    console.error("Error fetching blog:", error);
    res.status(500).json({ 
      success: false,
      message: "Error fetching blog", 
      error: error.message 
    });
  }
};

// @desc    Delete a blog
// @route   DELETE /api/blogs/:id
export const deleteBlog = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) {
      return res.status(404).json({ 
        success: false,
        message: "Blog not found" 
      });
    }

    // Delete image from Cloudinary
    if (blog.publicId) {
      await cloudinary.uploader.destroy(blog.publicId).catch(err => {
        console.error("Error deleting image from Cloudinary:", err);
      });
    }

    await Blog.findByIdAndDelete(req.params.id);
    
    res.json({ 
      success: true,
      message: "Blog deleted successfully"
    });
  } catch (error) {
    console.error("Error deleting blog:", error);
    res.status(500).json({ 
      success: false,
      message: "Error deleting blog", 
      error: error.message 
    });
  }
};

// @desc    Get blog statistics
// @route   GET /api/blogs/stats
export const getBlogStats = async (req, res) => {
  try {
    const totalBlogs = await Blog.countDocuments();
    const publishedBlogs = await Blog.countDocuments({ status: 'published' });
    const draftBlogs = await Blog.countDocuments({ status: 'draft' });
    const featuredBlogs = await Blog.countDocuments({ 
      isFeatured: true,
      status: 'published' 
    });
    
    res.json({
      success: true,
      total: totalBlogs,
      published: publishedBlogs,
      drafts: draftBlogs,
      featured: featuredBlogs
    });
  } catch (error) {
    console.error("Error fetching blog stats:", error);
    res.status(500).json({ 
      success: false,
      message: "Error fetching blog statistics", 
      error: error.message 
    });
  }
};