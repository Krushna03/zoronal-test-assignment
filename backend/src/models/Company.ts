import { Schema, model, Document, Types } from 'mongoose';

export interface ICompany extends Document {
  _id: Types.ObjectId;
  name: string;
  description?: string;
  address: string;
  city: string;
  foundedOn: Date;
  logoUrl?: string;
  logoText?: string;
  logoBgColor?: string;
  createdAt: Date;
  updatedAt: Date;
}

const companySchema = new Schema<ICompany>(
  {
    name: { 
      type: String, 
      required: true, 
      trim: true, 
      index: true,
      unique: true,
      lowercase: true,
      minlength: 3,
      maxlength: 100,
    },
    description: { 
      type: String, 
      default: '',
      trim: true,
      maxlength: 1000,
    },
    address: { 
      type: String, 
      required: true, 
      trim: true,
      maxlength: 200,
    },
    city: { 
      type: String, 
      required: true, 
      trim: true,
      index: true,
      maxlength: 100,
    },
    foundedOn: { 
      type: Date, 
      required: true,
    },
    logoUrl: { 
      type: String, 
      default: '',
    },
    logoText: { 
      type: String, 
      default: '',
    },
    logoBgColor: { 
      type: String, 
      default: '#1F2A44',
    },
  },
  { timestamps: true }
);

companySchema.index({ name: 'text', city: 'text', address: 'text' });

export const Company = model<ICompany>('Company', companySchema);
