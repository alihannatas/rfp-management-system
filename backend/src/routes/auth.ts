import { Router } from 'express';
import { AuthController } from '../controllers/authController';
import { validate } from '../middleware/validation';
import { createUserSchema, loginSchema, updateUserSchema } from '../utils/validation';
import { authenticateToken } from '../middleware/auth';
// import { authRateLimiter } from '../middleware/rateLimiter';

const router = Router();

// Public routes
router.post('/register', validate(createUserSchema), AuthController.register);
router.post('/login', validate(loginSchema), AuthController.login);

// Protected routes
router.use(authenticateToken);

router.get('/profile', AuthController.getProfile);
router.put('/profile', validate(updateUserSchema), AuthController.updateProfile);
router.put('/change-password', AuthController.changePassword);

export default router;
