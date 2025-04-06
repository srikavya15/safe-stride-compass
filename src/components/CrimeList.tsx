
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { 
  AlertCircle, 
  Search,
  Calendar, 
  MapPin,
  Clock,
  Info
} from 'lucide-react';
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Skeleton } from '@/components/ui/skeleton';
import ApiKeyInput from './ApiKeyInput';
import { CrimeData, searchCrimesByLocation } from '@/lib/crimeApi';

const CrimeList: React.FC = () => {
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

  // Get severity badge style
  const getSeverityBadge = (severity: string) => {
    switch (severity) {
      case 'high':
        return { color: 'bg-danger hover:bg-danger-hover text-white', icon: <AlertCircle className="h-3 w-3 mr-1" /> };
      case 'medium':
        return { color: 'bg-caution hover:bg-caution-hover text-white', icon: <AlertCircle className="h-3 w-3 mr-1" /> };
      case 'low':
        return { color: 'bg-safe hover:bg-safe-hover text-white', icon: <Info className="h-3 w-3 mr-1" /> };
      default:
        return { color: 'bg-gray-500 text-white', icon: <Info className="h-3 w-3 mr-1" /> };
    }
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
            <form onSubmit={handleSearch} className="flex space-x-2">
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

            {error && (
              <div className="bg-destructive/10 text-destructive px-4 py-3 rounded-md text-sm">
                {error}
              </div>
            )}

            {loading ? (
              // Loading state
              <div className="space-y-4">
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-24 w-full" />
                <Skeleton className="h-24 w-full" />
                <Skeleton className="h-24 w-full" />
              </div>
            ) : crimeData.length > 0 ? (
              // Results
              <div className="space-y-4">
                <div className="bg-muted p-3 rounded-md text-sm">
                  Found {crimeData.length} crimes in {searchLocation}
                </div>
                
                <div className="border rounded-md">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Type</TableHead>
                        <TableHead>Severity</TableHead>
                        <TableHead className="hidden md:table-cell">Date</TableHead>
                        <TableHead className="hidden md:table-cell">Location</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {getPaginatedData().map((crime) => (
                        <TableRow key={crime.id}>
                          <TableCell className="font-medium">{crime.type}</TableCell>
                          <TableCell>
                            <Badge className={getSeverityBadge(crime.severity).color}>
                              <span className="flex items-center">
                                {getSeverityBadge(crime.severity).icon}
                                {crime.severity.charAt(0).toUpperCase() + crime.severity.slice(1)}
                              </span>
                            </Badge>
                          </TableCell>
                          <TableCell className="hidden md:table-cell">
                            {crime.date ? (
                              <div className="flex items-center">
                                <Calendar className="h-3 w-3 mr-1 text-muted-foreground" />
                                {crime.date}
                              </div>
                            ) : 'N/A'}
                          </TableCell>
                          <TableCell className="hidden md:table-cell">
                            {crime.address ? (
                              <div className="flex items-center">
                                <MapPin className="h-3 w-3 mr-1 text-muted-foreground" />
                                {crime.address}
                              </div>
                            ) : 'N/A'}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
                
                {/* Mobile expanded view for selected crimes could go here */}
                
                {totalPages > 1 && (
                  <Pagination>
                    <PaginationContent>
                      <PaginationItem>
                        <PaginationPrevious 
                          onClick={() => setPage(p => Math.max(1, p - 1))}
                          className={page === 1 ? 'pointer-events-none opacity-50' : ''}
                        />
                      </PaginationItem>
                      
                      {Array.from({ length: Math.min(5, totalPages) }).map((_, i) => {
                        let pageToShow = i + 1;
                        
                        // Adjust for when current page is > 3
                        if (page > 3 && totalPages > 5) {
                          if (i === 0) {
                            return (
                              <PaginationItem key={i}>
                                <PaginationLink 
                                  onClick={() => setPage(1)}
                                  isActive={page === 1}
                                >
                                  1
                                </PaginationLink>
                              </PaginationItem>
                            );
                          } else if (i === 1 && page > 3) {
                            return (
                              <PaginationItem key={i}>
                                <PaginationEllipsis />
                              </PaginationItem>
                            );
                          } else {
                            pageToShow = page + i - 2;
                            if (pageToShow > totalPages) return null;
                          }
                        }
                        
                        // Don't show pages beyond the total
                        if (pageToShow > totalPages) return null;
                        
                        return (
                          <PaginationItem key={i}>
                            <PaginationLink 
                              onClick={() => setPage(pageToShow)}
                              isActive={page === pageToShow}
                            >
                              {pageToShow}
                            </PaginationLink>
                          </PaginationItem>
                        );
                      })}
                      
                      {totalPages > 5 && page < totalPages - 2 && (
                        <PaginationItem>
                          <PaginationEllipsis />
                        </PaginationItem>
                      )}
                      
                      {totalPages > 5 && page < totalPages - 1 && (
                        <PaginationItem>
                          <PaginationLink 
                            onClick={() => setPage(totalPages)}
                            isActive={page === totalPages}
                          >
                            {totalPages}
                          </PaginationLink>
                        </PaginationItem>
                      )}
                      
                      <PaginationItem>
                        <PaginationNext 
                          onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                          className={page === totalPages ? 'pointer-events-none opacity-50' : ''}
                        />
                      </PaginationItem>
                    </PaginationContent>
                  </Pagination>
                )}
              </div>
            ) : searchLocation ? (
              // No results after search
              <div className="text-center py-8">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-muted mb-4">
                  <Search className="h-6 w-6 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-semibold mb-1">No crimes found</h3>
                <p className="text-muted-foreground">
                  No crime data available for "{searchLocation}". Try another location.
                </p>
              </div>
            ) : (
              // Initial state
              <div className="text-center py-12">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-muted mb-4">
                  <Search className="h-8 w-8 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Search for crime data</h3>
                <p className="text-muted-foreground max-w-md mx-auto">
                  Enter a location to search for crime incidents and get detailed information.
                </p>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default CrimeList;
