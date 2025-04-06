
import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';
import { Check, AlertTriangle, X, MapPin, ArrowRight } from 'lucide-react';
import ApiKeyInput from './ApiKeyInput';
import { calculateSafeRoute, getCityCoordinates } from '@/lib/crimeApi';
import 'leaflet/dist/leaflet.css';

interface Location {
  lat: number;
  lng: number;
  address?: string;
}

interface RouteOption {
  route: Location[];
  safetyScore: number;
}

const RouteDecider: React.FC = () => {
  const [crimeApiKey, setCrimeApiKey] = useState<string | null>(null);
  const [startLocation, setStartLocation] = useState<string>('');
  const [endLocation, setEndLocation] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [recommendedRoute, setRecommendedRoute] = useState<RouteOption | null>(null);
  const [alternativeRoutes, setAlternativeRoutes] = useState<RouteOption[]>([]);
  const [selectedRoute, setSelectedRoute] = useState<RouteOption | null>(null);
  
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<any>(null);
  const routeLayers = useRef<any[]>([]);

  // Function to find route
  const findRoute = async () => {
    if (!startLocation || !endLocation) {
      setError('Please enter both start and end locations');
      return;
    }
    
    setLoading(true);
    setError(null);
    setRecommendedRoute(null);
    setAlternativeRoutes([]);
    setSelectedRoute(null);
    
    try {
      // Use city coordinates lookup instead of geocoding
      const startCoords = getCityCoordinates(startLocation);
      const endCoords = getCityCoordinates(endLocation);
      
      if (!startCoords) {
        setError(`Could not find location "${startLocation}". Please try another city.`);
        setLoading(false);
        return;
      }
      
      if (!endCoords) {
        setError(`Could not find location "${endLocation}". Please try another city.`);
        setLoading(false);
        return;
      }
      
      const startLocationObj = { ...startCoords, address: startLocation };
      const endLocationObj = { ...endCoords, address: endLocation };
      
      // Calculate safe route
      const routeResult = await calculateSafeRoute(
        crimeApiKey || 'demo-key',
        startLocationObj,
        endLocationObj
      );
      
      // Set the recommended route
      const recommended = {
        route: routeResult.route,
        safetyScore: routeResult.safetyScore
      };
      
      setRecommendedRoute(recommended);
      setSelectedRoute(recommended);
      
      // Set alternative routes if available
      if (routeResult.alternativeRoutes) {
        setAlternativeRoutes(routeResult.alternativeRoutes);
      }
      
      // Initialize map
      initializeMap(startLocationObj, endLocationObj, routeResult);
    } catch (error) {
      console.error('Error finding route:', error);
      setError('Failed to calculate safe route. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const initializeMap = async (start: Location, end: Location, routeResult: any) => {
    if (!mapContainer.current) return;
    
    try {
      // Dynamically import Leaflet to avoid SSR issues
      const L = await import('leaflet');
      
      // Clear previous map instance if it exists
      if (map.current) {
        map.current.remove();
        map.current = null;
        routeLayers.current = [];
      }
      
      // Calculate the center point between start and end
      const centerLat = (start.lat + end.lat) / 2;
      const centerLng = (start.lng + end.lng) / 2;
      
      // Initialize the map
      map.current = L.map(mapContainer.current).setView([centerLat, centerLng], 10);
      
      // Add OpenStreetMap tiles
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      }).addTo(map.current);
      
      // Add markers for start and end points
      const startIcon = L.divIcon({
        html: `<div class="flex items-center justify-center w-6 h-6 rounded-full bg-safe text-white"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-4 h-4"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg></div>`,
        className: '',
        iconSize: [24, 24],
        iconAnchor: [12, 24]
      });
      
      const endIcon = L.divIcon({
        html: `<div class="flex items-center justify-center w-6 h-6 rounded-full bg-danger text-white"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-4 h-4"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg></div>`,
        className: '',
        iconSize: [24, 24],
        iconAnchor: [12, 24]
      });
      
      L.marker([start.lat, start.lng], { icon: startIcon })
        .bindPopup(`<b>Start:</b> ${start.address}`)
        .addTo(map.current);
      
      L.marker([end.lat, end.lng], { icon: endIcon })
        .bindPopup(`<b>Destination:</b> ${end.address}`)
        .addTo(map.current);
      
      // Add the recommended route line
      const routeLine = L.polyline(
        routeResult.route.map((point: Location) => [point.lat, point.lng]),
        { 
          color: '#3B82F6', 
          weight: 5, 
          opacity: 0.8,
          className: 'recommended-route' 
        }
      ).addTo(map.current);
      
      routeLayers.current.push({
        id: 'recommended',
        layer: routeLine
      });
      
      // Create bounds that include both points and the route
      const bounds = L.latLngBounds(
        routeResult.route.map((point: Location) => [point.lat, point.lng])
      );
      
      // Fit the map to the bounds with some padding
      map.current.fitBounds(bounds, { padding: [50, 50] });
      
      // Add zoom control
      L.control.zoom({ position: 'topright' }).addTo(map.current);
      
    } catch (error) {
      console.error('Error initializing map:', error);
      setError('Failed to display the map. Please try again.');
    }
  };

  const selectRoute = async (route: RouteOption) => {
    if (!map.current) return;
    
    setSelectedRoute(route);
    
    try {
      const L = await import('leaflet');
      
      // Remove previous route layers except markers
      routeLayers.current.forEach(item => {
        if (map.current) {
          map.current.removeLayer(item.layer);
        }
      });
      routeLayers.current = [];
      
      // Add the new selected route
      const routeColor = route === recommendedRoute ? '#3B82F6' : '#f59e0b';
      const routeLine = L.polyline(
        route.route.map(point => [point.lat, point.lng]),
        { 
          color: routeColor, 
          weight: 5, 
          opacity: 0.8 
        }
      ).addTo(map.current);
      
      routeLayers.current.push({
        id: 'selected-route',
        layer: routeLine
      });
    } catch (error) {
      console.error('Error updating route on map:', error);
    }
  };
  
  // Clean up the map when component unmounts
  useEffect(() => {
    return () => {
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, []);

  // Function to get safety badge color and text
  const getSafetyBadge = (score: number) => {
    if (score >= 70) {
      return {
        color: 'bg-safe text-white',
        icon: <Check className="h-4 w-4 mr-1" />,
        text: 'Safe'
      };
    } else if (score >= 50) {
      return {
        color: 'bg-caution text-white',
        icon: <AlertTriangle className="h-4 w-4 mr-1" />,
        text: 'Use Caution'
      };
    } else {
      return {
        color: 'bg-danger text-white',
        icon: <X className="h-4 w-4 mr-1" />,
        text: 'Avoid'
      };
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Safe Route Planner</CardTitle>
        <CardDescription>
          Find the safest route between two locations based on crime data
        </CardDescription>
      </CardHeader>
      <CardContent>
        {!crimeApiKey ? (
          <ApiKeyInput onApiKeySubmit={setCrimeApiKey} type="crime" />
        ) : (
          <>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Start Location</label>
                  <div className="flex">
                    <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-input bg-muted text-muted-foreground">
                      <MapPin className="h-4 w-4" />
                    </span>
                    <Input
                      placeholder="Enter city name (e.g., Mumbai, New York)"
                      value={startLocation}
                      onChange={(e) => setStartLocation(e.target.value)}
                      disabled={loading}
                      className="rounded-l-none"
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">End Location</label>
                  <div className="flex">
                    <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-input bg-muted text-muted-foreground">
                      <MapPin className="h-4 w-4" />
                    </span>
                    <Input
                      placeholder="Enter city name (e.g., Delhi, London)"
                      value={endLocation}
                      onChange={(e) => setEndLocation(e.target.value)}
                      disabled={loading}
                      className="rounded-l-none"
                    />
                  </div>
                </div>
              </div>
              
              <Button 
                onClick={findRoute} 
                disabled={loading || !startLocation || !endLocation}
                className="w-full"
              >
                {loading ? 'Finding Safe Route...' : 'Find Safe Route'}
              </Button>
              
              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
              
              {loading && (
                <div className="space-y-4">
                  <Skeleton className="h-[300px] w-full rounded-md" />
                  <div className="space-y-2">
                    <Skeleton className="h-8 w-3/4" />
                    <Skeleton className="h-6 w-1/2" />
                  </div>
                </div>
              )}
              
              {!loading && recommendedRoute && (
                <div className="space-y-6 mt-4">
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Routes</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      <Card 
                        className={`cursor-pointer ${selectedRoute === recommendedRoute ? 'ring-2 ring-primary' : ''}`}
                        onClick={() => selectRoute(recommendedRoute)}
                      >
                        <CardHeader className="py-3 px-4">
                          <CardTitle className="text-base flex justify-between items-center">
                            <span>Recommended Route</span>
                            <Badge className={getSafetyBadge(recommendedRoute.safetyScore).color}>
                              <span className="flex items-center">
                                {getSafetyBadge(recommendedRoute.safetyScore).icon}
                                {getSafetyBadge(recommendedRoute.safetyScore).text}
                              </span>
                            </Badge>
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="p-4 pt-0">
                          <div className="text-sm text-muted-foreground">
                            <div className="flex items-center justify-between">
                              <span>Safety Score: </span>
                              <span className="font-semibold">{recommendedRoute.safetyScore}/100</span>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                      
                      {alternativeRoutes.map((route, index) => (
                        <Card 
                          key={index}
                          className={`cursor-pointer ${selectedRoute === route ? 'ring-2 ring-primary' : ''}`}
                          onClick={() => selectRoute(route)}
                        >
                          <CardHeader className="py-3 px-4">
                            <CardTitle className="text-base flex justify-between items-center">
                              <span>Alternative {index + 1}</span>
                              <Badge className={getSafetyBadge(route.safetyScore).color}>
                                <span className="flex items-center">
                                  {getSafetyBadge(route.safetyScore).icon}
                                  {getSafetyBadge(route.safetyScore).text}
                                </span>
                              </Badge>
                            </CardTitle>
                          </CardHeader>
                          <CardContent className="p-4 pt-0">
                            <div className="text-sm text-muted-foreground">
                              <div className="flex items-center justify-between">
                                <span>Safety Score: </span>
                                <span className="font-semibold">{route.safetyScore}/100</span>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
                  
                  <div ref={mapContainer} style={{ height: '400px' }} className="rounded-md border" />
                  
                  <div className="bg-muted p-4 rounded-md">
                    <h3 className="text-lg font-semibold mb-2">Route Details</h3>
                    <div className="space-y-2">
                      <div className="flex items-start md:items-center">
                        <div className="min-w-[100px] font-medium">Start:</div>
                        <div>{startLocation}</div>
                      </div>
                      <div className="flex items-start md:items-center">
                        <div className="min-w-[100px] font-medium">End:</div>
                        <div>{endLocation}</div>
                      </div>
                      <div className="flex items-start md:items-center">
                        <div className="min-w-[100px] font-medium">Safety Rating:</div>
                        <div className="flex items-center">
                          <Badge className={getSafetyBadge(selectedRoute?.safetyScore || 0).color}>
                            <span className="flex items-center">
                              {getSafetyBadge(selectedRoute?.safetyScore || 0).icon}
                              {getSafetyBadge(selectedRoute?.safetyScore || 0).text}
                            </span>
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default RouteDecider;
