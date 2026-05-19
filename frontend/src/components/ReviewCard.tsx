import { useState } from 'react';
import { Share2, ThumbsUp } from 'lucide-react';
import type { Review } from '../types';
import { StarRating } from './StarRating';
import { formatDate, initials } from '../utils/format';
import { likeReview as likeReviewApi } from '../api/reviews';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';

interface ReviewCardProps {
  review: Review;
}

export const ReviewCard = ({ review }: ReviewCardProps) => {
  const [likes, setLikes] = useState(review.likes);
  const [liked, setLiked] = useState(false);
  const [busy, setBusy] = useState(false);

  const handleLike = async () => {
    if (busy || liked) return;
    setBusy(true);
    try {
      const updated = await likeReviewApi(review._id);
      setLikes(updated.likes);
      setLiked(true);
    } catch {
      // soft-fail; the like button just won't increment
    } finally {
      setBusy(false);
    }
  };

  const handleShare = async () => {
    const url = `${window.location.origin}/companies/${review.company}`;
    const text = `${review.fullName} reviewed: ${review.subject}`;
    if (navigator.share) {
      try {
        await navigator.share({ title: review.subject, text, url });
        return;
      } catch {
        // fall through to clipboard
      }
    }
    try {
      await navigator.clipboard.writeText(`${text} — ${url}`);
    } catch {
      // ignore
    }
  };

  return (
    <article className="py-5 border-t border-ink-200 first:border-t-0">
      <div className="flex items-start gap-4">
        <Avatar>
          {review.avatarUrl && (
            <AvatarImage src={review.avatarUrl} alt={review.fullName} />
          )}
          <AvatarFallback>{initials(review.fullName)}</AvatarFallback>
        </Avatar>

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h4 className="font-bold text-ink-900">{review.fullName}</h4>
              <p className="text-xs text-ink-500 mt-0.5">
                {formatDate(review.createdAt, true)}
              </p>
            </div>
            <StarRating value={review.rating} size="sm" />
          </div>

          {review.subject && (
            <p className="text-sm font-semibold text-ink-700 mt-2">
              {review.subject}
            </p>
          )}

          <p className="text-sm text-ink-700 mt-2 leading-relaxed">
            {review.reviewText}
          </p>

          <div className="mt-3 flex items-center gap-1">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={handleLike}
              disabled={busy}
              aria-label="Like review"
              className={liked ? 'text-brand hover:text-brand' : 'text-ink-500 hover:text-brand'}
            >
              <ThumbsUp
                className="w-4 h-4"
                fill={liked ? 'currentColor' : 'none'}
                strokeWidth={2}
              />
              <span>{likes}</span>
            </Button>

            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={handleShare}
              aria-label="Share review"
              className="text-ink-500 hover:text-brand"
            >
              <Share2 className="w-4 h-4" strokeWidth={2} />
              <span>Share</span>
            </Button>
          </div>
        </div>
      </div>
    </article>
  );
};
