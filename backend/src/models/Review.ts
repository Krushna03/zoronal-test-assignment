import { Schema, model, Document, Types } from 'mongoose';

export interface IReview extends Document {
  _id: Types.ObjectId;
  company: Types.ObjectId;
  fullName: string;
  subject: string;
  reviewText: string;
  rating: number;
  likes: number;
  avatarUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}

const reviewSchema = new Schema<IReview>(
  {
    company: {
      type: Schema.Types.ObjectId,
      ref: 'Company',
      required: true,
      index: true,
    },
    fullName: { 
      type: String, 
      required: true, 
      trim: true,
      minlength: 3,
      maxlength: 100,
    },
    subject: { 
      type: String, 
      required: true, 
      trim: true,
      minlength: 3,
      maxlength: 100,
    },
    reviewText: { 
      type: String, 
      required: true, 
      trim: true,
      minlength: 10,
      maxlength: 1000,
    },
    rating: { 
      type: Number, 
      required: true, 
      min: 1, 
      max: 5,
      validate: {
        validator: function(value: number) {
          return value >= 1 && value <= 5;
        },
        message: 'Rating must be between 1 and 5',
      },
    },
    likes: { type: Number, default: 0,
      validate: {
        validator: function(value: number) {
          return value >= 0 && Number.isInteger(value);
        },
        message: 'Likes must be a non-negative integer',
      },
    },
    avatarUrl: { 
      type: String, 
      default: '',
    },
  },
  { timestamps: true }
);

reviewSchema.index({ company: 1, createdAt: -1 });
reviewSchema.index({ company: 1, rating: -1, createdAt: -1 });
reviewSchema.index({ company: 1, likes: -1, rating: -1, createdAt: -1 });
reviewSchema.index({ company: 1, fullName: 'text', subject: 'text', reviewText: 'text' });

export const Review = model<IReview>('Review', reviewSchema);