import mongoose from 'mongoose';

const learningModuleSchema = new mongoose.Schema({
  pdfId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'PDF',
    required: true
  },
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    default: ''
  },
  content: {
    type: String,
    required: true
  },
  pageRange: {
    start: {
      type: Number,
      required: true
    },
    end: {
      type: Number,
      required: true
    }
  },
  order: {
    type: Number,
    required: true
  },
  duration: {
    type: Number,
    default: 0
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model('LearningModule', learningModuleSchema);
