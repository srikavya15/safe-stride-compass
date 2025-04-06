
import React from 'react';
import Layout from '@/components/Layout';
import FeedbackForm from '@/components/FeedbackForm';

const FeedbackPage: React.FC = () => {
  return (
    <Layout>
      <div className="space-y-6">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">Location Safety Feedback</h1>
          <p className="text-muted-foreground">
            Share your experiences about the safety of locations to help others stay safe.
          </p>
        </div>
        
        <FeedbackForm />
      </div>
    </Layout>
  );
};

export default FeedbackPage;
