import { DnaAnalysisResult } from '../types/analysis';
import { Population } from '../models/population.model';

// Helper function to parse DNA file content
const parseDnaFile = (fileContent: string) => {
  const lines = fileContent.split('\n');
  const markers: Record<string, number> = {};
  
  lines.forEach(line => {
    const [marker, value] = line.trim().split(',');
    if (marker && value) {
      markers[marker] = parseFloat(value);
    }
  });
  
  return markers;
};

// Helper function to calculate genetic distance
const calculateGeneticDistance = (
  markers1: Record<string, number>,
  markers2: Record<string, number>
): number => {
  let distance = 0;
  let count = 0;

  for (const marker in markers1) {
    if (markers2[marker] !== undefined) {
      distance += Math.pow(markers1[marker] - markers2[marker], 2);
      count++;
    }
  }

  return count > 0 ? Math.sqrt(distance / count) : Infinity;
};

export const analyzeDna = async (fileContent: string): Promise<DnaAnalysisResult> => {
  try {
    // Parse the uploaded DNA file
    const uploadedMarkers = parseDnaFile(fileContent);

    // Get all populations from the database
    const populations = await Population.find();

    // Calculate distances to all populations
    const populationDistances = populations.map(pop => ({
      population: pop.name,
      distance: calculateGeneticDistance(uploadedMarkers, pop.geneticMarkers)
    }));

    // Sort by distance and get the nearest populations
    const nearestPopulations = populationDistances
      .sort((a, b) => a.distance - b.distance)
      .slice(0, 5);

    // Calculate ancestry breakdown based on the nearest populations
    const totalDistance = nearestPopulations.reduce((sum, pop) => sum + (1 / pop.distance), 0);
    const ancestryBreakdown = nearestPopulations.map(pop => ({
      population: pop.population,
      percentage: ((1 / pop.distance) / totalDistance) * 100
    }));

    // Determine haplogroups (simplified version - in reality this would be more complex)
    const haplogroups = {
      maternal: 'H', // Placeholder - actual implementation would analyze specific markers
      paternal: 'R1b' // Placeholder - actual implementation would analyze Y-chromosome markers
    };

    return {
      ancestryBreakdown,
      nearestPopulations,
      haplogroups
    };
  } catch (error) {
    console.error('Error analyzing DNA:', error);
    throw new Error('Failed to analyze DNA data');
  }
}; 