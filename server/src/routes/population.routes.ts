import express from 'express';
import { PopulationController } from '../controllers/population.controller';

const router = express.Router();
const controller = new PopulationController();

router.get('/', controller.getAllPopulations);
router.get('/:id', controller.getPopulationById);
router.post('/', controller.createPopulation);
router.put('/:id', controller.updatePopulation);
router.delete('/:id', controller.deletePopulation);

export default router; 