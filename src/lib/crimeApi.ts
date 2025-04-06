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
  city?: string;
  country?: string;
}

interface Location {
  lat: number;
  lng: number;
}

// Expanded local crime data including Indian and international cities
const LOCAL_CRIMES: CrimeData[] = [
  // New York, USA
  { id: 1, lat: 40.7128, lng: -74.006, type: 'Theft', severity: 'medium', date: '2025-04-02', description: 'Personal items stolen from vehicle', address: '123 Broadway', city: 'New York', country: 'USA' },
  { id: 2, lat: 40.7138, lng: -74.008, type: 'Assault', severity: 'high', date: '2025-04-01', description: 'Physical altercation between individuals', address: '456 5th Ave', city: 'New York', country: 'USA' },
  { id: 3, lat: 40.7118, lng: -74.004, type: 'Robbery', severity: 'high', date: '2025-04-03', description: 'Armed robbery at convenience store', address: '789 Park Ave', city: 'New York', country: 'USA' },
  { id: 4, lat: 40.7148, lng: -74.003, type: 'Vandalism', severity: 'low', date: '2025-04-02', description: 'Graffiti on public property', address: '321 Madison Ave', city: 'New York', country: 'USA' },
  
  // Mumbai, India
  { id: 5, lat: 19.0760, lng: 72.8777, type: 'Theft', severity: 'medium', date: '2025-04-03', description: 'Mobile phone snatching incident', address: 'Colaba Causeway', city: 'Mumbai', country: 'India' },
  { id: 6, lat: 19.0607, lng: 72.8362, type: 'Fraud', severity: 'high', date: '2025-04-01', description: 'Online banking fraud reported', address: 'Bandra West', city: 'Mumbai', country: 'India' },
  { id: 7, lat: 19.1136, lng: 72.8697, type: 'Harassment', severity: 'low', date: '2025-04-02', description: 'Verbal harassment case', address: 'Andheri East', city: 'Mumbai', country: 'India' },
  { id: 8, lat: 19.0821, lng: 72.8416, type: 'Burglary', severity: 'high', date: '2025-04-04', description: 'Home break-in during daytime', address: 'Juhu Beach Road', city: 'Mumbai', country: 'India' },
  
  // Delhi, India
  { id: 9, lat: 28.6139, lng: 77.2090, type: 'Theft', severity: 'medium', date: '2025-04-01', description: 'Pickpocketing incident', address: 'Connaught Place', city: 'Delhi', country: 'India' },
  { id: 10, lat: 28.6304, lng: 77.2177, type: 'Assault', severity: 'high', date: '2025-04-02', description: 'Physical altercation at market', address: 'Karol Bagh', city: 'Delhi', country: 'India' },
  { id: 11, lat: 28.5529, lng: 77.2420, type: 'Fraud', severity: 'medium', date: '2025-04-03', description: 'Property fraud case', address: 'Greater Kailash', city: 'Delhi', country: 'India' },
  
  // Bangalore, India
  { id: 12, lat: 12.9716, lng: 77.5946, type: 'Cybercrime', severity: 'high', date: '2025-04-02', description: 'Corporate email phishing attack', address: 'Koramangala', city: 'Bangalore', country: 'India' },
  { id: 13, lat: 12.9352, lng: 77.6245, type: 'Theft', severity: 'low', date: '2025-04-03', description: 'Vehicle accessory theft', address: 'Indiranagar', city: 'Bangalore', country: 'India' },
  { id: 14, lat: 13.0298, lng: 77.5997, type: 'Vandalism', severity: 'medium', date: '2025-04-01', description: 'Property damage at construction site', address: 'Hebbal', city: 'Bangalore', country: 'India' },
  
  // London, UK
  { id: 15, lat: 51.5074, lng: -0.1278, type: 'Theft', severity: 'medium', date: '2025-04-02', description: 'Bicycle theft', address: 'Oxford Street', city: 'London', country: 'UK' },
  { id: 16, lat: 51.5194, lng: -0.1270, type: 'Assault', severity: 'high', date: '2025-04-01', description: 'Late night assault', address: 'Leicester Square', city: 'London', country: 'UK' },
  
  // Tokyo, Japan
  { id: 17, lat: 35.6762, lng: 139.6503, type: 'Fraud', severity: 'medium', date: '2025-04-03', description: 'ATM card skimming', address: 'Shinjuku', city: 'Tokyo', country: 'Japan' },
  { id: 18, lat: 35.6895, lng: 139.6917, type: 'Theft', severity: 'low', date: '2025-04-02', description: 'Shoplifting incident', address: 'Shibuya', city: 'Tokyo', country: 'Japan' },
  
  // Sydney, Australia
  { id: 19, lat: -33.8688, lng: 151.2093, type: 'Vandalism', severity: 'low', date: '2025-04-01', description: 'Graffiti on public property', address: 'Darling Harbour', city: 'Sydney', country: 'Australia' },
  { id: 20, lat: -33.8569, lng: 151.2152, type: 'Assault', severity: 'high', date: '2025-04-03', description: 'Bar fight', address: 'The Rocks', city: 'Sydney', country: 'Australia' },
  
  // Kolkata, India
  { id: 21, lat: 22.5726, lng: 88.3639, type: 'Robbery', severity: 'high', date: '2025-04-01', description: 'Chain snatching incident', address: 'Park Street', city: 'Kolkata', country: 'India' },
  { id: 22, lat: 22.5958, lng: 88.3699, type: 'Theft', severity: 'medium', date: '2025-04-02', description: 'Mobile phone theft from shop', address: 'New Market', city: 'Kolkata', country: 'India' },
  
  // Chennai, India
  { id: 23, lat: 13.0827, lng: 80.2707, type: 'Fraud', severity: 'medium', date: '2025-04-03', description: 'Credit card fraud', address: 'T. Nagar', city: 'Chennai', country: 'India' },
  { id: 24, lat: 13.0500, lng: 80.2121, type: 'Burglary', severity: 'high', date: '2025-04-01', description: 'Shop break-in during night', address: 'Anna Nagar', city: 'Chennai', country: 'India' }
];

