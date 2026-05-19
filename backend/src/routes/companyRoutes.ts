import { Router } from 'express';
import { listCompanies, getCompanyById, createCompany } from '../controllers/companyController';
import { listReviewsForCompany, createReview } from '../controllers/reviewController';

const router = Router();

router.route('/').get(listCompanies).post(createCompany);

router.route('/:id').get(getCompanyById);

router.route('/:companyId/reviews').get(listReviewsForCompany).post(createReview);

export default router;
