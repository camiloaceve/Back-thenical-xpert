import { Response } from 'express';

export class ApiResponse {
  static success(res: Response, message: string, data: any = null, statusCode: number = 200): void {
    res.status(statusCode).json({
      success: true,
      message,
      data,
      timestamp: new Date().toISOString()
    });
  }

  static error(res: Response, message: string, statusCode: number = 500, error?: any): void {
    const response: any = {
      success: false,
      message,
      timestamp: new Date().toISOString()
    };

    if (error && process.env.NODE_ENV === 'development') {
      response.error = error;
    }

    res.status(statusCode).json(response);
  }

  static paginated(
    res: Response, 
    message: string, 
    data: any[], 
    pagination: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    }
  ): void {
    res.status(200).json({
      success: true,
      message,
      data,
      pagination,
      timestamp: new Date().toISOString()
    });
  }
}