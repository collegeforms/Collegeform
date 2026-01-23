import Blog from "../models/Blog.js";
import { v2 as cloudinary } from "cloudinary";

// @desc    Create a new blog (draft by default)
// @route   POST /api/blogs
export const createBlog = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No image uploaded" });
    }

    // Upload image to Cloudinary
    const uploadedImage = await cloudinary.uploader.upload(req.file.path, {
      folder: "blog_images",
    });

    // Parse FAQs from request body
    let faqs = [];
    if (req.body.faqs) {
      try {
        faqs = JSON.parse(req.body.faqs);
      } catch (error) {
        console.error("Error parsing FAQs:", error);
      }
    }

    // Determine status (draft or published)
    const status = req.body.status === 'published' ? 'published' : 'draft';

    const newBlog = new Blog({
      title: req.body.title,
      content: req.body.content,
      image: uploadedImage.secure_url,
      publicId: uploadedImage.public_id,
      category: req.body.category,
      author: req.body.author,
      isFeatured: req.body.isFeatured === 'true',
      status: status,
      faqs: faqs
    });

    const savedBlog = await newBlog.save();
    res.status(201).json(savedBlog);
  } catch (error) {
    console.error("Error creating blog:", error);
    res.status(500).json({ 
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
        return res.status(404).json({ message: "Blog not found" });
      }
      
      // Only allow updating drafts
      if (blog.status !== 'draft') {
        return res.status(400).json({ message: "Only drafts can be auto-saved" });
      }
      
      let updateData = {
        ...blogData,
        updatedAt: Date.now()
      };
      
      // If new image is uploaded
      if (req.file) {
        // Delete old image from Cloudinary
        if (blog.publicId) {
          await cloudinary.uploader.destroy(blog.publicId);
        }
        
        // Upload new image
        const uploadedImage = await cloudinary.uploader.upload(req.file.path, {
          folder: "blog_images",
        });
        
        updateData.image = uploadedImage.secure_url;
        updateData.publicId = uploadedImage.public_id;
      }
      
      const updatedBlog = await Blog.findByIdAndUpdate(id, updateData, { new: true });
      return res.json({ 
        message: "Draft saved successfully",
        blog: updatedBlog
      });
    } 
    // Create new draft
    else {
      if (!req.file) {
        return res.status(400).json({ message: "No image uploaded" });
      }
      
      const uploadedImage = await cloudinary.uploader.upload(req.file.path, {
        folder: "blog_images",
      });
      
      // Parse FAQs
      let faqs = [];
      if (blogData.faqs) {
        try {
          faqs = JSON.parse(blogData.faqs);
        } catch (error) {
          console.error("Error parsing FAQs:", error);
        }
      }
      
      const newDraft = new Blog({
        ...blogData,
        image: uploadedImage.secure_url,
        publicId: uploadedImage.public_id,
        status: 'draft',
        faqs: faqs
      });
      
      const savedDraft = await newDraft.save();
      return res.status(201).json(savedDraft);
    }
  } catch (error) {
    console.error("Error saving draft:", error);
    res.status(500).json({ 
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
    
    if (category) {
      query.category = category;
    }
    
    if (featured) {
      query.isFeatured = true;
    }
    
    if (status) {
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
    res.json(blogs);
  } catch (error) {
    console.error("Error fetching blogs:", error);
    res.status(500).json({ 
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
    res.json(drafts);
  } catch (error) {
    console.error("Error fetching drafts:", error);
    res.status(500).json({ 
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
    res.json(blogs);
  } catch (error) {
    console.error("Error fetching published blogs:", error);
    res.status(500).json({ 
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
      return res.status(404).json({ message: "Blog not found" });
    }
    
    if (blog.status === 'published') {
      return res.status(400).json({ message: "Blog is already published" });
    }
    
    blog.status = 'published';
    blog.publishedAt = new Date();
    const publishedBlog = await blog.save();
    
    res.json({ 
      message: "Blog published successfully",
      blog: publishedBlog
    });
  } catch (error) {
    console.error("Error publishing blog:", error);
    res.status(500).json({ 
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
      return res.status(404).json({ message: "Blog not found" });
    }
    
    if (blog.status === 'draft') {
      return res.status(400).json({ message: "Blog is already a draft" });
    }
    
    blog.status = 'draft';
    blog.publishedAt = null;
    const unpublishedBlog = await blog.save();
    
    res.json({ 
      message: "Blog moved to drafts",
      blog: unpublishedBlog
    });
  } catch (error) {
    console.error("Error unpublishing blog:", error);
    res.status(500).json({ 
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
      return res.status(404).json({ message: "Blog not found" });
    }
    res.json(blog);
  } catch (error) {
    console.error("Error fetching blog:", error);
    res.status(500).json({ 
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
      return res.status(404).json({ message: "Blog not found" });
    }

    // Parse FAQs from request body
    let faqs = blog.faqs;
    if (req.body.faqs) {
      try {
        faqs = JSON.parse(req.body.faqs);
      } catch (error) {
        console.error("Error parsing FAQs:", error);
      }
    }

    let updateData = {
      title: req.body.title || blog.title,
      content: req.body.content || blog.content,
      category: req.body.category || blog.category,
      author: req.body.author || blog.author,
      isFeatured: req.body.isFeatured ? req.body.isFeatured === 'true' : blog.isFeatured,
      faqs: faqs,
      status: req.body.status || blog.status,
      updatedAt: Date.now()
    };

    // If status is changed to published, set publishedAt
    if (req.body.status === 'published' && blog.status === 'draft') {
      updateData.publishedAt = new Date();
    }
    // If status is changed to draft, remove publishedAt
    else if (req.body.status === 'draft' && blog.status === 'published') {
      updateData.publishedAt = null;
      updateData.slug = null; // Remove slug for drafts
    }

    // If new image is uploaded
    if (req.file) {
      // Delete old image from Cloudinary
      if (blog.publicId) {
        await cloudinary.uploader.destroy(blog.publicId);
      }

      // Upload new image
      const uploadedImage = await cloudinary.uploader.upload(req.file.path, {
        folder: "blog_images",
      });

      updateData.image = uploadedImage.secure_url;
      updateData.publicId = uploadedImage.public_id;
    }

    const updatedBlog = await Blog.findByIdAndUpdate(req.params.id, updateData, { new: true });
    res.json(updatedBlog);
  } catch (error) {
    console.error("Error updating blog:", error);
    if (error.code === 11000 && error.keyPattern.slug) {
      return res.status(400).json({ 
        message: "A blog with this title already exists" 
      });
    }
    res.status(500).json({ 
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
    res.json(blogs);
  } catch (error) {
    console.error("Error fetching featured blogs:", error);
    res.status(500).json({ 
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
      return res.status(404).json({ message: "Blog not found" });
    }
    res.json(blog);
  } catch (error) {
    console.error("Error fetching blog:", error);
    res.status(500).json({ 
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
      return res.status(404).json({ message: "Blog not found" });
    }

    // Delete image from Cloudinary
    if (blog.publicId) {
      await cloudinary.uploader.destroy(blog.publicId);
    }

    await Blog.findByIdAndDelete(req.params.id);
    res.json({ 
      message: "Blog deleted successfully",
      deletedBlog: blog
    });
  } catch (error) {
    console.error("Error deleting blog:", error);
    res.status(500).json({ 
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
      total: totalBlogs,
      published: publishedBlogs,
      drafts: draftBlogs,
      featured: featuredBlogs
    });
  } catch (error) {
    console.error("Error fetching blog stats:", error);
    res.status(500).json({ 
      message: "Error fetching blog statistics", 
      error: error.message 
    });
  }
};