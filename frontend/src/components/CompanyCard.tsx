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
    <Card className="p-6 flex items-start gap-6">
      <CompanyLogo
        text={company.logoText}
        bgColor={company.logoBgColor}
        imageUrl={company.logoUrl}
        name={company.name}
        size="md"
      />

      <div className="flex-1 min-w-0">
        <h3 className="text-lg font-bold text-ink-900 leading-tight">
          {company.name}
        </h3>

        <p className="text-sm text-ink-500 mt-1 flex items-start gap-1.5">
          <MapPin className="w-4 h-4 mt-0.5 text-ink-500 flex-shrink-0" strokeWidth={2} />
          <span className="truncate">{company.address}</span>
        </p>

        <div className="mt-3 flex items-center gap-2">
          <StarRating value={company.avgRating} showValue size="sm" />
          {company.reviewCount > 0 && (
            <span className="text-sm text-ink-700 font-medium">
              {company.reviewCount} Reviews
            </span>
          )}
        </div>
      </div>

      <div className="flex flex-col items-end justify-between self-stretch gap-4">
        <span className="text-xs text-ink-500">
          Founded on&nbsp;{formatDate(company.foundedOn)}
        </span>
        <Button asChild variant="dark">
          <Link to={`/companies/${company._id}`}>Detail Review</Link>
        </Button>
      </div>
    </Card>
  );
};
