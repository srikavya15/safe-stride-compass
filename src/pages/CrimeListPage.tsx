
import React from 'react';
import Layout from '@/components/Layout';
import CrimeList from '@/components/CrimeList';

const CrimeListPage: React.FC = () => {
  return (
    <Layout>
      <div className="space-y-6">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">Crime Listing</h1>
          <p className="text-muted-foreground">
            Search and view crime incidents in any location to stay informed about safety concerns.
          </p>
        </div>
        
        <CrimeList />
      </div>
    </Layout>
  );
};

export default CrimeListPage;
