import mongoose from "mongoose";

const searchHistorySchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  filters: {
    course: {
      type: String,
      default: ''
    },
    specialization: {
      type: String,
      default: ''
    },
    currentCity: {
      type: String,
      default: ''
    },
    preferredCity: {
      type: String,
      default: ''
    },
    examAccepted: {
      type: String,
      default: ''
    },
    educationLevel: {
      type: String,
      default: ''
    },
    educationMode: {
      type: String,
      default: ''
    }
  },
  searchQuery: {
    type: String,
    required: true
  },
  collegesViewed: [{
    collegeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'College',
      required: true
    },
    collegeName: {
      type: String,
      required: true
    },
    collegeImage: {
      type: String,
      default: ''
    },
    location: {
      type: String,
      default: ''
    },
    courses: [{
      type: String
    }],
    minFees: {
      type: Number,
      default: 0
    },
    maxFees: {
      type: Number,
      default: 0
    },
    avgPackage: {
      type: Number,
      default: 0
    },
    firstViewedAt: {
      type: Date,
      default: Date.now
    },
    lastViewedAt: {
      type: Date,
      default: Date.now
    },
    viewCount: {
      type: Number,
      default: 1
    },
    viewedAt: {
      type: Date,
      default: Date.now
    }
  }]
}, {
  timestamps: true
});

// Index for better performance
searchHistorySchema.index({ user: 1, createdAt: -1 });
searchHistorySchema.index({ createdAt: -1 });

const SearchHistory = mongoose.model('SearchHistory', searchHistorySchema);

export default SearchHistory;