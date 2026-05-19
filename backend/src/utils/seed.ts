import dotenv from 'dotenv';
import mongoose from 'mongoose';
import { connectDB } from '../config/db';
import { Company } from '../models/Company';
import { Review } from '../models/Review';

dotenv.config();

const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/review_rate';

const companies = [
  {
    name: 'Graffersid Web and App Development',
    description:
      'Graffersid is a leading web and mobile app development company building scalable products for startups.',
    address:
      '816, Shekhar Central, Manorama Ganj, AB road, New Palasia, Indore (M.P.)',
    city: 'Indore, Madhya Pradesh, India',
    foundedOn: new Date('2016-01-01'),
    logoText: 'G',
    logoBgColor: '#0F1B3D',
  },
  {
    name: 'Code Tech Company',
    description: 'A modern software house focused on cutting-edge web platforms.',
    address: '414, Kanha Appartment, Bhawarkua, Indore (M.P.)',
    city: 'Indore, Madhya Pradesh, India',
    foundedOn: new Date('2016-01-01'),
    logoText: '<CT>',
    logoBgColor: '#2E7D32',
  },
  {
    name: 'Innogent Pvt. Ltd.',
    description: 'Product engineering and design studio crafting digital experiences.',
    address:
      '910, Shekhar Central, Manorama Ganj, AB road, New Palasia, Indore (M.P.)',
    city: 'Indore, Madhya Pradesh, India',
    foundedOn: new Date('2016-01-01'),
    logoText: 'I',
    logoBgColor: '#F57C00',
  },
];

const sampleReviewTexts = [
  'Graffersid one of the best Company dolor sit amet, consectetur adipiscing elit. Congue netus feugiat elit suspendisse commodo. Pellentesque risus suspendisse mattis et massa. Ultrices ac at nibh et. Aliquam aliquam ultricies ac pulvinar eleifend duis. Eget congue fringilla quam ut mattis tortor posuere semper ac. Sem egestas vestibulum faucibus montes. Gravida sit non arcu consequat.',
  'Graffersid one of the best Company dolor sit amet, consectetur adipiscing elit. Congue netus feugiat elit suspendisse commodo. Pellentesque risus suspendisse mattis et massa. Ultrices ac at nibh et.',
];

const seedReviewersForFirstCompany = [
  { fullName: 'Jorgue Watson', subject: 'Great experience', rating: 4 },
  { fullName: 'Jenny kole', subject: 'Highly recommended', rating: 4 },
  { fullName: 'Aman Verma', subject: 'Solid team', rating: 5 },
  { fullName: 'Priya Singh', subject: 'Loved the process', rating: 4 },
  { fullName: 'Rahul Mehta', subject: 'Top notch quality', rating: 5 },
];

const run = async (): Promise<void> => {
  await connectDB(MONGO_URI);
  try {
    console.log('clearing collections...');
    await Promise.all([Company.deleteMany({}), Review.deleteMany({})]);

    console.log('inserting companies...');
    const inserted = await Company.insertMany(companies);

    const target = inserted[0];
    if (target) {
      console.log('inserting reviews for first company...');
      await Review.insertMany(
        seedReviewersForFirstCompany.map((r, idx) => ({
          company: target._id,
          fullName: r.fullName,
          subject: r.subject,
          reviewText: sampleReviewTexts[idx % sampleReviewTexts.length],
          rating: r.rating,
          likes: Math.floor(Math.random() * 25),
        }))
      );
    }

    console.log('seed completed successfully.');
  } catch (err) {
    console.error('seed failed:', err);
    process.exitCode = 1;
  } finally {
    await mongoose.disconnect();
  }
};

void run();
