
import React, { useEffect, useRef, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import ApiKeyInput from './ApiKeyInput';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertTriangle } from 'lucide-react';
import { getCrimeData } from '@/lib/crimeApi';

// Mock data for initial development
const MOCK_CRIME_DATA = [
  { id: 1, lat: 40.7128, lng: -74.006, type: 'Theft', severity: 'medium' },
  { id: 2, lat: 40.7138, lng: -74.008, type: 'Assault', severity: 'high' },
  { id: 3, lat: 40.7118, lng: -74.004, type: 'Robbery', severity: 'high' },
  { id: 4, lat: 40.7148, lng: -74.003, type: 'Vandalism', severity: 'low' },
  { id: 5, lat: 40.7158, lng: -74.009, type: 'Theft', severity: 'medium' },
];

interface CrimeMapProps {
  location?: { lat: number; lng: number } | null;
}

const CrimeMap: React.FC<CrimeMapProps> = ({ location }) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<any>(null);
  const [mapboxApiKey, setMapboxApiKey] = useState<string | null>(null);
  const [crimeApiKey, setCrimeApiKey] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [crimeData, setCrimeData] = useState(MOCK_CRIME_DATA);
  
  // Default to New York City if no location provided
  const defaultLocation = location || { lat: 40.7128, lng: -74.006 };

  useEffect(() => {
    if (!mapboxApiKey || !mapContainer.current) return;
    
    // Load Mapbox script dynamically
    const script = document.createElement('script');
    script.src = 'https://api.mapbox.com/mapbox-gl-js/v2.14.1/mapbox-gl.js';
    script.async = true;
    
    script.onload = () => {
      const mapboxgl = (window as any).mapboxgl;
      
      if (mapboxgl && !map.current) {
        mapboxgl.accessToken = mapboxApiKey;
        
        map.current = new mapboxgl.Map({
          container: mapContainer.current!,
          style: 'mapbox://styles/mapbox/streets-v12',
          center: [defaultLocation.lng, defaultLocation.lat],
          zoom: 12
        });
        
        map.current.on('load', () => {
          // Add heat map layer when data is available
          if (map.current.getSource('crimes')) {
            map.current.removeSource('crimes');
          }
          
          map.current.addSource('crimes', {
            type: 'geojson',
            data: {
              type: 'FeatureCollection',
              features: crimeData.map(crime => ({
                type: 'Feature',
                properties: {
                  severity: crime.severity,
                  type: crime.type
                },
                geometry: {
                  type: 'Point',
                  coordinates: [crime.lng, crime.lat]
                }
              }))
            }
          });
          
          map.current.addLayer({
            id: 'crime-heat',
            type: 'heatmap',
            source: 'crimes',
            paint: {
              'heatmap-weight': [
                'interpolate',
                ['linear'],
                ['get', 'severity'],
                'low', 0.3,
                'medium', 0.6,
                'high', 1
              ],
              'heatmap-intensity': 1.5,
              'heatmap-color': [
                'interpolate',
                ['linear'],
                ['heatmap-density'],
                0, 'rgba(16, 185, 129, 0)',
                0.2, 'rgb(16, 185, 129)',
                0.4, 'rgb(245, 158, 11)',
                0.8, 'rgb(239, 68, 68)'
              ],
              'heatmap-radius': 25,
              'heatmap-opacity': 0.8
            }
          });
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
    
    return () => {
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
      // Remove script and stylesheet
      document.head.removeChild(script);
      document.head.removeChild(link);
    };
  }, [mapboxApiKey, defaultLocation.lat, defaultLocation.lng]);
  
  useEffect(() => {
    if (crimeApiKey) {
      // Fetch crime data when API key is available
      setLoading(true);
      setError(null);
      
      // For now, we're using mock data
      // In a real app, we would call the API with the key
      setTimeout(() => {
        getCrimeData(crimeApiKey, defaultLocation)
          .then(data => {
            setCrimeData(data);
            setLoading(false);
          })
          .catch(err => {
            console.error('Failed to fetch crime data', err);
            setError('Failed to fetch crime data. Please check your API key.');
            setLoading(false);
          });
      }, 1000);
    }
  }, [crimeApiKey, defaultLocation]);

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Crime Heat Map</CardTitle>
        <CardDescription>
          View crime hot spots in your area to identify safer routes
        </CardDescription>
      </CardHeader>
      <CardContent>
        {!mapboxApiKey ? (
          <ApiKeyInput onApiKeySubmit={setMapboxApiKey} type="mapbox" />
        ) : !crimeApiKey ? (
          <ApiKeyInput onApiKeySubmit={setCrimeApiKey} type="crime" />
        ) : (
          <>
            {error && (
              <Alert variant="destructive" className="mb-4">
                <AlertTriangle className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            <div className="relative">
              {loading && (
                <div className="absolute inset-0 flex items-center justify-center bg-background/50 z-10">
                  <div className="animate-pulse text-primary font-semibold">Loading crime data...</div>
                </div>
              )}
              <div className="heatmap-legend flex items-center justify-between mb-2 text-sm">
                <span className="flex items-center">
                  <span className="inline-block w-3 h-3 rounded-full bg-safe mr-1"></span> Low
                </span>
                <span className="flex items-center">
                  <span className="inline-block w-3 h-3 rounded-full bg-caution mr-1"></span> Medium
                </span>
                <span className="flex items-center">
                  <span className="inline-block w-3 h-3 rounded-full bg-danger mr-1"></span> High
                </span>
              </div>
              <div ref={mapContainer} style={{ height: '500px' }} className="rounded-md border map-container" />
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default CrimeMap;
