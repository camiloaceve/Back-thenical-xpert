import axios, { AxiosInstance } from 'axios';
import { logger } from '../utils/logger';
import { ICatService } from '../interfaces/ICatService.interface';
import { CatBreedDto, CatImageDto, BreedSearchQueryDto } from '../dtos/CatBreed.dto';
import { environment } from '../config/environment';

export class CatService implements ICatService {
  private axiosInstance: AxiosInstance;

  constructor() {
    this.axiosInstance = axios.create({
      baseURL: environment.catApiUrl,
      headers: {
        'x-api-key': environment.catApiKey,
        'Content-Type': 'application/json'
      },
      timeout: 10000
    });
  }

  async getAllBreeds(): Promise<CatBreedDto[]> {
    try {
      const response = await this.axiosInstance.get<CatBreedDto[]>('/breeds');
      return response.data;
    } catch (error: any) {
      logger.error(`Error obteniendo razas: ${error.message}`);
      throw new Error('Error al obtener las razas de gatos desde The Cat API');
    }
  }

  async getBreedById(breedId: string): Promise<CatBreedDto> {
    try {
      const response = await this.axiosInstance.get<CatBreedDto>(`/breeds/${breedId}`);
      return response.data;
    } catch (error: any) {
      logger.error(`Error obteniendo raza ${breedId}: ${error.message}`);
      if (error.response?.status === 404) {
        throw new Error(`Raza con ID ${breedId} no encontrada`);
      }
      throw new Error('Error al obtener la raza desde The Cat API');
    }
  }

  async searchBreeds(queryParams: BreedSearchQueryDto): Promise<CatBreedDto[]> {
    try {
      const response = await this.axiosInstance.get<CatBreedDto[]>('/breeds/search', {
        params: queryParams
      });
      return response.data;
    } catch (error: any) {
      logger.error(`Error buscando razas: ${error.message}`);
      throw new Error('Error al buscar razas de gatos');
    }
  }

  async getImagesByBreedId(breedId: string, limit: number = 10): Promise<CatImageDto[]> {
    try {
      const response = await this.axiosInstance.get<CatImageDto[]>('/images/search', {
        params: {
          breed_id: breedId,
          limit: limit,
          order: 'DESC'
        }
      });
      return response.data;
    } catch (error: any) {
      logger.error(`Error obteniendo imágenes para raza ${breedId}: ${error.message}`);
      throw new Error(`Error al obtener imágenes para la raza con ID: ${breedId}`);
    }
  }
}