import mongoose from 'mongoose';

const examEnquirySchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
    minlength: [2, 'Name must be at least 2 characters long'],
    maxlength: [100, 'Name cannot exceed 100 characters']
  },
  phone: {
    type: String,
    required: [true, 'Phone number is required'],
    trim: true,
    match: [/^[0-9]{10}$/, 'Please enter a valid 10-digit phone number']
  },
  inquiry: {
    type: String,
    required: [true, 'Inquiry message is required'],
    trim: true,
    minlength: [10, 'Inquiry must be at least 10 characters long'],
    maxlength: [1000, 'Inquiry cannot exceed 1000 characters']
  },
  category: {
    type: String,
    default: 'Competitive Exams',
    trim: true
  },
  examName: {
    type: String,
    required: [true, 'Exam name is required'],
    trim: true
  },
  courseName: {
    type: String,
    required: [true, 'Course name is required'],
    trim: true
  },
  agreeToContact: {
    type: Boolean,
    required: true,
    validate: {
      validator: function(v) {
        return v === true;
      },
      message: 'You must agree to be contacted'
    }
  },
  status: {
    type: String,
    enum: ['pending', 'contacted', 'resolved', 'cancelled'],
    default: 'pending'
  },
  source: {
    type: String,
    default: 'website'
  }
}, {
  timestamps: true
});

// Index for better query performance
examEnquirySchema.index({ createdAt: -1 });
examEnquirySchema.index({ status: 1 });
examEnquirySchema.index({ phone: 1 });

const ExamEnquiry = mongoose.model('ExamEnquiry', examEnquirySchema);

export default ExamEnquiry;