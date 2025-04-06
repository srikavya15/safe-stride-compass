
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Shield, MessageCircle, Map, List } from 'lucide-react';

const Navbar: React.FC = () => {
  const location = useLocation();
  
  const navItems = [
    { path: '/', label: 'Crime Map', icon: <Map className="h-5 w-5 mr-2" /> },
    { path: '/route', label: 'Safe Route', icon: <Shield className="h-5 w-5 mr-2" /> },
    { path: '/feedback', label: 'Feedback', icon: <MessageCircle className="h-5 w-5 mr-2" /> },
    { path: '/crimes', label: 'Crime List', icon: <List className="h-5 w-5 mr-2" /> }
  ];

  return (
    <header className="bg-primary shadow-md">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between py-4">
          <Link to="/" className="flex items-center space-x-2">
            <Shield className="h-8 w-8 text-primary-foreground" />
            <span className="text-xl font-bold text-primary-foreground">Safe Stride</span>
          </Link>
          
          <nav className="hidden md:flex space-x-6">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  "flex items-center text-sm font-medium transition-colors",
                  location.pathname === item.path
                    ? "text-primary-foreground"
                    : "text-primary-foreground/70 hover:text-primary-foreground"
                )}
              >
                {item.icon}
                {item.label}
              </Link>
            ))}
          </nav>
          
          <div className="md:hidden flex items-center">
            {/* Mobile menu button would go here */}
          </div>
        </div>
        
        {/* Mobile navigation */}
        <div className="md:hidden flex justify-between pb-4">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                "flex flex-col items-center text-xs font-medium transition-colors p-2",
                location.pathname === item.path
                  ? "text-primary-foreground"
                  : "text-primary-foreground/70 hover:text-primary-foreground"
              )}
            >
              {item.icon}
              <span className="mt-1">{item.label}</span>
            </Link>
          ))}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
