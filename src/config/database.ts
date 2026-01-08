import { logger } from '../utils/logger';
import mongoose from 'mongoose';

export const connectDB = async (): Promise<void> => {
  try {
    const mongoURI = process.env.MONGODB_URI || '';
    
    await mongoose.connect(mongoURI);
    logger.info('MongoDB conectado exitosamente');
  } catch (error: any) {
    logger.error(`Error conectando a MongoDB: ${error.message}`);
    process.exit(1);
  }
};

export const disconnectDB = async (): Promise<void> => {
  try {
    await mongoose.disconnect();
    logger.info('MongoDB desconectado');
  } catch (error: any) {
    logger.error(`Error desconectando de MongoDB: ${error.message}`);
  }
};