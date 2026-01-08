import { Router } from 'express';
import { UserController } from '../controllers/UserController';
import { authenticateToken } from '../middlewares/auth.middleware';

const router = Router();
const userController = new UserController();

// Rutas públicas
router.post('/login', userController.login);
router.post('/register', userController.register);

// Rutas protegidas
router.get('/profile', authenticateToken, userController.getProfile);

export default router;