import { useState, type ChangeEvent, type FormEvent } from 'react';
import { createReview, type CreateReviewPayload } from '../api/reviews';
import type { Review } from '../types';
import { StarRating } from './StarRating';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { DialogFooter } from '@/components/ui/dialog';

interface AddReviewFormProps {
  companyId: string;
  onCreated: (review: Review) => void;
  onCancel: () => void;
}

const initialState: CreateReviewPayload = {
  fullName: '',
  subject: '',
  reviewText: '',
  rating: 0,
};

export const AddReviewForm = ({ companyId, onCreated, onCancel }: AddReviewFormProps) => {
  const [form, setForm] = useState<CreateReviewPayload>(initialState);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  type TextField = 'fullName' | 'subject' | 'reviewText';

  const updateTextField = (key: TextField) => (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm((p) => ({ ...p, [key]: e.target.value }));
  };

  const handleRatingChange = (value: number) => {
    setForm((p) => ({ ...p, rating: value }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!form.fullName.trim() || !form.subject.trim() || !form.reviewText.trim()) {
      setError('Please fill in name, subject and review text.');
      return;
    }
    if (form.rating < 1 || form.rating > 5) {
      setError('Please select a rating from 1 to 5 stars.');
      return;
    }

    setSubmitting(true);
    try {
      const created = await createReview(companyId, form);
      onCreated(created);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create review');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col">
      <div className="p-6 space-y-4">
        {error && (
          <div className="rounded-md bg-red-50 border border-red-200 text-red-700 text-sm px-3 py-2">
            {error}
          </div>
        )}

        <div>
          <Label htmlFor="review-name">Full Name *</Label>
          <Input
            id="review-name"
            value={form.fullName}
            onChange={updateTextField('fullName')}
            required
          />
        </div>

        <div>
          <Label htmlFor="review-subject">Subject *</Label>
          <Input
            id="review-subject"
            value={form.subject}
            onChange={updateTextField('subject')}
            required
          />
        </div>

        <div>
          <Label htmlFor="review-text">Review *</Label>
          <Textarea
            id="review-text"
            className="min-h-[120px]"
            value={form.reviewText}
            onChange={updateTextField('reviewText')}
            placeholder="Share your experience..."
            required
          />
        </div>

        <div>
          <Label asChild>
            <span>Rating *</span>
          </Label>
          <StarRating
            value={form.rating}
            size="lg"
            interactive
            onChange={handleRatingChange}
          />
        </div>
      </div>

      <DialogFooter>
        <Button type="button" variant="outline" onClick={onCancel} disabled={submitting}>
          Cancel
        </Button>
        <Button type="submit" variant="brand" disabled={submitting}>
          {submitting ? 'Posting…' : 'Post Review'}
        </Button>
      </DialogFooter>
    </form>
  );
};
