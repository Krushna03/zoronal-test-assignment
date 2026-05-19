import { useEffect, useState, type ChangeEvent, type FormEvent } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Search, Star } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

export const Navbar = () => {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const [query, setQuery] = useState(params.get('search') ?? '');

  useEffect(() => {
    setQuery(params.get('search') ?? '');
  }, [params]);

  const navigateWithSearch = (value: string) => {
    const next = new URLSearchParams(params);
    const trimmed = value.trim();
    if (trimmed) next.set('search', trimmed);
    else next.delete('search');
    navigate({ pathname: '/', search: next.toString() ? `?${next.toString()}` : '' });
  };

  const handleSearchSubmit = (e: FormEvent) => {
    e.preventDefault();
    navigateWithSearch(query);
  };

  const handleQueryChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    if (value.trim() === '' && params.get('search')) {
      navigateWithSearch('');
    }
  };

  const searchForm = (
    <form onSubmit={handleSearchSubmit} className="w-full" role="search">
      <div className="relative">
        <Input
          type="text"
          placeholder="Search..."
          className="pr-10"
          aria-label="Search companies"
          value={query}
          onChange={handleQueryChange}
        />
        <Button
          type="submit"
          variant="ghost"
          size="icon"
          aria-label="Submit search"
          className="absolute right-1 top-1/2 -translate-y-1/2 text-brand hover:bg-transparent"
        >
          <Search className="w-5 h-5" />
        </Button>
      </div>
    </form>
  );

  return (
    <header className="bg-white border-b border-ink-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="h-16 flex items-center justify-between gap-3">
          <Link
            to="/"
            className="flex items-center gap-2 cursor-pointer flex-shrink-0"
          >
            <div className="w-9 h-9 rounded-full bg-brand-gradient flex items-center justify-center">
              <Star className="w-5 h-5 text-white fill-white" />
            </div>
            <span className="text-base sm:text-lg font-medium tracking-tight">
              Review<span className="text-brand">&amp;</span>
              <span className="font-extrabold">RATE</span>
            </span>
          </Link>

          <div className="flex-1 max-w-md mx-4 hidden sm:block">
            {searchForm}
          </div>

          <nav className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
            <Button
              variant="ghost"
              size="sm"
              className="font-medium text-ink-900 hover:text-brand px-2 sm:px-4"
            >
              SignUp
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="font-medium text-ink-900 hover:text-brand px-2 sm:px-4"
            >
              Login
            </Button>
          </nav>
        </div>

        <div className="pb-3 sm:hidden">{searchForm}</div>
      </div>
    </header>
  );
};
