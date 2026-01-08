import 'reflect-metadata';
import express, { Application, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import compression from 'compression';
import dotenv from 'dotenv';

import { connectDB } from './config/database';
import { environment } from './config/environment';
import { logger, stream } from './utils/logger';
import { errorHandler, AppError } from './middlewares/error.middleware';

// Importar rutas
import catRoutes from './routes/cat.routes';
import imageRoutes from './routes/image.routes';
import userRoutes from './routes/user.routes';

// Cargar variables de entorno
dotenv.config();

class App {
  public app: Application;

  constructor() {
    this.app = express();
    this.initializeMiddlewares();
    this.initializeRoutes();
    this.initializeErrorHandling();
    this.connectDatabase();
  }

  private initializeMiddlewares(): void {
    // Seguridad
    this.app.use(helmet());
    this.app.use(cors({
      origin: '*',
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
      allowedHeaders: [
        'Content-Type',
        'Authorization',
        'X-Requested-With',
        'Accept',
        'Origin',
        'Access-Control-Request-Method',
        'Access-Control-Request-Headers',
        'Cache-Control',
        'Pragma',
        'Expires'
      ],
    }));

    // Logging
    this.app.use(morgan('combined', { stream }));

    // Body parsing
    this.app.use(express.json({ limit: '10mb' }));
    this.app.use(express.urlencoded({ extended: true, limit: '10mb' }));

    // Compresión
    this.app.use(compression());
  }

  private initializeRoutes(): void {
    // Health check
    this.app.get('/health', (req: Request, res: Response) => {
      res.status(200).json({
        status: 'OK',
        timestamp: new Date().toISOString(),
        uptime: process.uptime()
      });
    });

    // API routes
    this.app.use('/api/cats', catRoutes);
    this.app.use('/api/images', imageRoutes);
    this.app.use('/api/users', userRoutes);

    // 404 handler - using a catch-all route
    this.app.use((req: Request, res: Response, next) => {
      next(new AppError(`Ruta ${req.originalUrl} no encontrada`, 404));
    });
  }

  private initializeErrorHandling(): void {
    // Error handling debe ser el último middleware
    this.app.use((err: any, req: Request, res: Response, next: NextFunction) => {
      if (res.headersSent) {
        return next(err);
      }
      errorHandler(err, req, res, next);
    });
  }

  private async connectDatabase(): Promise<void> {
    await connectDB();
  }

  public listen(): void {
    this.app.listen(environment.port, () => {
      logger.info(`🚀 Servidor ejecutándose en puerto ${environment.port}`);
      logger.info(`📁 Entorno: ${environment.nodeEnv}`);
      logger.info(`🔗 MongoDB: ${environment.mongodbUri ? 'Conectado' : 'No configurado'}`);
    });
  }
}

// Inicializar aplicación
const app = new App();
app.listen();

// Manejar excepciones no capturadas
process.on('unhandledRejection', (reason: Error) => {
  logger.error('Unhandled Rejection:', reason);
  throw reason;
});

process.on('uncaughtException', (error: Error) => {
  logger.error('Uncaught Exception:', error);
  process.exit(1);
});

export default app.app;