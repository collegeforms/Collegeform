import mongoose from "mongoose";

const blogSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  slug: {
    type: String,
    unique: true,
    lowercase: true,
    sparse: true // Allow null for drafts
  },
  content: {
    type: String,
    required: true
  },
  excerpt: {
    type: String
  },
  image: {
    type: String,
    required: true
  },
  publicId: {
    type: String
  },
  category: {
    type: String,
    required: true
  },
  author: {
    type: String,
    required: true
  },
  isFeatured: {
    type: Boolean,
    default: false
  },
  status: {
    type: String,
    enum: ['draft', 'published'],
    default: 'draft'
  },
  publishedAt: {
    type: Date
  },
  faqs: [{
    question: String,
    answer: String
  }]
}, {
  timestamps: true
});

// Generate slug before saving (only for published blogs)
blogSchema.pre('save', function(next) {
  if (this.status === 'published' && !this.slug) {
    this.slug = this.title
      .toLowerCase()
      .replace(/[^a-zA-Z0-9]/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '');
  }
  
  // Set publishedAt when status changes to published
  if (this.isModified('status') && this.status === 'published' && !this.publishedAt) {
    this.publishedAt = new Date();
  }
  
  // Generate excerpt if not provided
  if (this.content && !this.excerpt) {
    this.excerpt = this.content.substring(0, 160) + (this.content.length > 160 ? "..." : "");
  }
  
  next();
});

const Blog = mongoose.model("Blog", blogSchema);
export default Blog;