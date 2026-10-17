import { Router } from 'express';
import { listUsers, removeUser } from '../controllers/userController.js';
import { authenticate, requireAdmin } from '../middlewares/authMiddleware.js';

const router = Router();

router.get('/', authenticate, requireAdmin, listUsers);
router.delete('/:id', authenticate, requireAdmin, removeUser);

export default router;