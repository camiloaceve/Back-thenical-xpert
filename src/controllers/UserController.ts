import { Request, Response, NextFunction } from 'express';
import { AuthService } from '../services/AuthService';
import { LoginDto, RegisterDto, AuthResponseDto } from '../dtos/User.dto';
import { ApiResponse } from '../utils/ApiResponse';
import { logger } from '../utils/logger';
import { validateOrReject } from 'class-validator';
import { plainToInstance } from 'class-transformer';

export class UserController {
  private authService: AuthService;

  constructor() {
    this.authService = new AuthService();
  }

  login = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const loginDto = plainToInstance(LoginDto, req.body);
      await validateOrReject(loginDto);

      const { email, password } = loginDto;
      const result = await this.authService.login(email, password);

      ApiResponse.success(res, 'Inicio de sesión exitoso', new AuthResponseDto({
        success: true,
        token: result.token,
        user: result.user
      }));
    } catch (error: any) {
      logger.error(`Error en login: ${error.message}`);

      if (Array.isArray(error)) {
        return ApiResponse.error(res, 'Error de validación', 400, error);
      }
      next(error);
    }
  }

  register = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      // Validar DTO
      const registerDto = plainToInstance(RegisterDto, req.body);
      await validateOrReject(registerDto);

      const { username, email, password } = registerDto;

      const result = await this.authService.register(username, email, password);

      ApiResponse.success(res, 'Registro exitoso', new AuthResponseDto({
        success: true,
        token: result.token,
        user: result.user,
        message: 'Usuario registrado exitosamente'
      }));
    } catch (error: any) {
      logger.error(`Error en register: ${error.message}`);

      if (Array.isArray(error)) {
        // Errores de validación
        return ApiResponse.error(res, 'Error de validación', 400, error);
      }
      next(error);
    }
  }

  getProfile = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      // El usuario ya está adjunto por el middleware de autenticación
      const user = (req as any).user;

      ApiResponse.success(res, 'Perfil obtenido exitosamente', { user });
    } catch (error: any) {
      logger.error(`Error en getProfile: ${error.message}`);
      next(error);
    }
  }
}