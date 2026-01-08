import { Request, Response, NextFunction } from 'express';
import { CatService } from '../services/CatService';
import { CatBreedDto, BreedSearchQueryDto } from '../dtos/CatBreed.dto';
import { logger } from '../utils/logger';

export class CatController {
  private catService: CatService;

  constructor() {
    this.catService = new CatService();
  }

  getAllBreeds = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const breeds = await this.catService.getAllBreeds();
      res.status(200).json({
        success: true,
        breeds,
        count: breeds.length
      });
    } catch (error: any) {
      logger.error(`Error en getAllBreeds: ${error.message}`);
      next(error);
    }
  }

  getBreedById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { breed_id } = req.params;
      
      if (!breed_id) {
        throw new Error('Se requiere el ID de la raza');
      }
      
      const breed = await this.catService.getBreedById(breed_id);

      res.status(200).json({
        success: true,
        breed
      })
      
    } catch (error: any) {
      logger.error(`Error en getBreedById: ${error.message}`);
      next(error);
    }
  }

  searchBreeds = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const queryParams: BreedSearchQueryDto = req.query;
      
      const breeds = await this.catService.searchBreeds(queryParams);
      
      res.status(200).json({
        message:'Búsqueda completada exitosamente', 
        breeds,
        count: breeds.length
      });
    } catch (error: any) {
      logger.error(`Error en searchBreeds: ${error.message}`);
      next(error);
    }
  }
}