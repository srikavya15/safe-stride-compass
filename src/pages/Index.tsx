
import React from 'react';
import Layout from '@/components/Layout';
import CrimeMap from '@/components/CrimeMap';

const Index: React.FC = () => {
  return (
    <Layout>
      <div className="space-y-6">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">Crime Heat Map</h1>
          <p className="text-muted-foreground">
            View crime hot spots in your area to identify safer routes and make informed decisions.
          </p>
        </div>
        
        <CrimeMap />
      </div>
    </Layout>
  );
};

export default Index;
