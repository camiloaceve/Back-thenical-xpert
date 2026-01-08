import { Router } from 'express';
import { ImageController } from '../controllers/ImageController';
import { validateRequest } from '../middlewares/validation.middleware';
import { query } from 'express-validator';

const router = Router();
const imageController = new ImageController();

router.get('/imagesbybreedid', [
  query('breed_id').notEmpty().isString().trim(),
  query('limit').optional().isInt({ min: 1, max: 50 })
], validateRequest, imageController.getImagesByBreedId);

export default router;