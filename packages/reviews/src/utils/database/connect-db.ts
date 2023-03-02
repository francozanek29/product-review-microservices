import mongoose from 'mongoose';
import logger from '../logger';
import * as dotenv from 'dotenv';

const connectDB = async () => {
  try {
    await mongoose.connect( process.env.MONGODBCONNECTIONURL);

    logger.info('Database connected...');
    
  } catch (error: any) {
    logger.error(error.message);
    setTimeout(connectDB, 5000);
  }
};

export default connectDB;
