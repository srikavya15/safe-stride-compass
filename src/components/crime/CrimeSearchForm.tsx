
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';

interface CrimeSearchFormProps {
  searchLocation: string;
  setSearchLocation: (location: string) => void;
  onSearch: (e: React.FormEvent) => void;
  loading: boolean;
}

const CrimeSearchForm: React.FC<CrimeSearchFormProps> = ({ 
  searchLocation, 
  setSearchLocation, 
  onSearch, 
  loading 
}) => {
  return (
    <form onSubmit={onSearch} className="flex space-x-2">
      <div className="relative flex-1">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          type="text"
          placeholder="Enter location (e.g., New York, Chicago)"
          className="pl-8"
          value={searchLocation}
          onChange={(e) => setSearchLocation(e.target.value)}
          disabled={loading}
        />
      </div>
      <Button type="submit" disabled={loading || !searchLocation}>
        {loading ? 'Searching...' : 'Search'}
      </Button>
    </form>
  );
};

export default CrimeSearchForm;
