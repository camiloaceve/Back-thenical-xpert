import { Request, Response, NextFunction } from 'express';
import { logger } from '../utils/logger';
import { ApiResponse } from '../utils/ApiResponse';

export class AppError extends Error {
  statusCode: number;
  isOperational: boolean;

  constructor(message: string, statusCode: number = 500, isOperational: boolean = true) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    Error.captureStackTrace(this, this.constructor);
  }
}

export const errorHandler = (
  error: Error | AppError,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const statusCode = (error as AppError).statusCode || 500;
  const message = error.message || 'Error interno del servidor';
  const isOperational = (error as AppError).isOperational !== false;

  // Log error
  if (statusCode >= 500) {
    logger.error(`${statusCode} - ${message}`, {
      path: req.path,
      method: req.method,
      ip: req.ip,
      stack: error.stack
    });
  } else if (!isOperational) {
    logger.warn(`${statusCode} - ${message}`);
  }

  // Send response
  ApiResponse.error(res, message, statusCode, process.env.NODE_ENV === 'development' ? error.stack : undefined);
};