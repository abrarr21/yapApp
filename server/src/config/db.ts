import mongoose from 'mongoose';
import env from './config.js';
import { logger } from './logger.js';

const connectDB = async () => {
  await mongoose.connect(env.MONGODB_URI);
  logger.info(`Connected to Mongodb`);
};

export default connectDB;
