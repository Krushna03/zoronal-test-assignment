import { useState, type ChangeEvent, type FormEvent } from 'react';
import { toast } from 'sonner';
import { createReview, type CreateReviewPayload } from '../api/reviews';
import type { Review } from '../types';
import { StarRating } from './StarRating';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { DialogFooter } from '@/components/ui/dialog';
import { FieldError } from '@/components/ui/field-error';

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

type FieldErrors = Partial<Record<keyof CreateReviewPayload, string>>;

const validate = (form: CreateReviewPayload): FieldErrors => {
  const errors: FieldErrors = {};

  if (!form.fullName.trim()) {
    errors.fullName = 'Full name is required.';
  } else if (form.fullName.trim().length < 2) {
    errors.fullName = 'Name must be at least 2 characters.';
  }

  if (!form.subject.trim()) {
    errors.subject = 'Subject is required.';
  } else if (form.subject.trim().length < 3) {
    errors.subject = 'Subject must be at least 3 characters.';
  }

  if (!form.reviewText.trim()) {
    errors.reviewText = 'Review text is required.';
  } else if (form.reviewText.trim().length < 10) {
    errors.reviewText = 'Review must be at least 10 characters.';
  }

  if (form.rating < 1 || form.rating > 5) {
    errors.rating = 'Please select a rating from 1 to 5 stars.';
  }

  return errors;
};

export const AddReviewForm = ({ companyId, onCreated, onCancel }: AddReviewFormProps) => {
  const [form, setForm] = useState<CreateReviewPayload>(initialState);
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState<FieldErrors>({});

  type TextField = 'fullName' | 'subject' | 'reviewText';

  const clearError = (key: keyof CreateReviewPayload) => {
    setErrors((prev) => {
      if (!prev[key]) return prev;
      const { [key]: _removed, ...rest } = prev;
      return rest;
    });
  };

  const updateTextField =
    (key: TextField) =>
    (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setForm((p) => ({ ...p, [key]: e.target.value }));
      clearError(key);
    };

  const handleRatingChange = (value: number) => {
    setForm((p) => ({ ...p, rating: value }));
    clearError('rating');
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    const validationErrors = validate(form);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      toast.error('Please fix the highlighted fields before posting.');
      return;
    }

    setErrors({});
    setSubmitting(true);
    try {
      const created = await createReview(companyId, form);
      toast.success('Your review has been posted.');
      onCreated(created);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : 'Failed to create review';
      toast.error(message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col" noValidate>
      <div className="p-6 space-y-4">
        <div>
          <Label htmlFor="review-name">Full Name *</Label>
          <Input
            id="review-name"
            value={form.fullName}
            onChange={updateTextField('fullName')}
            error={Boolean(errors.fullName)}
          />
          <FieldError message={errors.fullName} />
        </div>

        <div>
          <Label htmlFor="review-subject">Subject *</Label>
          <Input
            id="review-subject"
            value={form.subject}
            onChange={updateTextField('subject')}
            error={Boolean(errors.subject)}
          />
          <FieldError message={errors.subject} />
        </div>

        <div>
          <Label htmlFor="review-text">Review *</Label>
          <Textarea
            id="review-text"
            className="min-h-[120px]"
            value={form.reviewText}
            onChange={updateTextField('reviewText')}
            placeholder="Share your experience..."
            error={Boolean(errors.reviewText)}
          />
          <FieldError message={errors.reviewText} />
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
          <FieldError message={errors.rating} />
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
