import { Request, Response } from 'express';
import mongoose from 'mongoose';
import { Company } from '../models/Company';
import { Review } from '../models/Review';
import { ApiError } from '../middleware/errorHandler';
import { asyncHandler } from '../utils/asyncHandler';

type SortKey = 'name' | 'rating' | 'newest';

const buildSort = (sort?: string): Record<string, 1 | -1> => {
  switch (sort as SortKey) {
    case 'newest':
      return { createdAt: -1 };
    case 'rating':
      return { avgRating: -1 };
    case 'name':
    default:
      return { name: 1 };
  }
};

// GET /api/companies
export const listCompanies = asyncHandler(async (req: Request, res: Response) => {
  const { search, city, sort } = req.query as Record<string, string | undefined>;

  const match: Record<string, unknown> = {};
  if (city && city.trim()) {
    match.city = { $regex: new RegExp(city.trim(), 'i') };
  }
  if (search && search.trim()) {
    const regex = new RegExp(search.trim(), 'i');
    match.$or = [{ name: regex }, { address: regex }, { city: regex }];
  }

  const companies = await Company.aggregate([
    { $match: match },
    {
      $lookup: {
        from: 'reviews',
        localField: '_id',
        foreignField: 'company',
        as: 'reviews',
      },
    },
    {
      $addFields: {
        reviewCount: { $size: '$reviews' },
        avgRating: {
          $cond: [
            { $gt: [{ $size: '$reviews' }, 0] },
            { $round: [{ $avg: '$reviews.rating' }, 1] },
            0,
          ],
        },
      },
    },
    { $project: { reviews: 0 } },
    { $sort: buildSort(sort) },
  ]);

  res.json({ success: true, count: companies.length, data: companies });
});

// GET /api/companies/:id
export const getCompanyById = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new ApiError(400, 'Invalid company id');
  }

  const company = await Company.findById(id).lean();
  if (!company) throw new ApiError(404, 'Company not found');

  const reviewStats = await Review.aggregate([
    { $match: { company: new mongoose.Types.ObjectId(id) } },
    {
      $group: {
        _id: null,
        avgRating: { $avg: '$rating' },
        reviewCount: { $sum: 1 },
      },
    },
  ]);

  const avgRating = reviewStats[0]?.avgRating
    ? Math.round(reviewStats[0].avgRating * 10) / 10
    : 0;
  const reviewCount = reviewStats[0]?.reviewCount ?? 0;

  res.json({
    success: true,
    data: { ...company, avgRating, reviewCount },
  });
});

// POST /api/companies
export const createCompany = asyncHandler(async (req: Request, res: Response) => {
  const { name, description, address, city, foundedOn, logoUrl, logoText, logoBgColor } =
    req.body as Record<string, string | undefined>;

  if (!name || !address || !city || !foundedOn) {
    throw new ApiError(400, 'name, address, city and foundedOn are required');
  }

  const parsedDate = new Date(foundedOn);
  if (Number.isNaN(parsedDate.getTime())) {
    throw new ApiError(400, 'foundedOn must be a valid date');
  }

  const company = await Company.create({
    name,
    description: description ?? '',
    address,
    city,
    foundedOn: parsedDate,
    logoUrl: logoUrl ?? '',
    logoText: logoText ?? name.charAt(0).toUpperCase(),
    logoBgColor: logoBgColor ?? '#1F2A44',
  });

  res.status(201).json({ success: true, data: company });
});
