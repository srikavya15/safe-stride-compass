
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import ApiKeyInput from './ApiKeyInput';
import CrimeSearchForm from './CrimeSearchForm';
import CrimeTable from './CrimeTable';
import CrimePagination from './CrimePagination';
import EmptyState from './EmptyState';
import LoadingState from './LoadingState';
import { CrimeData, searchCrimesByLocation } from '@/lib/crimeApi';

const CrimeListContainer: React.FC = () => {
  const [crimeApiKey, setCrimeApiKey] = useState<string | null>(null);
  const [searchLocation, setSearchLocation] = useState('');
  const [loading, setLoading] = useState(false);
  const [crimeData, setCrimeData] = useState<CrimeData[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const itemsPerPage = 5;

  const searchCrimes = async () => {
    if (!searchLocation || !crimeApiKey) {
      setError('Please enter a location to search');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const data = await searchCrimesByLocation(crimeApiKey, searchLocation);
      setCrimeData(data);
      setTotalPages(Math.ceil(data.length / itemsPerPage));
      setPage(1);
    } catch (error) {
      console.error('Error searching crimes:', error);
      setError('Failed to fetch crime data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    searchCrimes();
  };

  // Get the paginated data
  const getPaginatedData = () => {
    const startIndex = (page - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return crimeData.slice(startIndex, endIndex);
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Crime Listing</CardTitle>
        <CardDescription>
          Search for crimes in your area or any location of interest
        </CardDescription>
      </CardHeader>
      <CardContent>
        {!crimeApiKey ? (
          <ApiKeyInput onApiKeySubmit={setCrimeApiKey} type="crime" />
        ) : (
          <div className="space-y-6">
            <CrimeSearchForm 
              searchLocation={searchLocation} 
              setSearchLocation={setSearchLocation}
              onSearch={handleSearch}
              loading={loading}
            />

            {error && (
              <div className="bg-destructive/10 text-destructive px-4 py-3 rounded-md text-sm">
                {error}
              </div>
            )}

            {loading ? (
              <LoadingState />
            ) : crimeData.length > 0 ? (
              <div className="space-y-4">
                <div className="bg-muted p-3 rounded-md text-sm">
                  Found {crimeData.length} crimes in {searchLocation}
                </div>
                
                <CrimeTable crimes={getPaginatedData()} />
                
                <CrimePagination 
                  currentPage={page} 
                  totalPages={totalPages} 
                  onPageChange={setPage} 
                />
              </div>
            ) : (
              <EmptyState searched={!!searchLocation} searchTerm={searchLocation} />
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default CrimeListContainer;
