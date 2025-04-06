
// This file would contain functions to interact with a real crime API
// For now, we're using mock data for demonstration purposes

import { toast } from 'sonner';

// Types
export interface CrimeData {
  id: number;
  lat: number;
  lng: number;
  type: string;
  severity: 'low' | 'medium' | 'high';
  date?: string;
  description?: string;
  address?: string;
}

interface Location {
  lat: number;
  lng: number;
}

// Mock data to simulate API responses
const MOCK_CRIMES: CrimeData[] = [
  // New York
  { id: 1, lat: 40.7128, lng: -74.006, type: 'Theft', severity: 'medium', date: '2025-04-02', description: 'Personal items stolen from vehicle', address: '123 Broadway, New York' },
  { id: 2, lat: 40.7138, lng: -74.008, type: 'Assault', severity: 'high', date: '2025-04-01', description: 'Physical altercation between individuals', address: '456 5th Ave, New York' },
  { id: 3, lat: 40.7118, lng: -74.004, type: 'Robbery', severity: 'high', date: '2025-04-03', description: 'Armed robbery at convenience store', address: '789 Park Ave, New York' },
  { id: 4, lat: 40.7148, lng: -74.003, type: 'Vandalism', severity: 'low', date: '2025-04-02', description: 'Graffiti on public property', address: '321 Madison Ave, New York' },
  { id: 5, lat: 40.7158, lng: -74.009, type: 'Theft', severity: 'medium', date: '2025-04-03', description: 'Bicycle stolen from rack', address: '654 Lexington Ave, New York' },
  { id: 6, lat: 40.7168, lng: -74.007, type: 'Harassment', severity: 'low', date: '2025-04-01', description: 'Verbal harassment reported', address: '987 7th Ave, New York' },
  { id: 7, lat: 40.7178, lng: -74.005, type: 'Burglary', severity: 'high', date: '2025-04-02', description: 'Residential break-in', address: '159 East 32nd St, New York' },
  { id: 8, lat: 40.7188, lng: -74.001, type: 'Fraud', severity: 'medium', date: '2025-04-03', description: 'Credit card fraud reported', address: '753 West 42nd St, New York' },
  
  // Los Angeles
  { id: 9, lat: 34.0522, lng: -118.2437, type: 'Theft', severity: 'medium', date: '2025-04-02', description: 'Personal items stolen from vehicle', address: '123 Sunset Blvd, Los Angeles' },
  { id: 10, lat: 34.0532, lng: -118.2447, type: 'Assault', severity: 'high', date: '2025-04-01', description: 'Physical altercation between individuals', address: '456 Hollywood Blvd, Los Angeles' },
  { id: 11, lat: 34.0542, lng: -118.2457, type: 'Robbery', severity: 'high', date: '2025-04-03', description: 'Armed robbery at convenience store', address: '789 Wilshire Blvd, Los Angeles' },
  
  // Chicago
  { id: 12, lat: 41.8781, lng: -87.6298, type: 'Vandalism', severity: 'low', date: '2025-04-02', description: 'Graffiti on public property', address: '321 Michigan Ave, Chicago' },
  { id: 13, lat: 41.8791, lng: -87.6308, type: 'Theft', severity: 'medium', date: '2025-04-03', description: 'Bicycle stolen from rack', address: '654 State St, Chicago' },
  { id: 14, lat: 41.8801, lng: -87.6318, type: 'Harassment', severity: 'low', date: '2025-04-01', description: 'Verbal harassment reported', address: '987 Wacker Dr, Chicago' },
];

// Function to get crime data for a specific location
export const getCrimeData = async (apiKey: string, location: Location): Promise<CrimeData[]> => {
  // This would be an actual API call in a real application
  // For demonstration, we're returning mock data
  console.log(`Fetching crime data with API key: ${apiKey} for location:`, location);
  
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // For demo purposes, filter based on proximity to the requested location
  // In a real app, this would be handled by the API
  const filteredCrimes = MOCK_CRIMES.filter(crime => {
    // Simple distance calculation (not accurate for long distances but works for demo)
    const distance = Math.sqrt(
      Math.pow(crime.lat - location.lat, 2) + 
      Math.pow(crime.lng - location.lng, 2)
    );
    
    // Return crimes within approximately 10 miles
    return distance < 0.1;
  });
  
  // If we didn't find any crimes near the location, return the crimes from the same city
  if (filteredCrimes.length === 0) {
    const city = determineCity(location);
    const cityData = getCityData(city);
    return cityData;
  }
  
  return filteredCrimes;
};

