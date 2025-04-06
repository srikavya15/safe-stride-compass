
import React from 'react';
import { Search } from 'lucide-react';

interface EmptyStateProps {
  searched: boolean;
  searchTerm?: string;
}

const EmptyState: React.FC<EmptyStateProps> = ({ searched, searchTerm }) => {
  if (searched) {
    return (
      <div className="text-center py-8">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-muted mb-4">
          <Search className="h-6 w-6 text-muted-foreground" />
        </div>
        <h3 className="text-lg font-semibold mb-1">No crimes found</h3>
        <p className="text-muted-foreground">
          No crime data available for "{searchTerm}". Try another location.
        </p>
      </div>
    );
  }

  return (
    <div className="text-center py-12">
      <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-muted mb-4">
        <Search className="h-8 w-8 text-muted-foreground" />
      </div>
      <h3 className="text-lg font-semibold mb-2">Search for crime data</h3>
      <p className="text-muted-foreground max-w-md mx-auto">
        Enter a location to search for crime incidents and get detailed information.
      </p>
    </div>
  );
};

export default EmptyState;
