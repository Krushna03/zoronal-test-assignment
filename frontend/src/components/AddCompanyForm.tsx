import { useState, type FormEvent } from 'react';
import { format } from 'date-fns';
import { CalendarIcon } from 'lucide-react';
import { toast } from 'sonner';
import { createCompany, type CreateCompanyPayload } from '../api/companies';
import type { Company } from '../types';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { DialogFooter } from '@/components/ui/dialog';
import { FieldError } from '@/components/ui/field-error';
import { cn } from '@/lib/utils';

interface AddCompanyFormProps {
  onCreated: (company: Company) => void;
  onCancel: () => void;
}

const initialState: CreateCompanyPayload = {
  name: '',
  description: '',
  address: '',
  city: '',
  foundedOn: '',
  logoText: '',
  logoBgColor: '#1F2A44',
};

type FieldErrors = Partial<Record<keyof CreateCompanyPayload, string>>;

const validate = (form: CreateCompanyPayload): FieldErrors => {
  const errors: FieldErrors = {};

  if (!form.name.trim()) {
    errors.name = 'Company name is required.';
  } else if (form.name.trim().length < 2) {
    errors.name = 'Name must be at least 2 characters.';
  }

  if (!form.city.trim()) {
    errors.city = 'City is required.';
  }

  if (!form.address.trim()) {
    errors.address = 'Address is required.';
  } else if (form.address.trim().length < 5) {
    errors.address = 'Please enter a full address.';
  }

  if (!form.foundedOn) {
    errors.foundedOn = 'Please pick a founded date.';
  } else if (new Date(form.foundedOn) > new Date()) {
    errors.foundedOn = 'Founded date cannot be in the future.';
  }

  if (form.logoText && form.logoText.length > 4) {
    errors.logoText = 'Logo text must be 4 characters or less.';
  }

  return errors;
};

export const AddCompanyForm = ({ onCreated, onCancel }: AddCompanyFormProps) => {
  const [form, setForm] = useState<CreateCompanyPayload>(initialState);
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState<FieldErrors>({});

  const update =
    <K extends keyof CreateCompanyPayload>(key: K) =>
    (value: CreateCompanyPayload[K]) => {
      setForm((p) => ({ ...p, [key]: value }));
      setErrors((prev) => {
        if (!prev[key]) return prev;
        const { [key]: _removed, ...rest } = prev;
        return rest;
      });
    };

  const handleFoundedOnSelect = (date: Date | undefined) => {
    update('foundedOn')(date ? format(date, 'yyyy-MM-dd') : '');
  };

  const isFutureDate = (date: Date) => date > new Date();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    const validationErrors = validate(form);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      toast.error('Please fix the highlighted fields before saving.');
      return;
    }

    setErrors({});
    setSubmitting(true);
    try {
      const created = await createCompany({
        ...form,
        logoText: form.logoText?.trim() || form.name.charAt(0).toUpperCase(),
      });
      toast.success(`${created.name} added successfully.`);
      onCreated(created);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : 'Failed to create company';
      toast.error(message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col flex-1 min-h-0" noValidate>
      <div className="p-4 sm:p-6 space-y-4 overflow-y-auto flex-1 min-h-0">
        <div>
          <Label htmlFor="company-name">Company Name *</Label>
          <Input
            id="company-name"
            value={form.name}
            onChange={(e) => update('name')(e.target.value)}
            placeholder="e.g., Graffersid Web and App Development"
            error={Boolean(errors.name)}
            aria-describedby={errors.name ? 'company-name-error' : undefined}
          />
          <FieldError message={errors.name} />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="company-city">City *</Label>
            <Input
              id="company-city"
              value={form.city}
              onChange={(e) => update('city')(e.target.value)}
              placeholder="e.g., Indore, Madhya Pradesh, India"
              error={Boolean(errors.city)}
              aria-describedby={errors.city ? 'company-city-error' : undefined}
            />
            <FieldError message={errors.city} />
          </div>
          <div className="flex flex-col">
            <Label htmlFor="company-founded">Founded On *</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  id="company-founded"
                  type="button"
                  variant="outline"
                  className={cn(
                    'h-10 justify-start font-normal',
                    !form.foundedOn && 'text-ink-500',
                    errors.foundedOn &&
                      'border-red-500 focus-visible:border-red-500 focus-visible:ring-red-500/20'
                  )}
                >
                  <CalendarIcon className="w-4 h-4" />
                  {form.foundedOn
                    ? format(new Date(form.foundedOn), 'PPP')
                    : 'Pick a date'}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={form.foundedOn ? new Date(form.foundedOn) : undefined}
                  onSelect={handleFoundedOnSelect}
                  disabled={isFutureDate}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
            <FieldError message={errors.foundedOn} />
          </div>
        </div>

        <div>
          <Label htmlFor="company-address">Address *</Label>
          <Input
            id="company-address"
            value={form.address}
            onChange={(e) => update('address')(e.target.value)}
            placeholder="Full street address"
            error={Boolean(errors.address)}
            aria-describedby={errors.address ? 'company-address-error' : undefined}
          />
          <FieldError message={errors.address} />
        </div>

        <div>
          <Label htmlFor="company-description">Description</Label>
          <Textarea
            id="company-description"
            value={form.description}
            onChange={(e) => update('description')(e.target.value)}
            placeholder="Tell us about the company"
          />
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div className="col-span-2">
            <Label htmlFor="company-logo-text">Logo Text</Label>
            <Input
              id="company-logo-text"
              maxLength={4}
              value={form.logoText}
              onChange={(e) => update('logoText')(e.target.value)}
              placeholder="G"
              error={Boolean(errors.logoText)}
            />
            <FieldError message={errors.logoText} />
          </div>
          <div>
            <Label htmlFor="company-logo-color">Logo Color</Label>
            <Input
              id="company-logo-color"
              type="color"
              className="h-10 p-1"
              value={form.logoBgColor}
              onChange={(e) => update('logoBgColor')(e.target.value)}
            />
          </div>
        </div>
      </div>

      <DialogFooter>
        <Button type="button" variant="outline" onClick={onCancel} disabled={submitting}>
          Cancel
        </Button>
        <Button type="submit" variant="brand" disabled={submitting}>
          {submitting ? 'Saving…' : 'Save Company'}
        </Button>
      </DialogFooter>
    </form>
  );
};
