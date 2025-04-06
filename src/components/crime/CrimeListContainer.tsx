
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import CrimeSearchForm from './CrimeSearchForm';
import CrimeTable from './CrimeTable';
import CrimePagination from './CrimePagination';
import EmptyState from './EmptyState';
import LoadingState from './LoadingState';
import { CrimeData, searchCrimesByLocation, LOCAL_CRIMES } from '@/lib/crimeApi';

const CrimeListContainer: React.FC = () => {
  const [searchLocation, setSearchLocation] = useState('');
  const [loading, setLoading] = useState(false);
  const [crimeData, setCrimeData] = useState<CrimeData[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [hasSearched, setHasSearched] = useState(false);
  const itemsPerPage = 5;

  const searchCrimes = async () => {
    if (!searchLocation) {
      setError('Please enter a location to search');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Use the dummy data directly
      const data = await searchCrimesByLocation("dummy-key", searchLocation);
      setCrimeData(data);
      setTotalPages(Math.ceil(data.length / itemsPerPage));
      setPage(1);
      setHasSearched(true);
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
          ) : hasSearched ? (
            crimeData.length > 0 ? (
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
              <EmptyState searched={true} searchTerm={searchLocation} />
            )
          ) : (
            <div className="space-y-4">
              <div className="p-4 border rounded-md mb-4 bg-muted/30">
                <h3 className="text-lg font-medium mb-2">Sample Crime Data Available</h3>
                <p className="text-muted-foreground mb-3">
                  We have data for these locations and more:
                </p>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
                  {['Mumbai', 'Delhi', 'Bangalore', 'Kolkata', 'Chennai', 'New York', 'London', 'Tokyo'].map((city) => (
                    <div 
                      key={city} 
                      className="text-sm px-3 py-1 bg-primary/10 rounded-md cursor-pointer hover:bg-primary/20"
                      onClick={() => {
                        setSearchLocation(city);
                        setTimeout(() => {
                          searchCrimes();
                        }, 100);
                      }}
                    >
                      {city}
                    </div>
                  ))}
                </div>
              </div>
              <EmptyState searched={false} />
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default CrimeListContainer;
