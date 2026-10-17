import { Router } from 'express';
import { login, register } from '../controllers/authController.js';
import { authenticate } from '../middlewares/authMiddleware.js';

const router = Router();

router.post('/register', register);
router.post('/login', login);

router.get('/me', authenticate, (req, res) => {
    res.json({ message: 'You are authenticated', user: req.user });
});

export default router;
