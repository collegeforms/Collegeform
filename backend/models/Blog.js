import mongoose from "mongoose";

const faqSchema = new mongoose.Schema({
  question: {
    type: String,
    required: [true, "FAQ question is required"],
    trim: true
  },
  answer: {
    type: String,
    required: [true, "FAQ answer is required"],
    trim: true
  }
}, { _id: true });

const blogSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, "Title is required"],
    trim: true,
  },
  slug: {
    type: String,
    unique: true,
    sparse: true,
    trim: true,
    lowercase: true,
    index: true,
    default: null
  },
  content: {
    type: String,
    default: ""
  },
  excerpt: {
    type: String,
    trim: true,
  },
  image: {
    type: String,
    default: ""
  },
  publicId: {
    type: String,
    default: ""
  },
  category: {
    type: String,
    required: [true, "Category is required"],
    enum: [
      "Technology",
      "Education",
      "Health",
      "Business",
      "Entertainment",
      "Lifestyle",
      "Sports",
      "Science",
      "Travel",
      "General"
    ],
    default: "General"
  },
  author: {
    type: String,
    required: [true, "Author is required"],
    trim: true,
    default: "Admin"
  },
  isFeatured: {
    type: Boolean,
    default: false
  },
  status: {
    type: String,
    enum: ["draft", "published"],
    default: "draft"
  },
  publishedAt: {
    type: Date,
    default: null
  },
  views: {
    type: Number,
    default: 0
  },
  readingTime: {
    type: Number,
    default: 5,
    min: [1, "Reading time must be at least 1 minute"]
  },
  faqs: [faqSchema],
  tags: [{
    type: String,
    trim: true
  }],
  imageCredit: {
    type: String,
    trim: true
  }
}, {
  timestamps: true
});

// Indexes
blogSchema.index({ slug: 1 }, { unique: true, sparse: true });
blogSchema.index({ category: 1, status: 1 });
blogSchema.index({ isFeatured: 1, status: 1 });
blogSchema.index({ publishedAt: -1 });
blogSchema.index({ views: -1 });
blogSchema.index({ status: 1, createdAt: -1 });

// Helper function to generate slug
const generateSlug = (title) => {
  return title
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim()
    .replace(/-ml[a-z0-9]+$/i, '');
};

// Pre-save middleware
blogSchema.pre('save', async function(next) {
  try {
    // Always generate a slug, but for drafts we'll store it differently
    const baseSlug = generateSlug(this.title);
    
    // For published blogs, generate unique slug
    if (this.status === 'published') {
      let slug = baseSlug;
      let counter = 1;
      let slugExists = true;
      
      while (slugExists) {
        const query = {
          slug: slug,
          _id: { $ne: this._id }
        };
        
        // Only check published blogs for slug uniqueness
        if (this.status === 'published') {
          query.status = 'published';
        }
        
        const existingBlog = await this.constructor.findOne(query);
        
        if (!existingBlog) {
          slugExists = false;
        } else {
          slug = `${baseSlug}-${counter}`;
          counter++;
          if (counter > 100) {
            slug = `${baseSlug}-${Date.now().toString(36)}`;
            break;
          }
        }
      }
      
      this.slug = slug;
    } else {
      // For drafts, use a draft-specific slug format
      // This avoids the unique constraint issue with null values
      this.slug = `${baseSlug}-draft-${Date.now().toString(36)}`;
    }
    
    // Set publishedAt when publishing
    if (this.isModified('status') && this.status === 'published') {
      this.publishedAt = new Date();
      
      // Clean up draft slug when publishing
      if (this.slug && this.slug.includes('-draft-')) {
        const cleanSlug = this.slug.replace(/-draft-[a-z0-9]+$/i, '');
        this.slug = cleanSlug;
      }
    }
    
    // Generate excerpt
    if (!this.excerpt && this.content && this.content.trim().length > 0) {
      const plainText = this.content.replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim();
      this.excerpt = plainText.substring(0, 150) + (plainText.length > 150 ? '...' : '');
    } else if (!this.excerpt) {
      this.excerpt = "";
    }
    
    // Calculate reading time
    if (this.content && this.content.trim().length > 0) {
      const wordCount = this.content.split(/\s+/).length;
      this.readingTime = Math.max(1, Math.ceil(wordCount / 200));
    } else {
      this.readingTime = 5;
    }
    
    next();
  } catch (error) {
    next(error);
  }
});

// Custom validation for different statuses
blogSchema.pre('validate', function(next) {
  if (this.status === 'published') {
    if (!this.content || this.content.trim().length === 0) {
      this.invalidate('content', 'Content is required for published blogs');
    }
    if (!this.image || this.image.trim().length === 0) {
      this.invalidate('image', 'Image is required for published blogs');
    }
  }
  
  if (!this.title || this.title.trim().length === 0) {
    this.invalidate('title', 'Title is required');
  }
  
  if (this.title && this.title.trim().length < 5) {
    this.invalidate('title', 'Title must be at least 5 characters');
  }
  
  next();
});

const Blog = mongoose.model("Blog", blogSchema);
export default Blog;