// City coordinates for easy lookup
const CITY_COORDINATES = {
  'new york': { lat: 40.7128, lng: -74.0060 },
  'mumbai': { lat: 19.0760, lng: 72.8777 },
  'delhi': { lat: 28.6139, lng: 77.2090 },
  'bangalore': { lat: 12.9716, lng: 77.5946 },
  'london': { lat: 51.5074, lng: -0.1278 },
  'tokyo': { lat: 35.6762, lng: 139.6503 },
  'sydney': { lat: -33.8688, lng: 151.2093 },
  'kolkata': { lat: 22.5726, lng: 88.3639 },
  'chennai': { lat: 13.0827, lng: 80.2707 },
  'los angeles': { lat: 34.0522, lng: -118.2437 },
  'chicago': { lat: 41.8781, lng: -87.6298 },
  'hyderabad': { lat: 17.3850, lng: 78.4867 },
  'pune': { lat: 18.5204, lng: 73.8567 },
  'ahmedabad': { lat: 23.0225, lng: 72.5714 },
  'jaipur': { lat: 26.9124, lng: 75.7873 }
};

// Function to get crime data for a specific location
export const getCrimeData = async (apiKey: string, location: Location): Promise<CrimeData[]> => {
  console.log(`Using local crime data for location:`, location);
  
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // Find the closest city
  const closestCity = findClosestCity(location);
  
  // Filter based on the city
  const filteredCrimes = LOCAL_CRIMES.filter(crime => {
    // Simple distance calculation
    const distance = Math.sqrt(
      Math.pow(crime.lat - location.lat, 2) + 
      Math.pow(crime.lng - location.lng, 2)
    );
    
    // Return crimes within approximately 10-15 miles
    return distance < 0.15;
  });
  
  // If we didn't find any crimes near the location, return the crimes from the closest city
  if (filteredCrimes.length === 0) {
    const cityData = getCityData(closestCity);
    return cityData;
  }
  
  return filteredCrimes;
};

