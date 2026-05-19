export interface Company {
  _id: string;
  name: string;
  description?: string;
  address: string;
  city: string;
  foundedOn: string;
  logoUrl?: string;
  logoText?: string;
  logoBgColor?: string;
  avgRating: number;
  reviewCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface Review {
  _id: string;
  company: string;
  fullName: string;
  subject: string;
  reviewText: string;
  rating: number;
  likes: number;
  avatarUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ApiListResponse<T> {
  success: boolean;
  count: number;
  data: T[];
  avgRating?: number;
}

export interface ApiSingleResponse<T> {
  success: boolean;
  data: T;
}

export type CompanySort = 'name' | 'rating' | 'newest';
export type ReviewSort = 'newest' | 'oldest' | 'rating' | 'relevance';
