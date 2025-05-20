import axios from 'axios';

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Types
export interface Population {
  _id: string;
  name: string;
  region: string;
  timeframe: string;
  coordinates: {
    latitude: number;
    longitude: number;
  };
  geneticMarkers: {
    [key: string]: number;
  };
}

export interface AnalysisResult {
  geneticDistance: number;
  proportions: Array<{
    source: string;
    percentage: number;
  }>;
}

export interface AdmixtureInput {
  targetPopulation: string;
  sourceDataset: string;
}

export interface PCAResult {
  components: Array<{ x: number; y: number }>;
}

export interface FstResult {
  fstValue: number;
  confidence: number;
}

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

// API Service
export const apiService = {
  populations: {
    getAll: async (): Promise<Population[]> => {
      const { data } = await api.get<Population[]>('/populations');
      return data;
    },

    getById: async (id: string): Promise<Population> => {
      const { data } = await api.get<Population>(`/populations/${id}`);
      return data;
    },
  },

  analysis: {
    calculateAdmixture: async (input: AdmixtureInput): Promise<AnalysisResult> => {
      const { data } = await api.post<AnalysisResult>('/analysis/admixture', input);
      return data;
    },

    calculatePCA: async (geneticData: Record<string, number>): Promise<PCAResult> => {
      const { data } = await api.post<PCAResult>('/analysis/pca', { geneticData });
      return data;
    },

    calculateFst: async (population1: string, population2: string): Promise<FstResult> => {
      const { data } = await api.post<FstResult>('/analysis/fst', { population1, population2 });
      return data;
    },

    uploadDnaFile: async (formData: FormData): Promise<DnaAnalysisResult> => {
      const { data } = await api.post<DnaAnalysisResult>('/analysis/upload-dna', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return data;
    },
  },
}; 