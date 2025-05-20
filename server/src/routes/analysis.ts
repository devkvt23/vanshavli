import express from 'express';
import multer from 'multer';
import { analyzeDna } from '../controllers/dnaController';
import { calculateAdmixture, calculatePCA, calculateFst } from '../controllers/analysis.controller';

const router = express.Router();

// Configure multer for file upload
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
  fileFilter: (_req, file, cb) => {
    if (file.mimetype === 'text/plain' || file.mimetype === 'text/csv') {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only .txt and .csv files are allowed'));
    }
  },
});

// Existing routes
router.post('/admixture', calculateAdmixture);
router.post('/pca', calculatePCA);
router.post('/fst', calculateFst);

// New DNA upload route
router.post('/upload-dna', upload.single('dnaFile'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const fileContent = req.file.buffer.toString();
    const result = await analyzeDna(fileContent);
    
    res.json(result);
  } catch (error) {
    console.error('Error processing DNA file:', error);
    res.status(500).json({ error: 'Failed to process DNA file' });
  }
});

export default router; 