// Function to search for crimes by location name
export const searchCrimesByLocation = async (apiKey: string, locationName: string): Promise<CrimeData[]> => {
  console.log(`Searching crimes for location: ${locationName} using local data`);
  
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  const lowercaseQuery = locationName.toLowerCase();
  
  // Check if the location matches a city name first
  const cityMatch = Object.keys(CITY_COORDINATES).find(city => 
    city.includes(lowercaseQuery) || lowercaseQuery.includes(city)
  );
  
  if (cityMatch) {
    // Return crimes for that city
    return LOCAL_CRIMES.filter(crime => 
      crime.city?.toLowerCase() === cityMatch || 
      crime.address?.toLowerCase().includes(cityMatch)
    );
  }
  
  // Otherwise try to match by address or any field
  const filteredCrimes = LOCAL_CRIMES.filter(crime => 
    crime.address?.toLowerCase().includes(lowercaseQuery) ||
    crime.city?.toLowerCase().includes(lowercaseQuery) ||
    crime.country?.toLowerCase().includes(lowercaseQuery)
  );
  
  if (filteredCrimes.length === 0) {
    toast(`No crime data found for "${locationName}". Showing sample data instead.`);
    // Return a subset of data as a fallback
    return LOCAL_CRIMES.slice(0, 5);
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
  console.log(`Calculating safe route using local data from:`, start, 'to:', end);
  
  // Simulate processing delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
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
  
  // Generate some alternative routes with slight deviations
  const alternativeRoutes = [
    {
      route: generateAlternativeRoute(start, end, 0.01),
      safetyScore: Math.floor(Math.random() * 30) + 50,
    },
    {
      route: generateAlternativeRoute(start, end, 0.015),
      safetyScore: Math.floor(Math.random() * 20) + 40,
    }
  ];
  
  return {
    route,
    safetyScore,
    alternativeRoutes
  };
};

// Helper function to generate an alternative route
const generateAlternativeRoute = (start: Location, end: Location, deviation: number): Location[] => {
  const numPoints = 8;
  const route: Location[] = [];
  
  // Create a wavy path between start and end
  for (let i = 0; i <= numPoints; i++) {
    const ratio = i / numPoints;
    // Add some sine wave variation to make the route curve
    const waveFactor = Math.sin(ratio * Math.PI) * deviation;
    
    // Calculate perpendicular offset direction
    const dx = end.lng - start.lng;
    const dy = end.lat - start.lat;
    const length = Math.sqrt(dx * dx + dy * dy);
    
    // Normalize and rotate by 90 degrees to get perpendicular direction
    const perpX = -dy / length;
    const perpY = dx / length;
    
    route.push({
      lat: start.lat + (end.lat - start.lat) * ratio + perpY * waveFactor,
      lng: start.lng + (end.lng - start.lng) * ratio + perpX * waveFactor,
    });
  }
  
  return route;
};

// Helper function to find the closest city to a location
const findClosestCity = (location: Location): string => {
  let closestCity = 'new york'; // Default
  let minDistance = Number.MAX_VALUE;
  
  Object.entries(CITY_COORDINATES).forEach(([city, coords]) => {
    const distance = Math.sqrt(
      Math.pow(coords.lat - location.lat, 2) + 
      Math.pow(coords.lng - location.lng, 2)
    );
    
    if (distance < minDistance) {
      minDistance = distance;
      closestCity = city;
    }
  });
  
  return closestCity;
};

// Get city coordinates by name (case-insensitive)
export const getCityCoordinates = (cityName: string): Location | null => {
  const normalizedName = cityName.toLowerCase();
  
  // Try exact match first
  if (CITY_COORDINATES[normalizedName]) {
    return CITY_COORDINATES[normalizedName];
  }
  
  // Try partial match
  for (const [city, coords] of Object.entries(CITY_COORDINATES)) {
    if (city.includes(normalizedName) || normalizedName.includes(city)) {
      return coords;
    }
  }
  
  return null;
};

// Get sample data for a specific city
const getCityData = (city: string): CrimeData[] => {
  const cityLower = city.toLowerCase();
  return LOCAL_CRIMES.filter(crime => 
    crime.city?.toLowerCase() === cityLower ||
    (crime.city?.toLowerCase().includes(cityLower) || cityLower.includes(crime.city?.toLowerCase() || ''))
  );
};
