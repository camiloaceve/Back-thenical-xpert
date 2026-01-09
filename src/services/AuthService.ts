import * as jwt from 'jsonwebtoken';
import { User, IUser } from '../entities/User';
import { IAuthService } from '../interfaces/ICatService.interface';
import { UserResponseDto } from '../dtos/User.dto';
import { logger } from '../utils/logger';
import { environment } from '../config/environment';

export class AuthService implements IAuthService {
  async login(email: string, password: string): Promise<{ token: string; user: UserResponseDto }> {
    try {
      if (!email || !password) {
        const error = new Error('Email y contraseña son requeridos');
        (error as any).statusCode = 400;
        throw error;
      }

      // Buscar usuario por email
      const user = await User.findOne({ email });
      if (!user) {
        const error = new Error('Credenciales inválidas');
        (error as any).statusCode = 401;
        throw error;
      }

      // Verificar contraseña
      const isPasswordValid = await user.comparePassword(password);
      if (!isPasswordValid) {
        const error = new Error('Credenciales inválidas');
        (error as any).statusCode = 401;
        throw error;
      }

      // Generar token JWT
      const token = jwt.sign(
        { userId: user._id, email: user.email },
        environment.jwtSecret,
        { expiresIn: environment.jwtExpiresIn } as jwt.SignOptions
      );

      // Retornar respuesta
      return {
        token,
        user: new UserResponseDto(user)
      };
    } catch (error: any) {
      if (!error.statusCode) {
        error.statusCode = 500;
      }
      logger.error(`Error en login: ${error.message}`, { error });
      throw error;
    }
  }

  async register(username: string, email: string, password: string): Promise<{ token: string; user: UserResponseDto }> {
    try {
      // Validar campos requeridos
      if (!username || !email || !password) {
        const error = new Error('Todos los campos son requeridos');
        (error as any).statusCode = 400;
        throw error;
      }

      // Validar formato de email
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        const error = new Error('El formato del email no es válido');
        (error as any).statusCode = 400;
        throw error;
      }

      // Verificar si el usuario ya existe
      const existingUser = await User.findOne({ 
        $or: [{ email }, { username }] 
      });

      if (existingUser) {
        const error = new Error('El usuario o email ya está registrado');
        (error as any).statusCode = 409; // Conflict
        throw error;
      }

      // Crear nuevo usuario
      const user = new User({
        username,
        email,
        password
      });

      await user.save();

      // Generar token JWT
      const token = jwt.sign(
        { userId: user._id, email: user.email },
        environment.jwtSecret,
        { expiresIn: environment.jwtExpiresIn } as jwt.SignOptions
      );

      // Retornar respuesta
      return {
        token,
        user: new UserResponseDto(user)
      };
    } catch (error: any) {
      if (error.name === 'ValidationError') {
        error.message = Object.values(error.errors).map((e: any) => e.message).join(', ');
        error.statusCode = 400;
      } else if (!error.statusCode) {
        error.statusCode = 500;
      }
      logger.error(`Error en registro: ${error.message}`, { error });
      throw error;
    }
  }

  async validateToken(token: string): Promise<any> {
    try {
      if (!token) {
        const error = new Error('Token no proporcionado');
        (error as any).statusCode = 401;
        throw error;
      }
      
      const decoded = jwt.verify(token, environment.jwtSecret);
      return decoded;
    } catch (error: any) {
      if (error.name === 'TokenExpiredError') {
        error.message = 'Token expirado';
        error.statusCode = 401;
      } else if (error.name === 'JsonWebTokenError') {
        error.message = 'Token inválido';
        error.statusCode = 401;
      } else if (!error.statusCode) {
        error.statusCode = 500;
      }
      
      logger.error(`Error validando token: ${error.message}`);
      throw error;
    }
  }
}