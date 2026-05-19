import { Link } from 'react-router-dom';
import { MapPin } from 'lucide-react';
import type { Company } from '../types';
import { CompanyLogo } from './CompanyLogo';
import { StarRating } from './StarRating';
import { formatDate } from '../utils/format';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface CompanyCardProps {
  company: Company;
}

export const CompanyCard = ({ company }: CompanyCardProps) => {
  return (
    <Card className="p-4 sm:p-6 flex flex-col sm:flex-row sm:items-start gap-4 sm:gap-6">
      <div className="flex items-start gap-4 sm:contents">
        <CompanyLogo
          text={company.logoText}
          bgColor={company.logoBgColor}
          imageUrl={company.logoUrl}
          name={company.name}
          size="md"
        />

        <div className="flex-1 min-w-0">
          <h3 className="text-base sm:text-lg font-bold text-ink-900 leading-tight break-words">
            {company.name}
          </h3>

          <p className="text-sm text-ink-500 mt-1 flex items-start gap-1.5">
            <MapPin className="w-4 h-4 mt-0.5 text-ink-500 flex-shrink-0" strokeWidth={2} />
            <span className="line-clamp-2 sm:truncate">{company.address}</span>
          </p>

          <div className="mt-3 flex items-center gap-2 flex-wrap">
            <StarRating value={company.avgRating} showValue size="sm" />
            {company.reviewCount > 0 && (
              <span className="text-sm text-ink-700 font-medium">
                {company.reviewCount} Reviews
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="flex flex-row sm:flex-col items-center sm:items-end justify-between sm:self-stretch gap-3 sm:gap-4 w-full sm:w-auto">
        <span className="text-xs text-ink-500 order-2 sm:order-1">
          Founded on&nbsp;{formatDate(company.foundedOn)}
        </span>
        <Button asChild variant="dark" className="order-1 sm:order-2">
          <Link to={`/companies/${company._id}`}>Detail Review</Link>
        </Button>
      </div>
    </Card>
  );
};
