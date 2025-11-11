import mongoose from 'mongoose';

const manageSchema = new mongoose.Schema({
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

const Manageexams = mongoose.model('Manage', manageSchema);

export default Manageexams;