import { Router } from 'express';
import { updateProfile } from '../controllers/userController.js';
import { authenticate } from '../middlewares/authMiddleware.js';

const router = Router();

router.put('/profile', authenticate, updateProfile);

export default router;