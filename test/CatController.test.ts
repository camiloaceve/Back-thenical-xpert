import request from 'supertest';
import app from '../src/app';
import { CatService } from '../src/services/CatService';

jest.mock('../src/services/CatService');

describe('CatController', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /api/cats/breeds', () => {
    it('should return all breeds', async () => {
      const mockBreeds = [
        { id: 'beng', name: 'Bengal', description: 'Gato activo' },
        { id: 'siam', name: 'Siamese', description: 'Gato vocal' }
      ];

      (CatService.prototype.getAllBreeds as jest.Mock).mockResolvedValue(mockBreeds);

      const response = await request(app)
        .get('/api/cats/breeds')
        .expect('Content-Type', /json/)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.breeds).toHaveLength(2);
    });
  });

  describe('GET /api/cats/breeds/:breed_id', () => {
    it('should return a specific breed', async () => {
      const mockBreed = {
        id: 'beng',
        name: 'Bengal',
        description: 'Gato activo'
      };

      (CatService.prototype.getBreedById as jest.Mock).mockResolvedValue(mockBreed);

      const response = await request(app)
        .get('/api/cats/breeds/beng')
        .expect('Content-Type', /json/)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.breed.name).toBe('Bengal');
    });
  });
});