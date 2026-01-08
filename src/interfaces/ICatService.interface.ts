import { UserResponseDto } from '@dtos/User.dto';
import { CatBreedDto, CatImageDto, BreedSearchQueryDto } from '../dtos/CatBreed.dto';

export interface ICatService {
  getAllBreeds(): Promise<CatBreedDto[]>;
  getBreedById(breedId: string): Promise<CatBreedDto>;
  searchBreeds(queryParams: BreedSearchQueryDto): Promise<CatBreedDto[]>;
  getImagesByBreedId(breedId: string, limit?: number): Promise<CatImageDto[]>;
}

export interface IAuthService {
  login(email: string, password: string): Promise<{ token: string; user: UserResponseDto }>;
  register(username: string, email: string, password: string): Promise<{ token: string; user: UserResponseDto }>;
  validateToken(token: string): Promise<any>;
}