// Function to search for crimes by location name
export const searchCrimesByLocation = async (apiKey: string, locationName: string): Promise<CrimeData[]> => {
  console.log(`Searching crimes for location: ${locationName} with API key: ${apiKey}`);
  
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // For demo purposes, do a simple match on the location name in the address
  const lowercaseQuery = locationName.toLowerCase();
  
  // Filter the mock data based on the location name
  const filteredCrimes = MOCK_CRIMES.filter(crime => 
    crime.address?.toLowerCase().includes(lowercaseQuery)
  );
  
  if (filteredCrimes.length === 0) {
    toast(`No crime data found for "${locationName}". Showing sample data instead.`);
    // Return a subset of data as a fallback
    return MOCK_CRIMES.slice(0, 5);
  }
  
  return filteredCrimes;
};

// Function to calculate a safe route between two locations
export const calculateSafeRoute = async (
  apiKey: string, 
  start: Location, 
  end: Location
): Promise<{ 
  route: Location[],
  safetyScore: number,
  alternativeRoutes?: { route: Location[], safetyScore: number }[]
}> => {
  console.log(`Calculating safe route with API key: ${apiKey} from:`, start, 'to:', end);
  
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  // In a real app, this would query a routing API that takes crime data into account
  // For now, we'll create a simulated route with some intermediary points
  
  // Create a straight-line route with some points in between
  const numPoints = 8;
  const route: Location[] = [];
  
  for (let i = 0; i <= numPoints; i++) {
    const ratio = i / numPoints;
    route.push({
      lat: start.lat + (end.lat - start.lat) * ratio,
      lng: start.lng + (end.lng - start.lng) * ratio,
    });
  }
  
  // Generate a safety score (0-100, higher is safer)
  const safetyScore = Math.floor(Math.random() * 40) + 60;
  
  // Generate some alternative routes
  const alternativeRoutes = [
    {
      route: route.map(point => ({
        lat: point.lat + (Math.random() - 0.5) * 0.01,
        lng: point.lng + (Math.random() - 0.5) * 0.01,
      })),
      safetyScore: Math.floor(Math.random() * 30) + 50,
    },
    {
      route: route.map(point => ({
        lat: point.lat + (Math.random() - 0.5) * 0.01,
        lng: point.lng + (Math.random() - 0.5) * 0.01,
      })),
      safetyScore: Math.floor(Math.random() * 20) + 40,
    }
  ];
  
  return {
    route,
    safetyScore,
    alternativeRoutes
  };
};

// Helper function to determine which city a location is in
const determineCity = (location: Location): 'new-york' | 'los-angeles' | 'chicago' => {
  // Very simple proximity check - in a real app we would use a geocoding service
  const distances = {
    'new-york': Math.sqrt(Math.pow(location.lat - 40.7128, 2) + Math.pow(location.lng - (-74.006), 2)),
    'los-angeles': Math.sqrt(Math.pow(location.lat - 34.0522, 2) + Math.pow(location.lng - (-118.2437), 2)),
    'chicago': Math.sqrt(Math.pow(location.lat - 41.8781, 2) + Math.pow(location.lng - (-87.6298), 2)),
  };
  
  // Find the closest city
  let closestCity: 'new-york' | 'los-angeles' | 'chicago' = 'new-york';
  let minDistance = distances['new-york'];
  
  if (distances['los-angeles'] < minDistance) {
    closestCity = 'los-angeles';
    minDistance = distances['los-angeles'];
  }
  
  if (distances['chicago'] < minDistance) {
    closestCity = 'chicago';
  }
  
  return closestCity;
};

// Get sample data for a specific city
const getCityData = (city: 'new-york' | 'los-angeles' | 'chicago'): CrimeData[] => {
  switch (city) {
    case 'new-york':
      return MOCK_CRIMES.slice(0, 8);
    case 'los-angeles':
      return MOCK_CRIMES.slice(8, 11);
    case 'chicago':
      return MOCK_CRIMES.slice(11, 14);
    default:
      return MOCK_CRIMES.slice(0, 5);
  }
};
