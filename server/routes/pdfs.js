import express from 'express';
import multer from 'multer';
import fs from 'fs';
import pdfParse from 'pdf-parse';
import path from 'path';
import Pdf from '../models/Pdf.js';
import authMiddleware from '../middleware/auth.js';
import { fileURLToPath } from 'url';

const router = express.Router();

// Ensure uploads folder exists
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const uploadsDir = path.join(__dirname, '..', 'uploads');
if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadsDir),
  filename: (req, file, cb) => {
    const safe = Date.now() + '-' + file.originalname.replace(/\s+/g, '-');
    cb(null, safe);
  }
});
const upload = multer({ storage, fileFilter: (req, file, cb) => {
  if (!file.originalname.match(/\.(pdf)$/i)) return cb(new Error('Only PDF files allowed'));
  cb(null, true);
}});

// List PDFs
router.get('/', authMiddleware, async (req, res) => {
  try {
    const pdfs = await Pdf.find().sort({ createdAt: -1 }).populate('createdBy', 'name email');
    res.json(pdfs);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch PDFs' });
  }
});

// Upload PDF
router.post('/', authMiddleware, upload.single('file'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'No file uploaded' });

    const filePath = req.file.path;
    const dataBuffer = fs.readFileSync(filePath);
    const pdfData = await pdfParse(dataBuffer);

    const title = req.body.title || req.file.originalname;
    const description = req.body.description || '';
    const category = req.body.category || 'General';
    const totalPages = pdfData.numpages || 0;

    const pdfDoc = await Pdf.create({
      title,
      description,
      filename: req.file.filename,
      filepath: filePath,
      totalPages,
      category,
      createdBy: req.user._id
    });

    res.json(pdfDoc);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to upload PDF' });
  }
});

// Serve a PDF file (download/view)
router.get('/download/:id', authMiddleware, async (req, res) => {
  try {
    const pdf = await Pdf.findById(req.params.id);
    if (!pdf) return res.status(404).json({ error: 'PDF not found' });
    return res.sendFile(path.resolve(pdf.filepath));
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to download PDF' });
  }
});

export default router;
