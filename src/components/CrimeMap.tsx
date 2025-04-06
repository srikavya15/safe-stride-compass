
import React, { useEffect, useRef, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertTriangle } from 'lucide-react';
import 'leaflet/dist/leaflet.css';

// Mock data for development
const CRIME_DATA = [
  { id: 1, lat: 40.7128, lng: -74.006, type: 'Theft', severity: 'medium' },
  { id: 2, lat: 40.7138, lng: -74.008, type: 'Assault', severity: 'high' },
  { id: 3, lat: 40.7118, lng: -74.004, type: 'Robbery', severity: 'high' },
  { id: 4, lat: 40.7148, lng: -74.003, type: 'Vandalism', severity: 'low' },
  { id: 5, lat: 40.7158, lng: -74.009, type: 'Theft', severity: 'medium' },
  // Additional data points to create a better heat map
  { id: 6, lat: 40.7168, lng: -74.007, type: 'Harassment', severity: 'low' },
  { id: 7, lat: 40.7178, lng: -74.005, type: 'Burglary', severity: 'high' },
  { id: 8, lat: 40.7115, lng: -74.0065, type: 'Theft', severity: 'medium' },
  { id: 9, lat: 40.7135, lng: -74.0075, type: 'Assault', severity: 'high' },
  { id: 10, lat: 40.7125, lng: -74.0025, type: 'Robbery', severity: 'high' },
  { id: 11, lat: 40.7145, lng: -74.0035, type: 'Vandalism', severity: 'low' },
  { id: 12, lat: 40.7155, lng: -74.0095, type: 'Theft', severity: 'medium' },
];

interface CrimeMapProps {
  location?: { lat: number; lng: number } | null;
}

const CrimeMap: React.FC<CrimeMapProps> = ({ location }) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<any>(null);
  const heatLayer = useRef<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Default to New York City if no location provided
  const defaultLocation = location || { lat: 40.7128, lng: -74.006 };

  useEffect(() => {
    if (!mapContainer.current) return;
    
    const initializeMap = async () => {
      try {
        setLoading(true);
        
        // Dynamically import Leaflet to avoid SSR issues
        const L = await import('leaflet');
        
        // Initialize map if it doesn't exist
        if (!map.current) {
          map.current = L.map(mapContainer.current).setView(
            [defaultLocation.lat, defaultLocation.lng], 
            14
          );
          
          // Add OpenStreetMap tiles
          L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          }).addTo(map.current);
          
          // Add zoom control
          L.control.zoom({ position: 'topright' }).addTo(map.current);
          
          // Create markers for each crime
          CRIME_DATA.forEach(crime => {
            const severityColors = {
              low: '#10b981', // green
              medium: '#f59e0b', // amber
              high: '#ef4444' // red
            };
            
            const color = severityColors[crime.severity as keyof typeof severityColors];
            
            const marker = L.circleMarker([crime.lat, crime.lng], {
              radius: crime.severity === 'high' ? 10 : (crime.severity === 'medium' ? 8 : 6),
              fillColor: color,
              color: '#fff',
              weight: 1,
              opacity: 1,
              fillOpacity: 0.8
            }).addTo(map.current);
            
            // Add a popup with crime details
            marker.bindPopup(`
              <strong>${crime.type}</strong><br>
              Severity: ${crime.severity}<br>
            `);
          });
          
          // Create a simple heat map effect using a custom layer
          const heatmapPoints = CRIME_DATA.map(crime => {
            const intensity = crime.severity === 'high' ? 1 : (crime.severity === 'medium' ? 0.6 : 0.3);
            return { lat: crime.lat, lng: crime.lng, intensity };
          });
          
          // Create a canvas overlay for the heatmap effect
          const createHeatLayer = () => {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            
            // Use a custom overlay to draw heat effect
            const overlay = L.layerGroup();
            
            heatmapPoints.forEach(point => {
              const circleMarker = L.circle([point.lat, point.lng], {
                radius: 100 * point.intensity,
                fillColor: point.intensity > 0.8 ? '#ef4444' : (point.intensity > 0.5 ? '#f59e0b' : '#10b981'),
                fillOpacity: 0.3,
                stroke: false,
              });
              
              overlay.addLayer(circleMarker);
            });
            
            return overlay;
          };
          
          // Add heat layer
          heatLayer.current = createHeatLayer();
          heatLayer.current.addTo(map.current);
        }
        
        setLoading(false);
      } catch (err) {
        console.error('Error initializing map:', err);
        setError('Failed to load map. Please refresh the page.');
        setLoading(false);
      }
    };
    
    initializeMap();
    
    // Cleanup
    return () => {
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, [defaultLocation.lat, defaultLocation.lng]);

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Crime Heat Map</CardTitle>
        <CardDescription>
          View crime hot spots in your area to identify safer routes
        </CardDescription>
      </CardHeader>
      <CardContent>
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
                <div className="animate-pulse text-primary font-semibold">Loading map...</div>
              </div>
            )}
            <div className="heatmap-legend flex items-center justify-between mb-2 text-sm">
              <span className="flex items-center">
                <span className="inline-block w-3 h-3 rounded-full bg-[#10b981] mr-1"></span> Low
              </span>
              <span className="flex items-center">
                <span className="inline-block w-3 h-3 rounded-full bg-[#f59e0b] mr-1"></span> Medium
              </span>
              <span className="flex items-center">
                <span className="inline-block w-3 h-3 rounded-full bg-[#ef4444] mr-1"></span> High
              </span>
            </div>
            <div ref={mapContainer} style={{ height: '500px' }} className="rounded-md border map-container" />
          </div>
        </>
      </CardContent>
    </Card>
  );
};

export default CrimeMap;
