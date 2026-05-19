import mongoose from 'mongoose';

export const connectDB = async (mongoUri: string): Promise<void> => {
  try {
    await mongoose.connect(mongoUri);
    console.log('[db] MongoDB connected');
  } catch (error) {
    console.error('[db] MongoDB connection error:', error);
    process.exit(1);
  }
};
