import { useCallback, useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ChevronLeft, MapPin, Plus } from 'lucide-react';
import type { Company, Review, ReviewSort } from '../types';
import { fetchCompanyById } from '../api/companies';
import { fetchReviewsByCompany } from '../api/reviews';
import { CompanyLogo } from '../components/CompanyLogo';
import { StarRating } from '../components/StarRating';
import { ReviewCard } from '../components/ReviewCard';
import { AddReviewForm } from '../components/AddReviewForm';
import { formatDate } from '../utils/format';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

export const CompanyDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const [company, setCompany] = useState<Company | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [avgRating, setAvgRating] = useState(0);
  const [sort, setSort] = useState<ReviewSort>('newest');

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [addOpen, setAddOpen] = useState(false);

  const loadCompany = useCallback(async () => {
    if (!id) return;
    try {
      const c = await fetchCompanyById(id);
      setCompany(c);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load company');
    }
  }, [id]);

  const loadReviews = useCallback(async () => {
    if (!id) return;
    try {
      const { reviews: list, avgRating: avg } = await fetchReviewsByCompany(id, sort);
      setReviews(list);
      setAvgRating(avg);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load reviews');
    }
  }, [id, sort]);

  useEffect(() => {
    setLoading(true);
    Promise.all([loadCompany(), loadReviews()]).finally(() => setLoading(false));
  }, [loadCompany, loadReviews]);

  const handleSortChange = (value: string) => {
    setSort(value as ReviewSort);
  };

  const handleOpenAddReview = () => setAddOpen(true);
  const handleCloseAddReview = () => setAddOpen(false);

  const handleReviewCreated = () => {
    setAddOpen(false);
    void loadReviews();
    void loadCompany();
  };

  if (loading && !company) {
    return (
      <main className="max-w-6xl mx-auto px-6 py-8">
        <Card className="p-10 animate-pulse h-48" />
      </main>
    );
  }

  if (error && !company) {
    return (
      <main className="max-w-6xl mx-auto px-6 py-8">
        <div className="rounded-md bg-red-50 border border-red-200 text-red-700 px-4 py-3">
          {error}
        </div>
        <Button asChild variant="outline" className="mt-4">
          <Link to="/">← Back to list</Link>
        </Button>
      </main>
    );
  }

  if (!company) return null;

  return (
    <main className="max-w-6xl mx-auto px-6 py-8">
      <Button
        asChild
        variant="ghost"
        size="sm"
        className="mb-4 -ml-3 text-ink-500 hover:text-brand"
      >
        <Link to="/">
          <ChevronLeft className="w-4 h-4" />
          Back to companies
        </Link>
      </Button>

      <Card className="p-6">
        <div className="flex items-start gap-5 flex-wrap">
          <CompanyLogo
            text={company.logoText}
            bgColor={company.logoBgColor}
            imageUrl={company.logoUrl}
            name={company.name}
            size="md"
          />

          <div className="flex-1 min-w-[260px]">
            <h1 className="text-xl font-bold text-ink-900">{company.name}</h1>
            <p className="text-sm text-ink-500 mt-1 flex items-start gap-1.5">
              <MapPin className="w-4 h-4 mt-0.5 text-ink-500 flex-shrink-0" strokeWidth={2} />
              {company.address}
            </p>

            <div className="mt-3 flex items-center gap-3 flex-wrap">
              <StarRating value={avgRating} showValue size="md" />
              <span className="text-sm text-ink-700 font-medium">
                {reviews.length} Reviews
              </span>
            </div>

            {company.description && (
              <p className="text-sm text-ink-700 mt-3 max-w-2xl">
                {company.description}
              </p>
            )}
          </div>

          <div className="flex flex-col items-end gap-3">
            <span className="text-xs text-ink-500">
              Founded on&nbsp;{formatDate(company.foundedOn)}
            </span>
            <Button
              type="button"
              variant="brand"
              onClick={handleOpenAddReview}
            >
              <Plus className="w-4 h-4" />
              Add Review
            </Button>
          </div>
        </div>

        <hr className="my-6 border-ink-200" />

        <div className="flex items-center justify-between flex-wrap gap-3 mb-2">
          <span className="text-xs text-ink-500">
            Result Found: {reviews.length}
          </span>

          <div className="flex flex-wrap items-center gap-2">
            <label htmlFor="review-sort" className="text-sm text-ink-500">
              Sort by:
            </label>
            <Select value={sort} onValueChange={handleSortChange}>
              <SelectTrigger id="review-sort" className="h-9 min-w-[160px] flex-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Newest</SelectItem>
                <SelectItem value="oldest">Oldest</SelectItem>
                <SelectItem value="rating">Highest Rated</SelectItem>
                <SelectItem value="relevance">Most Relevant</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div>
          {reviews.length === 0 ? (
            <p className="text-center text-ink-500 py-10">
              No reviews yet. Be the first to share your experience.
            </p>
          ) : (
            reviews.map((r) => <ReviewCard key={r._id} review={r} />)
          )}
        </div>
      </Card>

      <Dialog open={addOpen} onOpenChange={setAddOpen}>
        <DialogContent className="max-w-2xl p-0">
          <DialogHeader>
            <DialogTitle>Add Review</DialogTitle>
          </DialogHeader>
          <AddReviewForm
            companyId={company._id}
            onCancel={handleCloseAddReview}
            onCreated={handleReviewCreated}
          />
        </DialogContent>
      </Dialog>
    </main>
  );
};
