import { useState, type FormEvent } from 'react';
import { format } from 'date-fns';
import { CalendarIcon } from 'lucide-react';
import { createCompany, type CreateCompanyPayload } from '../api/companies';
import type { Company } from '../types';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { DialogFooter } from '@/components/ui/dialog';
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

export const AddCompanyForm = ({ onCreated, onCancel }: AddCompanyFormProps) => {
  const [form, setForm] = useState<CreateCompanyPayload>(initialState);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const update =
    <K extends keyof CreateCompanyPayload>(key: K) =>
    (value: CreateCompanyPayload[K]) =>
      setForm((p) => ({ ...p, [key]: value }));

  const handleFoundedOnSelect = (date: Date | undefined) => {
    update('foundedOn')(date ? format(date, 'yyyy-MM-dd') : '');
  };

  const isFutureDate = (date: Date) => date > new Date();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!form.name.trim() || !form.address.trim() || !form.city.trim() || !form.foundedOn) {
      setError('Please fill in name, address, city, and founded date.');
      return;
    }

    setSubmitting(true);
    try {
      const created = await createCompany({
        ...form,
        logoText: form.logoText?.trim() || form.name.charAt(0).toUpperCase(),
      });
      onCreated(created);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create company');
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
          <Label htmlFor="company-name">Company Name *</Label>
          <Input
            id="company-name"
            value={form.name}
            onChange={(e) => update('name')(e.target.value)}
            placeholder="e.g., Graffersid Web and App Development"
            required
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="company-city">City *</Label>
            <Input
              id="company-city"
              value={form.city}
              onChange={(e) => update('city')(e.target.value)}
              placeholder="e.g., Indore, Madhya Pradesh, India"
              required
            />
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
                    !form.foundedOn && 'text-ink-500'
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
          </div>
        </div>

        <div>
          <Label htmlFor="company-address">Address *</Label>
          <Input
            id="company-address"
            value={form.address}
            onChange={(e) => update('address')(e.target.value)}
            placeholder="Full street address"
            required
          />
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
            />
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
