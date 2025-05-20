import mongoose, { Document, Schema } from 'mongoose';

export interface IPopulation extends Document {
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

const PopulationSchema = new Schema({
  name: { type: String, required: true },
  region: { type: String, required: true },
  timeframe: { type: String, required: true },
  coordinates: {
    latitude: { type: Number, required: true },
    longitude: { type: Number, required: true }
  },
  geneticMarkers: { type: Map, of: Number }
});

export const Population = mongoose.model<IPopulation>('Population', PopulationSchema); 