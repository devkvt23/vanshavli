import axios from 'axios';

const api = axios.create({
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

// API Service
export const apiService = {
  populations: {
    getAll: async (): Promise<Population[]> => {
      const { data } = await api.get('/populations');
      return data;
    },

    getById: async (id: string): Promise<Population> => {
      const { data } = await api.get(`/populations/${id}`);
      return data;
    },
  },

  analysis: {
    calculateAdmixture: async (input: AdmixtureInput): Promise<AnalysisResult> => {
      const { data } = await api.post('/analysis/admixture', input);
      return data;
    },

    calculatePCA: async (geneticData: Record<string, number>): Promise<PCAResult> => {
      const { data } = await api.post('/analysis/pca', { geneticData });
      return data;
    },

    calculateFst: async (population1: string, population2: string): Promise<FstResult> => {
      const { data } = await api.post('/analysis/fst', { population1, population2 });
      return data;
    },
  },
}; 