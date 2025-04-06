
import React from 'react';
import Layout from '@/components/Layout';
import RouteDecider from '@/components/RouteDecider';

const RoutePage: React.FC = () => {
  return (
    <Layout>
      <div className="space-y-6">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">Safe Route Planner</h1>
          <p className="text-muted-foreground">
            Find the safest route between two locations based on crime data and community feedback.
          </p>
        </div>
        
        <RouteDecider />
      </div>
    </Layout>
  );
};

export default RoutePage;
