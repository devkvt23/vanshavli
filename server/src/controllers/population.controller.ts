import { Request, Response } from 'express';
import { Population } from '../models/population.model';

export class PopulationController {
  async getAllPopulations(req: Request, res: Response) {
    try {
      const populations = await Population.find();
      res.json(populations);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching populations', error });
    }
  }

  async getPopulationById(req: Request, res: Response) {
    try {
      const population = await Population.findById(req.params.id);
      if (!population) {
        return res.status(404).json({ message: 'Population not found' });
      }
      res.json(population);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching population', error });
    }
  }

  async createPopulation(req: Request, res: Response) {
    try {
      const population = new Population(req.body);
      await population.save();
      res.status(201).json(population);
    } catch (error) {
      res.status(400).json({ message: 'Error creating population', error });
    }
  }

  async updatePopulation(req: Request, res: Response) {
    try {
      const population = await Population.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true }
      );
      if (!population) {
        return res.status(404).json({ message: 'Population not found' });
      }
      res.json(population);
    } catch (error) {
      res.status(400).json({ message: 'Error updating population', error });
    }
  }

  async deletePopulation(req: Request, res: Response) {
    try {
      const population = await Population.findByIdAndDelete(req.params.id);
      if (!population) {
        return res.status(404).json({ message: 'Population not found' });
      }
      res.json({ message: 'Population deleted successfully' });
    } catch (error) {
      res.status(500).json({ message: 'Error deleting population', error });
    }
  }
} 