import Blog from "../models/Blog.js";
import { v2 as cloudinary } from "cloudinary";

// @desc    Create a new blog
// @route   POST /api/blogs
export const createBlog = async (req, res) => {
  try {
    console.log("📝 Creating new blog...");

    // Parse FAQs
    let faqs = [];
    if (req.body.faqs) {
      try {
        faqs = typeof req.body.faqs === 'string' ? JSON.parse(req.body.faqs) : req.body.faqs;
      } catch (error) {
        console.error("Error parsing FAQs:", error);
        faqs = [];
      }
    }

    const status = req.body.status === 'published' ? 'published' : 'draft';

    const newBlog = new Blog({
      title: req.body.title || "Untitled Blog",
      content: req.body.content || "",
      image: req.file ? req.file.path : "",
      publicId: req.file ? req.file.filename : "",
      category: req.body.category || "General",
      author: req.body.author || "Admin",
      isFeatured: req.body.isFeatured === 'true',
      status: status,
      faqs: faqs
    });

    const savedBlog = await newBlog.save();
    
    const message = status === 'published' 
      ? "Blog published successfully" 
      : "Blog saved to drafts successfully";
    
    res.status(201).json({
      success: true,
      message: message,
      blog: savedBlog
    });
  } catch (error) {
    console.error("❌ Error creating blog:", error);
    
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        message: "Validation error",
        errors: errors
      });
    }
    
    if (error.code === 11000 && error.keyPattern.slug) {
      return res.status(400).json({
        success: false,
        message: "A blog with this title already exists",
        error: "Duplicate slug"
      });
    }
    
    res.status(500).json({ 
      success: false,
      message: "Error creating blog", 
      error: error.message 
    });
  }
};

// @desc    Get all blogs
// @route   GET /api/blogs
export const getAllBlogs = async (req, res) => {
  try {
    const { category, featured, status, search, limit, exclude } = req.query;
    let query = {};
    
    if (category && category !== 'all') query.category = category;
    if (featured === 'true') query.isFeatured = true;
    if (status && status !== 'all') query.status = status;
    if (exclude) query._id = { $ne: exclude };
    
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { content: { $regex: search, $options: 'i' } },
        { category: { $regex: search, $options: 'i' } },
        { author: { $regex: search, $options: 'i' } }
      ];
    }
    
    let queryBuilder = Blog.find(query).sort({ updatedAt: -1 });
    if (limit) queryBuilder = queryBuilder.limit(parseInt(limit));
    
    const blogs = await queryBuilder.exec();
    
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

