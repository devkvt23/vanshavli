import express from 'express';
import { AnalysisController } from '../controllers/analysis.controller';

const router = express.Router();
const controller = new AnalysisController();

router.post('/admixture', controller.calculateAdmixture);
router.post('/pca', controller.calculatePCA);
router.post('/fst', controller.calculateFst);

export default router; 