import mongoose from "mongoose";

const draftSchema = new mongoose.Schema({
  title: {
    type: String,
    default: "Untitled Draft"
  },
  content: {
    type: String,
    default: ""
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
    default: "Technology"
  },
  author: {
    type: String,
    default: ""
  },
  isFeatured: {
    type: Boolean,
    default: false
  },
  faqs: [{
    question: String,
    answer: String
  }],
  sessionId: {
    type: String,
    required: true,
    index: true
  },
  lastAutoSaved: {
    type: Date,
    default: Date.now
  },
  isAutoSaved: {
    type: Boolean,
    default: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  }
}, {
  timestamps: true
});

// Auto-delete drafts older than 30 days
draftSchema.index({ createdAt: 1 }, { expireAfterSeconds: 2592000 }); // 30 days

const Draft = mongoose.model("Draft", draftSchema);
export default Draft;