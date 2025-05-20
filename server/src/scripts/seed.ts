import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { populations } from '../data/populations';
import { Population } from '../models/population.model';

dotenv.config();

const seedDatabase = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/vanshavali');
    console.log('Connected to MongoDB');

    // Clear existing populations
    await Population.deleteMany({});
    console.log('Cleared existing populations');

    // Insert new populations
    const result = await Population.insertMany(populations);
    console.log(`Seeded ${result.length} populations`);

    // Log the inserted populations
    console.log('Inserted populations:');
    result.forEach(pop => {
      console.log(`- ${pop.name} (${pop.region})`);
    });

    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase(); 