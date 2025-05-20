import mongoose, { Schema, Document } from 'mongoose';

export interface IPopulation extends Document {
  name: string;
  region: string;
  timeframe: string;
  geneticMarkers: {
    [key: string]: number;
  };
  coordinates: {
    latitude: number;
    longitude: number;
  };
  createdAt: Date;
  updatedAt: Date;
}

const PopulationSchema: Schema = new Schema({
  name: { type: String, required: true, unique: true },
  region: { type: String, required: true },
  timeframe: { type: String, required: true },
  geneticMarkers: { type: Map, of: Number },
  coordinates: {
    latitude: { type: Number, required: true },
    longitude: { type: Number, required: true }
  }
}, {
  timestamps: true
});

export default mongoose.model<IPopulation>('Population', PopulationSchema); 