// @desc    Get blog by slug
// @route   GET /api/blogs/:slug
export const getBlogBySlug = async (req, res) => {
  try {
    const { slug } = req.params;
    
    let blog = await Blog.findOne({ 
      slug: slug,
      status: 'published' 
    });
    
    if (!blog && slug.includes('-ml')) {
      const cleanSlug = slug.replace(/-ml[a-z0-9]+$/i, '');
      blog = await Blog.findOne({ 
        slug: cleanSlug,
        status: 'published' 
      });
    }
    
    if (!blog) {
      return res.status(404).json({ 
        success: false,
        message: "Blog not found" 
      });
    }
    
    blog.views = (blog.views || 0) + 1;
    await blog.save();
    
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

// @desc    Get blog by clean slug
// @route   GET /api/blogs/slug/:slug
export const getBlogByCleanSlug = async (req, res) => {
  try {
    const { slug } = req.params;
    const cleanSlug = slug.replace(/-ml[a-z0-9]+$/i, '');
    
    const blog = await Blog.findOne({
      $or: [
        { slug: cleanSlug },
        { slug: { $regex: `^${cleanSlug}(-ml[a-z0-9]+)?$` } }
      ],
      status: 'published'
    });
    
    if (!blog) {
      return res.status(404).json({ 
        success: false,
        message: "Blog not found" 
      });
    }
    
    if (blog.slug !== cleanSlug && blog.slug.includes('-ml')) {
      const existingWithCleanSlug = await Blog.findOne({
        slug: cleanSlug,
        _id: { $ne: blog._id }
      });
      
      if (!existingWithCleanSlug) {
        blog.slug = cleanSlug;
        await blog.save();
      }
    }
    
    blog.views = (blog.views || 0) + 1;
    await blog.save();
    
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
    
    if (!blog.image || blog.image.trim().length === 0) {
      return res.status(400).json({ 
        success: false,
        message: "Image is required to publish a blog" 
      });
    }
    
    if (!blog.content || blog.content.trim().length === 0) {
      return res.status(400).json({ 
        success: false,
        message: "Content is required to publish a blog" 
      });
    }
    
    blog.status = 'published';
    const publishedBlog = await blog.save();
    
    res.json({ 
      success: true,
      message: "Blog published successfully",
      blog: publishedBlog
    });
  } catch (error) {
    console.error("Error publishing blog:", error);
    
    if (error.code === 11000 && error.keyPattern.slug) {
      return res.status(500).json({
        success: false,
        message: "Error publishing blog - could not generate unique slug",
        error: error.message
      });
    }
    
    res.status(500).json({ 
      success: false,
      message: "Error publishing blog", 
      error: error.message 
    });
  }
};

// @desc    Clean slug
// @route   PUT /api/blogs/:id/clean-slug
export const cleanBlogSlug = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) {
      return res.status(404).json({ 
        success: false,
        message: "Blog not found" 
      });
    }
    
    if (blog.status !== 'published') {
      return res.status(400).json({ 
        success: false,
        message: "Only published blogs can have slugs cleaned" 
      });
    }
    
    const cleanSlug = blog.title
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim()
      .replace(/-ml[a-z0-9]+$/i, '');
    
    const existingBlog = await Blog.findOne({
      slug: cleanSlug,
      _id: { $ne: blog._id },
      status: 'published'
    });
    
    if (existingBlog) {
      return res.status(400).json({ 
        success: false,
        message: "Cannot clean slug - another blog already has this slug" 
      });
    }
    
    blog.slug = cleanSlug;
    blog.updatedAt = new Date();
    const updatedBlog = await blog.save();
    
    res.json({ 
      success: true,
      message: "Slug cleaned successfully",
      blog: updatedBlog
    });
  } catch (error) {
    console.error("Error cleaning slug:", error);
    res.status(500).json({ 
      success: false,
      message: "Error cleaning slug", 
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

    let faqs = blog.faqs;
    if (req.body.faqs) {
      try {
        faqs = typeof req.body.faqs === 'string' ? JSON.parse(req.body.faqs) : req.body.faqs;
      } catch (error) {
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
      updatedAt: Date.now()
    };

    if (req.file) {
      if (blog.publicId && blog.publicId.trim().length > 0) {
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

// @desc    Get featured blogs
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

// @desc    Get blog by ID
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

    if (blog.publicId && blog.publicId.trim().length > 0) {
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
    
    const viewsResult = await Blog.aggregate([
      { $match: { status: 'published' } },
      { $group: { _id: null, totalViews: { $sum: "$views" } } }
    ]);
    
    const totalViews = viewsResult.length > 0 ? viewsResult[0].totalViews : 0;
    
    res.json({
      success: true,
      total: totalBlogs,
      published: publishedBlogs,
      drafts: draftBlogs,
      featured: featuredBlogs,
      totalViews: totalViews
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

// @desc    Check if slug exists
// @route   GET /api/blogs/check-slug/:slug
export const checkSlug = async (req, res) => {
  try {
    const { slug } = req.params;
    const blog = await Blog.findOne({ slug: slug });
    
    res.json({
      success: true,
      exists: !!blog,
      blogId: blog?._id,
      blog: blog
    });
  } catch (error) {
    console.error("Error checking slug:", error);
    res.status(500).json({
      success: false,
      message: "Error checking slug"
    });
  }
};

// @desc    Unpublish a blog
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