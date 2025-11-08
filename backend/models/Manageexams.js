import mongoose from 'mongoose';

const courseSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    unique: true
  },
  exams: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Exam'
  }]
}, {
  timestamps: true
});

const Course = mongoose.model('Manage', courseSchema);

export default Course;