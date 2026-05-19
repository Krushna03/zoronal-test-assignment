import { http } from './axios';
import type {
  ApiListResponse,
  ApiSingleResponse,
  Review,
  ReviewSort,
} from '../types';

export interface CreateReviewPayload {
  fullName: string;
  subject: string;
  reviewText: string;
  rating: number;
  avatarUrl?: string;
}

export interface ReviewsResponse {
  reviews: Review[];
  avgRating: number;
  count: number;
}

export const fetchReviewsByCompany = async (
  companyId: string,
  sort: ReviewSort = 'newest'
): Promise<ReviewsResponse> => {
  const { data } = await http.get<ApiListResponse<Review>>(
    `/companies/${companyId}/reviews`,
    { params: { sort } }
  );
  return {
    reviews: data.data,
    avgRating: data.avgRating ?? 0,
    count: data.count,
  };
};

export const createReview = async (
  companyId: string,
  payload: CreateReviewPayload
): Promise<Review> => {
  const { data } = await http.post<ApiSingleResponse<Review>>(
    `/companies/${companyId}/reviews`,
    payload
  );
  return data.data;
};

export const likeReview = async (reviewId: string): Promise<Review> => {
  const { data } = await http.post<ApiSingleResponse<Review>>(
    `/reviews/${reviewId}/like`
  );
  return data.data;
};
