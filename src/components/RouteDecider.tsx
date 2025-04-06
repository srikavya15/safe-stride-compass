
import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';
import { Check, AlertTriangle, X, MapPin, ArrowRight } from 'lucide-react';
import ApiKeyInput from './ApiKeyInput';
import { calculateSafeRoute } from '@/lib/crimeApi';

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
  const [mapboxApiKey, setMapboxApiKey] = useState<string | null>(null);
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

  // Function to geocode addresses to coordinates
  const geocodeAddress = async (address: string): Promise<Location | null> => {
    if (!mapboxApiKey) return null;
    
    try {
      const response = await fetch(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(address)}.json?access_token=${mapboxApiKey}`
      );
      
      if (!response.ok) {
        throw new Error('Geocoding failed');
      }
      
      const data = await response.json();
      
      if (data.features && data.features.length > 0) {
        const [lng, lat] = data.features[0].center;
        return { 
          lat, 
          lng, 
          address: data.features[0].place_name 
        };
      }
      
      return null;
    } catch (error) {
      console.error('Error geocoding address:', error);
      return null;
    }
  };

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
      // In a real app, we would geocode the addresses
      // For demo, we'll simulate it
      
      // Mock geocoding for demonstration
      const mockStart = await new Promise<Location>(resolve => {
        setTimeout(() => {
          resolve({ lat: 40.7128, lng: -74.0060, address: startLocation });
        }, 500);
      });
      
      const mockEnd = await new Promise<Location>(resolve => {
        setTimeout(() => {
          resolve({ lat: 40.7580, lng: -73.9855, address: endLocation });
        }, 500);
      });
      
      // Calculate safe route
      const routeResult = await calculateSafeRoute(
        crimeApiKey || 'demo-key',
        mockStart,
        mockEnd
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
      
      // Initialize map if we have Mapbox API key
      if (mapboxApiKey && mapContainer.current) {
        initializeMap(mockStart, mockEnd, routeResult);
      }
    } catch (error) {
      console.error('Error finding route:', error);
      setError('Failed to calculate safe route. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const initializeMap = (start: Location, end: Location, routeResult: any) => {
    if (!mapboxApiKey || !mapContainer.current) return;
    
    // Load Mapbox script dynamically
    const script = document.createElement('script');
    script.src = 'https://api.mapbox.com/mapbox-gl-js/v2.14.1/mapbox-gl.js';
    script.async = true;
    
    script.onload = () => {
      const mapboxgl = (window as any).mapboxgl;
      
      if (mapboxgl && !map.current) {
        mapboxgl.accessToken = mapboxApiKey;
        
        // Calculate the center point between start and end
        const centerLng = (start.lng + end.lng) / 2;
        const centerLat = (start.lat + end.lat) / 2;
        
        map.current = new mapboxgl.Map({
          container: mapContainer.current!,
          style: 'mapbox://styles/mapbox/streets-v12',
          center: [centerLng, centerLat],
          zoom: 12
        });
        
        map.current.on('load', () => {
          // Add markers for start and end points
          new mapboxgl.Marker({ color: '#10B981' })
            .setLngLat([start.lng, start.lat])
            .addTo(map.current);
            
          new mapboxgl.Marker({ color: '#EF4444' })
            .setLngLat([end.lng, end.lat])
            .addTo(map.current);
          
          // Add the recommended route
          const coords = routeResult.route.map((point: Location) => [point.lng, point.lat]);
          
          map.current.addSource('route', {
            type: 'geojson',
            data: {
              type: 'Feature',
              properties: {},
              geometry: {
                type: 'LineString',
                coordinates: coords
              }
            }
          });
          
          map.current.addLayer({
            id: 'route',
            type: 'line',
            source: 'route',
            layout: {
              'line-join': 'round',
              'line-cap': 'round'
            },
            paint: {
              'line-color': '#3B82F6',
              'line-width': 8,
              'line-opacity': 0.8
            }
          });
          
          // Fit map to show the entire route
          const bounds = new mapboxgl.LngLatBounds();
          coords.forEach((coord: [number, number]) => bounds.extend(coord));
          map.current.fitBounds(bounds, { padding: 50 });
        });
        
        // Add navigation controls
        map.current.addControl(new mapboxgl.NavigationControl());
      }
    };
    
    document.head.appendChild(script);
    
    // Add stylesheet
    const link = document.createElement('link');
    link.href = 'https://api.mapbox.com/mapbox-gl-js/v2.14.1/mapbox-gl.css';
    link.rel = 'stylesheet';
    document.head.appendChild(link);
  };

  const selectRoute = (route: RouteOption) => {
    setSelectedRoute(route);
    
    // Update the map to show the selected route
    if (map.current && route.route) {
      const coords = route.route.map(point => [point.lng, point.lat]);
      
      if (map.current.getSource('route')) {
        map.current.getSource('route').setData({
          type: 'Feature',
          properties: {},
          geometry: {
            type: 'LineString',
            coordinates: coords
          }
        });
      }
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
        {!mapboxApiKey ? (
          <ApiKeyInput onApiKeySubmit={setMapboxApiKey} type="mapbox" />
        ) : !crimeApiKey ? (
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
                      placeholder="Enter starting address"
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
                      placeholder="Enter destination address"
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
