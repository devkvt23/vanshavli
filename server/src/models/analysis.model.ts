import mongoose, { Schema, Document } from 'mongoose';

export interface IAnalysis extends Document {
  userId: string;
  type: 'admixture' | 'pca' | 'fst';
  input: {
    targetPopulation?: string;
    sourceDataset?: string;
    population1?: string;
    population2?: string;
    geneticData?: Record<string, number>;
  };
  results: {
    geneticDistance?: number;
    proportions?: Array<{ source: string; percentage: number }>;
    components?: Array<{ x: number; y: number }>;
    fstValue?: number;
    confidence?: number;
  };
  createdAt: Date;
}

const AnalysisSchema: Schema = new Schema({
  userId: { type: String, required: true },
  type: { 
    type: String, 
    required: true,
    enum: ['admixture', 'pca', 'fst']
  },
  input: {
    targetPopulation: String,
    sourceDataset: String,
    population1: String,
    population2: String,
    geneticData: { type: Map, of: Number }
  },
  results: {
    geneticDistance: Number,
    proportions: [{
      source: String,
      percentage: Number
    }],
    components: [{
      x: Number,
      y: Number
    }],
    fstValue: Number,
    confidence: Number
  }
}, {
  timestamps: true
});

export default mongoose.model<IAnalysis>('Analysis', AnalysisSchema); 