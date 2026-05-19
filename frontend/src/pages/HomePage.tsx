import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  type ChangeEvent,
  type KeyboardEvent,
} from 'react';
import { useSearchParams } from 'react-router-dom';
import { MapPin, Plus } from 'lucide-react';
import { toast } from 'sonner';
import { fetchCompanies } from '../api/companies';
import type { Company, CompanySort } from '../types';
import { CompanyCard } from '../components/CompanyCard';
import { AddCompanyForm } from '../components/AddCompanyForm';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

export const HomePage = () => {
  const [params] = useSearchParams();
  const search = params.get('search') ?? '';

  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);

  const [city, setCity] = useState('Indore, Madhya Pradesh, India');
  const [cityInput, setCityInput] = useState(city);
  const [sort, setSort] = useState<CompanySort>('name');

  const [addOpen, setAddOpen] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const data = await fetchCompanies({ city, sort, search });
      setCompanies(data);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to load companies';
      toast.error(message);
    } finally {
      setLoading(false);
    }
  }, [city, sort, search]);

  useEffect(() => {
    void load();
  }, [load]);

  const handleFindCompany = () => {
    setCity(cityInput.trim());
  };

  const handleCityChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setCityInput(value);
    if (value.trim() === '') setCity('');
  };

  const handleCityKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') handleFindCompany();
  };

  const handleSortChange = (value: string) => {
    setSort(value as CompanySort);
  };

  const handleOpenAddCompany = () => setAddOpen(true);
  const handleCloseAddCompany = () => setAddOpen(false);

  const handleCompanyCreated = () => {
    setAddOpen(false);
    void load();
  };

  const resultCount = useMemo(() => companies.length, [companies]);

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 pt-6 sm:pt-10 pb-12">
      <section className="pb-6 sm:pb-8 border-b border-ink-200/80">
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4 lg:gap-8">
          <div className="flex flex-col sm:flex-row sm:items-end gap-3 sm:gap-4 w-full lg:w-auto">
            <div className="w-full sm:w-[290px] sm:max-w-full">
              <Label htmlFor="city-input">Select City</Label>
              <div className="relative">
                <Input
                  id="city-input"
                  className="pr-10"
                  value={cityInput}
                  onChange={handleCityChange}
                  onKeyDown={handleCityKeyDown}
                />
                <MapPin
                  className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-brand pointer-events-none"
                  fill="currentColor"
                  strokeWidth={0}
                />
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-end gap-2 sm:gap-3 w-full sm:w-auto">
              <Button
                type="button"
                variant="brand"
                onClick={handleFindCompany}
                className="w-full sm:w-auto"
              >
                Find Company
              </Button>

              <Button
                type="button"
                variant="brand"
                onClick={handleOpenAddCompany}
                className="w-full sm:w-auto"
              >
                <Plus className="w-4 h-4" />
                Add Company
              </Button>
            </div>
          </div>

          <div className="w-full sm:min-w-[160px] sm:w-auto">
            <Label htmlFor="sort-select">Sort:</Label>
            <Select value={sort} onValueChange={handleSortChange}>
              <SelectTrigger id="sort-select" className="w-full sm:min-w-[160px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="name">Name</SelectItem>
                <SelectItem value="rating">Rating</SelectItem>
                <SelectItem value="newest">Newest</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </section>

      <div className="mt-6 sm:mt-8">
        <div className="text-xs text-ink-500 mb-4">
          {search ? (
            <>
              Showing results for <span className="font-semibold text-ink-700">&ldquo;{search}&rdquo;</span> ·{' '}
            </>
          ) : null}
          Result Found: {loading ? '…' : resultCount}
        </div>

        <div className="space-y-4 sm:space-y-5">
          {loading ? (
            Array.from({ length: 3 }).map((_, i: number) => (
              <Card key={i} className="p-5 animate-pulse h-28" />
            ))
          ) : companies.length === 0 ? (
            <Card className="p-6 sm:p-10 text-center text-ink-500">
              No companies found. Try a different city or add one.
            </Card>
          ) : (
            companies.map((c) => <CompanyCard key={c._id} company={c} />)
          )}
        </div>
      </div>

      <Dialog open={addOpen} onOpenChange={setAddOpen}>
        <DialogContent className="max-w-2xl p-0">
          <DialogHeader>
            <DialogTitle>Add Company</DialogTitle>
          </DialogHeader>
          <AddCompanyForm
            onCancel={handleCloseAddCompany}
            onCreated={handleCompanyCreated}
          />
        </DialogContent>
      </Dialog>
    </main>
  );
};
