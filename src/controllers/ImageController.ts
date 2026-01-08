import { Request, Response, NextFunction } from 'express';
import { CatService } from '../services/CatService';
import { ImagesQueryDto } from '../dtos/CatBreed.dto';
import { ApiResponse } from '../utils/ApiResponse';
import { logger } from '../utils/logger';

export class ImageController {
  private catService: CatService;

  constructor() {
    this.catService = new CatService();
  }

  getImagesByBreedId = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { breed_id, limit } = req.query as unknown as ImagesQueryDto;
      
      if (!breed_id) {
        throw new Error('Se requiere el parámetro breed_id');
      }
      
      const images = await this.catService.getImagesByBreedId(breed_id, limit || 10);
      
      ApiResponse.success(res, 'Imágenes obtenidas exitosamente', {
        images,
        count: images.length
      });
    } catch (error: any) {
      logger.error(`Error en getImagesByBreedId: ${error.message}`);
      next(error);
    }
  }
}