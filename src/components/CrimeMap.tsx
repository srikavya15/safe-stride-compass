
import React, { useEffect, useRef, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertTriangle } from 'lucide-react';
import 'leaflet/dist/leaflet.css';
import { CrimeData, getCrimeData } from '@/lib/crimeApi';

interface CrimeMapProps {
  location?: { lat: number; lng: number } | null;
}

const CrimeMap: React.FC<CrimeMapProps> = ({ location }) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<any>(null);
  const heatLayer = useRef<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [crimeData, setCrimeData] = useState<CrimeData[]>([]);
  
  // Default to Mumbai, India if no location provided
  const defaultLocation = location || { lat: 19.0760, lng: 72.8777 };

  useEffect(() => {
    if (!mapContainer.current) return;
    
    const fetchCrimeData = async () => {
      try {
        // Get crime data for the location
        const data = await getCrimeData('demo-key', defaultLocation);
        setCrimeData(data);
      } catch (error) {
        console.error('Error fetching crime data:', error);
        setError('Failed to load crime data.');
      }
    };
    
    fetchCrimeData();
  }, [defaultLocation.lat, defaultLocation.lng]);

  useEffect(() => {
    if (!mapContainer.current || crimeData.length === 0) return;
    
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
          crimeData.forEach(crime => {
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
              ${crime.date ? `Date: ${crime.date}<br>` : ''}
              ${crime.address ? `Location: ${crime.address}<br>` : ''}
              ${crime.city ? `City: ${crime.city}` : ''}
            `);
          });
          
          // Create a simple heat map effect using a custom layer
          const heatmapPoints = crimeData.map(crime => {
            const intensity = crime.severity === 'high' ? 1 : (crime.severity === 'medium' ? 0.6 : 0.3);
            return { lat: crime.lat, lng: crime.lng, intensity };
          });
          
          // Create a canvas overlay for the heatmap effect
          const createHeatLayer = () => {
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
          
          // Create bounds that include all crime points
          const bounds = L.latLngBounds(
            crimeData.map(crime => [crime.lat, crime.lng])
          );
          
          // Fit the map to the bounds with some padding
          map.current.fitBounds(bounds, { padding: [50, 50] });
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
  }, [crimeData, defaultLocation.lat, defaultLocation.lng]);

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
            
            {!loading && crimeData.length > 0 && (
              <div className="mt-4 text-sm text-muted-foreground">
                Showing {crimeData.length} crime incidents 
                {crimeData[0].city && ` in ${crimeData[0].city}`}.
              </div>
            )}
          </div>
        </>
      </CardContent>
    </Card>
  );
};

export default CrimeMap;
