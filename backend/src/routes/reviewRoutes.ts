import { Router } from 'express';
import { likeReview } from '../controllers/reviewController';

const router = Router();

router.post('/:id/like', likeReview);

export default router;
