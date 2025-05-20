import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI as string)
  .then(() => console.log('MongoDB connected successfully'))
  .catch((err) => console.error('MongoDB connection error:', err));

// Routes will be imported here
import populationRoutes from './routes/population.routes';
import analysisRoutes from './routes/analysis.routes';

app.use('/api/populations', populationRoutes);
app.use('/api/analysis', analysisRoutes);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
