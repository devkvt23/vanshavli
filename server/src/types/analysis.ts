export interface DnaAnalysisResult {
  ancestryBreakdown: Array<{
    population: string;
    percentage: number;
  }>;
  nearestPopulations: Array<{
    population: string;
    distance: number;
  }>;
  haplogroups: {
    maternal: string;
    paternal?: string;
  };
}

export interface PopulationDistance {
  population: string;
  distance: number;
} 