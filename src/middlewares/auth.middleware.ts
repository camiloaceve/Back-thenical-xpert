import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { environment } from '../config/environment';
import { ApiResponse } from '../utils/ApiResponse';

export interface AuthRequest extends Request {
  user?: any;
}

export const authenticateToken = (req: AuthRequest, res: Response, next: NextFunction): void => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  
  if (!token) {
    return ApiResponse.error(res, 'Token de autenticación requerido', 401);
  }
  
  jwt.verify(token, environment.jwtSecret, (err: any, user: any) => {
    if (err) {
      return ApiResponse.error(res, 'Token inválido o expirado', 403);
    }
    req.user = user;
    next();
  });
};