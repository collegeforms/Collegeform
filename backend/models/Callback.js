import mongoose from "mongoose";

const callbackSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  mobile: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    trim: true,
    lowercase: true
  },
  course: {
    type: String,
    required: true,
    trim: true
  },
 
  status: {
    type: String,
    enum: ["pending", "contacted", "completed"],
    default: "pending"
  }
}, {
  timestamps: true
});

const Callback = mongoose.model("Callback", callbackSchema);

export default Callback;