import { Router } from 'express';
import { createSearch, listSearches, removeSearch } from '../controllers/searchHistoryController.js';
import { authenticate } from '../middlewares/authMiddleware.js';

const router = Router();

router.post('/', authenticate, createSearch);
router.get('/', authenticate, listSearches);
router.delete('/:id', authenticate, removeSearch);

export default router;