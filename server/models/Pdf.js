import mongoose from 'mongoose';

const PdfSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, default: '' },
  filename: { type: String, required: true },
  filepath: { type: String, required: true },
  totalPages: { type: Number, default: 0 },
  category: { type: String, default: 'General' },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('Pdf', PdfSchema);
