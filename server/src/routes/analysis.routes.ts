import express from 'express';
import { calculateAdmixture, calculatePCA, calculateFst } from '../controllers/analysis.controller';

const router = express.Router();

router.post('/admixture', calculateAdmixture);
router.post('/pca', calculatePCA);
router.post('/fst', calculateFst);

export default router; 