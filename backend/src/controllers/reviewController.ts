import { Request, Response } from 'express';
import mongoose from 'mongoose';
import { Review } from '../models/Review';
import { Company } from '../models/Company';
import { ApiError } from '../middleware/errorHandler';
import { asyncHandler } from '../utils/asyncHandler';

type ReviewSort = 'newest' | 'oldest' | 'rating' | 'relevance';

const buildSort = (sort?: string): Record<string, 1 | -1> => {
  switch (sort as ReviewSort) {
    case 'oldest':
      return { createdAt: 1 };
    case 'rating':
      return { rating: -1, createdAt: -1 };
    case 'relevance':
      return { likes: -1, rating: -1 };
    case 'newest':
    default:
      return { createdAt: -1 };
  }
};

// GET /api/companies/:companyId/reviews
export const listReviewsForCompany = asyncHandler(async (req: Request, res: Response) => {
  const { companyId } = req.params;
  const { sort } = req.query as Record<string, string | undefined>;

  if (!mongoose.Types.ObjectId.isValid(companyId)) {
    throw new ApiError(400, 'Invalid company id');
  }

  const companyExists = await Company.exists({ _id: companyId });
  if (!companyExists) throw new ApiError(404, 'Company not found');

  const reviews = await Review.find({ company: companyId })
    .sort(buildSort(sort))
    .lean();

  const avgRating =
    reviews.length > 0
      ? Math.round(
          (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length) * 10
        ) / 10
      : 0;

  res.json({
    success: true,
    count: reviews.length,
    avgRating,
    data: reviews,
  });
});

// POST /api/companies/:companyId/reviews
export const createReview = asyncHandler(async (req: Request, res: Response) => {
  const { companyId } = req.params;
  const { fullName, subject, reviewText, rating, avatarUrl } = req.body as Record<
    string,
    string | number | undefined
  >;

  if (!mongoose.Types.ObjectId.isValid(companyId)) {
    throw new ApiError(400, 'Invalid company id');
  }

  const companyExists = await Company.exists({ _id: companyId });
  if (!companyExists) throw new ApiError(404, 'Company not found');

  if (!fullName || !subject || !reviewText || rating === undefined) {
    throw new ApiError(400, 'fullName, subject, reviewText and rating are required');
  }

  const ratingNum = Number(rating);
  if (Number.isNaN(ratingNum) || ratingNum < 1 || ratingNum > 5) {
    throw new ApiError(400, 'rating must be a number between 1 and 5');
  }

  const review = await Review.create({
    company: companyId,
    fullName: String(fullName),
    subject: String(subject),
    reviewText: String(reviewText),
    rating: ratingNum,
    avatarUrl: avatarUrl ? String(avatarUrl) : '',
  });

  res.status(201).json({ success: true, data: review });
});

// POST /api/reviews/:id/like
export const likeReview = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new ApiError(400, 'Invalid review id');
  }

  const review = await Review.findByIdAndUpdate(
    id,
    { $inc: { likes: 1 } },
    { new: true }
  );
  if (!review) throw new ApiError(404, 'Review not found');

  res.json({ success: true, data: review });
});
