
import React from 'react';
import Navbar from './Navbar';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <main className="flex-1 container mx-auto px-4 py-8 md:py-12">
        {children}
      </main>
      <footer className="bg-primary py-6">
        <div className="container mx-auto px-4 text-center text-primary-foreground">
          <p>© {new Date().getFullYear()} Safe Stride. All rights reserved.</p>
          <p className="text-sm mt-2">Making communities safer through data</p>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
