import { Router } from 'express';
import { CatController } from '../controllers/CatController';
import { validateRequest } from '../middlewares/validation.middleware';
import { query } from 'express-validator';

const router = Router();
const catController = new CatController();

router.get('/breeds', catController.getAllBreeds);

router.get('/breeds/:breed_id', catController.getBreedById);

router.get('/breeds/search', [
  query('q').optional().isString().trim(),
  query('attach_breed').optional().isInt({ min: 0, max: 1 }),
  query('page').optional().isInt({ min: 1 }),
  query('limit').optional().isInt({ min: 1, max: 100 })
], validateRequest, catController.searchBreeds);

export default router;